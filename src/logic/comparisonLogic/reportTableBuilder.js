import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import ColumnMapTable from "../../components/tables/columnMapTable";
import { ProductSummary } from "./SingleReportSummaryMaps";
import { ProductAttributeDeltaTables } from "./productSoldMaps";
import { TableTopper } from "../../components/tables/tableExtras";
import { PageBreaker } from "../../components/PDFelements";
import YoySalesConversionChart from "../../components/graphs/YoySalesConversionChart";
import { CustomCompTable } from "./DynamicTableConstructor";
const ReportTableBuilder = ({
	mid,
	reports,
	currentDates,
	previousDates,
	reportList,
}) => {
	const getReport = (text) => {
		return reports[text]?.[0];
	};
	const reportTitle = (text, dates) => {
		return text + " " + dates;
	};

	const productSummaryTable = ProductSummary(
		reports["Product_Sold_current"],
		currentDates
	).tableDisplay;

	const Performance_Summaries = Object.entries(
		reportList["Performance_Summary"]
	).map(([key, value]) => ({
		...value,
		key,
	}));

	const Graphs = Object.entries(reportList["Timeline_Graphs"]).map(
		([key, value]) => ({
			...value,
			key,
		})
	);
	const Aff_Web_Sub = Object.entries(
		reportList["Affiliate_Performance_Reports"]
	).map(([key, value]) => ({
		...value,
		key,
	}));

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
					{Performance_Summaries.map((report, i) => (
						<Row key={i}>
							<CustomCompTable
								reportType="verticalComp"
								reports={reports}
								title={report.reportTitle}
								limit={10}
								merchantId={mid}
								array={report}
								currLabel={currentDates.year}
								prevLabel={previousDates.year}
							/>
						</Row>
					))}
					{Graphs.map((report, i) => (
						<Row key={i}>
							<YoySalesConversionChart
								data={{
									current: reports[report.compReports.curr],
									previous: reports[report.compReports.prev],
								}}
								title={report.titleDisize}
								hAxisTitle={report.hAxisTitle}
							/>
						</Row>
					))}
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
				<TableTopper text="Product Performance Reports" id={mid} />

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
				{Aff_Web_Sub.map((report, i) => (
					<Row key={i}>
						<CustomCompTable
							reportType="yoyHorizontal"
							reports={reports}
							topperText={report.titleDisplay}
							title={
								currentDates.dateRange +
								" over " +
								previousDates.dateRange
							}
							limit={10}
							merchantId={mid}
							array={report}
							currLabel={currentDates.year}
							prevLabel={previousDates.year}
						/>
					</Row>
				))}
			</Row>
		</Container>
	);
};

export default ReportTableBuilder;
