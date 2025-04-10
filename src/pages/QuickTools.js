import React, { useState } from "react";
import REIDateConverter from "../components/modals/REIDateConverter";
import LinkCard from "../components/cards/LinkCard";

const QuickTools = () => {
	const tools_list = [
		{
			title: "REI Date Converter",
			description:
				"A quick CopyPaste for creating the SQL snippet Cristina's Dates in her REI reports.  ",
			modal: <REIDateConverter />,
		},
	];

	return (
		<div className="container container-fluid d-flex flex-column min-vh-100 justify-content-center align-items-center">
			<div className="container mt-4 shadow callout-info bg-white">
				<div classname="row">
					<h1 className="mb-4">
						<b>Chetti.Tools Dashboard</b>
					</h1>
				</div>
				<div className="row">
					{tools_list.map((tool, index) => (
						<LinkCard
							key={index}
							title={tool.title}
							text={tool.description}
							modal={tool.modal}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default QuickTools;
