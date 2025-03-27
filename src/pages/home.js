import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
	return (
		<div className="container mt-5">
			<h1 className="mb-4">Support Tools Dashboard</h1>
			<div className="card mb-3 shadow">
				<div className="card-body">
					<h5 className="card-title">Datafeed Automapper</h5>
					<p className="card-text">
						Upload and map product datafeeds automatically. Useful
						for quickly identifying field matches and handling
						common formatting inconsistencies.
					</p>
					<Link to="/automapper" className="btn btn-primary">
						Automapper
					</Link>
				</div>
				<div className="card-body">
					<h5 className="card-title">FISH-USA Custom Report</h5>
					<p className="card-text">
						For Anthony, and Fish USA produces a 7 day report.
					</p>
					<Link to="/fish_usa" className="btn btn-primary">
						FISH USA Report
					</Link>
				</div>
			</div>
			Placeholder for future tools
			<div className="card text-muted border-0">
				<div className="card-body">
					<h5 className="card-title">More tools coming soon...</h5>
					<p className="card-text">
						This dashboard will eventually include tools for
						validation, troubleshooting, and feed health
						diagnostics.
					</p>
				</div>
			</div>
		</div>
	);
};

export default Home;
