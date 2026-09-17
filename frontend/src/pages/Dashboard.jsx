import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/api";
import "../css/Dashboard.css";


function Dashboard() {

    // ==========================================
    // STATE
    // ==========================================

    const [user, setUser] = useState(null);

    const [history, setHistory] = useState([]);

    const [totalConversions, setTotalConversions] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD DASHBOARD DATA
    // ==========================================

    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                setLoading(true);

                setError("");


                // ==================================
                // LOAD USER + RECENT CONVERSIONS
                //
                // Dashboard only needs the latest
                // 4 conversions.
                //
                // Backend already sorts newest first.
                // ==================================

                const [
                    userResponse,
                    historyResponse
                ] = await Promise.all([

                    API.get("/user/me"),

                    API.get(
                        "/conversions/history",
                        {
                            params: {
                                page: 0,
                                size: 4
                            }
                        }
                    )

                ]);


                // ==================================
                // USER
                // ==================================

                setUser(
                    userResponse.data
                );


                // ==================================
                // PAGINATED HISTORY RESPONSE
                //
                // {
                //     content: [],
                //     totalElements: 11,
                //     totalPages: 3,
                //     ...
                // }
                // ==================================

                const historyData =
                    historyResponse.data;


                if (
                    historyData &&
                    Array.isArray(
                        historyData.content
                    )
                ) {

                    setHistory(
                        historyData.content
                    );

                    setTotalConversions(
                        historyData.totalElements ?? 0
                    );

                } else {

                    setHistory([]);

                    setTotalConversions(0);
                }


            } catch (error) {

                console.error(
                    "Dashboard loading failed:",
                    error
                );


                setError(
                    "Unable to load dashboard information."
                );


            } finally {

                setLoading(false);
            }
        };


        fetchDashboardData();

    }, []);


    // ==========================================
    // DATE FORMATTER
    // ==========================================

    const formatDate = (dateValue) => {

        if (!dateValue) {

            return "-";
        }


        const date =
            new Date(dateValue);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "-";
        }


        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    // ==========================================
    // FORMAT AMOUNT
    // ==========================================

    const formatAmount = (value) => {

        if (
            value === null ||
            value === undefined
        ) {

            return "-";
        }


        const number =
            Number(value);


        if (
            Number.isNaN(number)
        ) {

            return value;
        }


        return number.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        );
    };


    // ==========================================
    // FORMAT RATE
    // ==========================================

    const formatRate = (value) => {

        if (
            value === null ||
            value === undefined
        ) {

            return "-";
        }


        const number =
            Number(value);


        if (
            Number.isNaN(number)
        ) {

            return value;
        }


        return number.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 6
            }
        );
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="dashboard-loading">

                <div>

                    <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                    />

                    <h5>
                        Loading dashboard...
                    </h5>

                </div>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error || !user) {

        return (

            <div className="dashboard-error">

                <div>

                    <h3>
                        Unable to load dashboard.
                    </h3>

                    <p>
                        {
                            error ||
                            "Please login again."
                        }
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // DASHBOARD VALUES
    // ==========================================

    const latestConversion =
        history.length > 0
            ? history[0]
            : null;


    const recentHistory =
        history.slice(0, 4);


    const firstLetter =
        user.name
            ? user.name
                .charAt(0)
                .toUpperCase()
            : "U";


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="dashboard-page">

            <div className="container">


                {/* ==================================
                    WELCOME SECTION
                ================================== */}

                <div className="dashboard-welcome">

                    <div>

                        <span className="dashboard-welcome-label">

                            Your Dashboard

                        </span>


                        <h1>

                            Welcome back, {user.name}! 👋

                        </h1>


                        <p>

                            Manage your conversions,
                            history and account from
                            one place.

                        </p>

                    </div>


                    <div className="dashboard-user-badge">

                        <div className="dashboard-avatar">

                            {firstLetter}

                        </div>


                        <div>

                            <strong>

                                {user.name}

                            </strong>


                            <span>

                                {user.email}

                            </span>

                        </div>

                    </div>

                </div>


                {/* ==================================
                    DASHBOARD OVERVIEW
                ================================== */}

                <div className="dashboard-overview-grid">


                    {/* TOTAL CONVERSIONS */}

                    <div className="dashboard-overview-card">

                        <div className="dashboard-overview-icon dashboard-icon-blue">

                            💱

                        </div>


                        <div>

                            <span>

                                Total Conversions

                            </span>


                            <strong>

                                {totalConversions}

                            </strong>

                        </div>

                    </div>


                    {/* LATEST ACTIVITY */}

                    <div className="dashboard-overview-card">

                        <div className="dashboard-overview-icon dashboard-icon-orange">

                            ⚡

                        </div>


                        <div>

                            <span>

                                Latest Activity

                            </span>


                            <strong>

                                {
                                    latestConversion
                                        ? latestConversion
                                            .toCurrency
                                        : "None"
                                }

                            </strong>

                        </div>

                    </div>

                </div>


                {/* ==================================
                    QUICK ACTIONS HEADING
                ================================== */}

                <div className="dashboard-section-heading">

                    <div>

                        <span>

                            Quick Access

                        </span>


                        <h2>

                            What would you like to do?

                        </h2>

                    </div>

                </div>


                {/* ==================================
                    QUICK ACTIONS
                ================================== */}

                <div className="dashboard-action-grid">


                    {/* CONVERT CURRENCY */}

                    <Link
                        to="/converter"
                        className="dashboard-action-card dashboard-action-convert"
                    >

                        <div className="dashboard-action-icon">

                            💱

                        </div>


                        <h3>

                            Convert Currency

                        </h3>


                        <p>

                            Convert using the latest
                            available exchange rates.

                        </p>


                        <span>

                            Start Converting →

                        </span>

                    </Link>


                    {/* CONVERSION HISTORY */}

                    <Link
                        to="/history"
                        className="dashboard-action-card dashboard-action-history"
                    >

                        <div className="dashboard-action-icon">

                            📜

                        </div>


                        <h3>

                            Conversion History

                        </h3>


                        <p>

                            Review your previous
                            currency conversions.

                        </p>


                        <span>

                            View History →

                        </span>

                    </Link>


                    {/* PROFILE */}

                    <Link
                        to="/profile"
                        className="dashboard-action-card dashboard-action-profile"
                    >

                        <div className="dashboard-action-icon">

                            👤

                        </div>


                        <h3>

                            My Profile

                        </h3>


                        <p>

                            View your account
                            information.

                        </p>


                        <span>

                            Open Profile →

                        </span>

                    </Link>

                </div>


                {/* ==================================
                    MAIN DASHBOARD CONTENT
                ================================== */}

                <div className="dashboard-content-grid">


                    {/* ==================================
                        LATEST CONVERSION
                    ================================== */}

                    <div className="dashboard-panel">

                        <div className="dashboard-panel-header">

                            <div>

                                <span>

                                    Latest

                                </span>


                                <h3>

                                    Recent Conversion

                                </h3>

                            </div>

                        </div>


                        {
                            latestConversion ? (

                                <div className="dashboard-latest-conversion">


                                    {/* FROM CURRENCY */}

                                    <div className="dashboard-currency-box">

                                        <span>

                                            {
                                                latestConversion
                                                    .fromCurrency
                                            }

                                        </span>


                                        <strong>

                                            {
                                                formatAmount(
                                                    latestConversion
                                                        .amount
                                                )
                                            }

                                        </strong>

                                    </div>


                                    {/* ARROW / RATE */}

                                    <div className="dashboard-conversion-middle">

                                        <div>

                                            →

                                        </div>


                                        <small>

                                            Rate{" "}

                                            {
                                                formatRate(
                                                    latestConversion
                                                        .rateUsed
                                                )
                                            }

                                        </small>

                                    </div>


                                    {/* TO CURRENCY */}

                                    <div className="dashboard-currency-box">

                                        <span>

                                            {
                                                latestConversion
                                                    .toCurrency
                                            }

                                        </span>


                                        <strong>

                                            {
                                                formatAmount(
                                                    latestConversion
                                                        .convertedAmount
                                                )
                                            }

                                        </strong>

                                    </div>


                                    {/* CONVERSION DATE */}

                                    <div className="dashboard-conversion-date">

                                        {
                                            formatDate(
                                                latestConversion
                                                    .createdAt
                                            )
                                        }

                                    </div>

                                </div>

                            ) : (

                                <div className="dashboard-empty">

                                    <div>

                                        💱

                                    </div>


                                    <h4>

                                        No conversions yet

                                    </h4>


                                    <p>

                                        Make your first
                                        conversion to see
                                        it here.

                                    </p>


                                    <Link to="/converter">

                                        Convert Currency

                                    </Link>

                                </div>
                            )
                        }

                    </div>


                    {/* ==================================
                        PROFILE SUMMARY
                    ================================== */}

                    <div className="dashboard-panel">

                        <div className="dashboard-panel-header">

                            <div>

                                <span>

                                    Account

                                </span>


                                <h3>

                                    Profile Summary

                                </h3>

                            </div>


                            <Link to="/profile">

                                View

                            </Link>

                        </div>


                        <div className="dashboard-profile-list">


                            {/* NAME */}

                            <div>

                                <span>

                                    Name

                                </span>


                                <strong>

                                    {user.name}

                                </strong>

                            </div>


                            {/* EMAIL */}

                            <div>

                                <span>

                                    Email

                                </span>


                                <strong>

                                    {user.email}

                                </strong>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================
                    RECENT CONVERSION HISTORY
                ================================== */}

                <div className="dashboard-panel dashboard-history-panel">

                    <div className="dashboard-panel-header">

                        <div>

                            <span>

                                Activity

                            </span>


                            <h3>

                                Recent Conversions

                            </h3>

                        </div>


                        <Link to="/history">

                            View All

                        </Link>

                    </div>


                    {
                        recentHistory.length > 0 ? (

                            <div className="dashboard-history-list">

                                {
                                    recentHistory.map(
                                        (item) => (

                                            <div
                                                className="dashboard-history-item"
                                                key={item.id}
                                            >


                                                {/* CURRENCIES */}

                                                <div className="dashboard-history-currencies">

                                                    <div>

                                                        {
                                                            item
                                                                .fromCurrency
                                                        }

                                                    </div>


                                                    <span>

                                                        →

                                                    </span>


                                                    <div>

                                                        {
                                                            item
                                                                .toCurrency
                                                        }

                                                    </div>

                                                </div>


                                                {/* AMOUNT */}

                                                <div className="dashboard-history-amount">

                                                    <strong>

                                                        {
                                                            formatAmount(
                                                                item.amount
                                                            )
                                                        }

                                                        {" "}

                                                        {
                                                            item
                                                                .fromCurrency
                                                        }

                                                    </strong>


                                                    <span>

                                                        {
                                                            formatAmount(
                                                                item.convertedAmount
                                                            )
                                                        }

                                                        {" "}

                                                        {
                                                            item
                                                                .toCurrency
                                                        }

                                                    </span>

                                                </div>


                                                {/* DATE */}

                                                <div className="dashboard-history-date">

                                                    {
                                                        formatDate(
                                                            item.createdAt
                                                        )
                                                    }

                                                </div>

                                            </div>
                                        )
                                    )
                                }

                            </div>

                        ) : (

                            <div className="dashboard-empty small">

                                <p>

                                    No conversion history
                                    available.

                                </p>

                            </div>
                        )
                    }

                </div>

            </div>

        </div>
    );
}


export default Dashboard;