import React from "react";
import { Card } from "react-bootstrap";
import { Chart } from "react-google-charts";
import { formatDateShort } from "../../utils/getTime";

const YoySalesConversionChart = ({
	data,
	title = "YoY Sales vs CR",
	hAxisTitle,
}) => {
	if (!data || !data.current || !data.previous) return null;
	const dayOrMonth = () => {
		if (data[0].Weekday) {
			return "WeekDay";
		} else if (data[0].Month) {
			return "Month";
		}
	};

	const chartData = [
		[
			"Weekday",
			"Sales",
			"Conversion Rate",
			"Previous Sales",
			"Previous Conversion Rate",
		],
		...data.current.map((day, i) => [
			day.hAxisTitle,
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
			0: { title: "Sales", format: "$#,###" },
			1: { title: "Conversion Rate", format: "#%" },
		},
		series: {
			0: { type: "bars", targetAxisIndex: 0, color: "rgb(17, 17, 160)" },
			1: { type: "line", targetAxisIndex: 1, color: "rgb(17, 17, 160)" },
			2: {
				type: "bars",
				targetAxisIndex: 0,
				color: "grey",
			},
			3: {
				type: "line",
				targetAxisIndex: 1,
				color: "grey",
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
