import React from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const StylizedModal = ({
	show,
	onHide,
	title,
	children,
	footer,
	size = "lg",
}) => {
	return (
		<Modal show={show} onHide={onHide} centered size={size}>
			<Modal.Header closeButton className="bg-dark text-white">
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body className="bg-light p-4 rounded shadow-sm">
				{children}
			</Modal.Body>
			{footer !== false && (
				<Modal.Footer className="bg-light">
					{footer || (
						<Button variant="secondary" onClick={onHide}>
							Close
						</Button>
					)}
				</Modal.Footer>
			)}
		</Modal>
	);
};

export default StylizedModal;
