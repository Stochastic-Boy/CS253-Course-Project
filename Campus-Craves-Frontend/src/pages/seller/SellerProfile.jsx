import React from "react";

const OwnerProfile = () => {
  const ownerData = {
    name: "Harry",
    address: "Hall 3",
    storeId: "STORE-45678",
    image: "/profile.png", // Place image in the public folder
  };

  const styles = {
    page: {
      height: "100vh",
      backgroundColor: "#2b2b2b", // Dark gray background
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      color: "#fff",
    },
    header: {
      position: "absolute",
      top: "20px",
      left: "20px",
      fontSize: "24px",
      fontWeight: "bold",
      color: "#ff9800",
    },
    card: {
      width: "350px",
      backgroundColor: "#333",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
      padding: "20px",
    },
    banner: {
      backgroundColor: "#ff9800",
      height: "50px",
      borderTopLeftRadius: "10px",
      borderTopRightRadius: "10px",
    },
    image: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      border: "3px solid #fff",
      marginTop: "-40px",
    },
    text: {
      margin: "10px 0",
      fontSize: "18px",
      fontWeight: "bold",
    },
    smallText: {
      fontSize: "14px",
      opacity: "0.8",
    },
  };

  return (
    <div style={styles.page}>
      {/* Campus Craves Header */}
      <div style={styles.header}>Campus Craves</div>

      {/* Profile Card */}
      <div style={styles.card}>
        <div style={styles.banner}></div>
        <img src={ownerData.image} alt="Owner" style={styles.image} />
        <h2 style={styles.text}>{ownerData.name}</h2>
        <p style={styles.smallText}>
          <strong>Store ID:</strong> {ownerData.storeId}
        </p>
        <p style={styles.smallText}>
          <strong>Address:</strong> {ownerData.address}
        </p>
      </div>
    </div>
  );
};

export default OwnerProfile;

