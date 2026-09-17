import "../css/Register.css";

import {
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import API from "../api/api";


function Register() {

    const navigate = useNavigate();


    // ==========================================
    // STATE
    // ==========================================

    const [fullName, setFullName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [mobileNumber, setMobileNumber] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // REGISTER
    // ==========================================

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");


        // ======================================
        // REQUIRED FIELD VALIDATION
        // ======================================

        if (
            !fullName.trim() ||
            !email.trim() ||
            !mobileNumber.trim() ||
            !password
        ) {

            setError(
                "Please fill in all fields."
            );

            return;
        }


        // ======================================
        // NORMALIZE MOBILE NUMBER
        // ======================================

        let normalizedMobile =
            mobileNumber
                .trim()
                .replace(/\s/g, "")
                .replace(/-/g, "");


        // Remove +91 if entered

        if (
            normalizedMobile.startsWith("+91")
        ) {

            normalizedMobile =
                normalizedMobile.substring(3);
        }


        // Remove 91 if entered before 10 digits

        else if (
            normalizedMobile.startsWith("91") &&
            normalizedMobile.length === 12
        ) {

            normalizedMobile =
                normalizedMobile.substring(2);
        }


        // ======================================
        // MOBILE VALIDATION
        // ======================================

        if (
            !/^[6-9][0-9]{9}$/.test(
                normalizedMobile
            )
        ) {

            setError(
                "Please enter a valid 10-digit Indian mobile number."
            );

            return;
        }


        try {

            setLoading(true);


            // ======================================
            // CREATE ACCOUNT
            //
            // Backend will:
            // 1. Save user disabled
            // 2. Save mobile number
            // 3. Generate email verification OTP
            // 4. Send OTP to email
            // ======================================

            await API.post(
                "/auth/register",
                {
                    name:
                        fullName.trim(),

                    email:
                        email
                            .trim()
                            .toLowerCase(),

                    mobileNumber:
                        normalizedMobile,

                    password:
                        password
                }
            );


            // ======================================
            // GO TO EMAIL VERIFICATION PAGE
            // ======================================

            navigate(
                "/verify-otp",
                {
                    state: {

                        email:
                            email
                                .trim()
                                .toLowerCase(),

                        identifier:
                            email
                                .trim()
                                .toLowerCase(),

                        purpose:
                            "REGISTER_EMAIL",

                        message:
                            "Verification OTP sent to your email."
                    }
                }
            );


        } catch (error) {

            console.error(
                "Registration failed:",
                error
            );


            if (error.response) {

                setError(

                    typeof error.response.data ===
                    "string"

                        ? error.response.data

                        : error.response.data?.message ||
                          "Unable to create account."
                );

            } else {

                setError(
                    "Unable to connect to the server."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="register-page">

            <div className="register-card">


                {/* ==========================================
                    LEFT FORM SECTION
                ========================================== */}

                <div className="register-form-panel">

                    <div className="register-form-wrapper">


                        <div className="register-mobile-icon">
                            ✨
                        </div>


                        <div className="register-heading">

                            <h2>
                                Create Account
                            </h2>

                            <p>
                                Join Currency Converter World
                                and start converting smarter.
                            </p>

                        </div>


                        {/* ==================================
                            ERROR MESSAGE
                        ================================== */}

                        {error && (

                            <div className="register-error-message">

                                {error}

                            </div>

                        )}


                        <form
                            onSubmit={handleRegister}
                        >


                            {/* ==================================
                                FULL NAME
                            ================================== */}

                            <div className="register-field">

                                <label>
                                    Full Name
                                </label>


                                <div className="register-input-wrapper">

                                    <span className="register-input-icon">
                                        👤
                                    </span>


                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={fullName}
                                        autoComplete="name"
                                        onChange={(e) => {

                                            setFullName(
                                                e.target.value
                                            );

                                            setError("");
                                        }}
                                    />

                                </div>

                            </div>


                            {/* ==================================
                                EMAIL
                            ================================== */}

                            <div className="register-field">

                                <label>
                                    Email Address
                                </label>


                                <div className="register-input-wrapper">

                                    <span className="register-input-icon">
                                        ✉
                                    </span>


                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        autoComplete="email"
                                        onChange={(e) => {

                                            setEmail(
                                                e.target.value
                                            );

                                            setError("");
                                        }}
                                    />

                                </div>

                            </div>


                            {/* ==================================
                                MOBILE NUMBER
                            ================================== */}

                            <div className="register-field">

                                <label>
                                    Mobile Number
                                </label>


                                <div className="register-input-wrapper">

                                    <span className="register-input-icon">
                                        📱
                                    </span>


                                    <input
                                        type="tel"
                                        placeholder="Enter 10 digit mobile number"
                                        value={mobileNumber}
                                        maxLength={10}
                                        inputMode="numeric"
                                        autoComplete="tel"
                                        onChange={(e) => {

                                            const value =
                                                e.target.value
                                                    .replace(
                                                        /\D/g,
                                                        ""
                                                    );

                                            setMobileNumber(
                                                value
                                            );

                                            setError("");
                                        }}
                                    />

                                </div>

                            </div>


                            {/* ==================================
                                PASSWORD
                            ================================== */}

                            <div className="register-field">

                                <label>
                                    Password
                                </label>


                                <div className="register-input-wrapper">

                                    <span className="register-input-icon">
                                        🔒
                                    </span>


                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Create a password"
                                        value={password}
                                        autoComplete="new-password"
                                        onChange={(e) => {

                                            setPassword(
                                                e.target.value
                                            );

                                            setError("");
                                        }}
                                    />


                                    <button
                                        type="button"
                                        className="register-password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >

                                        {showPassword
                                            ? "Hide"
                                            : "Show"
                                        }

                                    </button>

                                </div>


                                <small className="register-password-hint">

                                    Use a strong password with
                                    letters, numbers and symbols.

                                </small>

                            </div>


                            {/* ==================================
                                CREATE ACCOUNT
                            ================================== */}

                            <button
                                type="submit"
                                className="register-button"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>

                                        <span
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                        />

                                        {" "}
                                        Sending verification OTP...

                                    </>

                                ) : (

                                    "Create Account"

                                )}

                            </button>


                            {/* ==================================
                                LOGIN LINK
                            ================================== */}

                            <p className="register-login-text">

                                Already have an account?

                                {" "}

                                <Link to="/login">
                                    Sign In
                                </Link>

                            </p>

                        </form>

                    </div>

                </div>


                {/* ==========================================
                    RIGHT BRANDING SECTION
                ========================================== */}

                <div className="register-brand-panel">

                    <div className="register-brand-content">


                        <div className="register-brand-icon">
                            🚀
                        </div>


                        <h1>
                            Start Your Journey
                        </h1>


                        <p className="register-brand-description">

                            Create your account and get access
                            to live currency conversion,
                            saved history and secure account
                            features.

                        </p>


                        <div className="register-feature-list">


                            <div className="register-feature">

                                <span>
                                    ⚡
                                </span>

                                <div>

                                    <strong>
                                        Fast Conversion
                                    </strong>

                                    <small>
                                        Convert currencies instantly
                                    </small>

                                </div>

                            </div>


                            <div className="register-feature">

                                <span>
                                    📊
                                </span>

                                <div>

                                    <strong>
                                        Track History
                                    </strong>

                                    <small>
                                        View your previous conversions
                                    </small>

                                </div>

                            </div>


                            <div className="register-feature">

                                <span>
                                    🛡️
                                </span>

                                <div>

                                    <strong>
                                        Secure Access
                                    </strong>

                                    <small>
                                        Protected with authentication
                                    </small>

                                </div>

                            </div>


                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default Register;