export function getTotals(data, groupKey, totalFields) {
	if (!Array.isArray(data)) {
		console.error("getTotals expected an array, received:", data);
		return [];
	}

	const resultMap = {};
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
	return resultMap;
}
export const AttributeDelta = (attribute, reportC, datesC, reportP, datesP) => {
	const attr = attribute;
	const name = attr[0];

	const totalsC = getTotals(reportC, attr, [
		"Sale Count ",
		"Total Product Sale Quantity",
		"Total Product Sale Amount",
	]);

	const totalsP = getTotals(reportP, attr, [
		"Sale Count ",
		"Total Product Sale Quantity",
		"Total Product Sale Amount",
	]);
	let deltaReport = [];
	const tableData = () => {
		let arr = [];
		Object.entries(totalsC).forEach(([category, curr]) => {
			const match = totalsP[category] || {};

			const prevAmount = match["Total Product Sale Amount"] || 0;
			const currAmount = curr["Total Product Sale Amount"] || 0;

			const prevQty = match["Total Product Sale Quantity"] || 0;
			const currQty = curr["Total Product Sale Quantity"] || 0;

			arr.push([
				category,
				currQty,
				prevQty,
				percentChange(currQty, prevQty),
				demandChange(currQty, prevQty),
				currAmount,
				prevAmount,
				percentChange(currAmount, prevAmount),
				demandChange(currAmount, prevAmount),
			]);
		});

		return arr.sort((a, b) => b[1] - a[1]); // sort by currQty (index 1)
	};

	const percentChange = (curr, prev) => {
		if (curr === 0) return 0;
		return (curr - prev) / curr;
	};

	const demandChange = (curr, prev) => {
		return curr - prev;
	};
	deltaReport = tableData();
	const tableMap = [
		{ label: attr[0], type: "text" },
		{
			label: "Units " + datesC.year,

			type: "int",
		},
		{
			label: "Units " + datesP.year,

			type: "int",
		},
		{
			label: datesC.year + " vs " + datesP.year + " % Change",

			type: "percent",
		},
		{
			label: datesC.year + " vs " + datesP.year + " Demand Change",

			type: "int",
		},
		{
			label: "Sales " + datesC.year,

			type: "dollar",
		},
		{
			label: "Sales " + datesP.year,

			type: "dollar",
		},
		{
			label: datesC.year + " vs " + datesP.year + " % Change",

			type: "percent",
		},
		{
			label: datesC.year + " vs " + datesP.year + " Change",

			type: "dollar",
		},
	];
	return { name, tableMap, deltaReport };
};
