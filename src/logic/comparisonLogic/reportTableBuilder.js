import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import ColumnMapTable from "../../components/tables/columnMapTable";
import { PerfSummary, ProductSummary } from "./SingleReportSummaryMaps";
import { ProductAttributeDeltaTables } from "./productSoldMaps";
import { Aff_And_Website_Map } from "./AffAndWebsitecomparisonMap";
import { TableTopper } from "../../components/tables/tableExtras";
import { PageBreaker } from "../../components/PDFelements";
import YoySalesConversionChart from "../../components/graphs/YoySalesConversionChart";
const ReportTableBuilder = ({ mid, reports, currentDates, previousDates }) => {
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
		reports["Product_Sold_current"],
		currentDates
	).tableDisplay;
	const dayGraphData = {
		current: reports["Performance_Summary_By_Day_current"],
		previous: reports["Performance_Summary_By_Day_previous"],
	};
	console.log(reports);

	return (
		<Container className="container mt-4">
			<Row className="mb-5">
				<TableTopper
					text={reportTitle(
						"Performance Summary",
						currentDates.dateRange
					)}
					id={mid}
				/>
				<Col md={6}>
					<ColumnMapTable
						id={mid}
						title={previousDates.dateRange}
						tableMap={performanceSummaryCurr.headers}
						table={[performanceSummaryCurr.data]}
						limit={1}
					/>
					<br></br>
					<ColumnMapTable
						title={previousDates.dateRange}
						tableMap={performanceSummaryPrev.headers}
						table={[performanceSummaryPrev.data]}
						limit={1}
					/>
				</Col>

				<Col md={6}>
					<ColumnMapTable
						title={["Most Sold Products ", previousDates.dateRange]}
						tableMap={productSummaryTable.headers}
						table={productSummaryTable.data}
						limit={10}
					/>
				</Col>
			</Row>
			<YoySalesConversionChart
				data={dayGraphData}
				title="Sales vs Conversion Rate"
				hAxisTitle="Day"
			/>
			<PageBreaker />

			<Row className="mb-5 ">
				<TableTopper
					topperText={"Product Performance Reports"}
					id={mid}
				/>
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
			</Row>
			<PageBreaker />

			<Row>
				<Aff_And_Website_Map
					mid={mid}
					size="sm"
					reports={reports}
					currentDates={currentDates}
					previousDates={previousDates}
				/>
			</Row>
		</Container>
	);
};

export default ReportTableBuilder;
