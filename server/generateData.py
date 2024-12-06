import json
import random
from datetime import datetime

def generate_restaurant_data(num=100):
    categories = ["Italian", "Japanese", "American", "Mexican", "Indian", "Chinese", "Steakhouse", "Vegan", "Seafood"]
    price_levels = ["$", "$$", "$$$", "$$$$"]
    street_names = ["Main St", "Oak Ave", "Pine Rd", "Broadway", "Elm St", "Maple Dr", "Sunset Blvd"]
    cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas"]
    states = ["NY", "CA", "TX", "AZ", "PA", "IL", "FL", "OH", "MI"]
    descriptions = [
        "A cozy place with delicious food.",
        "Authentic recipes served in a casual environment.",
        "Fine dining with an exquisite selection of dishes.",
        "Taste the best traditional dishes with a modern twist.",
        "Healthy and fresh ingredients to make every meal a delight.",
        "Delicious and fresh ingredients served daily.",
        "A family-friendly restaurant with something for everyone.",
        "Gourmet meals with a touch of elegance.",
        "Relaxing atmosphere with flavorful dishes."
    ]
    review_comments = [
        "Great food, would definitely come back!",
        "The atmosphere was perfect, but the service was slow.",
        "Amazing flavors and friendly staff!",
        "Very disappointing, the food was cold and bland.",
        "Excellent experience, highly recommend this place.",
        "Not as good as expected, but still decent.",
        "The best meal I've had in a long time!",
        "Good value for the price, but the portions were small."
    ]
    
    data = []

    for i in range(1, num + 1):
        # Generate restaurant data
        restaurant = {
            "_id": str(i),
            "name": f"Restaurant {i}",
            "category": random.choice(categories),
            "price_level": random.choice(price_levels),
            "location": {
                "street": f"{random.randint(1, 999)} {random.choice(street_names)}",
                "city": random.choice(cities),
                "state": random.choice(states),
                "zip": f"{random.randint(10000, 99999)}"
            },
            "hours": {
                "monday": f"{random.randint(9, 12)} AM - {random.randint(1, 9)} PM",
                "tuesday": f"{random.randint(9, 12)} AM - {random.randint(1, 9)} PM",
                "wednesday": f"{random.randint(9, 12)} AM - {random.randint(1, 9)} PM",
                "thursday": f"{random.randint(9, 12)} AM - {random.randint(1, 9)} PM",
                "friday": f"{random.randint(9, 12)} AM - {random.randint(1, 9)} PM"
            },
            "contact_info": f"+1-{random.randint(100, 999)}-{random.randint(100, 999)}-{random.randint(1000, 9999)}",
            "description": random.choice(descriptions)
        }
        
        # Generate 3 reviews for each restaurant
        reviews = []
        for _ in range(3):
            review = {
                "restaurant_id": restaurant["_id"],
                "user_id": f"user_{random.randint(1, 50)}",  # Random user ID from 1 to 50
                "rating": random.randint(1, 5),  # Random rating between 1 and 5
                "comment": random.choice(review_comments),
                "timestamp": datetime.utcnow().isoformat()  # Current UTC timestamp
            }
            reviews.append(review)

        # Add reviews to the restaurant data
        restaurant["reviews"] = reviews
        data.append(restaurant)
    
    return data

# Generate 100 restaurants with reviews
restaurants = generate_restaurant_data(100)

# Save to a JSON file
with open("restaurants.json", "w") as f:
    json.dump(restaurants, f, indent=2)

print("Generated 100 restaurants with random reviews and saved to 'restaurants_with_reviews.json'")
