import React, { useState } from "react";
import { Home, User, Mail, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [activeItem, setActiveItem] = useState("home");
  const navigate = useNavigate();

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/home" },
  ];

  const handleLogout = () => {
    navigate("/"); // Redirect to login page
  };

  return (
    <header style={headerStyle}>
      {/* Title */}
      <h1 style={titleStyle}>
        <Link to="/" style={{ textDecoration: "none", color: "#fff" }}>
          Restaurant Finder
        </Link>
      </h1>

      {/* Navigation Items */}
      <div style={navContainerStyle}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              style={{
                ...buttonStyle,
                backgroundColor:
                  activeItem === item.id ? "rgba(255, 255, 255, 0.2)" : "transparent",
                textDecoration: "none",
              }}
              onClick={() => setActiveItem(item.id)}
            >
              <Icon size={20} />
              <span style={{ marginLeft: "8px", color: "#fff" }}>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      <button style={logoutButtonStyle} onClick={handleLogout}>
        <LogOut size={18} style={{ marginRight: "5px" }} />
        Logout
      </button>
    </header>
  );
};

// Styles
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#333",
  color: "#fff",
};

const titleStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  margin: 0,
};

const navContainerStyle = {
  display: "flex",
  gap: "15px",
};

const buttonStyle = {
  display: "flex",
  alignItems: "center",
  padding: "8px 12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  color: "#fff",
  transition: "background-color 0.3s ease",
};

const logoutButtonStyle = {
  display: "flex",
  alignItems: "center",
  padding: "8px 15px",
  backgroundColor: "#ff6b6b",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Header;

