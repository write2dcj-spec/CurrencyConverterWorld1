import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/api";
import "../css/Profile.css";

function Profile() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchProfile = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await API.get("/user/me");

                setUser(response.data);

            } catch (error) {

                console.error(
                    "Failed to load profile:",
                    error
                );

                if (error.response?.status === 401) {

                    setError(
                        "Your session has expired. Please login again."
                    );

                } else {

                    setError(
                        "Unable to load your profile."
                    );
                }

            } finally {

                setLoading(false);
            }
        };


        fetchProfile();

    }, []);


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (

            <div className="profile-loading">

                <div>

                    <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <h5>
                        Loading profile...
                    </h5>

                </div>

            </div>
        );
    }


    // ==========================================
    // Error
    // ==========================================

    if (error) {

        return (

            <div className="profile-error">

                <div className="profile-error-card">

                    <h3>
                        Unable to load profile
                    </h3>

                    <p>
                        {error}
                    </p>

                    <Link
                        to="/login"
                        className="profile-error-button"
                    >
                        Go to Login
                    </Link>

                </div>

            </div>
        );
    }


    // ==========================================
    // No User
    // ==========================================

    if (!user) {

        return (

            <div className="profile-error">

                <div className="profile-error-card">

                    <h3>
                        Unable to load profile.
                    </h3>

                </div>

            </div>
        );
    }


    // ==========================================
    // Avatar Letter
    // ==========================================

    const firstLetter =
        user.name
            ? user.name
                .charAt(0)
                .toUpperCase()
            : "U";


    return (

        <div className="profile-page">

            <div className="container">

                <div className="profile-wrapper">


                    {/* ==========================================
                        Main Profile Card
                    ========================================== */}

                    <div className="profile-main-card">


                        {/* ======================================
                            Header
                        ====================================== */}

                        <div className="profile-top">

                            <div className="profile-avatar">
                                {firstLetter}
                            </div>

                            <div className="profile-user-details">

                                <span className="profile-label">
                                    My Profile
                                </span>

                                <h1>
                                    {user.name}
                                </h1>

                                <p>
                                    {user.email}
                                </p>

                            </div>

                        </div>


                        {/* ======================================
                            Account Overview
                        ====================================== */}

                        <div className="profile-section-title">

                            <span>
                                Account Overview
                            </span>

                            <h2>
                                Personal Information
                            </h2>

                        </div>


                        <div className="profile-info-list">


                            {/* Full Name */}

                            <div className="profile-info-item">

                                <div className="profile-info-icon">
                                    👤
                                </div>

                                <div className="profile-info-content">

                                    <span>
                                        Full Name
                                    </span>

                                    <strong>
                                        {user.name}
                                    </strong>

                                </div>

                            </div>


                            {/* Email */}

                            <div className="profile-info-item">

                                <div className="profile-info-icon">
                                    📧
                                </div>

                                <div className="profile-info-content">

                                    <span>
                                        Email Address
                                    </span>

                                    <strong>
                                        {user.email}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* ======================================
                            Quick Actions
                        ====================================== */}

                        <div className="profile-section-title profile-actions-heading">

                            <span>
                                Quick Access
                            </span>

                            <h2>
                                Continue Exploring
                            </h2>

                        </div>


                        <div className="profile-action-grid">


                            <Link
                                to="/dashboard"
                                className="profile-action-card"
                            >

                                <div className="profile-action-icon">
                                    🏠
                                </div>

                                <div>

                                    <strong>
                                        Dashboard
                                    </strong>

                                    <span>
                                        View your account overview
                                    </span>

                                </div>

                            </Link>


                            <Link
                                to="/converter"
                                className="profile-action-card"
                            >

                                <div className="profile-action-icon">
                                    💱
                                </div>

                                <div>

                                    <strong>
                                        Convert Currency
                                    </strong>

                                    <span>
                                        Start a new conversion
                                    </span>

                                </div>

                            </Link>


                            <Link
                                to="/history"
                                className="profile-action-card"
                            >

                                <div className="profile-action-icon">
                                    📜
                                </div>

                                <div>

                                    <strong>
                                        Conversion History
                                    </strong>

                                    <span>
                                        Review previous conversions
                                    </span>

                                </div>

                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default Profile;