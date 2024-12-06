import React from 'react';

const Review2 = ({ restaurantId }) => {
    // This will be replaced with API data later
    const staticReviews = [
        {
            "id": "1",
            "userName": "John Doe",
            "date": "2024-03-15",
            "stars": 4,
            "text": "Great food and atmosphere! Would definitely come back again."
        },
        {
            "id": "2",
            "userName": "Jane Smith",
            "date": "2024-03-10",
            "stars": 5,
            "text": "Best restaurant in town. The service was exceptional."
        },
        {
            "id": "3",
            "userName": "Mike Johnson",
            "date": "2024-03-05",
            "stars": 3,
            "text": "Food was good but service was a bit slow."
        }
    ];

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
        <div style={styles.reviewItem} key={item.id}>
            <div style={styles.reviewHeader}>
                <span style={styles.userName}>{item.userName}</span>
                <span style={styles.date}>{item.date}</span>
            </div>
            {renderStars(item.stars)}
            <p style={styles.reviewText}>{item.text}</p>
        </div>
    );

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Reviews</h2>
            <div style={styles.reviewList}>
                {staticReviews.map(renderReviewItem)}
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
    }
};

export default Review2; 