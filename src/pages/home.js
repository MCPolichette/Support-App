import React from "react";
import _PageDirectory from "./__PageDirectory";
import LinkCard from "../components/LinkCard";

const Home = () => {
	return (
		<div className="container container-fluid d-flex flex-column min-vh-100 justify-content-center align-items-center">
			<div className="container mt-4 shadow callout-info bg-white">
				<div classname="row">
					<h1 className="mb-4">
						<b>Chetti.Tools Dashboard</b>
					</h1>
				</div>
				<div className="row">
					{_PageDirectory.map((page, index) => (
						<LinkCard
							key={index}
							title={page.title}
							text={page.description}
							route={page.route}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default Home;
