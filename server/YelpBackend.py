# app.py
from flask import Flask, request, jsonify
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from database import db
from User import User
from flask_cors import CORS
import requests
from bson import ObjectId

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
@app.route("/restaurant/<restaurant_id>/avgrating", methods=["GET"])
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
    

@app.route("/restaurants/<restaurant_id>/reviews", methods=["GET"])
def fetch_reviews_for_restaurant(restaurant_id):
    try:
        # Find reviews for this restaurant
        reviews = list(db.reviews.find({"restaurant_id": restaurant_id}))
        for review in reviews:
            review["_id"] = str(review["_id"])
            review["restaurant_id"] = str(review["restaurant_id"])
            review["user_id"] = str(review["user_id"])

        return jsonify(reviews), 200

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

reviews_collection = db.reviews  # Access the 'reviews' collection
@app.route('/api/reviews', methods=['POST'])
def post_review():
    try:
        print("This post review request has not completed all the way through")

        # Parse JSON data from request
        data = request.get_json()
        print(data)
        # Validate input fields
        required_fields = ['restaurantId', 'rating', 'reviewText']
        for field in required_fields:
            if field not in data:
                print(field)
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Extract data
        restaurant_id = data['restaurantId']
        rating = data['rating']
        review_text = data['reviewText']



        # Basic validation for values
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            return jsonify({'error': 'Rating must be an integer between 1 and 5'}), 400
        
        if len(review_text.strip()) < 10:
            return jsonify({'error': 'Review text must be at least 10 characters long'}), 400


# Generate a new random ObjectId
        new_id = ObjectId()

        # Save the review (simulated)
        fakeReview = {
            '_id': new_id,
            'restaurant_id': restaurant_id,
            'user_id': "user_2",
            'rating': rating,
            'comment': review_text,
            'timestamp':'2024-12-06T20:36:00.639533'
        }
        review = {
            'restaurantId': restaurant_id,
            'rating': rating,
            'comment': review_text,
        }
        print(fakeReview)
#   # Append the review to the `reviews` array of the specific restaurant
#         result = db.restaurants.update_one(
#             {'_id': ObjectId(restaurant_id)},
#             {'$push': {'reviews': review}},
#             upsert=True  # Create a new document if not found
#         )


        # if result.matched_count > 0:
        #     print(f"Document with restaurantId {restaurant_id} was found and updated.")
        # else:
        #     print(f"No document found with restaurantId {restaurant_id}. A new document was inserted.")

        # print(f"Number of documents modified: {result.modified_count}")
        # print(f"Upserted ID (if a new document was inserted): {result.upserted_id}")
        # #Not working code

        # if result.upserted_id or result.modified_count > 0:
        #     return {'message': 'Review submitted successfully', 'review': review}, 201
        # else:
        #     return {'error': 'Failed to submit review'}, 500
        print(": : :")

        try:
    # Attempt to insert the review into the collection
            result = reviews_collection.insert_one(fakeReview)
            print(f"Review successfully inserted with ID: {result.inserted_id}")
        except Exception as e:
    # Catch and log any exceptions that occur
            print(f"An error occurred while inserting the review: {str(e)}")        
            print("testing")
        
        print(": : :")
        restaurant_id = fakeReview['restaurant_id']
        print(restaurant_id)
        reviews1 = reviews_collection.find({"restaurant_id": restaurant_id})
        # Iterate over the cursor and print each document
        print(reviews1)
        if reviews_collection.count_documents({"restaurant_id": restaurant_id}) == 0:
            print("No reviews found for the given restaurant_id")
        # Insert a document into 'reviews'
        for review in reviews1:
            print(review)
            print("testing")

        print(f"Inserted document ID: {result.inserted_id}")


        # Log the result of the operation
        if result.inserted_id:
            print(f"Review successfully added with ID: {result.inserted_id}")
            return jsonify({'message': 'Review added successfully', 'review_id': str(result.inserted_id)}), 201
        else:
            print("Failed to insert review.")
            return jsonify({'error': 'Failed to add review'}), 500
    except Exception as e:
        # Catch unexpected errors
        return jsonify({'error': str(e)}), 500


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

@app.route("/admin/duplicates", methods=["GET"])
def find_duplicates():
    try:
        # Group restaurants by name and address
        pipeline = [
            {
                "$group": {
                    "_id": {"name": "$name", "address": "$location"},  # Full location object
                    "count": {"$sum": 1},
                    "restaurant_ids": {"$push": "$_id"}
                }
            },
            {
                "$match": {"count": {"$gt": 1}}  # Only return groups with duplicates
            }
        ]

        duplicates = list(db.restaurants.aggregate(pipeline))

        # Convert ObjectId to string for JSON serialization
        for duplicate in duplicates:
            duplicate["restaurant_ids"] = [str(_id) for _id in duplicate["restaurant_ids"]]

        return jsonify(duplicates), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/admin/remove_listing/<restaurant_id>", methods=["DELETE"])
def remove_listing(restaurant_id):
    try:
        # Remove the restaurant by ID
        result = db.restaurants.delete_one({"_id": ObjectId(restaurant_id)})

        if result.deleted_count == 1:
            return jsonify({"msg": "Restaurant listing removed successfully"}), 200
        else:
            return jsonify({"error": "Restaurant not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route("/business/add_new_restaurant", methods=["POST"])
def add_new_restaurant():
    try:

        # Retrieve the restaurant data from the request
        data = request.get_json()

        # Validate required fields
        required_fields = ["name", "category", "price_level", "location", "contact_info", "hours", "description"]
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"{field} is required."}), 400

        # Validate nested fields
        if not isinstance(data.get("location"), dict):
            print("Invalid location format")
            return jsonify({"error": "Location must be a dictionary."}), 400
        if not isinstance(data.get("hours"), dict):
            print("Invalid hours format")
            return jsonify({"error": "Hours must be a dictionary."}), 400

        # Extract restaurant details
        restaurant = {
            "name": data.get("name"),
            "category": data.get("category"),
            "price_level": data.get("price_level"),
            "location": data.get("location"),  # Should be a dictionary
            "contact_info": data.get("contact_info"),
            "hours": data.get("hours"),  # Should be a dictionary
            "description": data.get("description"),
            "photos": data.get("photos", []),  # Default to empty array
            "owner_id": data.get("owner_id"),  # Should come from AppContext
        }

        # Insert the restaurant into the database
        result = db.restaurants.insert_one(restaurant)
        restaurant_id = str(result.inserted_id)

        # Log successful insertion
        return jsonify({"msg": "Restaurant added successfully", "restaurant_id": restaurant_id}), 201

    except Exception as e:
        # Log the exception details
        return jsonify({"error": "Failed to add restaurant", "details": str(e)}), 500
    
#Get restaurants by owner_id
@app.route("/business/restaurants/<owner_id>", methods=["GET"])
def get_restaurants_by_owner(owner_id):
    try:
        restaurants = list(db.restaurants.find({"owner_id": owner_id}))
        for restaurant in restaurants:
            restaurant["_id"] = str(restaurant["_id"])  # Convert ObjectId to string
        return jsonify({"restaurants": restaurants}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch restaurants", "details": str(e)}), 500
    
#update a restaurant
@app.route("/business/restaurants/<restaurant_id>", methods=["PUT"])
def update_restaurant(restaurant_id):
    try:
        data = request.get_json()
        # Exclude _id from the update fields
        if "_id" in data:
            del data["_id"]

    #Filter out empty fields
        update_fields = {key: value for key, value in data.items() if value}


        if not update_fields:
            return jsonify({"error": "No fields to update"}), 400

        # Perform the update
        result = db.restaurants.update_one({"_id": ObjectId(restaurant_id)}, {"$set": update_fields})

        if result.matched_count == 0:
            return jsonify({"error": "Restaurant not found"}), 404

        return jsonify({"msg": "Restaurant updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to update restaurant", "details": str(e)}), 500
    
#Delete a restaurant
@app.route("/business/restaurants/<restaurant_id>", methods=["DELETE"])
def delete_restaurant(restaurant_id):
    try:
        result = db.restaurants.delete_one({"_id": ObjectId(restaurant_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Restaurant not found"}), 404

        return jsonify({"msg": "Restaurant deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to delete restaurant", "details": str(e)}), 500
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
    import requests

