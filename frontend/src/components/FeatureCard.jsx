function FeatureCard({ icon, title, description }) {

    return (

        <div className="col-md-4">

      <div className="card feature-card shadow p-4 text-center h-100">

                <h1>{icon}</h1>

                <h4>{title}</h4>

                <p>{description}</p>

            </div>

        </div>

    );

}

export default FeatureCard;