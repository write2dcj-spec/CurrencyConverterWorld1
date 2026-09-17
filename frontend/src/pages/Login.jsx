import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useLocation
} from "react-router-dom";

import API from "../api/api";


function Login() {

    const location = useLocation();


    // ==========================================
    // LOGIN STATE
    // ==========================================

    // PASSWORD or OTP
    const [loginMode, setLoginMode] =
        useState("PASSWORD");

    const [identifier, setIdentifier] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [otp, setOtp] =
        useState("");

    const [otpSent, setOtpSent] =
        useState(false);

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState(
            location.state?.message || ""
        );


    // ==========================================
    // SUCCESS MESSAGE TIMER - 15 SECONDS
    // ==========================================

    useEffect(() => {

        if (!successMessage) {
            return;
        }


        const timer =
            setTimeout(() => {

                setSuccessMessage("");

            }, 10000);


        return () =>
            clearTimeout(timer);

    }, [successMessage]);


    // ==========================================
    // SESSION EXPIRED MESSAGE
    // ==========================================

    useEffect(() => {

        const authMessage =
            sessionStorage.getItem(
                "authMessage"
            );


        if (authMessage) {

            setError(authMessage);


            sessionStorage.removeItem(
                "authMessage"
            );

        }

    }, []);


    // ==========================================
    // CHANGE LOGIN MODE
    // ==========================================

    const changeLoginMode = (mode) => {

        setLoginMode(mode);

        setError("");

        setSuccessMessage("");

        setPassword("");

        setOtp("");

        setOtpSent(false);
    };


    // ==========================================
    // PASSWORD LOGIN
    // Email OR Mobile + Password
    // ==========================================

    const handlePasswordLogin = async (e) => {

        e.preventDefault();

        setError("");

        setSuccessMessage("");


        if (!identifier.trim() || !password) {

            setError(
                "Please enter your email/mobile number and password."
            );

            return;
        }


        try {

            setLoading(true);


            const response =
                await API.post(
                    "/auth/login",
                    {
                        identifier:
                            identifier.trim(),

                        password
                    }
                );


            // ==========================================
            // STORE JWT
            // ==========================================

            localStorage.setItem(
                "token",
                response.data.token
            );


            // ==========================================
            // REDIRECT TO DASHBOARD
            // ==========================================

            window.location.href =
                "/dashboard";


        } catch (error) {

            console.error(
                "Login failed:",
                error
            );


            setError(
                error.response?.data ||
                "Unable to login. Please try again."
            );


        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // SEND OTP
    // Email -> Gmail
    // Mobile -> Console during development
    // ==========================================

    const handleSendOtp = async () => {

        setError("");

        setSuccessMessage("");


        if (!identifier.trim()) {

            setError(
                "Please enter your email or mobile number."
            );

            return;
        }


        try {

            setLoading(true);


            await API.post(
                "/auth/send-login-otp",
                {
                    identifier:
                        identifier.trim()
                }
            );


            setOtpSent(true);

            setOtp("");


            setSuccessMessage(
                identifier.includes("@")
                    ? "OTP sent to your email."
                    : "Mobile OTP generated successfully."
            );


        } catch (error) {

            console.error(
                "Send OTP failed:",
                error
            );


            setError(
                error.response?.data ||
                "Unable to send OTP. Please try again."
            );


        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // VERIFY OTP
    // ==========================================

    const handleOtpLogin = async (e) => {

        e.preventDefault();

        setError("");

        setSuccessMessage("");


        if (!identifier.trim()) {

            setError(
                "Please enter your email or mobile number."
            );

            return;
        }


        if (!otp.trim()) {

            setError(
                "Please enter the OTP."
            );

            return;
        }


        try {

            setLoading(true);


            const response =
                await API.post(
                    "/auth/verify-login-otp",
                    {
                        identifier:
                            identifier.trim(),

                        otp:
                            otp.trim()
                    }
                );


            // ==========================================
            // STORE JWT
            // ==========================================

            localStorage.setItem(
                "token",
                response.data.token
            );


            // ==========================================
            // REDIRECT
            // ==========================================

            window.location.href =
                "/dashboard";


        } catch (error) {

            console.error(
                "OTP verification failed:",
                error
            );


            setError(
                error.response?.data ||
                "Invalid or expired OTP."
            );


        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // GOOGLE LOGIN
    // ==========================================

    const handleGoogleLogin = () => {

        window.location.href =
            "http://localhost:8080/oauth2/authorization/google";
    };


    return (

        <div className="auth-page">

            <div className="auth-card">


                {/* ==========================================
                    LEFT BRANDING
                ========================================== */}

                <div className="auth-brand-panel">

                    <div className="auth-brand-content">


                        <div className="auth-globe">
                            🌍
                        </div>


                        <h1>
                            Currency Converter World
                        </h1>


                        <p className="auth-brand-description">

                            Convert currencies using the latest
                            available exchange rates and keep track
                            of your previous conversions.

                        </p>


                        <div className="auth-feature-list">


                            <div className="auth-feature">

                                <span>
                                    💱
                                </span>

                                <div>

                                    <strong>
                                        Currency Conversion
                                    </strong>

                                    <small>
                                        Latest available exchange rates
                                    </small>

                                </div>

                            </div>


                            <div className="auth-feature">

                                <span>
                                    📜
                                </span>

                                <div>

                                    <strong>
                                        Conversion History
                                    </strong>

                                    <small>
                                        Track previous conversions
                                    </small>

                                </div>

                            </div>


                            <div className="auth-feature">

                                <span>
                                    🔐
                                </span>

                                <div>

                                    <strong>
                                        Secure Account
                                    </strong>

                                    <small>
                                        JWT protected access
                                    </small>

                                </div>

                            </div>


                        </div>

                    </div>

                </div>


                {/* ==========================================
                    LOGIN SECTION
                ========================================== */}

                <div className="auth-form-panel">

                    <div className="auth-form-wrapper">


                        {/* MOBILE LOGO */}

                        <div className="auth-mobile-logo">
                            🌍
                        </div>


                        {/* HEADING */}

                        <div className="auth-heading">

                            <h2>
                                Welcome Back
                            </h2>

                            <p>
                                Sign in to continue to your account
                            </p>

                        </div>


                        {/* ==================================
                            LOGIN MODE
                        ================================== */}

                        <div className="auth-login-tabs">


                            <button
                                type="button"
                                className={
                                    loginMode === "PASSWORD"
                                        ? "auth-login-tab active"
                                        : "auth-login-tab"
                                }
                                onClick={() =>
                                    changeLoginMode(
                                        "PASSWORD"
                                    )
                                }
                            >

                                Password

                            </button>


                            <button
                                type="button"
                                className={
                                    loginMode === "OTP"
                                        ? "auth-login-tab active"
                                        : "auth-login-tab"
                                }
                                onClick={() =>
                                    changeLoginMode(
                                        "OTP"
                                    )
                                }
                            >

                                OTP Login

                            </button>


                        </div>


                        {/* ==================================
                            SUCCESS MESSAGE
                        ================================== */}

                        {successMessage && (

                            <div className="auth-success-message">

                                <span>
                                    ✓
                                </span>

                                {successMessage}

                            </div>

                        )}


                        {/* ==================================
                            ERROR / SESSION MESSAGE
                        ================================== */}

                        {error && (

                            <div className="auth-error-message">

                                {error}

                            </div>

                        )}


                        {/* ==================================
                            LOGIN FORM
                        ================================== */}

                        <form
                            onSubmit={
                                loginMode === "PASSWORD"
                                    ? handlePasswordLogin
                                    : handleOtpLogin
                            }
                        >


                            {/* ==================================
                                EMAIL / MOBILE
                            ================================== */}

                            <div className="auth-field">

                                <label>
                                    Email or Mobile Number
                                </label>


                                <div className="auth-input-wrapper">

                                    <span className="auth-input-icon">
                                        👤
                                    </span>


                                    <input
                                        type="text"
                                        placeholder="Email or mobile number"
                                        value={identifier}
                                        autoComplete="username"
                                        disabled={loading}
                                        onChange={(e) => {

                                            setIdentifier(
                                                e.target.value
                                            );

                                            setError("");


                                            if (
                                                loginMode ===
                                                "OTP"
                                            ) {

                                                setOtpSent(
                                                    false
                                                );

                                                setOtp("");

                                            }

                                        }}
                                    />

                                </div>

                            </div>


                            {/* ==================================
                                PASSWORD MODE
                            ================================== */}

                            {loginMode === "PASSWORD" && (

                                <div className="auth-field">


                                    <label>
                                        Password
                                    </label>


                                    <div className="auth-input-wrapper">

                                        <span className="auth-input-icon">
                                            🔒
                                        </span>


                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter your password"
                                            value={password}
                                            autoComplete="current-password"
                                            disabled={loading}
                                            onChange={(e) => {

                                                setPassword(
                                                    e.target.value
                                                );

                                                setError("");

                                            }}
                                        />


                                        <button
                                            type="button"
                                            className="password-toggle"
                                            disabled={loading}
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


                                    {/* ==================================
                                        FORGOT PASSWORD
                                    ================================== */}

                                    <div className="auth-forgot-password">

                                        <Link to="/forgot-password">
                                            Forgot Password?
                                        </Link>

                                    </div>


                                </div>

                            )}


                            {/* ==================================
                                OTP MODE
                            ================================== */}

                            {loginMode === "OTP" && (

                                <>

                                    {!otpSent ? (

                                        <button
                                            type="button"
                                            className="auth-login-button"
                                            disabled={loading}
                                            onClick={handleSendOtp}
                                        >

                                            {loading
                                                ? "Sending OTP..."
                                                : "Send OTP"
                                            }

                                        </button>

                                    ) : (

                                        <>


                                            {/* OTP INPUT */}

                                            <div className="auth-field">

                                                <label>
                                                    Enter OTP
                                                </label>


                                                <div className="auth-input-wrapper">

                                                    <span className="auth-input-icon">
                                                        🔢
                                                    </span>


                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength="6"
                                                        placeholder="Enter 6-digit OTP"
                                                        value={otp}
                                                        disabled={loading}
                                                        onChange={(e) => {

                                                            const value =
                                                                e.target.value
                                                                    .replace(
                                                                        /\D/g,
                                                                        ""
                                                                    );

                                                            setOtp(
                                                                value
                                                            );

                                                            setError("");

                                                        }}
                                                    />

                                                </div>

                                            </div>


                                            {/* VERIFY OTP */}

                                            <button
                                                type="submit"
                                                className="auth-login-button"
                                                disabled={loading}
                                            >

                                                {loading
                                                    ? "Verifying..."
                                                    : "Verify OTP & Sign In"
                                                }

                                            </button>


                                            {/* RESEND OTP */}

                                            <button
                                                type="button"
                                                className="auth-resend-button"
                                                disabled={loading}
                                                onClick={handleSendOtp}
                                            >

                                                Resend OTP

                                            </button>


                                        </>

                                    )}

                                </>

                            )}


                            {/* ==================================
                                PASSWORD SIGN IN
                            ================================== */}

                            {loginMode === "PASSWORD" && (

                                <button
                                    type="submit"
                                    className="auth-login-button"
                                    disabled={loading}
                                >

                                    {loading ? (

                                        <>

                                            <span
                                                className="spinner-border spinner-border-sm"
                                                role="status"
                                            />

                                            Signing in...

                                        </>

                                    ) : (

                                        "Sign In"

                                    )}

                                </button>

                            )}


                            {/* ==================================
                                DIVIDER
                            ================================== */}

                            <div className="auth-divider">

                                <span>
                                    or continue with
                                </span>

                            </div>


                            {/* ==================================
                                GOOGLE LOGIN
                            ================================== */}

                            <button
                                type="button"
                                className="auth-google-button"
                                disabled={loading}
                                onClick={handleGoogleLogin}
                            >

                                <span className="google-icon">
                                    G
                                </span>

                                Continue with Google

                            </button>


                            {/* ==================================
                                REGISTER
                            ================================== */}

                            <p className="auth-register-text">

                                Don't have an account?

                                {" "}

                                <Link to="/register">
                                    Create account
                                </Link>

                            </p>


                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default Login;