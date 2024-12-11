import React, { useState, useEffect } from 'react';

const Review2 = ({ restaurantId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [averageReview, setAverageReview]=useState([]);


    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`/restaurants/${restaurantId}/reviews`);
                if (!response.ok) {
                    throw new Error('Failed to fetch reviews');
                }
                const data = await response.json();
                setReviews(data);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
            try{
                const response = await fetch(`/restaurants/${restaurantId}/average_review`);
                if (!response.ok) {
                    throw new Error('Failed to fetch reviews');
                }
                const data = await response.json();
                console.log("data average rating" +data.average_rating)
                setAverageReview(data.average_rating)
            }
            catch (error){
                setError("Unable to Calculate Average Review")
            }
        };
        fetchReviews();
    }, [restaurantId]);

    const renderStars = (rating) => {
        return (
            <div style={styles.starContainer}>
                <span style={styles.stars}>
                    {"★".repeat(rating)}
                    {"☆".repeat(5 - rating)}
                </span>
            </div>
        );
    };

    const renderReviewItem = (item) => (
        <div style={styles.reviewItem} key={item._id}>
            <div style={styles.reviewHeader}>
                <span style={styles.userName}>{item.user_id}</span>
                <span style={styles.date}>{new Date(item.timestamp).toLocaleDateString()}</span>
            </div>
            {renderStars(item.rating)}
            <p style={styles.reviewText}>{item.comment}</p>
        </div>
    );
    

    if (loading) {
        return <p>Loading reviews...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Reviews</h2>
            <h3 >AVG. {averageReview}</h3>
            <div style={styles.reviewList}>
                {reviews.length > 0 ? (
                    reviews.map(renderReviewItem)
                ) : (
                    <p style={styles.noResults}>No reviews found.</p>
                )}
            </div>
        </div>
    );
};

// Inline styles
const styles = {
    "container": {
        "padding": "16px",
        "backgroundColor": "#fff"
    },
    "title": {
        "fontSize": "20px",
        "fontWeight": "bold",
        "marginBottom": "16px"
    },
    "reviewItem": {
        "margin": "8px 0"
    },
    "reviewHeader": {
        "display": "flex",
        "justifyContent": "space-between",
        "marginBottom": "4px"
    },
    "userName": {
        "fontWeight": "bold",
        "fontSize": "16px"
    },
    "date": {
        "color": "#666"
    },
    "starContainer": {
        "display": "flex",
        "margin": "4px 0"
    },
    "stars": {
        "color": "#ffd700"
    },
    "reviewText": {
        "fontSize": "14px",
        "lineHeight": "20px",
        "marginTop": "4px"
    },
    "reviewList": {
        "borderTop": "1px solid #E0E0E0",
        "paddingTop": "8px"
    },
    "noResults": {
        "textAlign": "center",
        "color": "#666",
        "marginTop": "16px"
    }
};

export default Review2;