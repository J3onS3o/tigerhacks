import csv

# Initialize lists to hold the keys (airport names) and values (IATA codes)
keys = []
values = []

# Define the file path using a raw string for clarity
file_path = "C:/Users/kinet/Documents/GitHub/tigerhacks/data/filtered_airports_with_iata.csv"

# Open the file and use the csv.reader
with open(file_path, mode='r', encoding='utf-8', newline='') as csvfile:
        # csv.reader handles the double-quotes as text qualifiers by default
        reader = csv.reader(csvfile, delimiter=',')
        
        # Iterate over the rows and extract the data
        for row in reader:
            if len(row) == 2: # Ensure the row has exactly two columns
                keys.append(row[0].strip())
                values.append(row[1].strip())
            # Optionally handle or skip rows that don't match the expected format
            

# Create the final dictionary
airports_dict = {}
for key, value in zip(keys, values):
    airports_dict[key] = value

# Now airports_dict is populated correctly

# Example dictionary
airports = airports_dict

# Convert to TypeScript constant
def dict_to_ts_const(data: dict, const_name: str = "AirportIATA") -> str:
    ts_entries = []
    for key, value in data.items():
        ts_entries.append(f"  {{ name: '{key}', iata: '{value}' }}")
    ts_array = ",\n".join(ts_entries)
    ts_code = f"const {const_name} = [\n{ts_array}\n];"
    return ts_code

# Example usage
typescript_code = dict_to_ts_const(airports)

output_file = "C:/Users/kinet/Documents/GitHub/tigerhacks/data/output.txt"  # you can change to 'airports.ts' if preferred
with open(output_file, "w", encoding="utf-8") as f:
    f.write(typescript_code)

print(f"✅ TypeScript constant written to {output_file}")