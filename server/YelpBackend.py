# app.py
from flask import Flask, request, jsonify
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from database import db
from User import User
from flask_cors import CORS
import requests
app = Flask(__name__)
CORS(app)

CORS(app)
# Register user 
@app.route("/register", methods=["POST"])
def register_user():

    data = request.json
    print("Request JSON:", data)  # Debug print

    user = {
        "username": data["username"],
        "email": data["email"],
        "password": data["password"],  
        "role": data.get("role", "User")
    }
    
    try:
        result = db.users.insert_one(user)
        return jsonify({"msg": "User created", "user_id": str(result.inserted_id)}), 201
    except DuplicateKeyError:
        return jsonify({"error": "Email already registered"}), 400

#Add a restaurant
@app.route("/business/restaurants", methods=["POST"])
def add_restaurant():
    try:
        # Retrieve the restaurant data from the request
        data = request.get_json()

        # Check if the data is a list (multiple restaurants)
        if isinstance(data, list):
            # If it's a list, iterate over each restaurant and insert it
            inserted_ids = []
            for restaurant_data in data:
                # Create the restaurant document for each entry
                restaurant = {
                    "name": restaurant_data.get("name"),
                    "category": restaurant_data.get("category"),
                    "price_level": restaurant_data.get("price_level"),
                    "location": restaurant_data.get("location"),
                    "contact_info": restaurant_data.get("contact_info"),
                    "hours": restaurant_data.get("hours"),
                    "description": restaurant_data.get("description"),
                    "photos": restaurant_data.get("photos", []),
                    "owner_id": restaurant_data.get("owner_id")
                }

                # Insert the restaurant into the database
                result = db.restaurants.insert_one(restaurant)
                restaurant_id = str(result.inserted_id)

                # Insert reviews if any are provided
                reviews = restaurant_data.get("reviews", [])
                inserted_review_ids = []
                for review in reviews:
                    # Include the restaurant_id in the review document
                    review_data = {
                        "restaurant_id": restaurant_id,
                        "user_id": review.get("user_id"),
                        "rating": review.get("rating"),
                        "comment": review.get("comment"),
                        "timestamp": review.get("timestamp")
                    }
                    # Insert the review into the reviews collection
                    review_result = db.reviews.insert_one(review_data)
                    inserted_review_ids.append(str(review_result.inserted_id))

                # Add the review ids to the restaurant document
                db.restaurants.update_one(
                    {"_id": ObjectId(restaurant_id)},
                    {"$set": {"reviews": inserted_review_ids}}
                )

                inserted_ids.append(restaurant_id)

            return jsonify({"msg": "Restaurants added", "restaurant_ids": inserted_ids}), 201

        elif isinstance(data, dict):
            # If it's a single restaurant object (dict), insert it directly
            restaurant = {
                "name": data.get("name"),
                "category": data.get("category"),
                "price_level": data.get("price_level"),
                "location": data.get("location"),
                "contact_info": data.get("contact_info"),
                "hours": data.get("hours"),
                "description": data.get("description"),
                "photos": data.get("photos", []),
                "owner_id": data.get("owner_id")
            }

            # Insert the restaurant into the database
            result = db.restaurants.insert_one(restaurant)
            restaurant_id = str(result.inserted_id)

            # Insert reviews if any are provided
            reviews = data.get("reviews", [])
            inserted_review_ids = []
            for review in reviews:
                # Include the restaurant_id in the review document
                review_data = {
                    "restaurant_id": restaurant_id,
                    "user_id": review.get("user_id"),
                    "rating": review.get("rating"),
                    "comment": review.get("comment"),
                    "timestamp": review.get("timestamp")
                }
                # Insert the review into the reviews collection
                review_result = db.reviews.insert_one(review_data)
                inserted_review_ids.append(str(review_result.inserted_id))

            # Add the review ids to the restaurant document
            db.restaurants.update_one(
                {"_id": ObjectId(restaurant_id)},
                {"$set": {"reviews": inserted_review_ids}}
            )

            return jsonify({"msg": "Restaurant added", "restaurant_id": restaurant_id}), 201

        else:
            # If neither a list nor a dict, return an error
            return jsonify({"error": "Invalid input, expected an object or an array of restaurants"}), 400

    except Exception as e:
        # Return an error message with status code 400 if an exception occurs
        return jsonify({"error": str(e)}), 400

    
@app.route("/search_restaurants", methods=["GET"])
def search_restaurants():
    # Get query parameters
    name = request.args.get("name")
    category = request.args.get("category")
    price_level = request.args.get("price_level")
    zip_code = request.args.get("zip_code")
    
    # Create a query dictionary based on provided parameters
    query = {}
    if name:
        query["name"] = {"$regex": name, "$options": "i"}  # case-insensitive search
    if category:
        query["category"] = {"$in": [category]}  # match one of the categories
    if price_level:
        query["price_level"] = price_level
    if zip_code:
        query["location.zip"] = zip_code

    # Find matching restaurants
    restaurants = list(db.restaurants.find(query))
    
    # Convert ObjectId to string for JSON serialization
    for restaurant in restaurants:
        restaurant["_id"] = str(restaurant["_id"])
    
    return jsonify(restaurants), 200

# Get restaurant details along with its reviews
@app.route("/restaurant/<restaurant_id>", methods=["GET"])
def get_restaurant_reviews(restaurant_id):
    try:
        # Find the restaurant by ID
        restaurant = db.restaurants.find_one({"_id": ObjectId(restaurant_id)})
        if not restaurant:
            return jsonify({"error": "Restaurant not found"}), 404

        # Convert restaurant ObjectId to string for JSON serialization
        restaurant["_id"] = str(restaurant["_id"])

        # Find reviews for this restaurant
        reviews = list(db.reviews.find({"restaurant_id": restaurant_id}))
        for review in reviews:
            review["_id"] = str(review["_id"])
            review["restaurant_id"] = str(review["restaurant_id"])
            review["user_id"] = str(review["user_id"])

        # Add reviews to the restaurant details
        restaurant["reviews"] = reviews

        # Calculate average rating from reviews
        if reviews:
            average_rating = sum([review["rating"] for review in reviews]) / len(reviews)
            restaurant["average_rating"] = round(average_rating, 2)  # Round to 2 decimal places
        else:
            restaurant["average_rating"] = None  # No reviews, so no average

        return jsonify(restaurant), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Reviews
@app.route("/reviews", methods=["GET"])
def get_reviews():
    reviews = list(db.reviews.find())
    for review in reviews:
        review["_id"] = str(review["_id"]) 
    return jsonify(reviews), 200

#restaurants
@app.route("/restaurants", methods=["GET"])
def get_restaurants():
    restaurants = list(db.restaurants.find())
    for restaurant in restaurants:
        restaurant["_id"] = str(restaurant["_id"])  
    return jsonify(restaurants), 200

# users
@app.route("/users", methods=["GET"])
def get_users():
    users = list(db.users.find())
    for user in users:
        user["_id"] = str(user["_id"])  
    return jsonify(users), 200

@app.route("/wow", methods=["GET"])
def hello():
    return "App is running!"

GOOGLE_API_KEY = "AIzaSyCdAoRJ_UdjKER07LE9Q3YnykkIOSM7Roc"

@app.route("/restaurants_by_zip", methods=["GET"])
def restaurants_by_zip():
    # Get ZIP code from query parameters
    zipcode = request.args.get("zipcode")
    if not zipcode:
        return jsonify({"error": "ZIP code is required"}), 400

    try:
        # Geocoding API to get coordinates from ZIP code
        geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={zipcode}&key={GOOGLE_API_KEY}"
        geocode_response = requests.get(geocode_url).json()

        if geocode_response['status'] == 'OK':
            # Get latitude and longitude
            location = geocode_response['results'][0]['geometry']['location']
            latitude = location['lat']
            longitude = location['lng']

            # Places API to find restaurants
            places_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
            params = {
                'location': f"{latitude},{longitude}",
                'radius': 5000,  # Search within 5 km
                'type': 'restaurant',
                'key': GOOGLE_API_KEY
            }
            places_response = requests.get(places_url, params=params).json()

            if places_response['status'] == 'OK':
                # Extract restaurant details
                restaurants = [
                    {
                        'name': place['name'],
                        'address': place.get('vicinity', 'Address not available'),
                        'rating': place.get('rating', 'No rating available')
                    }
                    for place in places_response['results']
                ]
                return jsonify(restaurants), 200
            else:
                return jsonify({"error": f"Places API Error: {places_response['status']}"}), 500
        else:
            return jsonify({"error": f"Geocoding API Error: {geocode_response['status']}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#signup 
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'User')

    try:
        user = User(name=name, email=email, password=password, role=role)
        user_id = user.save()
        return jsonify({"message": "User registered successfully", "user_id": user_id}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

#login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    try:
        user = User.validate_user(email, password)
        if user:
            return jsonify({"message": "Login successful", "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
            }}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
    
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
    import requests




