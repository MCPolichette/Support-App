import React from "react";
import ColumnMapTable from "../../components/tables/columnMapTable";
import {
	PerfSummaryTableMap,
	PerfSummaryTableMapPrev,
} from "./performanceSummaryMap";
import { AttributeDelta } from "./productSoldMaps";

const ReportTableBuilder = ({ reports, currentDates, previousDates }) => {
	console.log(currentDates, previousDates);
	const getReport = (text) => {
		return reports[text]?.[0];
	};
	const reportTitle = (text, dates) => {
		console.log(dates);
		return text + " " + dates;
	};

	return (
		<div className="container mt-4">
			<ColumnMapTable
				title={reportTitle(
					"Performance Summary",
					currentDates.dateRange
				)}
				tableMap={PerfSummaryTableMap(
					getReport("Performance_Summary_current"),
					currentDates
				)}
			/>
			<ColumnMapTable
				title={reportTitle(
					"Performance Summary",
					previousDates.dateRange
				)}
				tableMap={PerfSummaryTableMapPrev(
					getReport("Performance_Summary_previous"),
					previousDates
				)}
			/>

			{/* TODO:  MAP out Dept, cat, subcat, brand IF THEY EXIST Below.   The Attribute Delta is experiencing some errors about the data.foreach */}
			<ColumnMapTable
				title="Products"
				tableMap={AttributeDelta(
					"Department",
					getReport("Product_Sold_current"),
					currentDates,
					getReport("Product_Sold_previous", previousDates)
				)}
			/>
		</div>
	);
};

export default ReportTableBuilder;
