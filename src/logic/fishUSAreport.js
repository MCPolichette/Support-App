import { runAPI } from "../utils/apiRunner";
import { exportToCSV } from "../utils/exportCSV";

function getDateRange(startDate, endDate) {
	const range = [];
	let current = new Date(startDate);
	const end = new Date(endDate);

	while (current <= end) {
		range.push(new Date(current).toISOString().split("T")[0]);
		current.setDate(current.getDate() + 1);
	}

	return range;
}

function formatDateString(iso) {
	const [year, month, day] = iso.split("-");
	return `${+month}/${+day}/${year}`;
}

export async function runFishUSAReport({
	uuid,
	startDate,
	endDate,
	onComplete,
}) {
	const dates = getDateRange(startDate, endDate);
	const merchant = { id: 27457 };
	const finalResults = [];

	for (const date of dates) {
		const [mod20Xml, mod15Xml] = await Promise.all([
			runAPI(
				{
					report_id: 20,
					startDate: date,
					endDate: date,
					type: "Module_20",
					networkCode: "US",
					merchant_id: merchant.id,
				},
				uuid,
				merchant
			),
			runAPI(
				{
					report_id: 15,
					startDate: date,
					endDate: date,
					type: "Module_15",
					networkCode: "US",
					merchant_id: merchant.id,
				},
				uuid,
				merchant
			),
		]);

		const mod20Data = parseXMLtoArray(mod20Xml);
		const mod15Data = parseXMLtoArray(mod15Xml);
		const merged = mergeReportData(mod20Data, mod15Data, date);
		finalResults.push(...merged);
	}

	const headers = [
		"Affiliate Website",
		"Affiliate Classic ID",
		"Day",
		"Impressions",
		"Clicks",
		"Orders",
		"Sales",
		"Affiliate Total Earnings",
		"Network Total Earnings",
		"Total Cost",
		"Conversion Rate",
		"Average Order Amount",
		"Affiliate Sale Commission",
		"Network Sale Commission",
		"Sale Commission",
		"Adjusted Affiliate Earnings",
		"Adjusted Cost",
		"Adjusted Network Earnings",
		"Adjusted Sales",
		"Adjustments",
		"Reversal Rate",
	];

	const mapped = finalResults.map((row) => ({
		"Affiliate Website": row.Affiliate_Website,
		"Affiliate Classic ID": row.Affiliate_ID,
		Day: row.Date,
		Impressions: row.Ad_Impressions,
		Clicks: row.Click_Throughs,
		Orders: row.Number_of_Sales,
		Sales: row.Sales,
		"Affiliate Total Earnings": row.Commissions,
		"Network Total Earnings": row.Network_Commissions,
		"Total Cost": row.Total_Commissions,
		"Conversion Rate": row.Conversion_Rate,
		"Average Order Amount": row.Average_Order_Amount,
		"Affiliate Sale Commission": row["15Commission"],
		"Network Sale Commission": row.Network_Commission,
		"Sale Commission": row["15Total_Commissions"],
		"Adjusted Affiliate Earnings": row["15Adjusted_Commissions"],
		"Adjusted Cost": row["15Total_Adjusted"],
		"Adjusted Network Earnings": row["15Adjusted_Network_Earnings"],
		"Adjusted Sales": row["15Adjusted_Sales"],
		Adjustments: row.Number_of_Adjustments,
		"Reversal Rate": row["15Reversal_Rate"],
	}));

	const filename = `FishUSA_customReport_${startDate}_to_${endDate}.csv`;
	exportToCSV(mapped, filename, headers);

	if (onComplete) onComplete(mapped);
}

function parseXMLtoArray(xml) {
	const rows = [];
	const entries = xml.getElementsByTagName("Table1");
	for (let i = 0; i < entries.length; i++) {
		const row = {};
		const children = entries[i].children;
		for (let j = 0; j < children.length; j++) {
			row[children[j].tagName] = children[j].textContent;
		}
		rows.push(row);
	}
	return rows;
}

function mergeReportData(mod20Rows, mod15Rows, date) {
	return mod20Rows
		.map((row20) => {
			const matching15 = mod15Rows.find(
				(row15) => row15.Affiliate_Id === row20.Affiliate_Id
			);

			const mergedRow = {
				Affiliate_Website: row20.Affiliate_Website || "",
				Affiliate_ID: row20.Affiliate_Id,
				Date: formatDateString(date),
				Ad_Impressions: row20.Ad_Impressions,
				Click_Throughs: row20.Click_Throughs,
				Number_of_Sales: row20.Number_of_Sales,
				Sales: row20.Sales,
				Commissions: row20.Commissions,
				Network_Commissions: row20.Network_Commissions,
				Total_Commissions: add(
					row20.Commissions,
					row20.Network_Commissions
				),
				Conversion_Rate: row20.Conversion_Rate,
				Average_Order_Amount: matching15?.Average_Sale_Amount || "",
				"15Commission": matching15?.Commissions || "",
				Network_Commission: matching15?.Network_Commissions || "",
				"15Total_Commissions": add(
					matching15?.Commissions,
					matching15?.Network_Commissions
				),
				"15Adjusted_Commissions":
					matching15?.Adjusted_Commissions || "",
				"15Total_Adjusted": add(
					matching15?.Adjusted_Commissions,
					matching15?.Adjusted_Network_Earnings
				),
				"15Adjusted_Network_Earnings":
					matching15?.Adjusted_Network_Earnings || "",
				"15Adjusted_Sales": matching15?.Adjusted_Sales || "",
				Number_of_Adjustments: row20.Number_of_Adjustments,
				"15Reversal_Rate": matching15?.Reversal_Rate || "",
			};

			return hasPerformance(mergedRow) ? mergedRow : null;
		})
		.filter(Boolean);
}

function hasPerformance(row) {
	return Object.entries(row).some(([key, value]) => {
		if (["Affiliate_Website", "Affiliate_ID", "Date"].includes(key))
			return false;
		return (
			value !== "" &&
			value !== "$0.00" &&
			value !== "0.00%" &&
			value !== "0"
		);
	});
}

function add(a, b) {
	const numA = parseFloat(a?.replace(/[^\d.-]+/g, "")) || 0;
	const numB = parseFloat(b?.replace(/[^\d.-]+/g, "")) || 0;
	return (numA + numB).toFixed(2);
}
