import sqlite3

def clear_users():
    print("Clearing users table...")
    try:
        # Connect to the database
        conn = sqlite3.connect('wingo.db')
        cursor = conn.cursor()
        
        # Delete all users
        cursor.execute("DELETE FROM users")
        conn.commit()
        print("All users have been deleted successfully!")
        
    except Exception as e:
        print(f"Error clearing users: {str(e)}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    clear_users() 