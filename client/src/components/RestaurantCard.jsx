// components/RestaurantCard.js

import React from 'react';
import Review2 from './Review2';

const RestaurantCard = ({ restaurant }) => {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{restaurant.name}</h2>
      <p style={styles.contact}>Location: {restaurant.zipcode}</p>
      <p style={styles.category}>Category: {restaurant.category}</p>
      <p style={styles.rating}>Rating: {restaurant.rating}</p>
      <p style={styles.price}>Price: {restaurant.price}</p>
      <Review2 restaurantId={restaurant.id} />
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
  category: {
    fontSize: '14px',
    color: 'gray',
  },
  rating: {
    fontSize: '14px',
    color: 'gray',
  },
  price: {
    fontSize: '14px',
    color: 'gray',
  },
};

export default RestaurantCard;
