import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useSelector } from "react-redux";

const BuyerProfile = () => {
    const user = useSelector((state) => state.user.user);
    const [userDetails, setUserDetails] = useState({ phone_number: "", address: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [phoneError, setPhoneError] = useState("");

    useEffect(() => {
        fetch("http://127.0.0.1:8000/users/profile/", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setUserDetails({ id: data.id, phone_number: data.phone_number, address: data.address });
                setLoading(false);
            })
            .catch((error) => {
                setError("Failed to fetch profile data.");
                console.error("Error fetching user data:", error);
                setLoading(false);
            });
    }, []);

    // Validate Indian phone number (10 digits)
    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "phone_number") {
            // Only allow digits to be entered
            const digitsOnly = value.replace(/\D/g, '');
            
            // Check length for phone validation
            if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
                setPhoneError("Phone number must be exactly 10 digits");
            } else {
                setPhoneError("");
            }
            
            setUserDetails({ ...userDetails, [name]: digitsOnly });
        } else {
            setUserDetails({ ...userDetails, [name]: value || "" });
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            // Validate phone number before saving
            if (userDetails.phone_number && !validatePhoneNumber(userDetails.phone_number)) {
                setPhoneError("Phone number must be exactly 10 digits");
                return;
            }
            
            fetch("http://127.0.0.1:8000/users/profile/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                },
                body: JSON.stringify({
                    phone_number: userDetails.phone_number || "",
                    address: userDetails.address || "",
                }),
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
        height: "calc(100vh - 60px)",
        justifyContent: "center",
        backgroundColor: "#2c2c2c",
        padding: "auto",
        color: "white",
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

    const errorStyle = {
        color: "#ff6b6b",
        fontSize: "12px",
        margin: "5px 0"
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
        <div>
            <Header />
            <div style={containerStyle}>
                <div style={profileCardStyle}>
                    <div style={bannerStyle}></div>
                    <div style={imageContainerStyle}>
                        <img src="/assets/profile.png" alt="Profile Icon" style={imageStyle} />
                    </div>
                    <div style={detailsStyle}>
                        <p>
                            <div className="username my-2"><strong>Username: </strong>{user.username}</div>
                            <div className="email my-2"><strong>Email: </strong>{user.email}</div>
                            <strong>Phone Number: </strong>
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        name="phone_number"
                                        value={userDetails.phone_number}
                                        onChange={handleChange}
                                        className="input-field"
                                        maxLength={10}
                                        style={inputStyle}
                                    />
                                    {phoneError && <div style={errorStyle}>{phoneError}</div>}
                                </>
                            ) : (
                                userDetails.phone_number
                            )}
                        </p>
                        <p>
                            <strong>Current Address: </strong>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="address"
                                    value={userDetails.address}
                                    onChange={handleChange}
                                    className="input-field"
                                    style={inputStyle}
                                />
                            ) : (
                                userDetails.address
                            )}
                        </p>
                        <button style={buttonStyle} onClick={toggleEdit} disabled={isEditing && phoneError}>
                            {isEditing ? "Save" : "Edit"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerProfile;