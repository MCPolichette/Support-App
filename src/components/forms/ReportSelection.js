import React, { useState } from "react";
import { Tabs, Tab, Row, Button } from "react-bootstrap";
import StylizedModal from "../modals/_ModalStylized";
import EditReportModal from "../modals/EditReportModal";
import { useReportContext } from "../../utils/reportContext";
import { getSettings } from "../../utils/API/_AdminApiModules";
import ReportCard from "../cards/ReportCard";
import { removeCustomReport } from "../../utils/localStorageSettings";

const ReportSelection = () => {
	const {
		reportList,
		updateReportByName,
		removeReportByName,
		// addReport,
		// loadReports,
	} = useReportContext();

	const settings = getSettings();
	const [modalType, setModalType] = useState(null);
	const [reportEditor, setReportEditor] = useState({});
	const [customReports, setCustomReports] = useState(
		settings.customReports || {}
	);
	const [activeTab, setActiveTab] = useState(
		Object.keys(reportList)[0] || ""
	);

	const handleDeleteCustomReport = (reportName, categoryName) => {
		const updated = { ...customReports };
		delete updated[categoryName]?.[reportName];
		removeCustomReport(categoryName, reportName);
		removeReportByName(reportName);
		setCustomReports(updated);
	};

	const handleToggleInReport = (reportName, categoryName) => {
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
		setReportEditor({ reportName, reportConfig, categoryName });
		setModalType("edit-report");
	}

	return (
		<div>
			<Tabs
				id="report-tabs"
				activeKey={activeTab}
				onSelect={(k) => setActiveTab(k)}
				className="mb-3"
				style={{ backgroundColor: "lightgrey" }}
			>
				{Object.entries(reportList).map(
					([categoryName, categoryReports]) => (
						<Tab
							eventKey={categoryName}
							title={categoryName.replaceAll("_", " ")}
							key={categoryName}
						>
							<Row className="p-3">
								{Object.entries(categoryReports).map(
									([reportName, reportConfig]) => (
										<Row
											className="col-md-3 d-flex flex-column col-sm-6"
											key={reportName}
										>
											<ReportCard
												reportName={reportName}
												reportConfig={reportConfig}
												categoryName={categoryName}
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
									)
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
						</Tab>
					)
				)}
			</Tabs>

			<StylizedModal
				show={!!modalType}
				onHide={() => setModalType(null)}
				title="Settings"
			>
				<EditReportModal
					reportEditor={reportEditor.reportConfig}
					reportName={reportEditor.reportName}
					categoryName={reportEditor.categoryName}
				/>
			</StylizedModal>
		</div>
	);
};

export default ReportSelection;
