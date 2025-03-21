import React, { useState } from "react";

const BuyerProfile = () => {
    const [user, setUser] = useState({
        username: "Ujjwal Kumar",
        email: "ujjwalk21@iitk.ac.in",
        currentAddress: "D318, Hall 9"
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#2c2c2c",
        padding: "20px",
        color: "white"
    };

    const headerStyle = {
        alignSelf: "flex-start",
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
        color: "#ff9800"
    };

    const profileCardStyle = {
        background: "#424242",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
        textAlign: "center",
        width: "350px",
        position: "relative"
    };

    const bannerStyle = {
        background: "#ff9800",
        height: "100px",
        borderRadius: "10px 10px 0 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };

    const imageContainerStyle = {
        position: "absolute",
        top: "60px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        overflow: "hidden",
        border: "4px solid #ff9800"
    };

    const imageStyle = {
        width: "100%",
        height: "100%",
        objectFit: "cover"
    };

    const detailsStyle = {
        marginTop: "50px"
    };

    const inputStyle = {
        border: "none",
        outline: "none",
        fontSize: "16px",
        textAlign: "center",
        width: "100%",
        backgroundColor: "#616161",
        color: "white",
        padding: "5px",
        borderRadius: "5px"
    };

    const buttonStyle = {
        marginTop: "10px",
        padding: "8px 16px",
        fontSize: "16px",
        cursor: "pointer",
        border: "none",
        borderRadius: "5px",
        backgroundColor: isEditing ? "#4caf50" : "#ff9800",
        color: "white"
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>Campus Craves</div>
            <div style={profileCardStyle}>
                <div style={bannerStyle}></div>
                <div style={imageContainerStyle}>
                    <img src="/profile.png" alt="Profile Icon" style={imageStyle} />
                </div>
                <div style={detailsStyle}>
                    <h2>
                        {isEditing ? (
                            <input 
                                type="text" 
                                name="username" 
                                value={user.username} 
                                onChange={handleChange} 
                                style={inputStyle} 
                            />
                        ) : (
                            user.username
                        )}
                    </h2>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p>
                        <strong>Current Address:</strong>
                        {isEditing ? (
                            <input 
                                type="text" 
                                name="currentAddress" 
                                value={user.currentAddress} 
                                onChange={handleChange} 
                                style={inputStyle} 
                            />
                        ) : (
                            user.currentAddress
                        )}
                    </p>
                    <button style={buttonStyle} onClick={toggleEdit}>
                        {isEditing ? "Save" : "Edit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BuyerProfile;
