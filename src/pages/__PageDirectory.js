const _PageDirectory = [
	{
		title: "Datafeed Automapper",
		description:
			"Upload and map product datafeeds automatically. Useful for quickly identifying field matches and handling common formatting inconsistencies.",
		route: "/automapper",
		devOnly: false,
		keyRequired: false,
	},
	{
		title: "Quick Tools ",
		description:
			"A series of quick conversion tools for DB queries, and other regular calculations.",
		route: "/more_tools",
		devOnly: false,
		keyRequired: false,
		listArray: ["UTMs", "FTP", "IBC verification", "etc..."],
	},
	{
		title: "Outage Estimate 2.0",
		description:
			"An updated version of the Outage Estimate, with more simplified logic, and easier setup.",
		route: "/outage_estimate",
		devOnly: true,
		keyRequired: true,
	},
	{
		title: "Recursive Link Crawler",
		description: "work in progress. ",
		route: "/link-detector",
		devOnly: true,
		keyRequired: true,
	},

	{
		title: "Parrallel Pulse Report",
		description:
			"A comprehensive and modular report designed for parallel metrics analysis and historical comparison",
		route: "/ParrallelPulse",
		devOnly: false,
		keyRequired: true,
	},
	{
		title: "Ad Tool Playground",
		description: "Tool Examples",
		route: "/AdTools",
		devOnly: false,
		keyRequired: false,
	},
];

export default _PageDirectory;
