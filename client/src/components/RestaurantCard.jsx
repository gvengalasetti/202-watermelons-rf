import React from 'react';
import Review2 from './Review2';

const RestaurantCard = ({ restaurant }) => {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{restaurant.name}</h2>
      <p style={styles.contact}>Contact: {restaurant.contact_info}</p>
      <p style={styles.location}>
        Location: {restaurant.location.street}, {restaurant.location.city}, {restaurant.location.state} {restaurant.location.zip}
      </p>
      <p style={styles.category}>Category: {restaurant.category}</p>
      <p style={styles.description}>Description: {restaurant.description}</p>
      <p style={styles.hours}>
        Hours: 
        <ul>
          {Object.entries(restaurant.hours).map(([day, hours]) => (
            <li key={day}>{day.charAt(0).toUpperCase() + day.slice(1)}: {hours}</li>
          ))}
        </ul>
      </p>
      <p style={styles.price}>Price Level: {restaurant.price_level}</p>
      <Review2 restaurantId={restaurant._id} />
    </div>
  );
};

// Inline styles
const styles = {
  card: {
    padding: '20px',
    margin: '10px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  contact: {
    fontSize: '14px',
    color: 'gray',
  },
  location: {
    fontSize: '14px',
    color: 'gray',
  },
  category: {
    fontSize: '14px',
    color: 'gray',
  },
  description: {
    fontSize: '14px',
    color: 'gray',
  },
  hours: {
    fontSize: '14px',
    color: 'gray',
  },
  price: {
    fontSize: '14px',
    color: 'gray',
  },
};

export default RestaurantCard;