function HowItWorks() {

    const steps = [
        {
            number: "1",
            title: "Register",
            description: "Create your account using email and verify it with OTP."
        },
        {
            number: "2",
            title: "Login",
            description: "Login securely using JWT Authentication."
        },
        {
            number: "3",
            title: "Convert",
            description: "Select currencies and convert using live exchange rates."
        },
        {
            number: "4",
            title: "Save History",
            description: "View and manage all your previous conversions."
        }
    ];

    return (

        <div className="container my-5">

            <h2 className="text-center mb-5">
                How It Works
            </h2>

            <div className="row">

                {steps.map((step) => (

                    <div className="col-md-3 mb-4" key={step.number}>

                        <div className="card shadow text-center p-4 h-100">

                            <div
                                className="rounded-circle bg-primary text-white mx-auto mb-3 d-flex align-items-center justify-content-center"
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    fontSize: "25px"
                                }}
                            >

                                {step.number}

                            </div>

                            <h5>{step.title}</h5>

                            <p>{step.description}</p>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default HowItWorks;