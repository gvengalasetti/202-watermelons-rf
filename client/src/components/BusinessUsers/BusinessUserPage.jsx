import React from 'react';
import RestaurantCard from '../RestaurantCard';

const BusinessUserPage = () => {
  // Mock data for testing the component
  const mockRestaurants = [
    {
      id: 1,
      name: "Pasta Palace",
      location: "123 Main St",
      price_range: 3,
      average_rating: 4.5,
      count: 10,
      category: "Italian"
    },
    {
      id: 2,
      name: "Sushi World",
      location: "456 Oak Ave",
      price_range: 4,
      average_rating: 4.8,
      count: 15,
      category: "Japanese"
    },
    {
      id: 3,
      name: "Burger Joint",
      location: "789 Pine Rd",
      price_range: 2,
      average_rating: 4.2,
      count: 8,
      category: "American"
    }
  ];

  const handleAddNew = () => {
    console.log("Add new restaurant clicked");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Restaurants</h1>
        <button 
          onClick={handleAddNew}
          style={styles.addButton}
        >
          Add New Restaurant
        </button>
      </div>

      {mockRestaurants.length === 0 ? (
        <div style={styles.message}>
          You haven't added any restaurants yet.
        </div>
      ) : (
        <div style={styles.restaurantGrid}>
          {mockRestaurants.map((restaurant) => (
            <RestaurantCard 
              key={restaurant.id} 
              restaurant={restaurant}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  "container": {
    "padding": "20px",
    "maxWidth": "1200px",
    "margin": "0 auto"
  },
  "header": {
    "display": "flex",
    "justifyContent": "space-between",
    "alignItems": "center",
    "marginBottom": "30px"
  },
  "title": {
    "fontSize": "24px",
    "fontWeight": "bold",
    "margin": "0"
  },
  "addButton": {
    "backgroundColor": "#28a745",
    "color": "white",
    "border": "none",
    "padding": "10px 20px",
    "borderRadius": "5px",
    "cursor": "pointer",
    "fontSize": "16px",
    "transition": "background-color 0.2s ease",
    ":hover": {
      "backgroundColor": "#218838"
    }
  },
  "restaurantGrid": {
    "display": "grid",
    "gridTemplateColumns": "repeat(auto-fill, minmax(300px, 1fr))",
    "gap": "20px"
  },
  "message": {
    "textAlign": "center",
    "padding": "20px",
    "color": "#666",
    "fontSize": "18px"
  }
};

export default BusinessUserPage;