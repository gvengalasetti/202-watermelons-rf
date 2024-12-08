import React from "react";
import Header from "../components/Header";
import AddRestaurant from "../components/AddRestaurant";
import RestaurantList from "../components/RestaurantList";
import SearchBar from "../components/SearchBar";
import { useAppContext } from "../context/AppContext"; // Import AppContext

const Home = () => {
  const { user } = useAppContext(); // Access user details from AppContext

  return (
    <div>
      <Header />
      <SearchBar />

      {/* Display user details */}
      {user && (
        <div style={{ margin: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
          <h2>User Details</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.id && <p><strong>ID:</strong> {user.id}</p>} {/* If ID exists */}
        </div>
      )}

      {/* Uncomment these lines to use additional components */}
      {/* <AddRestaurant />
      <RestaurantList /> */}
    </div>
  );
};

export default Home;
