import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import ColumnMapTable from "../../components/tables/columnMapTable";
import { PerfSummary, ProductSummary } from "./SingleReportSummaryMaps";
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
	const [graphHeight, setGraphHeight] = useState(700);
	const productSummaryTable = ProductSummary(
		reports["Product_Sold_current"],
		currentDates
	).tableDisplay;
	const dayGraphData = {
		current: reports["Performance_Summary_By_Day_current"],
		previous: reports["Performance_Summary_By_Day_previous"],
	};
	const Aff_Web_Sub = [
		reportList["Performance_Summary_By_Affiliate"],
		reportList["Performance_Summary_By_Affiliate_Website"],
		reportList["Performance_Summary_By_Sub_Affiliate_Partner"],
	];
	console.log(Aff_Web_Sub);

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
					<CustomCompTable
						reportType={"verticalComp"}
						reports={reports}
						title={"Comparison of Selected Dates"}
						limit={3}
						merchantId={mid}
						array={reportList["Performance_Summary_Total"]}
						currLabel={currentDates.dateRange}
						prevLabel={previousDates.dateRange}
					/>

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
				{Aff_Web_Sub.map((report, i) => (
					<Row key={i}>
						<CustomCompTable
							reportType="yoyHorizontal"
							reports={reports}
							topperText={"Custom Title"}
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
