from pymongo import MongoClient
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

# MongoDB connection
MONGO_URI = "mongodb+srv://parakramdahal:parakram@cluster0.m5qex.mongodb.net"
client = MongoClient(MONGO_URI)
db = client["restaurant_db"]
users_collection = db["users"]

class User:
    def __init__(self, name=None, email=None, password=None, role="User"):
        self.name = name
        self.email = email
        self.password = password
        self.role = role

    @staticmethod
    def hash_password(password):
        """Hash the password for secure storage."""
        return generate_password_hash(password)

    @staticmethod
    def verify_password(hashed_password, password):
        """Verify the password against the hashed version."""
        return check_password_hash(hashed_password, password)

    def save(self):
        """Save the user to the database."""
        if not self.name or not self.email or not self.password:
            raise ValueError("Name, Email, and Password are required fields")

        if users_collection.find_one({"email": self.email}):
            raise ValueError("User with this email already exists")

        hashed_password = self.hash_password(self.password)
        user_data = {
            "name": self.name,
            "email": self.email,
            "password": hashed_password,
            "role": self.role,
        }

        result = users_collection.insert_one(user_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_email(email):
        """Find a user by email."""
        return users_collection.find_one({"email": email})

    @staticmethod
    def find_by_id(user_id):
        """Find a user by ID."""
        return users_collection.find_one({"_id": ObjectId(user_id)})

    @staticmethod
    def validate_user(email, password):
        """Validate user credentials."""
        user = User.find_by_email(email)
        if user and User.verify_password(user["password"], password):
            return user
        return None

    def __repr__(self):
        return f"User(name={self.name}, email={self.email}, role={self.role})"
