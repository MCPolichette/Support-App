import React, { useState } from "react";
import { Stack, Button, Row, Col, Container } from "react-bootstrap";
import AvantLinkApiTester from "../components/modals/adminAPItester";
import StylizedModal from "../components/modals/_ModalStylized";
import SettingsModal from "../components/modals/SettingsModal";
import ParrallelPulseForm from "../components/forms/ParrallelPulseForm";
import ReportTableBuilder from "../logic/comparisonLogic/reportTableBuilder";
import { adminReportAPI } from "../utils/API/reportEngine";
import {
	_adminApiModules,
	getSettings,
	defaultReportArray,
} from "../utils/API/_AdminApiModules";
import { getReportTexts } from "../utils/getTime";
import { generatePDF } from "../utils/exportPDF";
import { FloatingCenterButton } from "../components/PDFelements";
import Loading from "../components/loadingWithSteps";

const ParrallelPulseReport = () => {
	const settings = getSettings();
	const [modalType, setModalType] = useState(settings.key ? null : "noKey");
	const [pageDisplay, setPageDisplay] = useState(
		settings.key ? null : "noKey"
	);
	const [errorModal, setErrorModal] = useState("");
	const [modules, setModules] = useState(_adminApiModules);
	const [completedModules, setCompletedModules] = useState([]);
	const [reportResults, setReportResults] = useState({});
	// Report params
	const [reportList, setReportList] = useState(defaultReportArray);
	// Display states
	const [showComparisonTable, setShowComparisonTable] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingStage, setLoadingStage] = useState("");
	const [tableButton, setTableButton] = useState(<div></div>);
	const [currentDates, setCurrentDates] = useState({});
	const [previousDates, setPreviousDates] = useState({});
	const [merchantReference, setmerchantReference] = useState("");

	const handleRunReport = async (dates, merchantId, network) => {
		console.log(dates);
		setCurrentDates(getReportTexts(dates.startDate, dates.endDate));
		setPreviousDates(
			getReportTexts(dates.previousPeriodStart, dates.previousPeriodEnd)
		);
		setmerchantReference(merchantId);
		setShowComparisonTable(false);
		setCompletedModules([]);
		setLoading(true);
		setLoadingStage("Initializing...");
		const selectedModules = Object.entries(modules).filter(
			([_, mod]) => mod.inReport
		);

		try {
			const results = await adminReportAPI({
				reportType: "Comparison",
				selectedModules,
				startDate: dates.startDate,
				endDate: dates.endDate,
				previousStartDate: dates.previousPeriodStart,
				previousEndDate: dates.previousPeriodEnd,
				merchant: merchantId,
				networkCode: network,
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
			setErrorModal("One or more reports failed.");
		} finally {
			setTableButton(
				<Button variant="success" size="lg" onClick={buildTables}>
					Compare Data and Display Tables
				</Button>
			);
			setLoadingStage("Ready To Build Tables.");
		}
	};
	const buildTables = () => {
		setLoading(false);
		setLoadingStage("");
		setPageDisplay("Tables");
	};

	const openSettings = () => setModalType("noKey");

	return (
		<div className="container ">
			<div className="position-relative card-drop-in ">
				{pageDisplay === "NoKey" && (
					<Stack gap={3} className="text-center">
						<Button
							variant="danger"
							size="lg"
							href="/settings" // or wherever your API key settings live
						>
							This tool requires an API key to use
						</Button>
						<Button variant="secondary" href="/">
							Return to Home Page
						</Button>
					</Stack>
				)}
				{pageDisplay === null && (
					<div
						className={loading ? "blur-sm pointer-events-none" : ""}
					>
						<ParrallelPulseForm
							modules={modules}
							setModules={setModules}
							handleRunReport={handleRunReport}
							loading={loading}
							openSettings={openSettings}
						/>
					</div>
				)}
				{loading && (
					<Row>
						<div
							className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
							style={{
								backgroundColor: "rgba(255, 255, 255, 0.7)",
								backdropFilter: "blur(4px)",
								zIndex: 10,
							}}
						></div>
						<Row
							className="position-absolute top-0 start-0 w-100 h-100 d-flex   align-items-center justify-content-center"
							style={{ zIndex: 10 }}
						>
							<Col md={4}>
								<h3>Step 1: Running APIs</h3>
							</Col>
							<Col md={2}>
								{loadingStage != "Ready To Build Tables." && (
									<div
										className="spinner-border text-primary"
										role="status"
									>
										<h1 className="visually-hidden">
											Loading...
										</h1>
									</div>
								)}
							</Col>
							<Col
								md={6}
								className="bg-white rounded shadow-sm p-3"
							>
								<h5 className="mb-3">Running Reports</h5>
								<div
									style={{
										maxHeight: "300px",
										overflowY: "auto",
									}}
								>
									{Object.entries(modules)
										.filter(([_, mod]) => mod.inReport)
										.map(([name, mod]) => (
											<div
												key={name}
												className="d-flex align-items-center mb-2 small"
											>
												<span
													className="me-2"
													style={{
														fontSize: "1.2rem",
														color: "#0d6efd",
													}}
												>
													{completedModules.includes(
														name
													)
														? "✅"
														: "⏳"}
												</span>
												<span>
													{name.replace(/_/g, " ")}
												</span>
											</div>
										))}
								</div>
							</Col>

							<Stack gap={2} className="col-md-5 mx-auto">
								<h5 style={{ textAlign: "center" }}>
									{loadingStage}
								</h5>
								{tableButton}
							</Stack>
						</Row>
					</Row>
				)}
			</div>
			{pageDisplay === "Tables" && (
				<Container>
					<FloatingCenterButton
						label="test"
						onClick={() =>
							generatePDF(
								"ParrallelPulse_" +
									merchantReference +
									"_" +
									currentDates.startDate +
									"-" +
									currentDates.endDate
							)
						}
					/>

					<Row id="report_pdf">
						<ReportTableBuilder
							mid={merchantReference}
							reports={reportResults}
							currentDates={currentDates}
							previousDates={previousDates}
						/>
					</Row>
					<hr
						style={{
							height: "10em",
						}}
					/>
				</Container>
			)}

			<StylizedModal
				show={!!modalType}
				onHide={() => setModalType(null)}
				title="Settings"
			>
				{modalType === "noKey" && <SettingsModal />},
				{modalType === "test" && <AvantLinkApiTester />}
			</StylizedModal>

			{errorModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-4 rounded shadow">
						<p className="text-danger mb-3">{errorModal}</p>
						<Button
							variant="danger"
							onClick={() => setErrorModal("")}
						>
							Close
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ParrallelPulseReport;
