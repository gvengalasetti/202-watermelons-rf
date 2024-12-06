# database.py
from pymongo import MongoClient
import atexit

# MongoDB Atlas connection URI
MONGO_URI = "mongodb+srv://parakramdahal:parakram@cluster0.m5qex.mongodb.net/"

# Connect to MongoDB Atlas
client = MongoClient(MONGO_URI)

# Access the database (it will be created if it doesn't exist)
db = client.restaurant_db  # 'restaurant_db' will be created if it doesn't exist

# Optionally, print to verify the connection
atexit.register(client.close)
