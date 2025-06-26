import React, { useRef, useState } from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
import ColumnMapTable from "../../components/tables/columnMapTable";
import { ProductSummary } from "./SingleReportSummaryMaps";
import { ProductAttributeDeltaTables } from "./productSoldMaps";
import { TableTopper } from "../../components/tables/tableExtras";
import { PageBreaker } from "../../components/PDFelements";
import YoySalesConversionChart from "../../components/graphs/YoySalesConversionChart";
import { CustomCompTable } from "./DynamicTableConstructor";
import { defaultReportArray } from "../../utils/API/_AdminApiModules";
const OutageReport = ({ mid, reports, outageDates, baselineDates, Graphs }) => {
	console.log(outageDates);
	const getReport = (text) => {
		return reports[text]?.[0];
	};
	const baseSummary = getReport("Performance_Summary_previous");
	const [summaryTable, setSummaryTable] = useState("");
	const outageSummary = getReport("Performance_Summary_current");

	const merchantName = outageSummary["Merchant"];
	const pdfRef = useRef(); // Use with html2canvas/jspdf or react-to-print

	const reportTitle = (text, dates) => {
		return text + " " + dates;
	};
	if (summaryTable === "") {
		setSummaryTable({
			headers: [
				{ label: "TimeLine", type: "string" },
				{ label: "Clicks", type: "int" },
				{ label: "Sales", type: "dollar" },
				{ label: "Average Order Amt (AOV)", type: "dollar" },
				{ label: "Number of Sales", type: "int" },
				{
					label: "Conversion Rate",
					type: "percent",
				},
			],
			table: [
				[
					"Baseline Period",
					baseSummary["Click Throughs"],
					baseSummary["Sales"],
					baseSummary["Average Sale Amount"],
					baseSummary["# of Sales"],
					baseSummary["Conversion Rate"],
				],
				[
					"Outage Period",
					outageSummary["Click Throughs"],
					outageSummary["Sales"],
					outageSummary["# of Sales"],
					outageSummary["Average Sale Amount"],
					outageSummary["Conversion Rate"],
				],
			],
		});
	}
	const websiteBasePerformance = getReport(
		"Performance_Summary_By_Affiliate_Website_previous"
	);

	return (
		<Container className="container pt-0">
			<Container fluid className="p-4 bg-white text-dark" ref={pdfRef}>
				{/* Header */}
				<TableTopper
					text={["Outage Estimate", outageDates.dateRange]}
					id={mid}
				/>
				<Row className="mb-4 border-bottom pb-3">
					<Col>
						<h3>Outage Estimate Report</h3>
						<p>
							<strong>Merchant:</strong> {merchantName}
						</p>
						<p>
							<strong>Program ID:</strong> {mid}
						</p>
						<p>
							<strong>Outage Dates:</strong>{" "}
							{outageDates.dateRange}
						</p>
						<p>
							<strong>Baseline Dates:</strong>{" "}
							{baselineDates.dateRange}
						</p>
						<p>
							<strong>Affiliate Commission:</strong> 5% – 20%
						</p>
						<p>
							<strong>Network Commission:</strong> 20% of
							Affiliate Commission
						</p>
					</Col>
					<Col className="text-end">
						<Card body className="">
							<h5>Performance Comparison</h5>
							<ColumnMapTable
								id={mid}
								hideTools={true}
								classNames="standard"
								tableMap={summaryTable.headers}
								table={summaryTable.table}
								limit={3}
							/>
						</Card>{" "}
						<hr />
						<Card body className="bg-light border-0">
							<p className="mb-2">
								<strong>About this report:</strong>
							</p>
							<p>
								This report compares the outage with a similar
								recent period to estimate potential sales loss.
								Two estimation methods are used: one based on
								AOV and conversion rate, and another based on
								click percentage. Their average is calculated
								per affiliate, and tracked sales are subtracted
								to determine discrepancy.
							</p>{" "}
						</Card>
					</Col>
				</Row>

				{/* Explanation Section */}
				<Row className="mb-4">
					<Col md={6}> </Col>
					<Col md={6}>{Graphs}</Col>
				</Row>
				{/* Top Affiliates Table Placeholder */}
				<Row className="mb-4">
					<Col>
						<h5>Top Affiliates During Outage</h5>
						<div className="border p-3 text-center text-muted">
							[Insert Affiliate Breakdown Table Here]
						</div>
					</Col>
				</Row>

				{/* Totals Summary */}
				<Row className="mt-5">
					<Col md={4}>
						<Card body className="bg-light border-0">
							<h6 className="mb-3">Estimated Totals</h6>
							<p>
								<strong>Affiliate Commission:</strong> $652.90
							</p>
							<p>
								<strong>Network Commission:</strong> $130.58
							</p>
							<hr />
							<p>
								<strong>Total:</strong> $783.48
							</p>
						</Card>
					</Col>
				</Row>
			</Container>
		</Container>
	);
};

export default OutageReport;
