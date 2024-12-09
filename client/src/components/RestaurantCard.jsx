import React from 'react';
import Review2 from './Review2';
import RestaurantReviewSection from './RestaurantReviewSection';

const RestaurantCard = ({ restaurant }) => {
  const restaurantID1="6753614b68217f732db935de"
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{restaurant.name}</h2>
      {/* Display location */}
      <p style={styles.location}>
        Location: {restaurant.address ? restaurant.address : `${restaurant.location?.street}, ${restaurant.location?.city}, ${restaurant.location?.state} ${restaurant.location?.zip}`}
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
      <RestaurantReviewSection restaurantId={restaurant._id}/>
      <p style={styles.rating}>Rating: {restaurant.rating || 'No rating available'}</p>

      {/* Only show additional information if present */}
      {restaurant.contact_info && <p style={styles.contact}>Contact: {restaurant.contact_info}</p>}
      {restaurant.category && <p style={styles.category}>Category: {restaurant.category}</p>}
      {restaurant.description && <p style={styles.description}>Description: {restaurant.description}</p>}
      {restaurant.hours && (
        <p style={styles.hours}>
          Hours:
          <ul>
            {Object.entries(restaurant.hours).map(([day, hours]) => (
              <li key={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)}: {hours}
              </li>
            ))}
          </ul>
        </p>
      )}
      {restaurant.price_level && <p style={styles.price}>Price Level: {restaurant.price_level}</p>}
      
      {/* Reviews section */}
      {restaurant.reviews && restaurant.reviews.length > 0 && (
        <div style={styles.reviews}>
          <h3>Reviews:</h3>
          {restaurant.reviews.map((review, index) => (
            <div key={index} style={styles.review}>
              <p><strong>{review.author_name}</strong>: {review.text}</p>
            </div>
          ))}
        </div>
      )}
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
  rating: {
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
  reviews: {
    marginTop: '10px',
  },
  review: {
    marginBottom: '8px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
  },
};

export default RestaurantCard;
