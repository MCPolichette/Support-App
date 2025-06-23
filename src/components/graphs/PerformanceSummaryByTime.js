import React from "react";
import { Chart } from "react-google-charts";

const PerformanceSummaryByTimeGraph = ({
	data,
	title,
	hAxisTitle,
	outageDates,
	baselineDays,
}) => {
	if (!data) return null;
	const referenceDate = new Date(`${outageDates.start}T00:00:00`);
	const baseLineStart = new Date(baselineDays.start);
	const baseLineEnd = new Date(baselineDays.end);
	baseLineEnd.setDate(baseLineEnd.getDate() + 1); // This logic works.. but something is odd here.
	const clickChart = [
		["Date", "Clicks", { role: "style" }, { role: "annotation" }],
		...data.map((day, i) => {
			const dayDate = new Date(`${day.Date}T00:00:00`);
			const clicks = Number(day["Click Throughs"]);
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

			return [day.Date, clicks, color, label];
		}),
	];
	const salesChart = [
		["Date", "Sales", { role: "style" }, { role: "annotation" }],
		...data.map((day, i) => {
			const dayDate = new Date(`${day.Date}T00:00:00`);
			const sales = Number(day["Sales"]);
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

			return [day.Date, sales, color, label];
		}),
	];
	const commonOptions = {
		title,
		fontSize: 10,
		hAxis: {
			title: hAxisTitle,
			textStyle: { fontSize: 8, color: "#333" },
			slantedText: true,
			slantedTextAngle: 19,
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
					vAxes: { 0: { title: "Clicks", format: "#" } },
					series: {
						0: {
							type: "bars",
							targetAxisIndex: 0,
							color: "#354cbe",
						},
					},
				}}
				width="100%"
				height="200px"
				loader={<div>Loading Chart...</div>}
			/>
			<h6>Sales Performance Summary by Day</h6>
			<Chart
				chartType="ColumnChart"
				data={salesChart}
				options={{
					...commonOptions,
					vAxes: { 0: { title: "Sales", format: "#" } },
				}}
				width="100%"
				height="200px"
				loader={<div>Loading Chart...</div>}
			/>
		</div>
	);
};

export default PerformanceSummaryByTimeGraph;
