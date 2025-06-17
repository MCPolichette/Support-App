import React, { useState } from "react";
import { Stack, Row, Card, Button, Collapse, Form } from "react-bootstrap";
import StylizedModal from "../modals/_ModalStylized";
import Edit_Report_Modal from "../modals/Edit_Report_Modal";
import { useReportContext } from "../../utils/reportContext";

const ReportSelection = () => {
	const { reportList, setReport, addReport, removeReportById, resetReports } =
		useReportContext();
	const [openItems, setOpenItems] = useState({});
	const [modalType, setModalType] = useState(null);
	const [reportEditor, setReportEditor] = useState({});

	const toggleCategory = (category) => {
		setOpenItems((prev) => ({
			...prev,
			[category]: !prev[category],
		}));
	};

	const handleToggleInReport = (reportName) => {
		// setReportMap((prev) =>
		// 	prev.map((field, i) =>
		// 		i === idx ? { ...field, comp: !field.comp } : field
		// 	)
		// );
	};

	function editReport(reportName, reportConfig) {
		setReportEditor({ reportName, reportConfig });
		setModalType("edit-report");
	}
	console.log(reportList);

	return (
		<div>
			{Object.entries(reportList).map(
				([categoryName, categoryReports]) => {
					const isOpen = !!openItems[categoryName];

					return (
						<div key={categoryName} className="mb-4">
							<Stack direction="horizontal" gap={2}>
								<h6 className="text-uppercase text-muted">
									{categoryName.replaceAll("_", " ")}{" "}
									{Object.entries(categoryReports).map(
										([reportName, reportConfig]) => {
											<p>{reportName}</p>;
											<p>{reportConfig.headers}</p>;
										}
									)}
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
														<Card className=" small shadow-sm d-flex flex-column mb-2">
															<Card.Body className="d-flex flex-column">
																<Card.Title
																	style={{
																		fontSize:
																			".8em",
																	}}
																	className="text-muted text-truncate"
																	title={
																		reportName
																	}
																>
																	{reportName.replaceAll(
																		"_",
																		" "
																	)}
																</Card.Title>

																<Stack>
																	{reportConfig !=
																		"string" && (
																		<Form.Check
																			type="checkbox"
																			id={`comp-toggle-${reportName}`}
																			label="Use In this Report"
																			className="ms-3 text-nowrap"
																			checked={
																				reportConfig.inReport
																			}
																			onChange={() =>
																				handleToggleInReport(
																					reportName
																				)
																			}
																		/>
																	)}
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

																<ul className="mb-0 ps-3 mt-2">
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
															</Card.Body>
														</Card>
													</Row>
												);
											}
										)}
										<Button
											className=""
											variant="outline-success"
											size="sm"
											disabled
										>
											Create a Custom Report
										</Button>
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
				/>
			</StylizedModal>
		</div>
	);
};

export default ReportSelection;
