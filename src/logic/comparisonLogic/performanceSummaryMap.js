export const PerfSummaryTableMap = (report, dates) => {
	return [
		{ label: "Year", value: dates.year, type: "text" },
		{ label: "Sales", value: report?.["Sales"], type: "dollar" },
		{ label: "Clicks", value: report?.["Click Throughs"], type: "int" },
		{ label: "# of Sales", value: report?.["# of Sales"], type: "int" },
		{
			label: "Avg Order Amount",
			value: report?.["Average Sale Amount"],
			type: "dollar",
		},
		{
			label: "Conversion Rate",
			value: report?.["Conversion Rate"],
			type: "percent",
		},
		{
			label: "New Customer %",
			value: report?.["New Customer %"],
			type: "percent",
		},
		{
			label: "Mobile Sales",
			value: report?.["Mobile Sales"],
			type: "dollar",
			className: "bg-light border-start border-2 border-dark",
		},
	];
};

export const PerfSummaryTableMapPrev = (report, dates) => {
	return [
		{ label: "Year", value: dates.year, type: "text" },
		{ label: "Sales", value: report?.["Sales"], type: "dollar" },
		{ label: "Clicks", value: report?.["Click Throughs"], type: "int" },
		{ label: "# of Sales", value: report?.["# of Sales"], type: "int" },
		{
			label: "Avg Order Amount",
			value: report?.["Average Sale Amount"],
			type: "dollar",
		},
		{
			label: "Conversion Rate",
			value: report?.["Conversion Rate"],
			type: "percent",
		},
		{
			label: "New Customer %",
			value: report?.["New Customer %"],
			type: "percent",
		},
		{
			label: "Mobile Sales",
			value: report?.["Mobile Sales"],
			type: "dollar",
			className: "bg-light border-start border-2 border-dark",
		},
	];
};
