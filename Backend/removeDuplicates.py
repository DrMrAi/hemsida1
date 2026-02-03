import os
import pandas as pd

# Folder containing your CSV files
folder_path = "/Users/ludvig/LTU/d0018e/hemsida1/data"

# Output file
output_file = "/Users/ludvig/LTU/d0018e/hemsida1/data/AllProductsAndPrices_NoDuplicates.csv"

# List all CSV files in the folder
csv_files = [f for f in os.listdir(folder_path) if f.endswith(".csv")]

# Initialize an empty list to store dataframes
dfs = []

# Loop through CSV files and read them
for file in csv_files:
    file_path = os.path.join(folder_path, file)
    df = pd.read_csv(file_path)
    dfs.append(df)

# Concatenate all dataframes into one
combined_df = pd.concat(dfs, ignore_index=True)

# Remove duplicates based on productId
combined_df = combined_df.drop_duplicates(subset='productId', keep='first')

# Save to a new CSV file
combined_df.to_csv(output_file, index=False)

print(f"All CSV files have been combined into {output_file} with duplicates removed")
