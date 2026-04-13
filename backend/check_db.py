import sqlite3
conn = sqlite3.connect('pathgen.db')
cursor = conn.cursor()

# List all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print('=== Tables in database ===')
for t in tables:
    print(t[0])

# Check roadmaps table if exists
for t in tables:
    if 'roadmap' in t[0].lower():
        table_name = t[0]
        print(f'\n=== Table: {table_name} ===')
        cursor.execute(f'PRAGMA table_info({table_name})')
        columns = cursor.fetchall()
        print(f'Columns: {[c[1] for c in columns]}')
        
        cursor.execute(f'SELECT * FROM {table_name}')
        rows = cursor.fetchall()
        print(f'Total rows: {len(rows)}')
        for r in rows:
            print(r)

conn.close()
