import React from "react";
import _PageDirectory from "./__PageDirectory";
import LinkCard from "../components/cards/LinkCard";

const Home = () => {
	const settings =
		JSON.parse(localStorage.getItem("ChettiToolsSettings")) || {};
	const showDev = settings.showDev;
	const showApiTools = settings.validKey;
	const visiblePages = _PageDirectory.filter(
		(page) => !page.keyRequired || showApiTools
	);

	return (
		<div className="card-drop-in container container-fluid d-flex flex-column  justify-content-center align-items-center">
			<div className="container mt-4 shadow my-card transition-shadow callout-info bg-light">
				<div className="row">
					<h1 className="mb-4">
						<b>Chetti.Tools Dashboard</b>
					</h1>
					<h4>
						If you believe there should be more cards displayed,
						navigate to settings above and apply your API key
					</h4>
				</div>
				<div className="row">
					{visiblePages.map((page, index) => (
						<LinkCard
							key={index}
							title={page.title}
							text={page.description}
							route={page.route}
							dev={page.devOnly}
							index={index}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
export default Home;
