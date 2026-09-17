import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function OAuthSuccess() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {

        const token = searchParams.get("token");

        console.log("=================================");
        console.log("OAUTH SUCCESS PAGE");
        console.log("Token received:", token);
        console.log("=================================");

        if (token) {

            console.log("Google Login Successful");

            localStorage.setItem("token", token);

            console.log(
                "Token stored in localStorage:",
                localStorage.getItem("token")
            );

            navigate("/dashboard");

        } else {

            console.log("Token not found");

            navigate("/login");
        }

    }, [navigate, searchParams]);

    return (
        <div className="container text-center mt-5">

            <h3>Logging you in...</h3>

            <p>Please wait.</p>

        </div>
    );
}

export default OAuthSuccess;