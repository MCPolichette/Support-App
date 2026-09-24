import React from "react";
import FTPshorthand from "../components/modals/quickTools/FTPshorthand";
import IBCVerification from "../components/modals/quickTools/IBCVerification";
import UTMBuilder from "../components/modals/quickTools/UTMBuilder";
import DownloadXMLTool from "../components/modals/quickTools/DownloadXMLTool";

import LinkCard from "../components/cards/LinkCard";

const QuickTools = ({ settings }) => {
	const showApiTools = settings.validKey;
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
		(tool) => !tool.apiRequired || showApiTools
	);

	return (
		<div className="row">
			{visibletools.map(tool => (
				<LinkCard key={tool.title} title={tool.title} text={tool.description}
					modal={tool.modal} cardInput={tool.cardInput} list={tool.listArray} />
			))}
		</div>
	);
};
export default QuickTools;
