import React, { useState } from "react";
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
	const [graphHeight, setGraphHeight] = useState(700);
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
		<Container className="container pt-0">
			<Row className="mb-5">
				<TableTopper
					text={reportTitle(
						"Performance Summary",
						currentDates.dateRange
					)}
					id={mid}
				/>
				<Col md={6}>
					<div>
						<ColumnMapTable
							id={mid}
							title={currentDates.dateRange}
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
					</div>
					<div style={{ height: { graphHeight } }}>
						<YoySalesConversionChart
							data={dayGraphData}
							title="Sales vs Conversion Rate"
							hAxisTitle="Day"
							size={graphHeight}
						/>
					</div>
				</Col>

				<Col md={6}>
					<ColumnMapTable
						title={["Most Sold Products ", currentDates.dateRange]}
						tableMap={productSummaryTable.headers}
						table={productSummaryTable.data}
						limit={25}
					/>
				</Col>
			</Row>

			<Row className="mb-5 mt-5">
				<PageBreaker />
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
