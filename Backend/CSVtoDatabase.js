// File: CSVtoDatabase.js

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const csv = require('csv-parser');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Always use the CSV from the data folder
const csvFilePath = path.join(__dirname, '../data/sorted_by_name.csv');

async function importCSV() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    const stream = fs.createReadStream(csvFilePath).pipe(csv());
    const rows = [];

    stream.on('data', (row) => {
      rows.push({
        product_id: parseInt(row.productId),
        name: row.name,
        image_url: row.imageUrl,
        image_count: parseInt(row.imageCount) || 0,
        category_id: parseInt(row.categoryId),
        group_id: parseInt(row.groupId),
        ext_number: row.extNumber,
        ext_rarity: row.extRarity,
        ext_card_type: row.extCardType,
        ext_hp: parseInt(row.extHP) || null,
        ext_stage: row.extStage,
        ext_attack1: row.extAttack1,
        ext_attack2: row.extAttack2,
        ext_weakness: row.extWeakness,
        ext_resistance: row.extResistance,
        ext_retreat_cost: parseInt(row.extRetreatCost) || 0,
        ext_card_text: row.extCardText,
        sub_type_name: row.subTypeName,
        price: parseFloat(row.midPrice) || null,
        stock: 1
      });
    });

    stream.on('end', async () => {
      console.log(`📥 Importing ${rows.length} rows...`);
      for (const r of rows) {
        await client.query(
          `INSERT INTO public.products(
            product_id, name, image_url, image_count, category_id, group_id, 
            ext_number, ext_rarity, ext_card_type, ext_hp, ext_stage, 
            ext_attack1, ext_attack2, ext_weakness, ext_resistance, 
            ext_retreat_cost, ext_card_text, sub_type_name, price, stock
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20
          )
          ON CONFLICT (product_id) DO UPDATE SET
            name = EXCLUDED.name,
            image_url = EXCLUDED.image_url,
            image_count = EXCLUDED.image_count,
            category_id = EXCLUDED.category_id,
            group_id = EXCLUDED.group_id,
            ext_number = EXCLUDED.ext_number,
            ext_rarity = EXCLUDED.ext_rarity,
            ext_card_type = EXCLUDED.ext_card_type,
            ext_hp = EXCLUDED.ext_hp,
            ext_stage = EXCLUDED.ext_stage,
            ext_attack1 = EXCLUDED.ext_attack1,
            ext_attack2 = EXCLUDED.ext_attack2,
            ext_weakness = EXCLUDED.ext_weakness,
            ext_resistance = EXCLUDED.ext_resistance,
            ext_retreat_cost = EXCLUDED.ext_retreat_cost,
            ext_card_text = EXCLUDED.ext_card_text,
            sub_type_name = EXCLUDED.sub_type_name,
            price = EXCLUDED.price,
            stock = EXCLUDED.stock;
          `,
          [
            r.product_id, r.name, r.image_url, r.image_count, r.category_id, r.group_id,
            r.ext_number, r.ext_rarity, r.ext_card_type, r.ext_hp, r.ext_stage,
            r.ext_attack1, r.ext_attack2, r.ext_weakness, r.ext_resistance,
            r.ext_retreat_cost, r.ext_card_text, r.sub_type_name, r.price, r.stock
          ]
        );
      }
      console.log('✅ Import complete!');
      await client.end();
    });
  } catch (err) {
    console.error('❌ Error importing CSV:', err);
    await client.end();
  }
}

importCSV();
