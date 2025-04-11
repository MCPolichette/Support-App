import React from "react";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const statusStyles = {
	success: "border-success text-success",
	warning: "border-warning text-warning",
	danger: "border-danger text-danger",
};

export default function StatusCard({
	status = "success",
	title = "Status Report",
	items = [],
}) {
	const styleClass =
		statusStyles[status] || "border-secondary text-secondary";

	return (
		<Card
			className={`mb-3 shadow-sm ${styleClass}`}
			style={{ borderWidth: "2px" }}
		>
			<Card.Body>
				<Card.Title className="fw-bold">{title}</Card.Title>
				<ul className="mb-0 ps-4">
					{items.map((item, idx) => (
						<li key={idx}>{item}</li>
					))}
				</ul>
			</Card.Body>
		</Card>
	);
}
