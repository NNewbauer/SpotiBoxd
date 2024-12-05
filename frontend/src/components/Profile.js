import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No token found. Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
                return;
            }

            const response = await fetch("http://127.0.0.1:8000/users/profile/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            } else if (response.status === 401) {
                setError("Unauthorized. Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setError("An error occurred. Please try again.");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    fetchProfile();
}, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <h1>Profile</h1>
      <p><strong>Username:</strong> {userData.username}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      {/* Add more user details if needed */}
    </div>
  );
};

export default Profile;