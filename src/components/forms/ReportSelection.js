import React, { useState } from "react";
import { Stack, Row, Card, Button, Collapse, Form } from "react-bootstrap";
import StylizedModal from "../modals/_ModalStylized";
import Edit_Report_Modal from "../modals/Edit_Report_Modal";
import { useReportContext } from "../../utils/reportContext";
import { getSettings } from "../../utils/API/_AdminApiModules";
import ReportCard from "../cards/ReportCard";
import { removeCustomReport } from "../../utils/localStorageSettings";
const ReportSelection = () => {
	const {
		reportList,
		updateReportByName,
		removeReportByName,
		addReport,
		loadReports,
	} = useReportContext();
	const settings = getSettings();
	const [openItems, setOpenItems] = useState({});
	const [modalType, setModalType] = useState(null);
	const [reportEditor, setReportEditor] = useState({});
	const [customReports, setCustomReports] = useState(
		settings.customReports || {}
	);

	const toggleCategory = (category) => {
		setOpenItems((prev) => ({
			...prev,
			[category]: !prev[category],
		}));
	};

	const handleDeleteCustomReport = (reportName, categoryName) => {
		const updated = { ...customReports };
		delete updated[categoryName]?.[reportName];

		// remove from storage too if needed

		removeCustomReport(categoryName, reportName);
		removeReportByName(reportName);
		setCustomReports(updated);
	};
	const handleToggleInReport = (reportName, categoryName) => {
		console.log((reportName, categoryName));

		const category = reportList[categoryName];
		if (!category || !category[reportName]) return;
		const currentReport = category[reportName];
		const updatedReport = {
			...currentReport,
			inReport: !currentReport.inReport,
		};

		updateReportByName(reportName, updatedReport, categoryName);
	};

	function editReport(reportName, reportConfig, categoryName) {
		console.log(reportName, reportConfig, categoryName);
		setReportEditor({ reportName, reportConfig, categoryName });
		setModalType("edit-report");
	}

	return (
		<div>
			{Object.entries(reportList).map(
				([categoryName, categoryReports]) => {
					const isOpen = !!openItems[categoryName];
					return (
						<div key={categoryName} className="mb-4">
							<Stack direction="horizontal" gap={2}>
								<h6 className="text-uppercase text-muted">
									{categoryName.replaceAll("_", " ")}
								</h6>

								<Button
									variant="outline-secondary"
									size="sm"
									onClick={() => toggleCategory(categoryName)}
								>
									{isOpen ? "Hide Reports" : "Show Reports"}
								</Button>
							</Stack>

							<Collapse in={isOpen}>
								<div>
									<Row className="row mt-2">
										{Object.entries(categoryReports).map(
											([reportName, reportConfig]) => {
												const headersArray =
													Array.isArray(
														reportConfig.headers
													)
														? reportConfig.headers
														: [];

												return (
													<Row
														className="col-md-3 d-flex flex-column col-sm-6"
														key={reportName}
													>
														<ReportCard
															reportName={
																reportName
															}
															reportConfig={
																reportConfig
															}
															categoryName={
																categoryName
															}
															onToggleInReport={() =>
																handleToggleInReport(
																	reportName,
																	categoryName
																)
															}
															onEdit={editReport}
															onDelete={
																handleDeleteCustomReport
															}
														/>
													</Row>
												);
											}
										)}

										<Row className="col-md-3 col-sm-6 d-flex align-items-start">
											<Button
												className="w-100 mt-2"
												variant="outline-success"
												size="sm"
												disabled
											>
												Create a Custom Report
											</Button>
										</Row>
									</Row>
								</div>
							</Collapse>
						</div>
					);
				}
			)}

			<StylizedModal
				show={!!modalType}
				onHide={() => setModalType(null)}
				title="Settings"
			>
				<Edit_Report_Modal
					reportEditor={reportEditor.reportConfig}
					reportName={reportEditor.reportName}
					categoryName={reportEditor.categoryName}
				/>
			</StylizedModal>
		</div>
	);
};

export default ReportSelection;
