import React, { useState, useEffect } from "react";
import { Button, Row, Stack, Col, Container } from "react-bootstrap";
import {
	getDefaultStartDate,
	getDefaultEndDate,
	getLastYearSameWeek,
	getReportTexts,
} from "../utils/getTime";
import StylizedModal from "../components/modals/_ModalStylized";
import PerformanceSummaryByDay from "../components/modals/quickTools/PerfomanceSummaryByDay";
import { FloatingCenterButton } from "../components/PDFelements";
import { generatePDF } from "../utils/exportPDF";
// import { exportToCSV } from "../utils/exportCSV";
import DateRangePicker from "../components/forms/DateRangePicker";
import MerchantAndNetworkInupt from "../components/forms/MerchantAndNetworkInput";
import { adminReportAPI } from "../utils/API/reportEngine";
import LoadingOverlay from "../components/LoadingOverlay";
import OutageReport from "../logic/comparisonLogic/outageEstimateTableBuilder";

const getMerchantLogo = (id) =>
	id === "23437"
		? `https://static.avantlink.com/merchant-logos/23437`
		: `https://static.avantlink.com/merchant-logos/${id}.png`;

const OutageEstimate = () => {
	// const [startDate, setStartDate] = useState(
	// 	getDefaultStartDate("last7days")
	// );

	// const [endDate, setEndDate] = useState(getDefaultEndDate());
	//
	//
	////FOR TESTING  REMOVE AND REPLACE WITH COMMENTED OUT STUFF ABOVE
	const [startDate, setStartDate] = useState("2025-01-21");
	const [endDate, setEndDate] = useState("2025-03-21");
	////FOR TESTING  REMOVE AND REPLACE WITH COMMENTED OUT STUFF ABOVE
	//
	//
	console.log(startDate, endDate);
	const [previousPeriodStart, setPreviousPeriodStart] = useState(
		getLastYearSameWeek(startDate, endDate).start
	);
	const [modalType, setModalType] = useState(null);
	const [previousPeriodEnd, setPreviousPeriodEnd] = useState(
		getLastYearSameWeek(startDate, endDate).end
	);
	const [reportResults, setReportResults] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingStage, setLoadingStage] = useState("");
	const [currentDates, setCurrentDates] = useState({});
	const [previousDates, setPreviousDates] = useState({});
	const [completedModules, setCompletedModules] = useState([]);
	const [selectedMerchant, setSelectedMerchant] = useState("15253");
	const [selectedNetwork, setSelectedNetwork] = useState("US");
	const [reportingStage, setReportingStage] = useState("input");
	const [disabledBaselineButton, setDisabledBaselineButton] = useState(true);
	const [tableButton, setTableButton] = useState(<div></div>);
	const [graphs, setGraphs] = useState(<div></div>);
	useEffect(() => {
		if (selectedMerchant !== "" && selectedNetwork !== "") {
			setDisabledBaselineButton(false);
		} else {
			setDisabledBaselineButton(true);
		}
	}, [selectedMerchant, selectedNetwork]);
	const determineBaseline = () => {
		setReportingStage("baseline");
		console.log(reportingStage);
		setModalType("PSDay");
	};
	const determineOutage = () => {
		console.log(reportingStage);
		setModalType("PSDay");
	};

	const testfunction = () => {
		console.log("date update");
	};
	const selectedModules = {
		Performance_Summary: {
			id: 1,
			inReport: true,
			sortBy: "Sales",
			limit: 1,
		},

		Performance_Summary_By_Affiliate_Website: { id: 20, inReport: true },
	};
	const buildTables = () => {
		setLoading(false);
		setLoadingStage("");
		setReportingStage("Tables");
	};
	const handleRunReport = async (dates) => {
		setCurrentDates(getReportTexts(startDate, endDate));
		setPreviousDates(
			getReportTexts(previousPeriodStart, previousPeriodEnd)
		);
		setModalType(null);
		setCompletedModules([]);
		setLoading(true);
		setLoadingStage("Initializing...");
		const reportModules = Object.entries(selectedModules).filter(
			([_, mod]) => mod.inReport
		);
		try {
			const results = await adminReportAPI({
				reportType: "Comparison",
				selectedModules: reportModules,
				startDate: startDate,
				endDate: endDate,
				previousStartDate: dates.start,
				previousEndDate: dates.end,
				networkCode: selectedNetwork,
				merchant: selectedMerchant,
				updateProgress: (message) => {
					setLoadingStage(message);
					if (message.includes("✅")) {
						const name = message.split(" ")[0];
						setCompletedModules((prev) => [...prev, name]);
					}
				},
			});
			setReportResults(results);
		} catch (err) {
			console.error("Report run failed", err);
		} finally {
			setTableButton(
				<Stack className="flashy-button">
					<Button variant="success" size="lg" onClick={buildTables}>
						Compare Data and Display Report
					</Button>
				</Stack>
			);
			setLoadingStage("Ready To Build Tables.");
		}
	};

	return (
		<div>
			{(reportingStage === "baseline" || reportingStage === "input") && (
				<Container className="shadow-sm p-4 bg-white border position-relative card-drop-in  rounded mt-5">
					<Row>
						{" "}
						<Row>
							<h3>Outage Estimate 2.0</h3>
							<MerchantAndNetworkInupt
								title="Fill in the Merchant Id and Network to begin"
								selectedMerchant={selectedMerchant}
								selectedNetwork={selectedNetwork}
								setSelectedMerchant={setSelectedMerchant}
								setSelectedNetwork={setSelectedNetwork}
							/>
							<hr />

							<h5 className="text-muted">
								This report compares the duration of the outage
								with a similar period in the past referred to as
								the 'baseline' period.
							</h5>
							<p className="text-muted">
								To estimate the sales made by each affiliate, we
								consider their clickthrough rates. This
								estimation is calculated by multiplying the
								estimated total program sales with the ratio of
								affiliate clicks to overall clicks.
							</p>
							<p>
								Additionally, we factor in the baseline average
								order value (AOV) and conversion rate of the
								program, either by multiplying the affiliate
								clicks with the program's baseline AOV and
								conversion rate or by taking the average of both
								methods. Any actual sales that occurred during
								the outage period are excluded from these
								calculations.
							</p>
							<hr />
						</Row>
						<Row>
							<Col sm={8}>
								<h5>Select Outage period</h5>{" "}
								<DateRangePicker
									startDate={startDate}
									endDate={endDate}
									onStartChange={setStartDate}
									onEndChange={setEndDate}
									otherFunction={testfunction}
								/>
							</Col>
							<Col sm={4} className="d-grid gap-2">
								<Button
									onClick={() => determineOutage()}
									disabled={disabledBaselineButton}
									variant="secondary"
								>
									Determine Outage Dates (if unsure)
								</Button>
							</Col>
							<Col sm={12} className="d-grid gap-2">
								<Button
									onClick={() => determineBaseline()}
									disabled={disabledBaselineButton}
									variant="success"
									className="m-3 flashy-button"
								>
									Determine BaseLine
								</Button>
							</Col>
						</Row>
						{loading && (
							<LoadingOverlay
								modules={selectedModules}
								completedModules={completedModules}
								loadingStage={loadingStage}
								merchantReference={selectedMerchant}
								tableButton={tableButton}
							/>
						)}
					</Row>
				</Container>
			)}

			{reportingStage === "Tables" && (
				<Container>
					<FloatingCenterButton
						label="test"
						onClick={() =>
							generatePDF(
								"OutageReport" +
									selectedMerchant +
									"_" +
									startDate +
									"-" +
									endDate,
								"portrait"
							)
						}
					/>
					<Row id="report_pdf">
						<OutageReport
							reportList={""}
							Graphs={graphs}
							mid={selectedMerchant}
							reports={reportResults}
							outageDates={currentDates}
							baselineDates={previousDates}
						/>
					</Row>
				</Container>
			)}
			<StylizedModal
				show={!!modalType}
				onHide={() => setModalType(null)}
				size="xl"
			>
				<PerformanceSummaryByDay
					setPPEnd={setPreviousPeriodEnd}
					setPPStart={setPreviousPeriodStart}
					setReportStage={setReportingStage}
					startingStage={reportingStage}
					mId={selectedMerchant}
					mNetwork={selectedNetwork}
					start={startDate}
					end={endDate}
					runReport={handleRunReport}
					setGraphs={setGraphs}
				/>
			</StylizedModal>
		</div>
	);
};

export default OutageEstimate;
