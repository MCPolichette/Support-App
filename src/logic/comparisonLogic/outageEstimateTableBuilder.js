import React, { useRef, useState } from "react";
import { Row, Col, Card, Container, Button } from "react-bootstrap";
import ColumnMapTable from "../../components/tables/columnMapTable";
import { TableTopper } from "../../components/tables/tableExtras";
import { build_Outage_Estimate_Table } from "./outageLogic";

const OutageReport = ({ mid, reports, outageDates, baselineDates, Graphs }) => {
	const getReport = (text) => {
		return reports[text];
	};
	const baseSummary = getReport("Performance_Summary_previous")?.[0];
	const [summaryTable, setSummaryTable] = useState("");
	const [estimatedTotals, setEstimatedTotals] = useState({
		aCommissionTotal: 0,
		nCommissionTotal: 0,
		overallTotal: 0,
		salesTotal: 0,
		nRate: "",
		cRate: "",
	});
	const [avgCommRate, setAvgCommRate] = useState("");
	const [networkRate, setNetworkRate] = useState("");
	const websiteBasePerformance = getReport(
		"Performance_Summary_By_Affiliate_Website_previous"
	);
	const [affiliateCount, setAffiliateAccount] = useState(20);
	const outageSummary = getReport("Performance_Summary_current")?.[0];
	const merchantName = outageSummary["Merchant"];

	const [outageTable, setOutageTable] = useState({
		headers: [],
		table: [],
	});
	const pdfRef = useRef(); // Use with html2canvas/jspdf or react-to-print
	console.log("IMPORTANT", outageTable);

	const estimatedSales =
		outageSummary["Click Throughs"] *
		baseSummary["Average Sale Amount"] *
		baseSummary["Conversion Rate"];
	const discrepency = estimatedSales - outageSummary["Sales"];
	const reportTitle = (text, dates) => {
		return text + " " + dates;
	};
	function updateTable() {
		build_Outage_Estimate_Table({
			affiliateCount: affiliateCount,
			outageReport: websiteBasePerformance,
			baselineReport: getReport(
				"Performance_Summary_By_Affiliate_Website_current"
			),
			discrepency: discrepency,
			setOutageTable,
			setEstimatedTotals,
			setAvgCommRate,
			setNetworkRate,
		});
	}
	if (outageTable.table.length === 0) {
		updateTable();
	}
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

	return (
		<Container className="container pt-0">
			<Container fluid className="p-4 bg-white text-dark" ref={pdfRef}>
				{/* Header */}
				<TableTopper
					text={["Outage Estimate", outageDates.dateRange]}
					id={mid}
				/>
				<Row className="mb-4 border-bottom pb-3">
					<Col md={4}>
						<h3>Outage Estimate Report</h3>
						<li>
							<strong>Merchant:</strong>
							{"    "} {merchantName}
						</li>
						<li>
							<strong>Program ID:</strong>
							{"    "} {mid}
						</li>
						<li>
							<strong>Outage Dates:</strong>
							{"    "}
							{outageDates.dateRange}
						</li>
						<li>
							<strong>Baseline Dates:</strong>
							{"    "}
							{baselineDates.dateRange}
						</li>
						<li>
							<strong>Affiliate Commission:</strong>
							{"    "}
							{estimatedTotals.cRate}
						</li>
						<li>
							<strong>Network Commission:</strong>
							{"    "} {estimatedTotals.nRate}
						</li>
						<Card body className="text-end">
							<h5>Performance Comparison</h5>
							<ColumnMapTable
								id={mid}
								hideTools={true}
								classNames="standard"
								tableMap={summaryTable.headers}
								table={summaryTable.table}
								limit={3}
							/>
						</Card>
					</Col>
					<Col className="text-end" md={8}>
						{Graphs}
					</Col>
				</Row>
				{/* Top Affiliates Table Placeholder */}
				<Row className="mb-4">
					<Col>
						<ColumnMapTable
							id={mid}
							hideTools={true}
							classNames="standard"
							tableMap={outageTable.headers}
							table={outageTable.table}
							limit={affiliateCount}
						/>
					</Col>
				</Row>

				{/* Totals Summary */}
				<Row className="mt-5">
					<Col md={4}>
						<Card body className="bg-light border-0">
							<h6 className="mb-3">Estimated Totals</h6>
							<p>
								<strong>Affiliate Commission:</strong>
								{"    $"}
								{estimatedTotals.aCommissionTotal.toFixed(2)}
							</p>
							<p>
								<strong>Network Commission:</strong>
								{"    $"}
								{estimatedTotals.nCommissionTotal.toFixed(2)}
							</p>
							<hr />
							<p>
								<strong>Total:</strong>
								{"    $"}
								{estimatedTotals.overallTotal.toFixed(2)}
							</p>
						</Card>
					</Col>
					<Col>
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
							</p>
						</Card>
					</Col>
				</Row>
			</Container>
			<Button onClick={() => updateTable()} />
		</Container>
	);
};

export default OutageReport;
