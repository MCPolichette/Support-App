import React from "react";
import { Chart } from "react-google-charts";
const YoySalesConversionChart = ({
	data,
	title = "YoY Sales vs CR",
	hAxisTitle,
	TimeFormat,
}) => {
	if (!data || !data.current || !data.previous) return null;
	if (!TimeFormat) {
		TimeFormat = hAxisTitle;
	}

	const chartData = [
		[
			TimeFormat,
			"Sales",
			"Conversion Rate",
			"Previous Sales",
			"Previous Conversion Rate",
		],
		...data.current.map((day, i) => [
			day.TimeFormat,
			Number(day.Sales),
			Number(day["Conversion Rate"]) / 100,
			Number(data.previous[i]?.Sales ?? 0),
			Number(data.previous[i]?.["Conversion Rate"] ?? 0) / 100,
		]),
	];

	const options = {
		fontSize: 10,
		title,
		width: "100%",
		height: "100%",
		hAxis: {
			title: hAxisTitle,
			textStyle: {
				fontSize: 8,
				color: "#333",
			},
			slantedText: true,
			slantedTextAngle: 19,
		},
		vAxes: {
			0: { title: "Sales", format: "$#,##" },
			1: { title: "Conversion Rate", format: "#%" },
		},
		series: {
			0: { type: "bars", targetAxisIndex: 0, color: "#354cbe" },
			1: { type: "line", targetAxisIndex: 1, color: "#354cbe" },
			2: {
				type: "bars",
				targetAxisIndex: 0,
				color: "#8d8d98",
			},
			3: {
				type: "line",
				targetAxisIndex: 1,
				color: "#8d8d98",
			},
		},
		legend: { position: "in" },
	};

	return (
		<div>
			<Chart
				chartType="ComboChart"
				data={chartData}
				options={options}
				width="100%"
				height="100%"
				loader={<div>Loading Chart...</div>}
			/>
		</div>
	);
};

export default YoySalesConversionChart;
