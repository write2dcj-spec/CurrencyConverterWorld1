import axios from "axios";


const API = axios.create({
    baseURL:
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:8080/api"
});


// ==========================================
// ADD JWT TO EVERY REQUEST
// ==========================================

API.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");


        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);


// ==========================================
// HANDLE API RESPONSES
// ==========================================

API.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {


        // ==========================================
        // JWT EXPIRED / INVALID / UNAUTHORIZED
        // ==========================================

        if (error.response?.status === 401) {

            const token =
                localStorage.getItem("token");


            // Only treat it as an expired session
            // when the user actually had a JWT.
            if (token) {

                console.log(
                    "JWT expired or unauthorized."
                );


                // Remove expired / invalid JWT
                localStorage.removeItem("token");


                // Store message temporarily.
                // sessionStorage is better than
                // localStorage for this message.
                sessionStorage.setItem(
                    "authMessage",
                    "Your session has expired. Please sign in again."
                );


                // Avoid unnecessary redirect loop
                if (
                    window.location.pathname !==
                    "/login"
                ) {

                    window.location.href =
                        "/login";

                }

            }

        }


        return Promise.reject(error);

    }

);


export default API;
