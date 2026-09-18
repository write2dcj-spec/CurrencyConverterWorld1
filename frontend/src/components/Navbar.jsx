import {
    NavLink,
    Link,
    useNavigate,
    useLocation
} from "react-router-dom";

import {
    useEffect,
    useState
} from "react";


function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);

    const token =
        localStorage.getItem("token");


    // ==========================================
    // Close Menu When Page Changes
    // ==========================================

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);


    // ==========================================
    // Logout
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        setMenuOpen(false);

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
    // Mobile Menu Toggle
    // ==========================================

    const handleMenuToggle = () => {
        setMenuOpen((previous) => !previous);
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
                    onClick={() => setMenuOpen(false)}
                >
                    <span className="navbar-brand-icon">
                        🌍
                    </span>

                    <span className="navbar-brand-text">
                        Currency Converter World
                    </span>
                </Link>


                {/* ==========================================
                    Mobile / Tablet Toggle
                ========================================== */}

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={handleMenuToggle}
                    aria-controls="mainNavbar"
                    aria-expanded={menuOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>


                {/* ==========================================
                    Navigation Links
                ========================================== */}

                <div
                    className={`navbar-collapse ${
                        menuOpen ? "mobile-menu-open" : ""
                    }`}
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
