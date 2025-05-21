export const PerfSummary = (report, dates) => {
	const tableDisplay = {
		headers: [
			{
				label: "Year",
				type: "text",
				className: "border-primary border-right",
			},
			{ label: "Sales", type: "dollar" },
			{ label: "Clicks", type: "int" },
			{ label: "# of Sales", type: "int" },
			{
				label: ["Avg Order", " Amount"],
				type: "dollar",
			},
			{
				label: ["Conversion", " Rate"],
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
export const ProductSummary = (report, dates) => {
	const data = [];

	report.forEach((product) => {
		data.push([
			product["Product Name"],
			product["Total Product Sale Quantity"],
			product["Total Product Sale Amount"],
		]);
	});

	const tableDisplay = {
		headers: [
			{
				label: "Product",
				type: "string",
				className: "w-75 border-primary border-right",
			},
			{ label: "Units " + dates.year, type: "int" },
			{ label: "Sales " + dates.year, type: "dollar" },
		],
		data: data,
	};

	return {
		tableDisplay,
	};
};
