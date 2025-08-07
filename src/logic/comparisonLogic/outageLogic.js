export const SummaryReportTable = ({
	setSummaryTable,
	baseSummary,
	outageSummary,
}) => {
	setSummaryTable({
		headers: [
			{ label: "Summary:", type: "string" },
			{ label: "Clicks", type: "int" },
			{ label: "Sales", type: "dollar" },
			{ label: "Average Order Amt (AOV)", type: "dollar" },
			{ label: "Number of Sales", type: "int" },
			{
				label: "Conversion Rate",
				type: "percent",
			},
		],
		table: [
			[
				"Baseline Period",
				baseSummary["Click Throughs"],
				baseSummary["Sales"],
				baseSummary["Average Sale Amount"],
				baseSummary["# of Sales"],
				baseSummary["Conversion Rate"],
			],
			[
				"Outage Period",
				outageSummary["Click Throughs"],
				outageSummary["Sales"],
				outageSummary["# of Sales"],
				outageSummary["Average Sale Amount"],
				outageSummary["Conversion Rate"],
			],
		],
	});
};
export function outagePerformance(reports, limit) {
	const tableArray = reports[
		"Performance_Summary_By_Affiliate_Website_current"
	]
		.sort((a, b) => {
			return parseFloat(b["Click Throughs"] - a["Click Throughs"]);
		})
		.slice(0, limit);
	console.log(tableArray);
	const baseData =
		reports["Performance_Summary_By_Affiliate_Website_previous"];
	let totalSales = 0;
	let totalClicks = 0;
	const row = [];
	const troubleAffs = [];
	Object.entries(tableArray).forEach(([i, webAff]) => {
		if (!webAff || typeof webAff != "object") return;
		totalClicks = totalClicks + webAff["Click Throughs"];
		totalClicks = totalSales + webAff["Sales"];
		const websiteId = webAff["Website Id"];
		const match = baseData.find((row) => row["Website Id"] === websiteId);
		if (!match) {
			webAff.error = "Made No Sales during the Base Period";
			troubleAffs.push(webAff);
			console.log(webAff);
			return;
		}
		console.log(match["Sales"] || "0");
		const aCommission =
			Number(webAff["Commissions"]) / Number(webAff["Sales"]);
		const nCommission =
			Number(webAff["Network Commissions"]) / Number(webAff["Sales"]);
		const clickPercentage =
			(Number(webAff["Click Throughs"]) / totalClicks) * 100;
		const estimatedAOV =
			Number(webAff["Conversion Rate"]) *
			Number(webAff["Click Throughs"]) *
			Number(webAff["Average Sale Amount"]);
		row.push({
			AffId: webAff["Affiliate Id"],
			webId: webAff["Website Id"],
			webName: webAff["Affiliate Website Name"],
			oClicks: webAff["Click Throughs"],
			bClicks: match["Click Throughs"] || "0",
			oSales: webAff["Sales"],
			bSales: match["Sales"],
			conversionRate: Number(webAff["Conversion Rate"]),
			commissions: Number(webAff["Sales"]),
			aov: Number(webAff["Average Sale Amount"]),
		});
	});
	console.log(row);
}

export const build_Outage_Estimate_Table = ({
	outageReport,
	baselineReport,
	discrepency,
	setOutageTable,
	setEstimatedTotals,
	aovChoice,
}) => {
	console.log("RUNNING THE BUILD OUTAGE ESTIMATE TABLE");
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

	for (let j = 0; j < outageReport.length; j++) {
		totalClicks = totalClicks + Number(outageReport[j]["Click Throughs"]);
	}
	for (let i = 0; i < outageReport.length; i++) {
		const match =
			baselineReport[i] && typeof baselineReport[i] === "object"
				? baselineReport[i]
				: {};
		const aCommission =
			Number(outageReport[i]["Commissions"]) /
			Number(outageReport[i]["Sales"]);
		const nCommission =
			Number(outageReport[i]["Network Commissions"]) /
			Number(outageReport[i]["Sales"]);
		const clickPercentage =
			(Number(outageReport[i]["Click Throughs"]) / totalClicks) * 100;
		const estimatedAOV =
			Number(outageReport[i]["Conversion Rate"]) *
			Number(outageReport[i]["Click Throughs"]) *
			Number(outageReport[i]["Average Sale Amount"]);
		const estimateOnClicks = (clickPercentage * discrepency) / 100;
		const averageEstimate = (estimatedAOV + estimateOnClicks) / 2;
		table.push([
			outageReport[i]["Affiliate Id"],
			outageReport[i]["Affiliate Website Name"],
			Number(outageReport[i]["Click Throughs"]),
			clickPercentage,
			Number(outageReport[i]["Average Sale Amount"]),
			Number(outageReport[i]["Conversion Rate"]),
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
			totals.salesTotal + Number(outageReport[i]["Sales"]);
		totals.overallTotal = totals.aCommissionTotal + totals.nCommissionTotal;
	}
	totals.cRate = totals.aCommissionTotal / totals.salesTotal;
	totals.nRate = totals.nCommissionTotal / totals.salesTotal;
	const results = { headers, table };

	setEstimatedTotals(totals);
	setOutageTable(results);
	return;
};
