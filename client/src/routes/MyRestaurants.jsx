import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import Header from "../components/Header";

const MyRestaurants = () => {
  const { user } = useAppContext();
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price_level: "",
    location: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    contact_info: "",
    hours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    description: "",
    photos: [],
  });
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingRestaurantId, setEditingRestaurantId] = useState(null);

  // Fetch restaurants owned by the current owner
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`/business/restaurants/${user.id}`);
        const result = await response.json();

        if (response.ok) {
          setRestaurants(result.restaurants);
        } else {
          alert(result.error || "Failed to fetch restaurants.");
        }
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    };

    if (user?.role === "Owner") {
      fetchRestaurants();
    }
  }, [user]);

  // Handle input changes for nested objects (location and hours)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError("");
  };

  // Handle photo uploads
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    if (formData.photos.length + files.length > 4) {
      setError("You can upload up to 4 photos only.");
      return;
    }
    const filePreviews = files.map((file) => URL.createObjectURL(file)); // Create file previews
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...filePreviews],
    }));
    setError("");
  };

  // New function to remove a photo during editing
  const handleRemovePhoto = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Reset form data to initial state
  const resetFormData = () => ({
    name: "",
    category: "",
    price_level: "",
    location: { street: "", city: "", state: "", zip: "" },
    contact_info: "",
    hours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    description: "",
    photos: [],
  });

  // Handle add restaurant form submission
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price_level) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      const response = await fetch("/business/add_new_restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, owner_id: user.id }),
      });
      const result = await response.json();

      if (response.ok) {
        alert("Restaurant added successfully!");
        setRestaurants([...restaurants, { ...formData, _id: result.restaurant_id }]);
        setFormData(resetFormData());
        setIsAdding(false); // Close the form after successful submission
      } else {
        setError(result.error || "Failed to add restaurant.");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please try again later.");
    }
  };

  // Handle delete restaurant
  const handleDelete = async (restaurantId) => {
    try {
      const response = await fetch(`/business/restaurants/${restaurantId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok) {
        alert("Restaurant deleted successfully!");
        setRestaurants((prev) => prev.filter((r) => r._id !== restaurantId));
      } else {
        alert(result.error || "Failed to delete restaurant.");
      }
    } catch (err) {
      console.error("Error deleting restaurant:", err);
    }
  };

  // Handle edit restaurant
  const handleEdit = (restaurant) => {
    setIsEditing(true);
    setEditingRestaurantId(restaurant._id);
    setFormData(restaurant);
  };

  // Handle save restaurant (edit)
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const { _id, ...fieldsToUpdate } = formData; // Exclude _id for update
      const response = await fetch(`/business/restaurants/${editingRestaurantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fieldsToUpdate),
      });
      const result = await response.json();

      if (response.ok) {
        alert("Restaurant updated successfully!");
        setRestaurants((prev) =>
          prev.map((r) =>
            r._id === editingRestaurantId ? { ...r, ...fieldsToUpdate } : r
          )
        );
        
        // Reset form data first
        setFormData(resetFormData());
        setIsEditing(false);
        setEditingRestaurantId(null);
      } else {
        alert(result.error || "Failed to update restaurant.");
      }
    } catch (err) {
      console.error("Error updating restaurant:", err);
      alert("An error occurred while updating the restaurant. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <div style={{ padding: "20px" }}>
        <h3>My Restaurants</h3>

        {/* Button to toggle "Add New Restaurant" */}
        {!isAdding && !isEditing && (
          <button onClick={() => setIsAdding(true)}>Add New Restaurant</button>
        )}

        {/* Add Restaurant Form */}
        {isAdding && (
          <div>
            <h4>Add a New Restaurant</h4>
            <form onSubmit={handleAddSubmit}>
              {/* All Fields */}
              <input
                type="text"
                name="name"
                placeholder="Restaurant Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="price_level"
                placeholder="Price Level"
                value={formData.price_level}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
              />
              {/* Location */}
              <input
                type="text"
                name="location.street"
                placeholder="Street"
                value={formData.location.street}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="location.city"
                placeholder="City"
                value={formData.location.city}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="location.state"
                placeholder="State"
                value={formData.location.state}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="location.zip"
                placeholder="Zip Code"
                value={formData.location.zip}
                onChange={handleInputChange}
              />
              {/* Contact Info */}
              <input
                type="text"
                name="contact_info"
                placeholder="Contact Info"
                value={formData.contact_info}
                onChange={handleInputChange}
              />
              {/* Hours */}
              {Object.keys(formData.hours).map((day) => (
                <input
                  key={day}
                  type="text"
                  name={`hours.${day}`}
                  placeholder={`${day.charAt(0).toUpperCase() + day.slice(1)} Hours`}
                  value={formData.hours[day]}
                  onChange={handleInputChange}
                />
              ))}
              {/* Photos */}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                {formData.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Uploaded preview ${index + 1}`}
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                ))}
              </div>
              <button type="submit">Add Restaurant</button>
              <button type="button" onClick={() => setIsAdding(false)}>Cancel</button>
            </form>
          </div>
        )}

        {/* Edit Restaurant Form */}
        {isEditing && (
          <div>
            <h4>Edit Restaurant</h4>
            <form onSubmit={handleSave}>
              {/* All Fields */}
              <input
                type="text"
                name="name"
                placeholder="Restaurant Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="price_level"
                placeholder="Price Level"
                value={formData.price_level}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
              />
              {/* Location */}
              <input
                type="text"
                name="location.street"
                placeholder="Street"
                value={formData.location.street}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="location.city"
                placeholder="City"
                value={formData.location.city}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="location.state"
                placeholder="State"
                value={formData.location.state}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="location.zip"
                placeholder="Zip Code"
                value={formData.location.zip}
                onChange={handleInputChange}
              />
              {/* Contact Info */}
              <input
                type="text"
                name="contact_info"
                placeholder="Contact Info"
                value={formData.contact_info}
                onChange={handleInputChange}
              />
              {/* Hours */}
              {Object.keys(formData.hours).map((day) => (
                <input
                  key={day}
                  type="text"
                  name={`hours.${day}`}
                  placeholder={`${day.charAt(0).toUpperCase() + day.slice(1)} Hours`}
                  value={formData.hours[day]}
                  onChange={handleInputChange}
                />
              ))}
              {/* Photos */}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                {formData.photos.map((photo, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={photo}
                      alt={`Uploaded preview ${index + 1}`}
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer'
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
          </div>
        )}

        {/* Display Restaurant Listings */}
        {!isAdding && !isEditing && restaurants.length === 0 && (
          <p>No restaurants found. Add your first restaurant!</p>
        )}
        {!isAdding && !isEditing && restaurants.map((restaurant) => (
          <div key={restaurant._id}>
            <h4>{restaurant.name}</h4>
            <button onClick={() => handleEdit(restaurant)}>Edit</button>
            <button onClick={() => handleDelete(restaurant._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRestaurants;