import pandas as pd
import re

# Configuration
EXCEL_FILE = 'G:\\Projects\\Khaliji\\backend\\pythonScripts\\cars.xlsx'  # Your Excel file
OUTPUT_FILE = 'output.sql' # Output SQL file
TABLE_NAME = 'companies'   # Target SQL table name

def split_years(year_str):
    """Split Arabic year range into start and end years"""
    if not year_str or pd.isna(year_str):
        return None, None
    
    # Extract all 4-digit numbers from the string
    years = re.findall(r'\d{4}', str(year_str))
    
    if len(years) == 1:
        return years[0], years[0]
    elif len(years) >= 2:
        return years[0], years[1]
    return None, None

def clean_text(text):
    """Clean and format text for SQL"""
    if pd.isna(text):
        return 'NULL'
    return f"'{str(text).strip().replace("'", "''")}'"

def excel_to_sql():
    # Read Excel file (automatically uses first sheet)
    df = pd.read_excel(EXCEL_FILE)
    
    # Process manufacture years - split into start and end
    if 'سنة الصنع' in df.columns:
        df['manufacture_start'], df['manufacture_end'] = zip(*df['سنة الصنع'].apply(split_years))
        df.drop('سنة الصنع', axis=1, inplace=True)
    
    # Generate SQL queries
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        for _, row in df.iterrows():
            columns = []
            values = []
            
            for col, val in row.items():
                if pd.isna(val) or val == '':
                    val = 'NULL'
                elif isinstance(val, (int, float)):
                    val = str(int(val))
                else:
                    val = clean_text(val)
                
                columns.append(f'"{col}"')  # Quote column names
                values.append(val)
            
            columns_str = ', '.join(columns)
            values_str = ', '.join(values)
            
            sql = f"INSERT INTO {TABLE_NAME} ({columns_str}) VALUES ({values_str});\n"
            f.write(sql)
    
    print(f"SQL file generated successfully: {OUTPUT_FILE}")

if __name__ == '__main__':
    excel_to_sql()