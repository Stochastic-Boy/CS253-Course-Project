//aayush's code
// Profile component to display user's profile

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  // Inline helper function
  const isLoggedIn = () => {
    return localStorage.getItem("user") && localStorage.getItem("access_token");
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  if (!isLoggedIn()) return null;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Profile</h2>
      <p><strong>Username:</strong> {user.username || user.user?.username}</p>
      <p><strong>Email:</strong> {user.email || user.user?.email}</p>
      <p><strong>Role:</strong> {role}</p>
    </div>
  );
};

export default Profile;