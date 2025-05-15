import { Col } from "react-bootstrap";
import ColumnMapTable from "../../components/tables/columnMapTable";

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
	console.log(byWebsite);
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
export const AttributeDelta = (
	attribute,
	reportC,
	datesC,
	reportP,
	datesP,
	totalsArr,
	SCDc,
	SCDp
) => {
	const attr = attribute;
	const name = attr[0];
	const fieldsToCheck = [
		"Department",
		"Category",
		"Sub Category",
		"Brand Name",
	];
	const totalsC = getTotals(reportC, attr, totalsArr);
	const totalsP = getTotals(reportP, attr, totalsArr);
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
		{
			label: attr[0],
			type: "text",
			className: " border-right  border-dark",
		},
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
			className: " border-right  border-dark",
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
export const Aff_And_Website_Map = ({
	reports,
	currentDates,
	previousDates,
}) => {
	const getReport = (text) => {
		console.log(reports);
		return reports[text]?.[0];
	};
	const data = getReport("Performance_Summary_By_Affiliate_current");
	const safeData = Array.isArray(data) ? data : [data];
	const fieldsToCheck = ["", ""];

	const totalsSCDc = summarizeTransactions(
		reports["Sales_Commissions_Detail_current"]
	);
	const totalsSCDp = summarizeTransactions(
		reports["Sales_Commissions_Detail_previous"]
	);
	console.log(totalsSCDc, currentDates);
	console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

	const standardReportC = "";
	const standardReportP = "";
	return <div>x</div>;
	// const productTables = fieldsToCheck
	// 	.filter((field) =>
	// 		safeData.some(
	// 			(row) => row[field] && row[field].toString().trim() !== ""
	// 		)
	// 	)
	// 	.map((field) =>
	// 		AttributeDelta(
	// 			[field],
	// 			getReport("Product_Sold_current"),
	// 			currentDates,
	// 			getReport("Product_Sold_previous"),
	// 			previousDates
	// 		)
	// 	);

	// return (
	// 	<>
	// 		{productTables.map((field) => (
	// 			<Col key={field.name} xs={12} className="mb-1">
	// 				<ColumnMapTable
	// 					tableMap={field.tableMap}
	// 					table={field.deltaReport}
	// 					limit={10}
	// 				/>
	// 				<ColumnMapTable
	// 					tableMap={field.tableMap}
	// 					table={field.deltaReport}
	// 					limit={10}
	// 				/>
	// 			</Col>
	// 		))}
	// 	</>
	// );
};
