// components/cards/ReportCard.js
import React from "react";
import { Card, Stack, Form, Button } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

const ReportCard = ({
	reportName,
	reportConfig,
	categoryName,
	onToggleInReport,
	onEdit,
	onDelete,
}) => {
	const headersArray = Array.isArray(reportConfig.headers)
		? reportConfig.headers
		: [];

	const variant = reportConfig.custom ? "info" : "light";

	return (
		<Card bg={variant} text="dark" className="small shadow-sm mb-2">
			<Card.Body className="d-flex flex-column">
				<Card.Title
					style={{ fontSize: ".8em" }}
					className="text-truncate"
					title={reportName}
				>
					{reportName.replaceAll("_", " ")}
					{reportConfig.custom && (
						<span className="ms-1 badge bg-warning text-dark">
							Custom
						</span>
					)}{" "}
				</Card.Title>{" "}
				<Form.Check
					type="checkbox"
					id={`inreport-toggle-${reportName}`}
					label="Use in this Report"
					className="ms-1 text-nowrap"
					checked={!!reportConfig.inReport}
					onChange={() => onToggleInReport(reportName)}
				/>
				<ul className="mb-0 ps-3 mt-2">
					{headersArray.map((header, index) => (
						<li key={index}>{header.label}</li>
					))}
				</ul>
				<Stack>
					<Button
						variant="outline-primary"
						size="sm"
						className="mt-1"
						disabled={!reportConfig.customizable}
						onClick={() =>
							onEdit(reportName, reportConfig, categoryName)
						}
					>
						Customize
					</Button>

					{reportConfig.custom && (
						<Button
							variant="outline-danger"
							size="sm"
							className="mt-1 d-flex align-items-center justify-content-center"
							onClick={() => onDelete(reportName, categoryName)}
							title="Delete Custom Report"
						>
							<Trash />
						</Button>
					)}
				</Stack>
			</Card.Body>
		</Card>
	);
};

export default ReportCard;
