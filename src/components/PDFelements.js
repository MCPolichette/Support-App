import React, { useState } from "react";
import {
	Alert,
	Row,
	Col,
	Stack,
	Button,
	Badge,
	CloseButton,
} from "react-bootstrap";

export const FloatingCenterButton = ({ onClick, label = "Download PDF" }) => {
	const [showNotes, setShowNotes] = useState(true);
	const [showMenus, setShowMenus] = useState(true);
	const toggleMenus = () => {
		const element = document.getElementById("report_pdf");
		if (!element) return console.error("Missing #report_pdf element");
		const hiddenEls = element.querySelectorAll(".d-print-none");
		if (showMenus === true) {
			hiddenEls.forEach((el) => (el.hidden = true));
			setShowMenus(false);
		} else {
			hiddenEls.forEach((el) => (el.hidden = true));
			setShowMenus(true);
		}
	};

	return (
		<Alert
			variant="warning"
			style={{
				position: "fixed",
				bottom: "1em",
				right: "10%",
				width: "25%",
				zIndex: 9998,
			}}
		>
			<Row>
				{showNotes && (
					<CloseButton
						style={{
							position: "fixed",
							top: "-1em",

							zIndex: 9999,
						}}
						onClick={() => setShowNotes(false)}
						className="position-relative d-print-none force-page-break"
					/>
				)}
				{showNotes && (
					<Col lg={6}>
						All Green and Yellow Elements will be auto-removed upon
						clicking the print button
					</Col>
				)}
				<Col>
					<Stack>
						<Button size="lg" variant="warning" onClick={onClick}>
							Click Here To Print this Report
						</Button>
						<Button
							variant="Warning"
							onClick={() => {
								toggleMenus();
							}}
						>
							Hide tags and dropdowns
						</Button>
					</Stack>
				</Col>
			</Row>
		</Alert>
	);
};
export const PageBreaker = () => {
	return (
		<div className="position-relative d-print-none force-page-break">
			<Badge
				size="sm"
				pill
				bg="success"
				text="light"
				className="position-absolute  "
				style={{
					top: "1em",
					left: "-11em",
					zIndex: 10,
					opacity: 0.8,
				}}
			>
				PDF PAGE BREAK
			</Badge>
		</div>
	);
};
