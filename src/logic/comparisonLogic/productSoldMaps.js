export function getTotals(data, groupKey, totalFields) {
	const resultMap = {};
	console.log(data, groupKey, totalFields);

	data.forEach((item) => {
		const group = item[groupKey]?.trim() || "Unknown";

		if (!resultMap[group]) {
			resultMap[group] = Object.fromEntries(
				totalFields.map((field) => [field, 0])
			);
		}

		totalFields.forEach((field) => {
			const rawValue = item[field]?.toString().trim() || "0";
			const parsedValue =
				parseFloat(rawValue.replace(/[^0-9.-]+/g, "")) || 0;
			resultMap[group][field] += parsedValue;
		});
	});

	// Convert to sorted array of totals
	const sorted = Object.entries(resultMap)
		.map(([group, totals]) => ({
			[groupKey]: group,
			...totals,
		}))
		.sort((a, b) => a[groupKey].localeCompare(b[groupKey]));

	return sorted;
}

export const AttributeDelta = (attribute, reportC, datesC, reportP, datesP) => {
	const totalsC = getTotals(reportC, attribute, [
		[
			"Sale Count ",
			"Total Product Sale Quantity",
			"Total Product Sale Amount",
		],
	]);
	const totalsP = getTotals(reportP, attribute, [
		[
			"Sale Count ",
			"Total Product Sale Quantity",
			"Total Product Sale Amount",
		],
	]);
	const percentChange = (value) => {
		return (totalsC?.[value] - totalsP?.[value]) / totalsC?.[value];
	};
	const demandChange = (value) => {
		return totalsC?.[value] - totalsP?.[value];
	};

	return [
		{ label: attribute, value: totalsC?.[attribute], type: "text" },
		{
			label: "Units " + datesC.year,
			value: totalsC?.["Total Product Sale Quantity"],
			type: "int",
		},
		{
			label: ("Units ", +datesP.year),
			value: totalsP?.["Total Product Sale Quantity"],
			type: "int",
		},
		{
			label: datesC.year + " vs " + datesP.year + " % Change",
			value: percentChange("Total Product Sale Quantity"),
			type: "percent",
		},
		{
			label: datesC.year + " vs " + datesP.year + " Demand Change",
			value: demandChange("Total Product Sale Quantity"),
			type: "int",
		},
		{
			label: "Sales " + datesC.year,
			value: totalsC?.["Total Product Sale Amount"],
			type: "dollar",
		},
		{
			label: ("Sales ", +datesP.year),
			value: totalsP?.["Total Product Sale Amount"],
			type: "dollar",
		},
		{
			label: datesC.year + " vs " + datesP.year + " % Change",
			value: percentChange("Total Product Sale Amount"),
			type: "percent",
		},
		{
			label: datesC.year + " vs " + datesP.year + " Change",
			value: demandChange("Total Product Sale Amount"),
			type: "dollar",
		},
	];
};
