export const build_Outage_Estimate_Table = ({
	affiliateCount,
	outageReport,
	baselineReport,
	discrepency,
	setOutageTable,
	setEstimatedTotals,
	setAvgCommRate,
	setNetworkRate,
}) => {
	console.log(affiliateCount, "RUNNING THE BUILD OUTAGE ESTIMATE TABLE");
	const headers = [
		{ label: "Affiliate Website ID", type: "string" },
		{ label: "Website Name", type: "string" },
		{ label: "Clicks During Outage", type: "int" },
		{ label: "Click Percentage of top performers", type: "percent" },
		{ label: "Baseline Average Order Amount", type: "dollar" },
		{ label: "Baseline Conversion", type: "percent" },
		{ label: "Estimated Sales by AOV and Conversion", type: "dollar" },
		{ label: "Estimated Sales by Click Persentage", type: "dollar" },
		{ label: "Average of Estimated Totals", type: "dollar" },
		{ label: "Expected Affiliate Commission ", type: "dollar" },
		{ label: "Expected Network Commission ", type: "dollar" },
	];
	const table = [];
	const totals = {
		aCommissionTotal: 0,
		nCommissionTotal: 0,
		overallTotal: 0,
		salesTotal: 0,
		nRate: "",
		cRate: "",
	};
	let totalClicks = 0;
	const SortedByClicks = outageReport.sort(
		(a, b) => b["Click Throughs"] - a["Click Throughs"]
	);
	for (let j = 0; j < affiliateCount; j++) {
		totalClicks = totalClicks + Number(SortedByClicks[j]["Click Throughs"]);
	}
	for (let i = 0; i < affiliateCount; i++) {
		const match =
			baselineReport[i] && typeof baselineReport[i] === "object"
				? baselineReport[i]
				: {};
		const aCommission =
			Number(SortedByClicks[i]["Commissions"]) /
			Number(SortedByClicks[i]["Sales"]);
		const nCommission =
			Number(SortedByClicks[i]["Network Commissions"]) /
			Number(SortedByClicks[i]["Sales"]);
		const clickPercentage =
			(Number(SortedByClicks[i]["Click Throughs"]) / totalClicks) * 100;
		const estimatedAOV =
			Number(SortedByClicks[i]["Conversion Rate"]) *
			Number(SortedByClicks[i]["Click Throughs"]) *
			Number(SortedByClicks[i]["Average Sale Amount"]);
		const estimateOnClicks = clickPercentage * discrepency;
		const averageEstimate = (estimatedAOV + estimateOnClicks) / 2;
		table.push([
			SortedByClicks[i]["Affiliate Id"],
			SortedByClicks[i]["Affiliate Website Name"],
			Number(SortedByClicks[i]["Click Throughs"]),
			clickPercentage,
			Number(SortedByClicks[i]["Average Sale Amount"]),
			Number(SortedByClicks[i]["Conversion Rate"]),
			estimatedAOV,
			estimateOnClicks,
			averageEstimate,
			averageEstimate * aCommission,
			averageEstimate * nCommission,
		]);
		console.log(table);
		totals.aCommissionTotal =
			totals.aCommissionTotal + averageEstimate * aCommission;
		totals.nCommissionTotal =
			totals.nCommissionTotal + averageEstimate * nCommission;
		totals.salesTotal =
			totals.salesTotal + Number(SortedByClicks[i]["Sales"]);
		totals.overallTotal = totals.aCommissionTotal + totals.nCommissionTotal;
	}
	totals.cRate = totals.aCommissionTotal / totals.salesTotal;
	totals.nRate = totals.nCommissionTotal / totals.salesTotal;
	const results = { headers, table };
	setOutageTable(results);
	setEstimatedTotals(totals);

	return;
};
