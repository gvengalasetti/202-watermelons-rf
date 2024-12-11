import React, { useState } from 'react';
import RestaurantCard from './RestaurantCard';

const SearchBar = () => {
  const [searchCriteria, setSearchCriteria] = useState("name");
  const [inputValue, setInputValue] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search options with more descriptive labels
  const searchOptions = [
    { value: "name", label: "Restaurant Name" },
    { value: "category", label: "Cuisine Type" },
    {value: "diet", label: "Dietary Preference"},
    { value: "price_level", label: "Price Level" },
    { value: "location.zip", label: "Location (Zipcode)" },
    { value: "ratings", label:"Ratings"}
  ];

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSearch = async () => {
    // Reset previous state
    setFilteredRestaurants([]);
    setIsLoading(true);

    try {
      let filteredData = [];

      if (searchCriteria === "location.zip") {
        // Handle ZIP code search
        const response = await fetch(`/restaurants_by_zip?zipcode=${inputValue}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Ensure only key information is included
        filteredData = data.map(restaurant => ({
          name: restaurant.name,
          address: restaurant.address,
          rating: restaurant.rating
        }));
      } else if(searchCriteria==="price_level"){
        const response = await fetch(`/restaurants`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Filter the data based on search criteria
        filteredData = data.filter(restaurant => {
          const value = restaurant[searchCriteria];
          return value && value.toString().toLowerCase() === inputValue.toLowerCase();
        });
      }
        else if(searchCriteria==="ratings"){
          try{
        const response = await fetch(`/restaurants/by_rating/${inputValue}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        filteredData = data.filter(restaurant => {
          
          const value = restaurant["average_rating"]
          console.log(value+"sadfjkhsadlfkj")
          return value;
          
        });
          
                    
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setFilteredRestaurants([]); // Clear results on error
      } finally {
        setIsLoading(false); // Reset loading state
      }
      }
      else if(searchCriteria==="diet"){
          console.log("DIET")
      }
      
      else {
        // Handle other search criteria
        const response = await fetch(`/restaurants`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Filter the data based on search criteria
        filteredData = data.filter(restaurant => {
          
          const value = restaurant[searchCriteria] || (restaurant.location && restaurant.location.zip);
          return value && value.toString().toLowerCase().includes(inputValue.toLowerCase());
          
        });
      }
      setFilteredRestaurants(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setFilteredRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchContainer}>
        <select
          value={searchCriteria}
          onChange={(event) => setSearchCriteria(event.target.value)}
          style={styles.select}
        >
          {searchOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder={`Enter ${searchOptions.find(opt => opt.value === searchCriteria)?.label}`}
          value={inputValue}
          onChange={handleInputChange}
          style={styles.input}
        />

        <button 
          onClick={handleSearch} 
          style={styles.button}
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div style={styles.resultsContainer}>
        {isLoading ? (
          <p style={styles.loadingText}>Loading restaurants...</p>
        ) : filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <div key={restaurant.name} style={styles.restaurantCardWrapper}>
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))
        ) : (
          <p style={styles.noResults}>
            {inputValue ? 'No restaurants found' : 'Start your search'}
          </p>
        )}
      </div>
    </div>
  );
};

// Updated inline styles with more responsive design
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  searchContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  select: {
    flex: '0 0 25%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    backgroundColor: 'white'
  },
  input: {
    flex: '1',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  button: {
    padding: '10px 15px',
    borderRadius: '4px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  restaurantCardWrapper: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '10px'
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px'
  },
  loadingText: {
    textAlign: 'center',
    color: '#007BFF',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px'
  }
};

export default SearchBar;