import {
    Link
} from "react-router-dom";

import "../css/Footer.css";


function Footer() {

    const currentYear =
        new Date().getFullYear();


    return (

        <footer className="site-footer">


            {/* ==========================================
                MAIN FOOTER
            ========================================== */}

            <div className="site-footer-main">

                <div className="container">

                    <div className="site-footer-grid">


                        {/* ==================================
                            BRAND
                        ================================== */}

                        <div className="footer-brand">

                            <Link
                                to="/"
                                className="footer-logo"
                            >
                                <span>
                                    🌍
                                </span>

                                Currency Converter World
                            </Link>


                            <p className="footer-description">
                                A simple and secure currency conversion
                                platform for checking the latest available
                                exchange rates across global currencies.
                            </p>


                            <div className="footer-social">

                                <a
                                    href="#"
                                    aria-label="Facebook"
                                    title="Facebook"
                                >
                                    f
                                </a>


                                <a
                                    href="#"
                                    aria-label="Instagram"
                                    title="Instagram"
                                >
                                    ◎
                                </a>


                                <a
                                    href="#"
                                    aria-label="LinkedIn"
                                    title="LinkedIn"
                                >
                                    in
                                </a>


                                <a
                                    href="#"
                                    aria-label="X"
                                    title="X"
                                >
                                    𝕏
                                </a>


                                <a
                                    href="#"
                                    aria-label="YouTube"
                                    title="YouTube"
                                >
                                    ▶
                                </a>

                            </div>

                        </div>


                        {/* ==================================
                            QUICK LINKS
                        ================================== */}

                        <div className="footer-column">

                            <h3>
                                Quick Links
                            </h3>


                            <Link to="/">
                                Home
                            </Link>


                            <Link to="/converter">
                                Currency Converter
                            </Link>


                            <Link to="/dashboard">
                                Dashboard
                            </Link>


                            <Link to="/history">
                                Conversion History
                            </Link>


                            <Link to="/profile">
                                My Profile
                            </Link>

                        </div>


                        {/* ==================================
                            ACCOUNT
                        ================================== */}

                        <div className="footer-column">

                            <h3>
                                Account
                            </h3>


                            <Link to="/login">
                                Sign In
                            </Link>


                            <Link to="/register">
                                Create Account
                            </Link>


                            <Link to="/converter">
                                Free Conversion
                            </Link>


                            <span>
                                Secure Authentication
                            </span>


                            <span>
                                Google Sign-In
                            </span>

                        </div>


                        {/* ==================================
                            INFORMATION
                        ================================== */}

                        <div className="footer-column">

                            <h3>
                                Information
                            </h3>


                            <Link to="/about">
                                About Us
                            </Link>


                            <Link to="/contact">
                                Contact Us
                            </Link>


                            <Link to="/privacy">
                                Privacy Policy
                            </Link>


                            <Link to="/terms">
                                Terms & Conditions
                            </Link>


                            <Link to="/disclaimer">
                                Disclaimer
                            </Link>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==========================================
                DISCLAIMER
            ========================================== */}

            <div className="footer-disclaimer">

                <div className="container">

                    <div className="footer-disclaimer-box">

                        <div className="footer-disclaimer-icon">
                            ℹ
                        </div>


                        <div>

                            <strong>
                                Exchange Rate Disclaimer
                            </strong>


                            <p>
                                Currency exchange rates displayed on this
                                website are provided for informational
                                purposes only. Rates represent the latest
                                available reference data and may differ
                                from rates offered by banks, credit card
                                providers, payment services, money transfer
                                services or other financial institutions.
                                Currency Converter World does not provide
                                financial, investment or trading advice.
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==========================================
                DATA NOTICE
            ========================================== */}

            <div className="footer-data-notice">

                <div className="container">

                    <p>
                        <strong>
                            Rate Information:
                        </strong>

                        {" "}

                        Exchange rates may be delayed and should
                        not be relied upon for forex trading,
                        investment decisions or financial transactions.
                    </p>

                </div>

            </div>


            {/* ==========================================
                COPYRIGHT
            ========================================== */}

            <div className="footer-bottom">

                <div className="container">

                    <div className="footer-bottom-content">

                        <p>
                            © {currentYear} Currency Converter World.
                            All rights reserved.
                        </p>


                        <div className="footer-bottom-links">

                            <Link to="/privacy">
                                Privacy
                            </Link>


                            <span>
                                •
                            </span>


                            <Link to="/terms">
                                Terms
                            </Link>


                            <span>
                                •
                            </span>


                            <Link to="/disclaimer">
                                Disclaimer
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </footer>
    );
}


export default Footer;