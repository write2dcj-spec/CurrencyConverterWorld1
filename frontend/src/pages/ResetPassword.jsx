import {
    useState
} from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import API from "../api/api";

import "../css/ResetPassword.css";


function ResetPassword() {

    const location = useLocation();

    const navigate = useNavigate();


    const [email, setEmail] =
        useState(
            location.state?.email || ""
        );

    const [otp, setOtp] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // RESET PASSWORD
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        const normalizedEmail =
            email.trim().toLowerCase();

        const normalizedOtp =
            otp.trim();


        if (!normalizedEmail) {

            setError(
                "Please enter your email address."
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


        if (!normalizedOtp) {

            setError(
                "Please enter the OTP sent to your email."
            );

            return;
        }


        if (normalizedOtp.length !== 6) {

            setError(
                "OTP must contain 6 digits."
            );

            return;
        }


        if (!newPassword) {

            setError(
                "Please enter your new password."
            );

            return;
        }


        if (newPassword.length < 8) {

            setError(
                "Password must contain at least 8 characters."
            );

            return;
        }


        if (!confirmPassword) {

            setError(
                "Please confirm your new password."
            );

            return;
        }


        if (newPassword !== confirmPassword) {

            setError(
                "New password and confirm password do not match."
            );

            return;
        }


        try {

            setLoading(true);


            await API.post(
                "/auth/reset-password",
                {
                    email: normalizedEmail,

                    otp: normalizedOtp,

                    newPassword,

                    confirmPassword
                }
            );


            navigate(
                "/login",
                {
                    replace: true,

                    state: {
                        message:
                            "Password reset successfully. Please sign in with your new password."
                    }
                }
            );


        } catch (error) {

            console.error(
                "Password reset failed:",
                error
            );


            setError(
                error.response?.data ||
                "Unable to reset password. Please try again."
            );


        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // RESEND RESET OTP
    // ==========================================

    const handleResendOtp = async () => {

        setError("");


        const normalizedEmail =
            email.trim().toLowerCase();


        if (!normalizedEmail) {

            setError(
                "Please enter your email address first."
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


            setOtp("");


        } catch (error) {

            console.error(
                "Resend password reset OTP failed:",
                error
            );


            setError(
                error.response?.data ||
                "Unable to resend OTP. Please try again."
            );


        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="reset-page">

            <div className="reset-card">


                {/* ==========================================
                    BRAND PANEL
                ========================================== */}

                <div className="reset-brand-panel">

                    <div className="reset-brand-content">


                        <div className="reset-brand-icon">
                            🛡️
                        </div>


                        <h1>
                            Create New Password
                        </h1>


                        <p className="reset-brand-description">

                            Enter the verification code sent
                            to your email and choose a new
                            password for your account.

                        </p>


                        <div className="reset-feature-list">


                            <div className="reset-feature">

                                <span>
                                    🔢
                                </span>

                                <div>

                                    <strong>
                                        Verify OTP
                                    </strong>

                                    <small>
                                        Enter your 6-digit code
                                    </small>

                                </div>

                            </div>


                            <div className="reset-feature">

                                <span>
                                    🔐
                                </span>

                                <div>

                                    <strong>
                                        New Password
                                    </strong>

                                    <small>
                                        Use at least 8 characters
                                    </small>

                                </div>

                            </div>


                            <div className="reset-feature">

                                <span>
                                    ✓
                                </span>

                                <div>

                                    <strong>
                                        Sign In Again
                                    </strong>

                                    <small>
                                        Use your new password
                                    </small>

                                </div>

                            </div>


                        </div>

                    </div>

                </div>


                {/* ==========================================
                    FORM PANEL
                ========================================== */}

                <div className="reset-form-panel">

                    <div className="reset-form-wrapper">


                        <div className="reset-mobile-icon">
                            🛡️
                        </div>


                        <div className="reset-heading">

                            <h2>
                                Reset Password
                            </h2>

                            <p>
                                Enter your OTP and create
                                your new password.
                            </p>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="reset-error-message">

                                {error}

                            </div>

                        )}


                        <form onSubmit={handleSubmit}>


                            {/* EMAIL */}

                            <div className="reset-field">

                                <label>
                                    Email Address
                                </label>


                                <div className="reset-input-wrapper">

                                    <span className="reset-input-icon">
                                        ✉️
                                    </span>


                                    <input
                                        type="email"
                                        placeholder="Enter your email"
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


                            {/* OTP */}

                            <div className="reset-field">

                                <label>
                                    Verification OTP
                                </label>


                                <div className="reset-input-wrapper">

                                    <span className="reset-input-icon">
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

                                            setOtp(value);

                                            setError("");
                                        }}
                                    />

                                </div>

                            </div>


                            {/* NEW PASSWORD */}

                            <div className="reset-field">

                                <label>
                                    New Password
                                </label>


                                <div className="reset-input-wrapper">

                                    <span className="reset-input-icon">
                                        🔒
                                    </span>


                                    <input
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        autoComplete="new-password"
                                        disabled={loading}
                                        onChange={(e) => {

                                            setNewPassword(
                                                e.target.value
                                            );

                                            setError("");
                                        }}
                                    />


                                    <button
                                        type="button"
                                        className="reset-password-toggle"
                                        disabled={loading}
                                        onClick={() =>
                                            setShowNewPassword(
                                                !showNewPassword
                                            )
                                        }
                                    >

                                        {showNewPassword
                                            ? "Hide"
                                            : "Show"
                                        }

                                    </button>

                                </div>


                                <small className="reset-password-hint">
                                    Use at least 8 characters.
                                </small>

                            </div>


                            {/* CONFIRM PASSWORD */}

                            <div className="reset-field">

                                <label>
                                    Confirm New Password
                                </label>


                                <div className="reset-input-wrapper">

                                    <span className="reset-input-icon">
                                        🔒
                                    </span>


                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        autoComplete="new-password"
                                        disabled={loading}
                                        onChange={(e) => {

                                            setConfirmPassword(
                                                e.target.value
                                            );

                                            setError("");
                                        }}
                                    />


                                    <button
                                        type="button"
                                        className="reset-password-toggle"
                                        disabled={loading}
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >

                                        {showConfirmPassword
                                            ? "Hide"
                                            : "Show"
                                        }

                                    </button>

                                </div>

                            </div>


                            {/* RESET BUTTON */}

                            <button
                                type="submit"
                                className="reset-button"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>

                                        <span
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                        />

                                        Resetting Password...

                                    </>

                                ) : (

                                    "Reset Password"

                                )}

                            </button>


                            {/* RESEND */}

                            <button
                                type="button"
                                className="reset-resend-button"
                                disabled={loading}
                                onClick={handleResendOtp}
                            >

                                Resend OTP

                            </button>


                            {/* BACK */}

                            <p className="reset-login-text">

                                <Link to="/login">
                                    ← Back to Sign In
                                </Link>

                            </p>


                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default ResetPassword;