# app.py
from flask import Flask, request, jsonify
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from database import db
import requests
app = Flask(__name__)



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


# Add a new restaurant
@app.route("/business/restaurants", methods=["POST"])
def add_restaurant():
    data = request.json
    restaurant = {
        "name": data["name"],
        "category": data["category"],
        "price_level": data["price_level"],
        "location": data["location"],
        "contact_info": data.get("contact_info"),
        "hours": data.get("hours"),
        "description": data.get("description"),
        "photos": data.get("photos", []),
        "owner_id": data["owner_id"]
    }
    result = db.restaurants.insert_one(restaurant)
    return jsonify({"msg": "Restaurant added", "restaurant_id": str(result.inserted_id)}), 201

# Add a review
@app.route("/reviews", methods=["POST"])
def add_review():
    data = request.json
    review = {
        "restaurant_id": data["restaurant_id"], 
        "user_id": data["user_id"], 
        "rating": data["rating"],  
        "comment": data.get("comment", ""),  
        "timestamp": data.get("timestamp", None) 
    }
    
    try:
        result = db.reviews.insert_one(review)
        return jsonify({"msg": "Review added", "review_id": str(result.inserted_id)}), 201
    except Exception as e:
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
    
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
    import requests




