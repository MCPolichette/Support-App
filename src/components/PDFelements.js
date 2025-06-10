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
				fontSize: 10,
				position: "fixed",
				bottom: "1em",
				right: "1.8em",
				width: "200px",
			}}
			className="p-3 rounded transition-shadow my-card"
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
					<p>
						All Green and Yellow Elements will be auto-removed upon
						clicking the print button
					</p>
				)}
				<Col>
					<Stack>
						<Button size="sm" variant="warning" onClick={onClick}>
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
		<div
			className="position-relative   force-page-break"
			style={{ height: "2em" }}
		>
			<Badge
				size="sm"
				pill
				bg="success"
				text="light"
				className="d-print-none"
				style={{
					top: "0em",
					left: "-25em",
					zIndex: 10,
					opacity: 0.8,
				}}
			>
				PDF PAGE BREAK
			</Badge>
		</div>
	);
};
