import os
import pandas as pd

# Folder containing your CSV files
folder_path = "/Users/ludvig/LTU/d0018e/hemsida1/data"

# Output file
output_file = "/Users/ludvig/LTU/d0018e/hemsida1/data/AllProductsAndPrices.csv"

# Required CSV columns (camelCase version)
required_columns = [
    "productId",
    "name",
    "imageUrl",
    "imageCount",
    "categoryId",
    "groupId",
    "extNumber",
    "extRarity",
    "extCardType",
    "extHP",
    "extStage",
    "extAttack1",
    "extAttack2",
    "extWeakness",
    "extResistance",
    "extRetreatCost",
    "extCardText",
    "subTypeName",
    "marketPrice"  # main price column
]

# List all CSV files in the folder
csv_files = [f for f in os.listdir(folder_path) if f.endswith(".csv")]

# Initialize list for valid dataframes
dfs = []

for file in csv_files:
    file_path = os.path.join(folder_path, file)
    try:
        df = pd.read_csv(file_path)
        
        if df.empty:
            print(f"Skipped empty CSV file: {file_path}")
            continue
        
        # Check if all required columns exist
        missing_cols = [col for col in required_columns if col not in df.columns]
        if missing_cols:
            print(f"Skipped CSV file due to missing required columns ({missing_cols}): {file_path}")
            continue
        
        # Optional: reorder required columns first, then any extra columns
        df = df[[col for col in required_columns if col in df.columns] +
                [col for col in df.columns if col not in required_columns]]
        
        dfs.append(df)
        
    except pd.errors.EmptyDataError:
        print(f"Skipped empty CSV file: {file_path}")
    except Exception as e:
        print(f"Error reading {file_path}: {e}")

# Combine all valid dataframes
if dfs:
    combined_df = pd.concat(dfs, ignore_index=True)
    combined_df.to_csv(output_file, index=False)
    print(f"All valid CSV files have been combined into {output_file}")
else:
    print("No CSV files with the required columns were found to combine.")
