import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import UpdatePage from "./routes/UpdatePage";
import RestaurantDetailPage from "./routes/RestaurantDetailPage";
import { RestaurantsContextProvider } from "./context/RestaurantsContext";
import { AppProvider } from "./context/AppContext";
import SearchBar from "./components/SearchBar";
import LoginPage from "./routes/signin";
import SignupPage from "./routes/signup";
import AdminPage from "./components/Admin/Admin";  // Corrected import path
import MyRestaurants from "./routes/MyRestaurants";


const App = () => {
  return (
    <AppProvider>
    <RestaurantsContextProvider>
      <div >
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/home" element={<Home />} />
            <Route path="/restaurants/:id/update" element={<UpdatePage />} />
            <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/my-restaurants" element={<MyRestaurants />} /> {/* Add the new route */}
          </Routes>
        </Router>
      </div>
    </RestaurantsContextProvider>
    </AppProvider>
  );
};

export default App;
