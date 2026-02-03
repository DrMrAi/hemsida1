import pandas as pd

# Input and output paths
input_file = "/Users/ludvig/LTU/d0018e/hemsida1/data/AllProductsAndPrices_NoDuplicates.csv"
output_file = "/Users/ludvig/LTU/d0018e/hemsida1/data/sorted_by_name.csv"

# Read the CSV
df = pd.read_csv(input_file)

# Sort by name
df_sorted = df.sort_values(by='name', ascending=True)

# Save to new CSV
df_sorted.to_csv(output_file, index=False)

print(f"CSV has been sorted by name and saved to {output_file}")
