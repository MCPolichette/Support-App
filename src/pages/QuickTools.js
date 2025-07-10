import React, { useState } from "react";
import { Container } from "react-bootstrap";
import FTPshorthand from "../components/modals/quickTools/FTPshorthand";
import IBCVerification from "../components/modals/quickTools/IBCVerification";
import UTMBuilder from "../components/modals/quickTools/UTMBuilder";
import DownloadXMLTool from "../components/modals/quickTools/DownloadXMLTool";

import LinkCard from "../components/cards/LinkCard";

const QuickTools = () => {
	const settings =
		JSON.parse(localStorage.getItem("ChettiToolsSettings")) || {};

	const [showApiTools] = useState(settings.validKey || false);
	console.log(showApiTools);
	const tools_list = [
		{
			title: "FTP conversion tools",
			description:
				"creating FTP strings, encoding passwords, and copypasta for explaining logins.",
			listArray: ["assembles and encodes FTP", "decodes FTP URLS"],
			modal: <FTPshorthand />,
			apiRequired: false,
		},
		{
			title: "SIMPLE UTM Builder",
			description:
				"basic inputs for building UTMs, with lower chances of creating a syntax eroor",
			listArray: ["assemble UTM strings"],
			modal: <UTMBuilder />,
			apiRequired: false,
		},
		{
			title: "Force Download XML",
			description:
				"For those Awful XML docs that cannot download or display in the browser. this should force the download to your downloads folder.",
			modal: <DownloadXMLTool />,
			apiRequired: false,
		},
		{
			title: "IBC verification",
			description:
				"A quick API that returns product sold report over the last 30days   ",
			listArray: [
				"Verifies connection between feed and reports",
				"Returns department, brand, and category totals.",
				"  Failure responses available.  ",
			],
			modal: <IBCVerification />,
			apiRequired: true,
		},
		{
			title: "Affiliate Pop-up",
			description: "pop up for 2FA.",
			listArray: [
				"requirements:",
				"logged in",
				"as Admin in Network",
				"on same Browser Application ",
			],
			cardInput:
				"http://classic.avantlink.com/admin/affiliate_all_detail.php?lngPublisherId=",
			apiRequired: true,
		},
	];
	const visibletools = tools_list.filter(
		(tool) => !tool.keyRequired || showApiTools
	);

	return (
		<div className=" container container-fluid  d-flex flex-column min-vh-50 justify-content-center align-items-center">
			<Container
				className="container mt-4 shadow callout-info card-drop-in "
				style={{
					backgroundColor: "lightgrey",
					padding: "2rem",
				}}
			>
				<div className="row">
					<h5 className="mb-4">
						<b>Quick Tools!</b>
					</h5>
				</div>
				<div className="row">
					{visibletools.map((tool, index) => (
						<LinkCard
							key={index}
							title={tool.title}
							text={tool.description}
							modal={tool.modal}
							index={index}
							cardInput={tool.cardInput}
							list={tool.listArray}
						/>
					))}
				</div>
			</Container>{" "}
		</div>
	);
};

export default QuickTools;
