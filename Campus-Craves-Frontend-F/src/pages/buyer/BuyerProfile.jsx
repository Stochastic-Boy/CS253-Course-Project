import React, { useState, useEffect  } from "react";

const BuyerProfile = () => {
    const [user, setUser] = useState({ phone_number: "", address: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/users/profile/", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setUser({ id: data.id, phone_number: data.phone_number, address: data.address });
                setLoading(false);
            })
            .catch((error) => {
                setError("Failed to fetch profile data.");
                console.error("Error fetching user data:", error);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const toggleEdit = () => {
        if (isEditing) {
            fetch("http://127.0.0.1:8000/users/profile/", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                }
            }, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(user),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Updated successfully:", data);
                })
                .catch((error) => console.error("Error updating profile:", error));
        }
        setIsEditing(!isEditing);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

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
            <div style={headerStyle}>
    <a href="/" style={{ textDecoration: "none", color: "inherit" }}>Campus Craves</a>
</div>
            <div style={profileCardStyle}>
                <div style={bannerStyle}></div>
                <div style={imageContainerStyle}>
                <img src="/assets/profile.png" alt="Profile Icon" style={imageStyle} />
                </div>
                <div style={detailsStyle}>
                <p>
                        <strong>Phone Number:</strong>
                        {isEditing ? (
                            <input 
                                type="text" 
                                name="phone_number" 
                                value={user.phone_number} 
                                onChange={handleChange} 
                                className="input-field" 
                            />
                        ) : (
                            user.phone_number
                        )}
                    </p>
                    <p>
                        <strong>Current Address:</strong>
                        {isEditing ? (
                            <input 
                                type="text" 
                                name="address" 
                                value={user.address} 
                                onChange={handleChange} 
                                className="input-field" 
                            />
                        ) : (
                            user.address
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