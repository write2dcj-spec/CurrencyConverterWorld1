import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Converter from "./pages/Converter";
import History from "./pages/History";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import OAuthSuccess from "./pages/OAuthSuccess";

import ProtectedRoute from "./context/ProtectedRoute";

import {
    Routes,
    Route
} from "react-router-dom";


function App() {

    return (

        <>

            <Navbar />


            <Routes>


                {/* ==========================================
                    PUBLIC ROUTES
                ========================================== */}

                <Route
                    path="/"
                    element={<Home />}
                />


                <Route
                    path="/login"
                    element={<Login />}
                />


                <Route
                    path="/register"
                    element={<Register />}
                />


                <Route
                    path="/verify-otp"
                    element={<VerifyOtp />}
                />


                {/* ==========================================
                    PASSWORD RECOVERY
                ========================================== */}

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />


                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />


                <Route
                    path="/oauth-success"
                    element={<OAuthSuccess />}
                />


                {/* ==========================================
                    PUBLIC CURRENCY CONVERTER
                ========================================== */}

                <Route
                    path="/converter"
                    element={<Converter />}
                />


                {/* ==========================================
                    PUBLIC INFORMATION / LEGAL PAGES
                ========================================== */}

                <Route
                    path="/about"
                    element={<About />}
                />


                <Route
                    path="/contact"
                    element={<Contact />}
                />


                <Route
                    path="/privacy"
                    element={<Privacy />}
                />


                <Route
                    path="/terms"
                    element={<Terms />}
                />


                <Route
                    path="/disclaimer"
                    element={<Disclaimer />}
                />


                {/* ==========================================
                    PROTECTED ROUTES
                ========================================== */}

                <Route
                    element={<ProtectedRoute />}
                >

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />


                    <Route
                        path="/history"
                        element={<History />}
                    />


                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                </Route>


                {/* ==========================================
                    404 - MUST REMAIN LAST
                ========================================== */}

                <Route
                    path="*"
                    element={<NotFound />}
                />


            </Routes>


            {/* ==========================================
                GLOBAL FOOTER
            ========================================== */}

            <Footer />


        </>

    );
}


export default App;