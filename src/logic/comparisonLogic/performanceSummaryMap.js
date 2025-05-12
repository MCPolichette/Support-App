export const PerfSummaryTableMap = (report, dates) => {
	console.log(report, dates);
	const tableDisplay = {
		headers: [
			{
				label: "Year",
				type: "text",
				className: "bg-light border-start border-2 border-dark",
			},
			{ label: "Sales", type: "dollar" },
			{ label: "Clicks", type: "int" },
			{ label: "# of Sales", type: "int" },
			{
				label: "Avg Order Amount",
				type: "dollar",
			},
			{
				label: "Conversion Rate",
				type: "percent",
			},
			{
				label: "New Customer %",
				type: "end",
				className: "text-right",
			},
			{
				label: "Mobile Sales",
				type: "dollar",
			},
		],
		data: [
			dates.year,
			report?.["Sales"],
			report?.["Click Throughs"],
			report?.["# of Sales"],
			report?.["Average Sale Amount"],
			report?.["Conversion Rate"],
			report?.["New Customer %"] + "%",
			report?.["Mobile Sales"],
		],
	};
	return {
		tableDisplay,
	};
};
