import React, { useState } from "react";
import { Button, Row, Container } from "react-bootstrap";
import ParrallelPulseForm from "../components/forms/ParrallelPulseForm";
import ReportTableBuilder from "../logic/comparisonLogic/reportTableBuilder";
import { adminReportAPI } from "../utils/API/reportEngine";
import { _adminApiModules, getSettings } from "../utils/API/_AdminApiModules";
import { getReportTexts } from "../utils/getTime";
import { generatePDF } from "../utils/exportPDF";
import { FloatingCenterButton } from "../components/PDFelements";
import { useReportContext } from "../utils/reportContext";
import LoadingOverlay from "../components/LoadingOverlay";
const ParrallelPulseReport = () => {
	const settings = getSettings();
	const [pageDisplay, setPageDisplay] = useState(
		settings.key ? null : "noKey"
	);
	const [errorModal, setErrorModal] = useState("");
	const [modules, setModules] = useState(_adminApiModules);
	const [completedModules, setCompletedModules] = useState([]);
	const [reportResults, setReportResults] = useState({});
	// Report params
	const { reportList } = useReportContext();
	// Display states
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
		setCompletedModules([]);
		setLoading(true);
		setLoadingStage("Initializing...");
		const selectedModules = Object.entries(modules).filter(
			([_, mod]) => mod.inReport
		);

		try {
			console.log(selectedModules);
			const results = await adminReportAPI({
				reportType: "Comparison",
				reportList,
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

	return (
		<div className="container ">
			<div className="position-relative card-drop-in ">
				{pageDisplay === null && (
					<div
						className={loading ? "blur-sm pointer-events-none" : ""}
					>
						<ParrallelPulseForm
							modules={modules}
							setModules={setModules}
							handleRunReport={handleRunReport}
							loading={loading}
							reportList={reportList}
						/>
					</div>
				)}
				{loading && (
					<LoadingOverlay
						modules={modules}
						completedModules={completedModules}
						loadingStage={loadingStage}
						merchantReference={merchantReference}
						tableButton={tableButton}
					/>
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
							reportList={reportList}
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
		</div>
	);
};

export default ParrallelPulseReport;
