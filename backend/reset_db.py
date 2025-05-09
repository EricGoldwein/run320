import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import Base, User

# Remove existing database file
if os.path.exists('wingo.db'):
    os.remove('wingo.db')
    print("Removed existing database file")

# Create new database
SQLALCHEMY_DATABASE_URL = "sqlite:///./wingo.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)
print("Created new database with correct schema") 