import sqlite3
conn = sqlite3.connect('backend/pathgen.db')
cursor = conn.cursor()

# Fix: Set is_published = 1 for javascript and python developer
topics_to_publish = ['javascript', 'python developer']

for topic in topics_to_publish:
    cursor.execute("UPDATE roadmaps SET is_published = 1 WHERE topic = ? AND is_published = 0", (topic,))
    print(f"Updated {topic}: {cursor.rowcount} rows affected")

conn.commit()

# Verify
cursor.execute('SELECT id, topic, is_published FROM roadmaps WHERE is_published != 0')
rows = cursor.fetchall()
print(f'\n=== Now Published Roadmaps ({len(rows)} total) ===')
for r in rows:
    print(f'ID: {r[0]}, Topic: {r[1]}, Published: {r[2]}')

conn.close()
print('\nDone! Refresh Explore page.')
