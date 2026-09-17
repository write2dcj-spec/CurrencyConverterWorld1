import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import Converter from "./pages/Converter";
import History from "./pages/History";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import OAuthSuccess from "./pages/OAuthSuccess";

import ProtectedRoute from "./context/ProtectedRoute";

import { Routes, Route } from "react-router-dom";

function App() {

    return (
        <>
            {/* =========================
                NAVBAR
            ========================= */}
            <Navbar />


            <Routes>

                {/* =========================
                    PUBLIC ROUTES
                ========================= */}

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

                {/* Google OAuth Redirect */}
                <Route
                    path="/oauth-success"
                    element={<OAuthSuccess />}
                />


                {/* =========================
                    PROTECTED ROUTES
                ========================= */}

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/converter"
                        element={<Converter />}
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


                {/* =========================
                    404 PAGE
                ========================= */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>
        </>
    );
}

export default App;