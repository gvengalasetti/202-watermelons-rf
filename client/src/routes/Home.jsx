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
      {/* Uncomment these lines to use additional components */}
      {/* <AddRestaurant />
      <RestaurantList /> */}
    </div>
  );
};

export default Home;
