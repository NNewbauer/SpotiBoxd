import React from "react";
import { useNavigate } from "react-router-dom";
import '../../styles.css';

const HomeNavbar = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    <header className="home-navbar">
        <div className="home-title">SpotiBoxd</div>
        <button className="home-login-button" onClick={handleLoginClick}>
            Login
        </button>
    </header>
  );
};

export default HomeNavbar;