import React, { useState } from 'react';
import RestaurantCard from './RestaurantCard';

// Mock data for restaurants
const restaurants = [
  {
    "id": 1,
    "name": "Pasta Palace",
    "zipcode": "12345",
    "category": "Italian",
    "rating": 4.5,
    "price": "$$",
    "reviews": ["Great food!", "Loved the ambiance."]
  },
  {
    "id": 2,
    "name": "Sushi World",
    "zipcode": "12345",
    "category": "Japanese",
    "rating": 4.7,
    "price": "$$$",
    "reviews": ["Best sushi in town!", "Fresh and delicious."]
  },
  {
    "id": 3,
    "name": "Burger Haven",
    "zipcode": "54321",
    "category": "American",
    "rating": 4.2,
    "price": "$",
    "reviews": ["Juicy burgers!", "Fast service."]
  },
  {
    "id": 4,
    "name": "Curry Corner",
    "zipcode": "67890",
    "category": "Indian",
    "rating": 4.8,
    "price": "$$",
    "reviews": ["Amazing curry!", "Spicy and flavorful."]
  }
];

const SearchBar = () => {
  const [searchCriteria, setSearchCriteria] = useState("name");
  const [inputValue, setInputValue] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    const results = restaurants.filter((restaurant) => {
      if (searchCriteria === "name") {
        return restaurant.name.toLowerCase().includes(inputValue.toLowerCase());
      } else if (searchCriteria === "zipcode") {
        return restaurant.zipcode.includes(inputValue);
      } else if (searchCriteria === "category") {
        return restaurant.category.toLowerCase().includes(inputValue.toLowerCase());
      } else if (searchCriteria === "rating") {
        return restaurant.rating.toString() === inputValue;
      } else if (searchCriteria === "price") {
        return restaurant.price === inputValue;
      }
      return false;
    });

    setFilteredRestaurants(results);
  };

  return (
    <div style={styles.container}>
      <select
        value={searchCriteria}
        onChange={(event) => setSearchCriteria(event.target.value)}
        style={styles.select}
      >
        <option value="name">Name</option>
        <option value="zipcode">Location (Zipcode)</option>
        <option value="category">Category (Food, Cuisine)</option>
        <option value="rating">Ratings</option>
        <option value="price">Price</option>
      </select>

      <input
        type="text"
        placeholder={`Enter ${searchCriteria}`}
        value={inputValue}
        onChange={handleInputChange}
        style={styles.input}
      />

      <button onClick={handleSearch} style={styles.button}>Search</button>

      <div>
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))
        ) : (
          <p style={styles.noResults}>No results found.</p>
        )}
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  "container": {
    "padding": "16px"
  },
  "select": {
    "marginBottom": "16px",
    "padding": "8px",
    "borderRadius": "4px",
    "border": "1px solid #ccc",
    "fontSize": "16px"
  },
  "input": {
    "height": "40px",
    "borderWidth": "1px",
    "borderColor": "#ccc",
    "borderRadius": "8px",
    "paddingHorizontal": "12px",
    "marginBottom": "16px",
    "fontSize": "16px",
    "backgroundColor": "white",
    "width": "100%"
  },
  "button": {
    "padding": "10px 15px",
    "borderRadius": "4px",
    "backgroundColor": "#007BFF",
    "color": "white",
    "border": "none",
    "cursor": "pointer"
  },
  "noResults": {
    "textAlign": "center",
    "color": "#666",
    "marginTop": "16px"
  }
};

export default SearchBar;