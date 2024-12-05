import React from "react";
import "./styles.css"; // Import your styles
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Search from "./components/Search"; // Import the Search component
import AlbumPage from "./components/AlbumPage"; // Import the AlbumPage component
import AlbumNavbar from "./components/Navbars/AlbumNavbar"; // Import Navbar
import HomeNavbar from "./components/Navbars/HomeNavbar"; // Import Navbar
import Login from "./components/Login"; // Import Login
import Signup from "./components/Signup"; // Import Signup
import Profile from "./components/Profile";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={800}>
        <Routes location={location}>
          <Route path="/" element={<Search />} />
          <Route path="/album/:albumId" element={<AlbumPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}

function App() {
  const location = useLocation();

  const renderNavbar = () => {
    if (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup") {
      return <HomeNavbar />;
    }
    return <AlbumNavbar />;
  };

  return (
    <div className="App">
      {/* Render the appropriate Navbar */}
      {renderNavbar()}
      <main>
        <AnimatedRoutes />
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} SpotiBoxd</p>
      </footer>
    </div>
  );
}

export default App;