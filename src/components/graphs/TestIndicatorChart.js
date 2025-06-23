import { Chart } from "react-google-charts";

const data = [
	["Date", "Value", { role: "style" }, { role: "annotation" }],
	["01", 100, "color: #888", "Baseline"],
	["02", 120, "color: #888", null],
	["03", 130, "color: #888", null],
	["04", 140, "color: #888", null],
	["05", 110, "color: #888", null],
	// ...
	["12", 115, "color: #888", "End Baseline"],
	["13", 180, "color: #4caf50", "Test"],
	["14", 190, "color: #4caf50", null],
	["15", 200, "color: #4caf50", null],
	["16", 210, "color: #4caf50", "End Test"],
];

const options = {
	title: "Daily Values with Period Indicators",
	legend: "none",
	annotations: {
		alwaysOutside: true,
		textStyle: {
			fontSize: 12,
			color: "#000",
		},
	},
	hAxis: {
		title: "Day of Month",
	},
	vAxis: {
		title: "Value",
	},
};

export default function TestIndicatorChart() {
	return (
		<Chart
			chartType="ColumnChart"
			width="100%"
			height="400px"
			data={data}
			options={options}
		/>
	);
}
