import React from "react";
import { Container } from "react-bootstrap";
import pages from "./__PageDirectory";
import LinkCard from "../components/cards/LinkCard";
import QuickTools from "./QuickTools";
import ToolContainer from "../components/ToolContainer";

const Home = ({ settings }) => {
	const visible = pages.filter(
		(page) => !page.keyRequired || settings.validKey,
	);
	const main = visible.filter((page) => !page.devOnly);
	const development = visible.filter((page) => page.devOnly);
	const cards = (list) =>
		list.map((page) => (
			<LinkCard
				key={page.route}
				title={page.title}
				text={page.description}
				route={page.route}
				dev={page.devOnly}
				list={page.listArray}
			/>
		));
	return (
		<Container className="py-4">
			<h1 className="h2">Chetti.Tools</h1>
			<p className="text-muted mb-4">
				Your everyday support tools, reports, and feed mapping.
			</p>
			<ToolContainer>
				<section aria-labelledby="workspaces-title" className="mb-4">
					<h2 id="workspaces-title" className="h4">
						Reports and workspaces
					</h2>
					{!settings.validKey && (
						<p className="text-muted">
							Add a working API key in Settings to access reports
							and API tools.
						</p>
					)}
					<div className="row">{cards(main)}</div>
				</section>
				<section aria-labelledby="quick-tools-title" className="mb-4">
					<h2 id="quick-tools-title" className="h4">
						Quick Tools
					</h2>
					<QuickTools settings={settings} />
				</section>

				{settings.showDev && development.length > 0 && (
					<details className="border rounded p-3">
						<summary className="fw-semibold">
							Development tools
						</summary>
						<div className="row mt-3">{cards(development)}</div>
					</details>
				)}
			</ToolContainer>
		</Container>
	);
};
export default Home;
