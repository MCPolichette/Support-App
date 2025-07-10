import React, { useRef, useState } from "react";
import { Row, Col, Card, Container, Button } from "react-bootstrap";
import ColumnMapTable from "../../components/tables/columnMapTable";
import { TableTopper } from "../../components/tables/tableExtras";
import { build_Outage_Estimate_Table } from "./outageLogic";
import { formatNumber } from "../../utils/conversions";
import LimitTableRows from "../../components/buttons_and_dropdowns/LimitTableRows";

const OutageReport = ({ mid, reports, outageDates, baselineDates, Graphs }) => {
	const getReport = (text) => {
		return reports[text];
	};
	console.log(reports);
	const baseSummary = getReport("Performance_Summary_previous")?.[0];
	const [summaryTable, setSummaryTable] = useState("");
	const [estimatedTotals, setEstimatedTotals] = useState({
		aCommissionTotal: 0,
		nCommissionTotal: 0,
		overallTotal: 0,
		salesTotal: 0,
		nRate: formatNumber(
			baseSummary["Commission"] / baseSummary["Sales"],
			"percent"
		),
		cRate: formatNumber(
			baseSummary["Network Commissions"] / baseSummary["Sales"],
			"percent"
		),
	});
	const aov = formatNumber(baseSummary["Average Sale Amount"], "dollar");
	console.log(baseSummary);
	const [aovChoice, setAovChoice] = useState("Affiliate");
	const [affiliateCount, setAffiliateCount] = useState(15);
	const outagePerformance = getReport(
		"Performance_Summary_By_Affiliate_Website_current"
	)
		.sort((a, b) => b["Click Throughs"] - a["Click Throughs"])
		.slice(0, affiliateCount);
	const basePerformance = getReport(
		"Performance_Summary_By_Affiliate_Website_previous"
	);

	const outageSummary = getReport("Performance_Summary_current")?.[0];
	const merchantName = outageSummary["Merchant"];
	const baselineRates = {
		nRate: formatNumber(
			Number(baseSummary["Commissions"]) / Number(baseSummary["Sales"]),
			"percent"
		),
		cRate: formatNumber(
			Number(baseSummary["Network Commissions"]) /
				Number(baseSummary["Sales"]),
			"percent"
		),
	};
	const [outageTable, setOutageTable] = useState({
		headers: [],
		table: [],
	});
	const pdfRef = useRef(); // Use with html2canvas/jspdf or react-to-print
	const estimatedSales =
		outageSummary["Click Throughs"] *
		baseSummary["Average Sale Amount"] *
		baseSummary["Conversion Rate"];
	const discrepency = estimatedSales - outageSummary["Sales"];
	const reportTitle = (text, dates) => {
		return text + " " + dates;
	};
	function changeAffiliates(array) {
		const newLimit = array.length;
		console.log("LIMIT", newLimit);
		setAffiliateCount(newLimit);
		updateTable(newLimit);
	}
	function updateTable(count) {
		build_Outage_Estimate_Table({
			affiliateCount: count,
			outageReport: outagePerformance,
			baselineReport: basePerformance,
			discrepency: discrepency,
			setOutageTable,
			setEstimatedTotals,
			aovChoice,
		});
	}
	if (outageTable.table.length === 0) {
		updateTable(affiliateCount);
	}
	if (summaryTable === "") {
		setSummaryTable({
			headers: [
				{ label: "Summary:", type: "string" },
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
	console.log("IMPORTANT ", affiliateCount);

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
							<strong> {merchantName}</strong>
						</li>
						<li>
							<strong>Merchant ID: {mid}:</strong>
						</li>
						<li>
							<strong>Outage Dates:</strong>
							<ul>
								<li>{outageDates.dateRange}</li>
							</ul>
						</li>
						<li>
							<strong>Baseline Dates:</strong>
							<ul>
								<li>{baselineDates.dateRange}</li>
							</ul>
						</li>
						<li>
							<strong>Baseline AOV: {aov}</strong>
						</li>
						<li>
							<strong>Baseline avg Commission Rates:</strong>
							<ul>
								<li>Affiliates: {baselineRates.cRate}</li>
								<li>Network: {baselineRates.nRate}</li>
							</ul>
						</li>
						<h5 className="mt-3">Performance Comparison</h5>
						<ColumnMapTable
							id={mid}
							hideTools={true}
							classes="standard"
							tableMap={summaryTable.headers}
							table={summaryTable.table}
							limit={3}
						/>
					</Col>
					<Col className="text-end" md={8}>
						{Graphs}
					</Col>
				</Row>

				<Row className="mb-4">
					<Col>
						<LimitTableRows
							hidden={false}
							displayTable={"Null"}
							displayedRows={affiliateCount}
							table={outagePerformance}
							setDisplayedRows={changeAffiliates}
							title={"title"}
						/>
						<ColumnMapTable
							id={mid}
							hideTools={true}
							classes="standard"
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
