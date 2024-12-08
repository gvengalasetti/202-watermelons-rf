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
const App = () => {
  return (
    <AppProvider>
    <RestaurantsContextProvider>
      <div className="container">
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/home" element={<Home />} />
            <Route path="/restaurants/:id/update" element={<UpdatePage />} />
            <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
          </Routes>
        </Router>
        <SearchBar />
      </div>
    </RestaurantsContextProvider>
    </AppProvider>
  );
};

export default App;
