# Example dictionary
airports = {
    "Anaa": "AAA",
    "Los Angeles International": "LAX",
    "Tokyo Haneda": "HND",
    "London Heathrow": "LHR",
}

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
print(typescript_code)
