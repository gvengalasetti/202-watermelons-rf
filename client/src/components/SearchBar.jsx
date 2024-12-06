import React, { useState } from 'react';
import RestaurantCard from './RestaurantCard';

const SearchBar = () => {
  const [searchCriteria, setSearchCriteria] = useState("name");
  const [inputValue, setInputValue] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5001/restaurants`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data)
      
      // Filter the data based on search criteria
      const filteredData = data.filter(restaurant => {
        const value = restaurant[searchCriteria] || (restaurant.location && restaurant.location.zip);
        return value && value.toString().toLowerCase().includes(inputValue.toLowerCase());
      });

      setFilteredRestaurants(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setFilteredRestaurants([]);
    }
  };

  return (
    <div style={styles.container}>
      <select
        value={searchCriteria}
        onChange={(event) => setSearchCriteria(event.target.value)}
        style={styles.select}
      >
        <option value="name">Name</option>
        <option value="category">Category (Food, Cuisine)</option>
        <option value="price_level">Price Level</option>
        <option value="location.zip">Location (Zipcode)</option>
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
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
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