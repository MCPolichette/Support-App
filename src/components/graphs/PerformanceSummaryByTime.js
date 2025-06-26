import React from "react";
import { Chart } from "react-google-charts";
const PerformanceSummaryByTimeGraph = ({
	data,
	title,
	outageDates,
	baselineDays,
	setBaseSummary,
}) => {
	if (!data) return null;
	const oSummary = { clicks: 0, sales: 0, numOfSales: 0 };
	const bSummary = { clicks: 0, sales: 0, numOfSales: 0 };
	const referenceDate = new Date(`${outageDates.start}T00:00:00`);
	const baseLineStart = new Date(baselineDays.start);
	const baseLineEnd = new Date(baselineDays.end);
	baseLineEnd.setDate(baseLineEnd.getDate() + 1);
	const clickChart = [
		[
			"Date",
			"Clicks",
			{ role: "style" },
			{ role: "annotation" },
			"Conversion Rate",
		],
		...data.map((day, i) => {
			const dayDate = new Date(`${day.Date}T00:00:00`);
			const clicks = Number(day["Click Throughs"]);
			const sales = Number(day["Sales"]);
			const numOfSales = Number(day["# of Sales"]);
			const conversionRate = Number(day["Conversion Rate"] ?? 0) / 100;
			let label = "";
			let color = "color:#8d8d98";
			const isBaseline = dayDate < baseLineEnd && dayDate > baseLineStart;
			const isOutage = dayDate >= referenceDate;
			const prevDay =
				i > 0 ? new Date(`${data[i - 1].Date}T00:00:00`) : null;
			const nextDay =
				i < data.length - 1
					? new Date(`${data[i + 1].Date}T00:00:00`)
					: null;
			if (isBaseline) {
				color = "color: green";
				//Process For applying setBaseSummary
				bSummary.clicks = bSummary.clicks + clicks;
				bSummary.sales = bSummary.sales + sales;
				bSummary.numOfSales = bSummary.numOfSales + numOfSales;
				if (!prevDay || prevDay <= baseLineStart) {
					label = "Baseline Start";
				} else if (!nextDay || nextDay >= baseLineEnd) {
					label = "Baseline End";
				}
			} else if (isOutage) {
				color = "color: red";
				oSummary.clicks = oSummary.clicks + clicks;
				oSummary.sales = oSummary.sales + sales;
				oSummary.numOfSales = oSummary.numOfSales + numOfSales;
				if (!prevDay || prevDay < referenceDate) {
					label = "Outage Start";
				} else if (i === data.length - 1) {
					label = "Outage End";
				}
			}
			return [day.Date, clicks, color, label, conversionRate];
		}),
	];

	const salesChart = [
		[
			"Date",
			"Sales Dollar Amount",
			"Number Of Sales",
			{ role: "style" },
			{ role: "annotation" },
		],
		...data.map((day, i) => {
			const dayDate = new Date(`${day.Date}T00:00:00`);
			const sales = Number(day["Sales"]);
			const numOfSales = Number(day["# of Sales"]);
			let label = "";
			let color = "color:#8d8d98";
			const isBaseline =
				dayDate <= baseLineEnd && dayDate > baseLineStart;
			const isOutage = dayDate >= referenceDate;
			const prevDay =
				i > 0 ? new Date(`${data[i - 1].Date}T00:00:00`) : null;
			const nextDay =
				i < data.length - 1
					? new Date(`${data[i + 1].Date}T00:00:00`)
					: null;
			if (isBaseline) {
				color = "color: green";
				if (!prevDay || prevDay <= baseLineStart) {
					label = "Baseline Start";
				} else if (!nextDay || nextDay >= baseLineEnd) {
					label = "Baseline End";
				}
			} else if (isOutage) {
				color = "color: red";
				if (!prevDay || prevDay < referenceDate) {
					label = "Outage Start";
				} else if (i === data.length - 1) {
					label = "Outage End";
				}
			}
			return [day.Date, sales, numOfSales, color, label];
		}),
	];
	const commonOptions = {
		title,
		fontSize: 10,
		hAxis: {
			textStyle: { fontSize: 8, color: "#333" },
			slantedText: true,
			slantedTextAngle: 40,
		},
		legend: { position: "in" },
	};
	return (
		<div>
			<h6>Click Performance Summary by Day</h6>
			<Chart
				chartType="ComboChart"
				data={clickChart}
				options={{
					...commonOptions,
					hAxisTitle: "Clicks and Conversion Rates",
					vAxes: {
						0: { title: "Clicks", format: "#" },
						1: { title: "Conversion Rate", format: "#%" },
					},
					series: {
						0: {
							type: "bars",
							targetAxisIndex: 0,
							color: "#8d8d98",
						},
						1: {
							type: "line",
							targetAxisIndex: 1,
							color: "#354cbe",
						},
					},
				}}
				width="100%"
				height="200px"
				loader={<div>Loading Chart...</div>}
			/>
			<p> Clicks and Conversions - 30 days prior to the outage</p>
			<hr />
			<h6>Sales Performance Summary by Day</h6>
			<Chart
				chartType="ColumnChart"
				data={salesChart}
				options={{
					...commonOptions,
					vAxes: {
						0: { title: "Sales in Dollars", format: "$#.##" },
						1: { title: "Number of Sales", format: "#" },
					},
					series: {
						1: {
							type: "bars",
							targetAxisIndex: 1,
							color: "#8d8d98",
						},
						0: {
							type: "line",
							targetAxisIndex: 0,
							color: "#354cbe",
						},
					},
				}}
				width="100%"
				height="200px"
				loader={<div>Loading Chart...</div>}
			/>
			<p>
				Number of Sales and Sales Totals - 30 days prior to the outage
			</p>
			<hr />
		</div>
	);
};

export default PerformanceSummaryByTimeGraph;
