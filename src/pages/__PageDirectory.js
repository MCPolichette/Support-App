const _PageDirectory = [
	{
		title: "Datafeed Automapper 2.0",
		description:
			"Upload and map product datafeeds automatically. Useful for quickly identifying field matches and handling common formatting inconsistencies.",
		listArray: ["maps variant feeds:", "assigns new Attributes"],
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
		title: "Parrallel Pulse Report",
		description:
			"A comprehensive and modular report designed for parallel metrics analysis and historical comparison",
		listArray: [
			"Compare:",
			"Month over Month",
			"Week over Week",
			"Products, Affiliate and overall summaries",
		],
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
	{
		title: "Mark K Report",
		description: "Report built for Mark K",
		listArray: ["Mark K "],
		route: "/MarkK",
		devOnly: true,
		keyRequired: true,
	},
	{
		title: "Outage Estimate 2.0",
		description:
			"An updated version of the Outage Estimate, with more simplified logic, and easier setup.",
		listArray: [
			"API Required",
			"General Structure up",
			"Math is still incomplete",
			"custom Tools, and overall display incomplete",
		],
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
];

export default _PageDirectory;
