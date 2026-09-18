import { Link } from "react-router-dom";

import "../css/Home.css";


function Home() {

    return (

        <div className="home-page">


            {/* ==========================================
                HERO SECTION
            ========================================== */}

            <section className="home-hero-section">

                <div className="container">

                    <div className="row align-items-center home-hero-row">


                        {/* ==================================
                            HERO LEFT
                        ================================== */}

                        <div className="col-12 col-lg-6">

                            <div className="home-hero-content">

                                <span className="home-hero-badge">
                                    🌍 Global Currency Platform
                                </span>


                                <h1 className="home-hero-title">

                                    Convert Currency

                                    <span>
                                        Around The World
                                    </span>

                                </h1>


                                <p className="home-hero-description">

                                    Fast, simple and secure currency
                                    conversion using the latest available
                                    exchange rates, with conversion history
                                    available for registered users.

                                </p>


                                {/* ==================================
                                    HERO ACTIONS
                                ================================== */}

                                <div className="home-hero-actions">

                                    <Link
                                        to="/converter"
                                        className="home-primary-button"
                                    >
                                        Convert Currency

                                        <span>
                                            →
                                        </span>
                                    </Link>


                                    <a
                                        href="#features"
                                        className="home-secondary-button"
                                    >
                                        Explore Features
                                    </a>

                                </div>


                                {/* ==================================
                                    TRUST ROW
                                ================================== */}

                                <div className="home-trust-row">

                                    <div>

                                        <strong>
                                            Global
                                        </strong>

                                        <span>
                                            Currency Support
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            Latest
                                        </strong>

                                        <span>
                                            Available Rates
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            Secure
                                        </strong>

                                        <span>
                                            JWT Access
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* ==================================
                            HERO RIGHT
                        ================================== */}

                        <div className="col-12 col-lg-6">

                            <div className="home-hero-visual">


                                <div
                                    className="home-glow home-glow-one"
                                />


                                <div
                                    className="home-glow home-glow-two"
                                />


                                {/* MAIN CARD */}

                                <div className="home-main-visual-card">

                                    <div className="home-visual-icon">
                                        💱
                                    </div>


                                    <h3>
                                        Smart Currency Conversion
                                    </h3>


                                    <p>

                                        Choose your currencies, enter an
                                        amount and convert using the latest
                                        available exchange rate.

                                    </p>


                                    <div className="home-sample-conversion">

                                        <div>

                                            <span>
                                                FROM
                                            </span>

                                            <strong>
                                                USD
                                            </strong>

                                        </div>


                                        <div className="home-conversion-arrow">
                                            ⇄
                                        </div>


                                        <div>

                                            <span>
                                                TO
                                            </span>

                                            <strong>
                                                INR
                                            </strong>

                                        </div>

                                    </div>

                                </div>


                                {/* FLOATING CARD 1 */}

                                <div className="home-floating-card home-floating-one">

                                    <span>
                                        📈
                                    </span>

                                    <div>

                                        <strong>
                                            Latest Rates
                                        </strong>

                                        <small>
                                            Reference exchange data
                                        </small>

                                    </div>

                                </div>


                                {/* FLOATING CARD 2 */}

                                <div className="home-floating-card home-floating-two">

                                    <span>
                                        🔐
                                    </span>

                                    <div>

                                        <strong>
                                            Secure Login
                                        </strong>

                                        <small>
                                            Protected account access
                                        </small>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==========================================
                FEATURES
            ========================================== */}

            <section
                className="home-section"
                id="features"
            >

                <div className="container">

                    <div className="home-section-heading">

                        <span>
                            Why Choose Us
                        </span>


                        <h2>
                            Everything You Need
                        </h2>


                        <p>

                            Simple currency conversion with
                            useful account features when you
                            want to keep track of your activity.

                        </p>

                    </div>


                    <div className="row g-4">


                        {/* FEATURE 1 */}

                        <div className="col-12 col-md-6 col-lg-4">

                            <div className="home-feature-card">

                                <div className="home-feature-icon home-feature-blue">
                                    📈
                                </div>


                                <h3>
                                    Latest Exchange Rates
                                </h3>


                                <p>

                                    Convert currencies using the
                                    latest available reference
                                    exchange-rate data.

                                </p>


                                <span className="home-feature-link">
                                    Quick conversion →
                                </span>

                            </div>

                        </div>


                        {/* FEATURE 2 */}

                        <div className="col-12 col-md-6 col-lg-4">

                            <div className="home-feature-card">

                                <div className="home-feature-icon home-feature-purple">
                                    🔐
                                </div>


                                <h3>
                                    Secure Access
                                </h3>


                                <p>

                                    Sign in using password, OTP
                                    or Google and access protected
                                    account features securely.

                                </p>


                                <span className="home-feature-link">
                                    Protected account →
                                </span>

                            </div>

                        </div>


                        {/* FEATURE 3 */}

                        <div className="col-12 col-md-6 col-lg-4">

                            <div className="home-feature-card">

                                <div className="home-feature-icon home-feature-green">
                                    🌍
                                </div>


                                <h3>
                                    Global Currencies
                                </h3>


                                <p>

                                    Search and convert between
                                    supported currencies from
                                    around the world.

                                </p>


                                <span className="home-feature-link">
                                    Explore currencies →
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==========================================
                PLATFORM BENEFITS
            ========================================== */}

            <section className="home-stats-section">

                <div className="container">

                    <div className="row g-3 g-md-4">


                        <div className="col-6 col-lg-3">

                            <div className="home-stat-card">

                                <strong className="home-stat-blue">
                                    Global
                                </strong>

                                <span>
                                    Currency Coverage
                                </span>

                            </div>

                        </div>


                        <div className="col-6 col-lg-3">

                            <div className="home-stat-card">

                                <strong className="home-stat-green">
                                    Latest
                                </strong>

                                <span>
                                    Available Rates
                                </span>

                            </div>

                        </div>


                        <div className="col-6 col-lg-3">

                            <div className="home-stat-card">

                                <strong className="home-stat-red">
                                    Fast
                                </strong>

                                <span>
                                    Currency Conversion
                                </span>

                            </div>

                        </div>


                        <div className="col-6 col-lg-3">

                            <div className="home-stat-card">

                                <strong className="home-stat-orange">
                                    Secure
                                </strong>

                                <span>
                                    Account Access
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==========================================
                HOW IT WORKS
            ========================================== */}

            <section className="home-how-section">

                <div className="container">

                    <div className="home-section-heading">

                        <span>
                            Simple Process
                        </span>


                        <h2>
                            How It Works
                        </h2>


                        <p>

                            Start converting immediately.
                            Create an account when you want
                            access to your personal history.

                        </p>

                    </div>


                    <div className="home-steps">


                        <div className="home-step-card">

                            <div className="home-step-number">
                                1
                            </div>


                            <div className="home-step-icon">
                                💱
                            </div>


                            <h3>
                                Choose Currencies
                            </h3>


                            <p>

                                Open the converter and select
                                the currency you have and the
                                currency you want.

                            </p>

                        </div>


                        <div className="home-step-line" />


                        <div className="home-step-card">

                            <div className="home-step-number">
                                2
                            </div>


                            <div className="home-step-icon">
                                🔢
                            </div>


                            <h3>
                                Enter Amount
                            </h3>


                            <p>

                                Enter the amount you want
                                to convert using the selected
                                currency pair.

                            </p>

                        </div>


                        <div className="home-step-line" />


                        <div className="home-step-card">

                            <div className="home-step-number">
                                3
                            </div>


                            <div className="home-step-icon">
                                ⚡
                            </div>


                            <h3>
                                Convert
                            </h3>


                            <p>

                                View the converted amount
                                calculated using the latest
                                available exchange rate.

                            </p>

                        </div>


                        <div className="home-step-line" />


                        <div className="home-step-card">

                            <div className="home-step-number">
                                4
                            </div>


                            <div className="home-step-icon">
                                📜
                            </div>


                            <h3>
                                Track History
                            </h3>


                            <p>

                                Sign in to save and review
                                your previous conversions
                                from your History page.

                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==========================================
                CALL TO ACTION
            ========================================== */}

            <section className="home-cta-section">

                <div className="container">

                    <div className="home-cta-card">

                        <div>

                            <span className="home-cta-badge">
                                Ready to convert?
                            </span>


                            <h2>
                                Start converting currencies today.
                            </h2>


                            <p>

                                Use the converter without an
                                account, or create an account
                                to keep your conversion history.

                            </p>

                        </div>


                        <div className="home-cta-actions">

                            <Link
                                to="/converter"
                                className="home-cta-primary"
                            >
                                Convert Now
                            </Link>


                            <Link
                                to="/register"
                                className="home-cta-secondary"
                            >
                                Create Account
                            </Link>

                        </div>

                    </div>

                </div>

            </section>


        </div>

    );
}


export default Home;
