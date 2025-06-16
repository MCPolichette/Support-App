import React, { useState } from "react";
import { Stack, Row, Card, Button, Collapse } from "react-bootstrap";
import StylizedModal from "../modals/_ModalStylized";
import Edit_Report_Modal from "../modals/Edit_Report_Modal";
const ReportSelection = ({ reportsData }) => {
	const [openItems, setOpenItems] = useState({});
	const [modalType, setModalType] = useState(null);
	const [reportEditor, setReportEditor] = useState({});
	const toggle = (key) => {
		setOpenItems((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};
	function editReport(reportName, reportConfig) {
		console.log(reportName, reportConfig);
		setReportEditor({ reportConfig, reportName });
		setModalType("edit-report");
	}

	return (
		<div>
			{Object.entries(reportsData).map(
				([categoryName, categoryReports]) => (
					<div key={categoryName} className="mb-4">
						{" "}
						<Stack direction="horizontal">
							<h6 className="text-uppercase text-muted">
								{categoryName.replaceAll("_", " ")}
							</h6>

							<Button
								className="p-2 ms-auto"
								variant="outline-success"
								size="sm"
								disabled
							>
								Add New Report
							</Button>
						</Stack>
						<Row className="row">
							{Object.entries(categoryReports).map(
								([reportName, reportConfig]) => {
									const headersArray = Array.isArray(
										reportConfig.headers
									)
										? reportConfig.headers
										: [];

									const isOpen = !!openItems[reportName];

									return (
										<Row
											className="col-md-3 d-flex flex-column col-sm-6"
											key={reportName}
										>
											<Card className="h-100 small shadow-sm d-flex flex-column mb-2">
												<Card.Body className="d-flex flex-column">
													<Card.Title
														style={{
															fontSize: ".8em",
														}}
														className="text-muted text-truncate"
														title={reportName}
													>
														{reportName.replaceAll(
															"_",
															" "
														)}
													</Card.Title>

													<Stack>
														<Button
															variant="outline-primary"
															size="sm"
															onClick={() =>
																toggle(
																	reportName
																)
															}
															aria-controls={`collapse-${reportName}`}
															aria-expanded={
																isOpen
															}
														>
															{isOpen
																? "Hide Fields"
																: "Show Default Fields"}
														</Button>
														<Button
															disabled={
																!reportConfig.customizable
															}
															variant="outline-primary"
															size="sm"
															onClick={() =>
																editReport(
																	reportName,
																	reportConfig
																)
															}
														>
															Customize
														</Button>
													</Stack>

													<Collapse in={isOpen}>
														<div
															id={`collapse-${reportName}`}
														>
															<ul className="mb-0 ps-3">
																{headersArray.map(
																	(
																		header,
																		index
																	) => (
																		<li
																			key={
																				index
																			}
																		>
																			{
																				header.label
																			}
																		</li>
																	)
																)}
															</ul>
														</div>
													</Collapse>
												</Card.Body>
											</Card>
										</Row>
									);
								}
							)}
						</Row>
					</div>
				)
			)}
			<StylizedModal
				show={!!modalType}
				onHide={() => setModalType(null)}
				title="Settings"
			>
				<Edit_Report_Modal
					reportEditor={reportEditor.reportConfig}
					reportName={reportEditor.reportName}
				/>
			</StylizedModal>
		</div>
	);
};

export default ReportSelection;
