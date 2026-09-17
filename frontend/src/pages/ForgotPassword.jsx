import {
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import API from "../api/api";

import "../css/ForgotPassword.css";


function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // SEND PASSWORD RESET OTP
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        const normalizedEmail =
            email.trim().toLowerCase();


        if (!normalizedEmail) {

            setError(
                "Please enter your registered email address."
            );

            return;
        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(normalizedEmail)) {

            setError(
                "Please enter a valid email address."
            );

            return;
        }


        try {

            setLoading(true);


            await API.post(
                "/auth/forgot-password",
                {
                    email: normalizedEmail
                }
            );


            navigate(
                "/reset-password",
                {
                    state: {
                        email: normalizedEmail
                    }
                }
            );


        } catch (error) {

            console.error(
                "Forgot password failed:",
                error
            );


            setError(
                error.response?.data ||
                "Unable to send password reset OTP. Please try again."
            );


        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="forgot-page">

            <div className="forgot-card">


                {/* ==========================================
                    LEFT BRAND PANEL
                ========================================== */}

                <div className="forgot-brand-panel">

                    <div className="forgot-brand-content">


                        <div className="forgot-brand-icon">
                            🔐
                        </div>


                        <h1>
                            Reset Your Password
                        </h1>


                        <p className="forgot-brand-description">

                            Forgot your password? No problem.
                            We'll send a verification code to
                            your registered email address.

                        </p>


                        <div className="forgot-feature-list">


                            <div className="forgot-feature">

                                <span>
                                    ✉️
                                </span>

                                <div>

                                    <strong>
                                        Email Verification
                                    </strong>

                                    <small>
                                        Receive a 6-digit OTP
                                    </small>

                                </div>

                            </div>


                            <div className="forgot-feature">

                                <span>
                                    ⏱️
                                </span>

                                <div>

                                    <strong>
                                        5 Minute OTP
                                    </strong>

                                    <small>
                                        Verification code expires quickly
                                    </small>

                                </div>

                            </div>


                            <div className="forgot-feature">

                                <span>
                                    🛡️
                                </span>

                                <div>

                                    <strong>
                                        Secure Reset
                                    </strong>

                                    <small>
                                        Create a new account password
                                    </small>

                                </div>

                            </div>


                        </div>

                    </div>

                </div>


                {/* ==========================================
                    FORM PANEL
                ========================================== */}

                <div className="forgot-form-panel">

                    <div className="forgot-form-wrapper">


                        <div className="forgot-mobile-icon">
                            🔐
                        </div>


                        <div className="forgot-heading">

                            <h2>
                                Forgot Password?
                            </h2>

                            <p>
                                Enter your registered email and
                                we'll send you a password reset OTP.
                            </p>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="forgot-error-message">

                                {error}

                            </div>

                        )}


                        <form onSubmit={handleSubmit}>


                            <div className="forgot-field">

                                <label>
                                    Email Address
                                </label>


                                <div className="forgot-input-wrapper">

                                    <span className="forgot-input-icon">
                                        ✉️
                                    </span>


                                    <input
                                        type="email"
                                        placeholder="Enter your registered email"
                                        value={email}
                                        autoComplete="email"
                                        disabled={loading}
                                        onChange={(e) => {

                                            setEmail(
                                                e.target.value
                                            );

                                            setError("");
                                        }}
                                    />

                                </div>

                            </div>


                            <button
                                type="submit"
                                className="forgot-button"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>

                                        <span
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                        />

                                        Sending OTP...

                                    </>

                                ) : (

                                    "Send Reset OTP"

                                )}

                            </button>


                            <p className="forgot-login-text">

                                Remember your password?

                                {" "}

                                <Link to="/login">
                                    Back to Sign In
                                </Link>

                            </p>


                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default ForgotPassword;