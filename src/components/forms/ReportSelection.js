import React, { useState } from "react";
import { Stack, Card, Button, Collapse } from "react-bootstrap";

const ReportSelection = ({ reportsData }) => {
	const [openItems, setOpenItems] = useState({});

	const toggle = (key) => {
		setOpenItems((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	return (
		<div className="row">
			<Stack direction="horizontal" className="mb-0">
				<h5> Selected Reports:</h5>
				<Button
					className="p-2 ms-auto"
					variant="outline-primary"
					size="sm"
					disabled
				>
					Add New Report
				</Button>
			</Stack>
			{Object.entries(reportsData).map(([reportName, reportConfig]) => {
				const headersArray = Array.isArray(reportConfig.headers)
					? reportConfig.headers
					: [];

				const isOpen = !!openItems[reportName];

				return (
					<div
						className="col-md-3 d-flex flex-column col-sm-6 "
						key={reportName}
					>
						<Card className="h-100 small shadow-sm d-flex flex-column mb-2">
							<Card.Body className="d-flex flex-column ">
								<Card.Title
									style={{ fontSize: ".8em" }}
									className=" text-muted text-truncate "
									title={reportName}
								>
									{reportName.replaceAll("_", " ")}
								</Card.Title>
								<Stack>
									<Button
										variant="outline-primary"
										size="sm"
										onClick={() => toggle(reportName)}
										aria-controls={`collapse-${reportName}`}
										aria-expanded={isOpen}
									>
										{isOpen
											? "Hide Fields"
											: "Show Default Fields"}
									</Button>
									<Button
										variant="outline-primary"
										size="sm"
										disabled
									>
										Customize
									</Button>
								</Stack>

								<Collapse in={isOpen}>
									<div
										id={`collapse-${reportName}`}
										className=""
									>
										<ul className="mb-0 ps-3">
											{headersArray.map(
												(header, index) => (
													<li key={index}>
														{header.label}
													</li>
												)
											)}
										</ul>
									</div>
								</Collapse>
							</Card.Body>
						</Card>
					</div>
				);
			})}
		</div>
	);
};

export default ReportSelection;
