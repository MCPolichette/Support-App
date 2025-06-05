import React from "react";
import { Card } from "react-bootstrap";
import { Chart } from "react-google-charts";
import { formatDateShort } from "../../utils/getTime";

const YoySalesConversionChart = ({ data, title = "YoY Sales vs CR" }) => {
	console.log(data);
	if (!data || !data.current || !data.previous) return null;

	const chartData = [
		[
			"Weekday",
			"Sales",
			"Conversion Rate",
			"Previous Sales",
			"Previous Conversion Rate",
		],
		...data.current.map((day, i) => [
			day.Weekday,
			Number(day.Sales),
			Number(day["Conversion Rate"]) / 100,
			Number(data.previous[i]?.Sales ?? 0),
			Number(data.previous[i]?.["Conversion Rate"] ?? 0) / 100,
		]),
	];

	const options = {
		fontSize: 10,
		title,
		width: "80%",
		height: "100%",
		hAxis: {
			title: "Performance By Day",
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
			0: { type: "bars", targetAxisIndex: 0, color: "#3366cc" },
			1: { type: "line", targetAxisIndex: 1, color: "#3366cc" },
			2: { type: "bars", targetAxisIndex: 0, color: "#f45850" },
			3: { type: "line", targetAxisIndex: 1, color: "#f45850" },
		},
		legend: { position: "in" },
	};

	return (
		<Card className="pdfGraphCard">
			<Card.Body>
				<Chart
					chartType="ComboChart"
					data={chartData}
					options={options}
					width="100%"
					height="100%"
					loader={<div>Loading Chart...</div>}
				/>
			</Card.Body>
		</Card>
	);
};

export default YoySalesConversionChart;
