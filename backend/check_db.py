import sqlite3

def check_db():
    print("Checking database contents...")
    db = sqlite3.connect("wingo.db")
    cursor = db.cursor()
    
    # Check users table
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    print("\nUsers in database:")
    for user in users:
        print(f"ID: {user[0]}")
        print(f"Email: {user[1]}")
        print(f"Username: {user[2]}")
        print(f"Wingo Balance: {user[4]}")
        print(f"Created At: {user[5]}")
        print("---")
    
    db.close()

if __name__ == "__main__":
    check_db() 