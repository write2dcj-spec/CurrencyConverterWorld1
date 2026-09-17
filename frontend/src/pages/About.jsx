import "../css/InfoPages.css";

function About() {
    return (
        <div className="info-page">
            <div className="container">

                <div className="info-card">

                    <span className="info-badge">
                        About Currency Converter World
                    </span>

                    <h1>
                        Simple, Secure and Global Currency Conversion
                    </h1>

                    <p>
                        Currency Converter World is designed to make
                        currency conversion simple, fast and easy to use.
                    </p>

                    <p>
                        Users can convert supported global currencies,
                        check the latest available exchange rates and,
                        after signing in, maintain a personal conversion
                        history.
                    </p>

                    <p>
                        The platform also supports secure authentication
                        using email, mobile credentials, OTP verification
                        and Google Sign-In.
                    </p>

                    <h2>
                        Our Goal
                    </h2>

                    <p>
                        Our goal is to provide a clean and convenient
                        currency conversion experience for users who need
                        quick access to exchange-rate information.
                    </p>

                    <h2>
                        Features
                    </h2>

                    <ul>
                        <li>
                            Currency conversion using the latest available rates
                        </li>

                        <li>
                            Guest conversions without creating an account
                        </li>

                        <li>
                            Secure registered-user access
                        </li>

                        <li>
                            Conversion history for signed-in users
                        </li>

                        <li>
                            Responsive design for desktop, tablet and mobile
                        </li>
                    </ul>

                </div>

            </div>
        </div>
    );
}

export default About;