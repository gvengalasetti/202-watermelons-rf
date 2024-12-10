import React, { useState, useContext, useEffect } from "react";
import RestaurantFinder from "../../apis/RestaurantFinder";
import { RestaurantsContext } from "../../context/RestaurantsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons"; // Import the refresh icon
import "./FindDuplicates.css";

const FindDuplicates = () => {
  const [duplicates, setDuplicates] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [restaurantDetails, setRestaurantDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { removeRestaurants } = useContext(RestaurantsContext);

  const fetchDuplicates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await RestaurantFinder.get("http://rf-lb-1272531251.us-east-1.elb.amazonaws.com:5001/admin/duplicates");
      setDuplicates(response.data);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error("Error fetching duplicates:", err);
      setError(err.response?.data?.error || "Failed to fetch duplicates");
    }
    setIsLoading(false);
  };

  const fetchRestaurantDetails = async (restaurantId) => {
    try {
      const response = await RestaurantFinder.get(`http://rf-lb-1272531251.us-east-1.elb.amazonaws.com:5001/restaurant-fetch/${restaurantId}`);
      setRestaurantDetails((prevDetails) => ({
        ...prevDetails,
        [restaurantId]: response.data,
      }));
    } catch (err) {
      console.error("Error fetching restaurant details:", err);
      setRestaurantDetails((prevDetails) => ({
        ...prevDetails,
        [restaurantId]: { error: "Failed to fetch details" },
      }));
    }
  };

  const handleExpandToggle = (groupKey, restaurantIds) => {
    setExpandedGroups((prevState) => {
      const newState = { ...prevState };
      if (newState[groupKey]) {
        delete newState[groupKey]; // Collapse
      } else {
        newState[groupKey] = true; // Expand
        // Fetch details for all restaurant IDs in this group
        restaurantIds.forEach((restaurantId) => {
          if (!restaurantDetails[restaurantId]) {
            fetchRestaurantDetails(restaurantId);
          }
        });
      }
      return newState;
    });
  };

  const handleRemoveListing = async (restaurantId) => {
    if (!restaurantId) {
      alert("Invalid restaurant ID.");
      return; // Stop execution if no valid ID
    }

    try {
      await RestaurantFinder.delete(`http://rf-lb-1272531251.us-east-1.elb.amazonaws.com:5001/admin/remove_listing/${restaurantId}`);
      alert("Restaurant removed successfully.");
      removeRestaurants(restaurantId);

      // Dynamically update state without refreshing
      setDuplicates((prevDuplicates) =>
        prevDuplicates.map((duplicate) => ({
          ...duplicate,
          restaurant_ids: duplicate.restaurant_ids.filter((id) => id !== restaurantId),
          count: duplicate.restaurant_ids.length - 1, // Adjust count
        }))
      );
    } catch (err) {
      console.error("Error removing listing:", err);
      alert("Failed to remove the restaurant.");
    }
  };

  useEffect(() => {
    fetchDuplicates();
  }, []);

  const renderDuplicateGroup = (duplicate) => {
    const name = duplicate._id?.name || "Unknown Name";
    const address = duplicate._id?.address;
    const { city, state, street, zip } = address || {};
    const fullAddress = `${street || "Unknown Street"}, ${city || "Unknown City"}, ${state || "Unknown State"} ${zip || ""}`;

    const groupKey = `${name}-${fullAddress}`;

    return (
      <div key={groupKey} className="duplicate-group">
        <div className="duplicate-info" onClick={() => handleExpandToggle(groupKey, duplicate.restaurant_ids)}>
          <h3>
            <span className="expand-arrow">
              {expandedGroups[groupKey] ? "▼" : "►"}
            </span>
            {name} - {fullAddress} <span>({duplicate.count} Listings)</span>
          </h3>
        </div>
        {expandedGroups[groupKey] && (
          <div className="expanded-group">
            {duplicate.restaurant_ids.map((restaurantId) => {
              const details = restaurantDetails[restaurantId];
              return (
                <div key={restaurantId} className="restaurant-item">
                  <div className="restaurant-info">
                    <h4>{details?.name || "Restaurant Name"}</h4>
                    <p><strong>Description:</strong> {details?.description || "No description available."}</p>
                    <p><strong>Hours:</strong></p>
                    <ul>
                      {details?.hours && Object.entries(details.hours).length > 0 ? (
                        Object.entries(details.hours).map(([day, hours]) => (
                          <li key={day}>{day}: {hours}</li>
                        ))
                      ) : (
                        <p>No hours available</p>
                      )}
                    </ul>
                    <p><strong>Contact Info:</strong> {details?.contact_info || "N/A"}</p>
                  </div>
                  <div className="remove-listing-btn">
                    <button onClick={() => handleRemoveListing(restaurantId)} className="remove-listing-btn">
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="duplicates-container">
      <h2>Duplicate Restaurants</h2>
      <div className="refresh-container">
        {lastUpdated && <p>Last Updated: {lastUpdated}</p>}
        <FontAwesomeIcon
          icon={faRedoAlt}
          className="refresh-icon"
          onClick={fetchDuplicates}
          style={{ cursor: "pointer", fontSize: "1.5em" }}
        />
      </div>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {duplicates.length === 0 ? (
        <p>No duplicate restaurants found.</p>
      ) : (
        duplicates.map(renderDuplicateGroup)
      )}
    </div>
  );
};

export default FindDuplicates;
