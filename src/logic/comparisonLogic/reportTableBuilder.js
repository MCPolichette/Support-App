import React from "react";
import ColumnMapTable from "./ColumnMapTable"; // uses the version we just built

const ReportTableBuilder = ({ reports }) => {
	const PSC = reports["Performance_Summary_current"]?.[0];
	const PSP = reports["Performance_Summary_previous"]?.[0];

	const PerfSummaryTableMap = [
		{ label: "Year", value: "Current", type: "text" },
		{ label: "Sales", value: PSC?.["Sales"], type: "dollar" },
		{ label: "Clicks", value: PSC?.["Click Throughs"], type: "int" },
		{ label: "# of Sales", value: PSC?.["# of Sales"], type: "int" },
		{
			label: "Avg Order Amount",
			value: PSC?.["Average Sale Amount"],
			type: "dollar",
		},
		{
			label: "Conversion Rate",
			value: PSC?.["Conversion Rate"],
			type: "percent",
		},
		{
			label: "New Customer %",
			value: PSC?.["New Customer %"],
			type: "percent",
		},
		{
			label: "Mobile Sales",
			value: PSC?.["Mobile Sales"],
			type: "dollar",
			className: "bg-light border-start border-2 border-dark",
		},
	];

	const PerfSummaryTableMapPrev = [
		{ label: "Year", value: "Previous", type: "text" },
		{ label: "Sales", value: PSP?.["Sales"], type: "dollar" },
		{ label: "Clicks", value: PSP?.["Click Throughs"], type: "int" },
		{ label: "# of Sales", value: PSP?.["# of Sales"], type: "int" },
		{
			label: "Avg Order Amount",
			value: PSP?.["Average Sale Amount"],
			type: "dollar",
		},
		{
			label: "Conversion Rate",
			value: PSP?.["Conversion Rate"],
			type: "percent",
		},
		{
			label: "New Customer %",
			value: PSP?.["New Customer %"],
			type: "percent",
		},
		{
			label: "Mobile Sales",
			value: PSP?.["Mobile Sales"],
			type: "dollar",
			className: "bg-light border-start border-2 border-dark",
		},
	];

	return (
		<div className="container mt-4">
			<h3>Performance Summary Report</h3>
			<ColumnMapTable
				title="Performance Summary - Current"
				tableMap={PerfSummaryTableMap}
			/>
			<ColumnMapTable
				title="Performance Summary - Previous"
				tableMap={PerfSummaryTableMapPrev}
			/>
		</div>
	);
};

export default ReportTableBuilder;
