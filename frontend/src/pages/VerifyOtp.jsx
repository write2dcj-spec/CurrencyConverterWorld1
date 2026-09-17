import {
    useState
} from "react";

import {
    Navigate,
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import API from "../api/api";

import "../css/VerifyOtp.css";


function VerifyOtp() {

    const location =
        useLocation();

    const navigate =
        useNavigate();


    // ==========================================
    // DATA FROM REGISTER PAGE
    // ==========================================

    const email =
        location.state?.email ||
        location.state?.identifier ||
        "";


    // ==========================================
    // STATE
    // ==========================================

    const [otp, setOtp] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // PROTECT DIRECT ACCESS
    // ==========================================

    if (!email) {

        return (
            <Navigate
                to="/register"
                replace
            />
        );
    }


    // ==========================================
    // VERIFY OTP
    // ==========================================

    const handleVerifyOtp =
        async (e) => {

            e.preventDefault();

            setError("");
            setSuccess("");


            if (!otp.trim()) {

                setError(
                    "Please enter the verification OTP."
                );

                return;
            }


            if (!/^[0-9]{6}$/.test(otp.trim())) {

                setError(
                    "Please enter a valid 6 digit OTP."
                );

                return;
            }


            try {

                setLoading(true);


                await API.post(
                    "/auth/verify-register-otp",
                    {
                        identifier:
                            email.trim(),

                        otp:
                            otp.trim()
                    }
                );


                setSuccess(
                    "Email verified successfully!"
                );


                // Redirect after successful verification

                setTimeout(() => {

                    navigate(
                        "/login",
                        {
                            replace: true,

                            state: {
                                message:
                                    "Account created successfully. Please sign in."
                            }
                        }
                    );

                }, 1500);


            } catch (error) {

                console.error(
                    "OTP verification failed:",
                    error
                );


                if (error.response) {

                    setError(

                        typeof error.response.data === "string"

                            ? error.response.data

                            : error.response.data?.message ||
                              "OTP verification failed."
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

        <div className="verify-page">

            <div className="verify-card">


                {/* =====================================
                    LEFT SIDE
                ===================================== */}

                <div className="verify-form-panel">

                    <div className="verify-form-content">


                        {/* Icon */}

                        <div className="verify-main-icon">
                            ✉
                        </div>


                        {/* Heading */}

                        <div className="verify-heading">

                            <h2>
                                Verify Your Email
                            </h2>

                            <p>
                                We've sent a 6 digit verification
                                code to your email. Enter the code
                                below to activate your account.
                            </p>

                        </div>


                        {/* Email Box */}

                        <div className="verify-email-box">

                            <div className="verify-email-icon">
                                ✉
                            </div>

                            <div>

                                <span>
                                    Email Address
                                </span>

                                <strong>
                                    {email}
                                </strong>

                            </div>

                        </div>


                        {/* Success */}

                        {success && (

                            <div className="verify-success">

                                ✓ {success}

                            </div>

                        )}


                        {/* Error */}

                        {error && (

                            <div className="verify-error">

                                {error}

                            </div>

                        )}


                        {/* OTP Form */}

                        <form
                            onSubmit={handleVerifyOtp}
                        >

                            <div className="verify-field">

                                <label>
                                    Verification OTP
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter 6 Digit OTP"
                                    value={otp}
                                    maxLength={6}
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    onChange={(e) => {

                                        const value =
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            );

                                        setOtp(value);

                                        setError("");
                                    }}
                                />

                            </div>


                            {/* Verify Button */}

                            <button
                                type="submit"
                                className="verify-button"
                                disabled={loading}
                            >

                                {loading
                                    ? "Verifying..."
                                    : "✓  Verify OTP"
                                }

                            </button>

                        </form>


                        {/* OTP Validity */}

                        <div className="verify-expiry">

                            <span>
                                ◷
                            </span>

                            OTP is valid for 5 minutes.

                        </div>


                        {/* Back */}

                        <div className="verify-back">

                            <Link to="/register">

                                ← Back to Register

                            </Link>

                        </div>


                    </div>

                </div>


                {/* =====================================
                    RIGHT SIDE
                ===================================== */}

                <div className="verify-brand-panel">

                    <div className="verify-brand-content">


                        <div className="verify-brand-icon">

                            <div className="verify-envelope">
                                ✉
                            </div>

                            <div className="verify-check">
                                ✓
                            </div>

                        </div>


                        <h1>
                            Almost There!
                        </h1>


                        <p className="verify-brand-description">

                            Verify your email to complete your
                            registration and get access to all
                            features of Currency Converter World.

                        </p>


                        {/* Features */}

                        <div className="verify-features">


                            <div className="verify-feature">

                                <span className="verify-feature-icon">
                                    ⚡
                                </span>

                                <div>

                                    <strong>
                                        Secure Account
                                    </strong>

                                    <small>
                                        Keep your account safe and protected
                                    </small>

                                </div>

                            </div>


                            <div className="verify-feature">

                                <span className="verify-feature-icon">
                                    👤
                                </span>

                                <div>

                                    <strong>
                                        Access All Features
                                    </strong>

                                    <small>
                                        Get full access after verification
                                    </small>

                                </div>

                            </div>


                            <div className="verify-feature">

                                <span className="verify-feature-icon">
                                    🌍
                                </span>

                                <div>

                                    <strong>
                                        Start Converting
                                    </strong>

                                    <small>
                                        Explore global currencies instantly
                                    </small>

                                </div>

                            </div>


                        </div>


                        {/* Brand Footer */}

                        <div className="verify-brand-footer">

                            <strong>
                                CURRENCY CONVERTER WORLD
                            </strong>

                            <span>
                                CONVERT TODAY, EXPLORE TOMORROW
                            </span>

                        </div>


                    </div>

                </div>


            </div>

        </div>
    );
}


export default VerifyOtp;