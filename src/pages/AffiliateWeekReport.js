import React, { useState } from "react";
import { Button, Row, Col, Container } from "react-bootstrap";
import AvantLinkApiTester from "../components/modals/adminAPItester";

import StylizedModal from "../components/modals/_ModalStylized";
import SettingsModal from "../components/modals/SettingsModal";
import AffiliateWeekForm from "../components/forms/AffiliateWeekForm";
import { adminReportAPI } from "../utils/reportEngine";
import { _adminApiModules, getSettings } from "../utils/_AdminApiModules";

import DynamicComparisonReportContainer from "../components/tables/DynamicComparisonContainer";
import {
	getDefaultStartDate,
	getDefaultEndDate,
	getLastYearSameWeek,
} from "../utils/getTime";

// const getMerchantLogo = (id) => {
// 	return id === "23437"
// 		? `https://static.avantlink.com/merchant-logos/23437`
// 		: `https://static.avantlink.com/merchant-logos/${id}.png`;
// };

const AffiliateWeekReport = () => {
	const settings = getSettings();
	const [modalType, setModalType] = useState(settings.key ? null : "noKey");
	const [errorModal, setErrorModal] = useState("");
	const [modules, setModules] = useState(_adminApiModules);
	const [completedModules, setCompletedModules] = useState([]);

	const [reportResults, setReportResults] = useState({});
	// Report params
	const [merchantId, setMerchantId] = useState(
		settings.primaryMerchant.id || ""
	);
	const [network, setNetwork] = useState(
		settings.primaryMerchant.network || ""
	);
	const [startDate, setStartDate] = useState(getDefaultStartDate());
	const [endDate, setEndDate] = useState(getDefaultEndDate());
	const [previousPeriodStart, setPreviousPeriodStart] = useState(
		getLastYearSameWeek(startDate, endDate).start
	);
	const [previousPeriodEnd, setPreviousPeriodEnd] = useState(
		getLastYearSameWeek(startDate, endDate).end
	);

	// Display states
	const [showComparisonTable, setShowComparisonTable] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingStage, setLoadingStage] = useState("N/A");
	const toggleModule = (name) => {
		setModules((prev) => ({
			...prev,
			[name]: { ...prev[name], inReport: !prev[name].inReport },
		}));
	};
	const toggleHeaderDisplay = (moduleName, headerName) => {
		setModules((prevModules) => {
			const updatedModules = { ...prevModules }; // shallow copy modules
			const updatedModule = { ...updatedModules[moduleName] }; // shallow copy specific module
			const updatedHeaders = { ...updatedModule.headers }; // shallow copy headers

			const headerSettings = updatedHeaders[headerName];

			if (headerSettings !== undefined) {
				if (typeof headerSettings === "object") {
					updatedHeaders[headerName] = {
						...headerSettings,
						display: headerSettings.display === false, // flip true/false properly
					};
				} else {
					updatedHeaders[headerName] = {
						yoy: headerSettings,
						display: true,
					};
				}
			}

			updatedModule.headers = updatedHeaders;
			updatedModules[moduleName] = updatedModule;

			return updatedModules;
		});
	};

	const handleRunReport = async () => {
		console.log(loadingStage);
		setShowComparisonTable(false);
		setCompletedModules([]);
		setLoading(true);
		setLoadingStage("Initializing...");
		const selectedModules = Object.entries(modules).filter(
			([_, mod]) => mod.inReport
		);

		try {
			const results = await adminReportAPI({
				selectedModules,
				startDate,
				endDate,
				previousStartDate: previousPeriodStart,
				previousEndDate: previousPeriodEnd,
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
			console.log(results);
			setReportResults(results);
			setShowComparisonTable(true);
			console.log(completedModules);
		} catch (err) {
			console.error("Report run failed", err);
			setErrorModal("One or more reports failed.");
		} finally {
			setLoading(false);
			setLoadingStage("N/A");
		}
	};

	const openSettings = () => setModalType("noKey");
	const commonMerchants = settings.commonMerchants || [];

	return (
		<div className="container mt-5">
			<div className="position-relative">
				<div className={loading ? "blur-sm pointer-events-none" : ""}>
					<AffiliateWeekForm
						modules={modules}
						setModules={setModules}
						toggleModule={toggleModule}
						handleRunReport={handleRunReport}
						currentStartDate={startDate}
						currentEndDate={endDate}
						previousPeriodStart={previousPeriodStart}
						previousPeriodEnd={previousPeriodEnd}
						setCurrentStartDate={setStartDate}
						setCurrentEndDate={setEndDate}
						setpreviousPeriodStart={setPreviousPeriodStart}
						setPreviousPeriodEnd={setPreviousPeriodEnd}
						merchantId={merchantId}
						setMerchantId={setMerchantId}
						loading={loading}
						openSettings={openSettings}
						commonMerchants={commonMerchants}
						network={network}
						setNetwork={setNetwork}
						toggleHeaderDisplay={toggleHeaderDisplay}
					/>
				</div>
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
								<div
									className="spinner-border text-primary"
									role="status"
								>
									<h1 className="visually-hidden">
										Loading...
									</h1>
								</div>
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
						</Row>
					</Row>
				)}
			</div>

			<Container>
				{showComparisonTable && (
					<Row>
						<DynamicComparisonReportContainer
							reportResults={reportResults}
							completedModules={completedModules}
							modules={modules}
						/>
					</Row>
				)}
			</Container>
			{/* <Form className="shadow-sm p-4 bg-light border rounded">
				<h5 className="mb-3">More Report Options (Coming Soon)</h5>
				<p className="text-muted mb-0">
					Filters, partner types, and detailed metrics will be added
					here.
				</p>
			</Form> */}

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

export default AffiliateWeekReport;
