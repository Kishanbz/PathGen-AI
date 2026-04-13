import sqlite3
conn = sqlite3.connect('backend/pathgen.db')
cursor = conn.cursor()

# Check roadmaps - only id, topic, is_published
cursor.execute('SELECT id, topic, is_published FROM roadmaps')
rows = cursor.fetchall()

print('=== All Roadmaps ===')
for r in rows:
    print(f'ID: {r[0]}, Topic: {r[1]}, Published: {r[2]}')

print(f'\nTotal: {len(rows)} roadmaps')

# Check published only
cursor.execute('SELECT id, topic, is_published FROM roadmaps WHERE is_published != 0')
published = cursor.fetchall()
print(f'\n=== Published Roadmaps (is_published != 0) ===')
for r in published:
    print(f'ID: {r[0]}, Topic: {r[1]}, Published: {r[2]}')

print(f'\nPublished count: {len(published)}')

conn.close()
