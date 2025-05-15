import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import ColumnMapTable from "../../components/tables/columnMapTable";
import { PerfSummary, ProductSummary } from "./SingleReportSummaryMaps";
import { ProductAttributeDeltaTables } from "./productSoldMaps";
import { Aff_And_Website_Map } from "./AffAndWebsiteComparisonMap";
const ReportTableBuilder = ({ mid, reports, currentDates, previousDates }) => {
	console.log(reports);
	const getReport = (text) => {
		return reports[text]?.[0];
	};
	const reportTitle = (text, dates) => {
		return text + " " + dates;
	};
	const performanceSummaryCurr = PerfSummary(
		getReport("Performance_Summary_current"),
		currentDates
	).tableDisplay;
	const performanceSummaryPrev = PerfSummary(
		getReport("Performance_Summary_previous"),
		previousDates
	).tableDisplay;
	const productSummaryTable = ProductSummary(
		getReport("Product_Sold_current"),
		currentDates
	).tableDisplay;

	return (
		<Container className="container mt-4">
			<Row className="mb-5">
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
			<hr />
			<Row className="mb-5">
				<h4>Product data for {currentDates.dateRange}</h4>
				<ProductAttributeDeltaTables
					data={getReport("Product_Sold_current")}
					reports={reports}
					currentDates={currentDates}
					previousDates={previousDates}
					totalsArr={[
						"Sale Count ",
						"Total Product Sale Quantity",
						"Total Product Sale Amount",
					]}
					limit={10}
				/>
				<ColumnMapTable
					tableMap={productSummaryTable.headers}
					table={[productSummaryTable.data]}
					limit={10}
				/>
			</Row>
			<hr />
			<Row>
				<Aff_And_Website_Map
					reports={reports}
					currentDates={currentDates}
					previousDates={previousDates}
				/>

				{/* 
	
				data={getReport("Performance_Summary_By_Affiliate_current")}
					reports={reports}
					currentDates={currentDates}
					previousDates={previousDates}
					totalsArr={
					[					
					Click Throughs,
					Sales,
					[GROSS SALES],
					# of Sales,
					# of Adjustments,
					Conversion Rate,
					[AOV],
					[TOTAL SPEND],
					[ROAS],
					[NC%],
					]
					 */}
			</Row>
		</Container>
	);
};

export default ReportTableBuilder;
