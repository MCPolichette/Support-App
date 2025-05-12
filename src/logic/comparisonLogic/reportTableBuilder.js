import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import ColumnMapTable from "../../components/tables/columnMapTable";
import { PerfSummaryTableMap } from "./performanceSummaryMap";
import { AttributeDelta } from "./productSoldMaps";

function ProductAttributeDeltaTables({
	data,
	reports,
	currentDates,
	previousDates,
}) {
	const safeData = Array.isArray(data) ? data : [data];
	const fieldsToCheck = [
		"Department",
		"Category",
		"Sub Category",
		"Brand Name",
	];
	const getReport = (text) => reports[text] ?? [];
	const productTables = fieldsToCheck
		.filter((field) =>
			safeData.some(
				(row) => row[field] && row[field].toString().trim() !== ""
			)
		)
		.map((field) =>
			AttributeDelta(
				[field],
				getReport("Product_Sold_current"),
				currentDates,
				getReport("Product_Sold_previous"),
				previousDates
			)
		);

	return (
		<>
			{productTables.map((field) => (
				<Col key={field.name} xs={12} className="mb-4">
					<ColumnMapTable
						tableMap={field.tableMap}
						table={field.deltaReport}
						limit={10}
					/>
				</Col>
			))}
		</>
	);
}

const ReportTableBuilder = ({ mid, reports, currentDates, previousDates }) => {
	const getReport = (text) => {
		return reports[text]?.[0];
	};
	const reportTitle = (text, dates) => {
		return text + " " + dates;
	};
	const performanceSummaryCurr = PerfSummaryTableMap(
		getReport("Performance_Summary_current"),
		currentDates
	).tableDisplay;
	const performanceSummaryPrev = PerfSummaryTableMap(
		getReport("Performance_Summary_previous"),
		currentDates
	).tableDisplay;

	return (
		<Container className="container mt-4">
			<Row>
				<ColumnMapTable
					topperText={reportTitle(
						"Performance Summary",
						currentDates.dateRange
					)}
					id={mid}
					tableMap={performanceSummaryCurr.headers}
					table={[performanceSummaryCurr.data]}
					limit={1}
				/>
				<ColumnMapTable
					title={previousDates.dateRange}
					tableMap={performanceSummaryPrev.headers}
					table={[performanceSummaryPrev.data]}
					limit={1}
				/>
			</Row>
			<Row>
				<h4>Product data for {currentDates.dateRange}</h4>
				<ProductAttributeDeltaTables
					data={getReport("Product_Sold_current")}
					reports={reports}
					currentDates={currentDates}
					previousDates={previousDates}
					limit={10}
				/>
			</Row>
		</Container>
	);
};

export default ReportTableBuilder;
