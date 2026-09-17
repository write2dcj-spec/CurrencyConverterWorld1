import {
    NavLink,
    Link,
    useNavigate
} from "react-router-dom";


function Navbar() {

    const navigate = useNavigate();

    const token =
        localStorage.getItem("token");


    // ==========================================
    // Logout
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate(
            "/login",
            {
                replace: true,
                state: {
                    message: "Logout successful"
                }
            }
        );
    };


    // ==========================================
    // Navbar Active Link Class
    // ==========================================

    const linkClass = ({ isActive }) =>
        `nav-link ${isActive ? "active-link" : ""}`;


    return (

        <nav className="navbar navbar-expand-lg navbar-dark custom-navbar">

            <div className="container">


                {/* ==========================================
                    Brand
                ========================================== */}

                <Link
                    className="navbar-brand"
                    to="/"
                >
                    🌍 Currency Converter World
                </Link>


                {/* ==========================================
                    Mobile Toggle
                ========================================== */}

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>


                {/* ==========================================
                    Navigation Links
                ========================================== */}

                <div
                    className="collapse navbar-collapse"
                    id="mainNavbar"
                >

                    <div className="navbar-nav ms-auto align-items-lg-center">


                        {/* PUBLIC */}

                        <NavLink
                            className={linkClass}
                            to="/"
                        >
                            Home
                        </NavLink>


                        <NavLink
                            className={linkClass}
                            to="/converter"
                        >
                            Convert Currency
                        </NavLink>


                        {/* LOGGED-IN USER */}

                        {token ? (

                            <>

                                <NavLink
                                    className={linkClass}
                                    to="/dashboard"
                                >
                                    Dashboard
                                </NavLink>


                                <NavLink
                                    className={linkClass}
                                    to="/history"
                                >
                                    History
                                </NavLink>


                                <NavLink
                                    className={linkClass}
                                    to="/profile"
                                >
                                    Profile
                                </NavLink>


                                <button
                                    type="button"
                                    className="nav-link logout-link"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>

                            </>

                        ) : (

                            <>

                                <NavLink
                                    className={linkClass}
                                    to="/register"
                                >
                                    Register
                                </NavLink>


                                <NavLink
                                    className={linkClass}
                                    to="/login"
                                >
                                    Login
                                </NavLink>

                            </>

                        )}

                    </div>

                </div>

            </div>

        </nav>

    );
}


export default Navbar;