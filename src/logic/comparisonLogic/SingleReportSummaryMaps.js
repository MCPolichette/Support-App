export const PerfSummary = (report, dates) => {
	const tableDisplay = {
		headers: [
			{
				label: "Year",
				type: "text",
				className: "standard border-right",
			},
			{ className: "standard", label: "Sales", type: "dollar" },
			{ className: "standard", label: "Clicks", type: "int" },
			{ className: "standard", label: "# of Sales", type: "int" },
			{
				className: "standard",
				label: ["Avg Order", " Amount"],
				type: "dollar",
			},
			{
				className: "standard",
				label: ["Conversion", " Rate"],
				type: "percent",
			},
			{
				className: "standard text-right",
				label: "New Customer %",
				type: "end",
			},
			{
				className: "standard",
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
			product["Product SKU"],
			product["Product Name"],
			product["Total Product Sale Quantity"],
			product["Total Product Sale Amount"],
		]);
	});
	//TODO NOWRAP COLUMNS?

	const tableDisplay = {
		headers: [
			{
				label: "Product SKU",
				type: "string",
				className: "w-75  border-right nowrap-col standard",
			},
			{
				label: "Product Name",
				type: "string",
				className: "w-75 name-cell border-right nowrap-col",
			},
			{
				label: "Units " + dates.year,
				type: "int",
				className: "w-75 standard",
			},
			{
				label: "Sales " + dates.year,
				type: "dollar",
				className: "w-75 standard",
			},
		],
		data: data,
	};

	return {
		tableDisplay,
	};
};
