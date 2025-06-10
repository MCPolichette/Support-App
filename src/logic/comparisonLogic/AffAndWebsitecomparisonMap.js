import { Col } from "react-bootstrap";
import ColumnMapTable from "../../components/tables/columnMapTable";
import { PageBreaker } from "../../components/PDFelements";
import "../../components/tables/smallFontStyle.css";

function summarizeTransactions(data) {
	const refundTypes = ["RETURN", "CANCELED", "FRAUD", "REFUND"];

	const initializeSummary = () => ({
		saleAmount: 0,
		refundAmount: 0,
		totalCommission: 0,
	});
	const byWebsite = {};
	const byAffiliate = {};
	for (const row of data) {
		const websiteId = row["Website Id"];
		const affiliateId = row["Affiliate Id"];
		const type = row["Transaction Type"];
		const amount = parseFloat(row["Transaction Amount"]) || 0;
		const totalCommission = parseFloat(row["Total Commission"]) || 0;
		const networkCommission = parseFloat(row["Network Commission"]) || 0;

		if (!byWebsite[websiteId]) byWebsite[websiteId] = initializeSummary();
		if (!byAffiliate[affiliateId])
			byAffiliate[affiliateId] = initializeSummary();

		const isSale = type === "SALE";
		const isRefund = refundTypes.includes(type);

		if (isSale) {
			byWebsite[websiteId].saleAmount += amount;
			byAffiliate[affiliateId].saleAmount += amount;
		} else if (isRefund) {
			byWebsite[websiteId].refundAmount += amount;
			byAffiliate[affiliateId].refundAmount += amount;
		}

		byWebsite[websiteId].totalCommission +=
			totalCommission + networkCommission;
		byAffiliate[affiliateId].totalCommission +=
			totalCommission + networkCommission;
	}

	return { byWebsite, byAffiliate };
}

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
export const AffDelta = (
	aff_or_web,
	reportC,
	datesC,
	reportP,
	datesP,
	SCDc,
	SCDp
) => {
	let deltaReport = [];
	const tableData = () => {
		let arr = [];
		Object.entries(reportC).forEach(([i, curr]) => {
			// FORMULA FOR EACH DETERMINED FIELD  / GROSS AOV SPEND ROA
			const identifier = `${aff_or_web} Id`; // e.g., "Affiliate Id"
			const reportType = "by" + aff_or_web; // e.g., "byAffiliate"
			const determineKey = (term) => {
				if (term === "Affiliate") {
					return "Affiliate Name";
				} else {
					if (term === "Website") {
						return "Affiliate Website";
					}
				}
			};

			const salesDetailsData = (SDCReport) => {
				const perfId = curr[identifier];
				const y = SDCReport[reportType];
				const grossSales = y[perfId]?.saleAmount ?? 0;
				const totalSpend = y[perfId]?.totalCommission ?? 0;
				return { grossSales, totalSpend };
			};
			const perfDetailsC = salesDetailsData(SCDc);
			const perfDetailsP = salesDetailsData(SCDp);
			const match = reportP[i] || {};
			const pName = determineKey(aff_or_web);

			arr.push([
				//Title
				curr[pName],
				//Clicks
				curr["Click Throughs"],
				match["Click Throughs"],
				match["Click Throughs"] / curr["Click Throughs"],
				curr["Click Throughs"] - match["Click Throughs"],
				//Sales
				curr["Sales"],
				match["Sales"],
				match["Sales"] / curr["Sales"],
				curr["Sales"] - match["Sales"],
				//Gross Sales
				perfDetailsC.grossSales,
				perfDetailsP.grossSales,
				perfDetailsP.grossSales / perfDetailsP.grossSales,
				(perfDetailsP.grossSales, -perfDetailsP.grossSales),
				//Number of Sales
				curr["# of Sales"],
				match["# of Sales"],
				percentChange(curr["# of Sales"], match["# of Sales"]),
				demandChange(curr["# of Sales"], match["# of Sales"]),
				curr[pName],

				//===================
				//Conversion Rate
				curr["Conversion Rate"] * 0.01,
				match["Conversion Rate"] * 0.01,
				match["Conversion Rate"] / curr["Conversion Rate"],
				curr["Conversion Rate"] - match["Conversion Rate"],
				// AOV
				curr["Sales"] / curr["# of Sales"],
				match["Sales"] / match["# of Sales"],
				match["Sales"] /
					match["# of Sales"] /
					curr["Sales"] /
					curr["# of Sales"],
				curr["Sales"] / curr["# of Sales"] -
					match["Sales"] / match["# of Sales"],
				//Total Spend
				perfDetailsC.totalSpend,
				perfDetailsP.totalSpend,
				perfDetailsC.totalSpend / perfDetailsP.totalSpend,
				(perfDetailsC.totalSpend, -perfDetailsP.totalSpend),
				//ROA  Sales
				curr["Sales"] / perfDetailsC.totalSpend,
				match["Sales"] / perfDetailsP.totalSpend,
				curr["Sales"] /
					perfDetailsC.totalSpend /
					match["Sales"] /
					perfDetailsP.totalSpend,
				(curr["Sales"] / perfDetailsC.totalSpend,
				-match["Sales"] / perfDetailsP.totalSpend),
				//AOV
				curr["Sales"] / curr["# of Sales"],
				match["Sales"] / match["# of Sales"],
				perfDetailsP.totalSpend /
					match["Sales"] /
					perfDetailsC.totalSpend /
					curr["Sales"],
				perfDetailsC.totalSpend / curr["Sales"] -
					perfDetailsP.totalSpend / match["Sales"],
				curr["New Customer %"] * 0.01,
				match["New Customer %"] * 0.01,
				match["New Customer %"] / curr["New Customer %"],
				curr["New Customer %"] - match["New Customer %"],
			]);
		});

		return arr.sort((a, b) => b[5] - a[5]); // sort by currQty (index 1)
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
		{
			label: aff_or_web,
			type: "text",
			className: " border-right  border-dark text-truncate name-cell",
		},
		{
			label: "Clicks Throughs " + datesC.year,
			className: "small-cell",
			type: "int",
		},
		{
			label: "Clicks Throughs " + datesP.year,
			className: "small-cell",
			type: "int",
		},
		{
			label: datesC.year + " vs " + datesP.year + " % Change ",
			className: "small-cell",
			type: "percent",
		},
		{
			label: datesC.year + " vs " + datesP.year + " Change",
			className: "small-cell border-right  border-dark",
			type: "int",
		},
		{
			label: "Sales " + datesC.year,
			className: "small-cell",
			type: "dollar",
		},
		{
			label: "Sales " + datesP.year,
			className: "small-cell",
			type: "dollar",
		},

		{
			label: datesC.year + " vs " + datesP.year + " % Change ",
			className: "small-cell",
			type: "percent",
		},
		{
			label: datesC.year + " vs " + datesP.year + " Change",
			className: "small-cell border-right  border-dark table-sm-text",
			type: "dollar",
		},
		{
			label: "Gross Sales " + datesC.year,
			className: "small-cell",
			type: "dollar",
		},
		{
			label: "Gross Sales " + datesP.year,
			className: "small-cell",
			type: "dollar",
		},
		{
			label: datesC.year + " vs " + datesP.year + " % Change",
			className: "small-cell",
			type: "percent",
		},
		{
			label: datesC.year + " vs " + datesP.year + " Change",
			className: "small-cell border-right  border-dark",
			type: "dollar",
		},
		{
			label: "# of Sales " + datesC.year,
			className: "small-cell",
			type: "int",
		},
		{
			label: "# of Sales " + datesP.year,
			className: "small-cell",
			type: "int",
		},
		{
			label: datesC.year + " vs " + datesP.year + " % Change",
			className: "small-cell",
			type: "percent",
		},
		{
			label: datesC.year + " vs " + datesP.year + "Change",
			className: "small-cell border-right  border-dark",
			type: "int",
		},
		{
			label: aff_or_web,
			className:
				"name-cell border-right border-left border-dark text-truncate",
			type: "text",
		},

		{
			label: "Conversion Rate " + datesC.year,
			className: "small-cell",
			type: "percent",
		},
		{
			label: "Conversion Rate " + datesP.year,
			className: "small-cell",
			type: "percent",
		},
		{
			label: datesC.year + " vs " + datesP.year + " % Change",
			className: "small-cell",
			type: "percent",
		},
		{
			label: datesC.year + " vs " + datesP.year + " Change",
			className: "border-right  border-dark small-cell",
			type: "percent",
		},
		{
			label: "AOV " + datesC.year,
			className: "small-cell",
			type: "dollar",
		},
		{
			label: "AOV " + datesP.year,
			className: "small-cell",
			type: "dollar",
		},
		{
			label: datesC.year + " vs " + datesP.year + " % Change",
			className: "small-cell",
			type: "percent",
		},
		{
			label: datesC.year + " vs " + datesP.year + " Change",
			className: "border-right  border-dark small-cell",
			type: "dollar",
		},
		{
			label: "Total Spend " + datesC.year,
			className: "small-cell",
			type: "dollar",
		},
		{
			label: "Total Spend " + datesP.year,
			className: "small-cell",
			type: "dollar",
		},
		{
			label: datesC.year + " vs " + datesP.year + " % Change",
			className: "small-cell",
			type: "percent",
		},
		{
			label: datesC.year + " vs " + datesP.year + " Change",
			className: "border-right  border-dark small-cell",
			type: "dollar",
		},
		{
			label: "ROA " + datesC.year,
			className: "small-cell",
			type: "dollar",
		},
		{
			label: "ROA " + datesP.year,
			className: "small-cell",
			type: "dollar",
		},
		{
			label: datesC.year + " vs " + datesP.year + " ROA % Change",
			className: "small-cell",
			type: "percent",
		},
		{
			label: datesC.year + " vs " + datesP.year + " ROA Change",
			className: "border-right  border-dark small-cell",
			type: "dollar",
		},

		{
			label: "New Customer % " + datesC.year,
			className: "small-cell",
			type: "percent",
		},
		{
			label: "New Customer % " + datesP.year,
			className: "small-cell",
			type: "percent",
		},
		{
			label: datesC.year + " vs " + datesP.year + " % Change",
			className: "small-cell",
			type: "percent",
		},
		{
			label: datesC.year + " vs " + datesP.year + " Change",
			className: "border-right  border-dark small-cell",
			type: "percent",
		},
	];
	return { tableMap, deltaReport };
};
export const Aff_And_Website_Map = ({
	reports,
	currentDates,
	previousDates,
	mid,
}) => {
	console.log(reports);
	const getReport = (text) => {
		return reports[text]?.[0];
	};
	const reportDates = currentDates.dateRange;
	const data = getReport("Performance_Summary_By_Affiliate_current");
	const safeData = Array.isArray(data) ? data : [data];
	const fieldsToCheck = ["", ""];
	const totalsSCDc = summarizeTransactions(
		reports["Sales_Commissions_Detail_current"]
	);
	const totalsSCDp = summarizeTransactions(
		reports["Sales_Commissions_Detail_previous"]
	);
	const perfByWebsiteC =
		reports["Performance_Summary_By_Affiliate_Website_current"];
	const perfByWebsiteP =
		reports["Performance_Summary_By_Affiliate_Website_previous"];
	const perfByAffC = reports["Performance_Summary_By_Affiliate_current"];
	const perfByAffP = reports["Performance_Summary_By_Affiliate_previous"];
	const affiliateReport = AffDelta(
		"Affiliate",
		perfByAffC,
		currentDates,
		perfByAffP,
		previousDates,
		totalsSCDc,
		totalsSCDp
	);
	const websiteReport = AffDelta(
		"Website",
		perfByWebsiteC,
		currentDates,
		perfByWebsiteP,
		previousDates,
		totalsSCDc,
		totalsSCDp
	);

	return (
		<>
			<ColumnMapTable
				id={mid}
				topperText={"Affiliate Top Performance Report"}
				title={"Affiliate Top Performers " + reportDates}
				tableMap={affiliateReport.tableMap.slice(0, 17)}
				table={affiliateReport.deltaReport.map((row) =>
					row.slice(0, 17)
				)}
				limit={10}
			/>
			<ColumnMapTable
				title={" - Affiliate Top Performers (continued)"}
				tableMap={affiliateReport.tableMap.slice(17, 34)}
				table={affiliateReport.deltaReport.map((row) =>
					row.slice(17, 34)
				)}
				limit={10}
			/>
			<PageBreaker />
			<ColumnMapTable
				topperText={"Website Top Performance Report"}
				title={"Website Top Performers " + reportDates}
				tableMap={websiteReport.tableMap.slice(0, 17)}
				table={websiteReport.deltaReport.map((row) => row.slice(0, 17))}
				limit={10}
			/>
			<ColumnMapTable
				title={" - Website Top Performers (continued)"}
				tableMap={websiteReport.tableMap.slice(17, 34)}
				table={websiteReport.deltaReport.map((row) =>
					row.slice(17, 34)
				)}
				limit={10}
			/>
		</>
	);
};
