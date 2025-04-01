import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const MapModal = ({ show, onClose, mapping = [] }) => {
	const [copied, setCopied] = useState(false);

	const mappedStr = mapping.map((m) => m.fieldName).join("|");

	const handleCopy = () => {
		navigator.clipboard.writeText(mappedStr).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		});
	};

	return (
		<Modal show={show} onHide={onClose} centered size="lg">
			<Modal.Header closeButton>
				<Modal.Title>Mapped Fields</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="mb-3">
					<pre className="bg-light p-2 border rounded text-wrap">
						{mappedStr || "No fields mapped yet."}
					</pre>
					<Button
						variant="outline-primary"
						onClick={handleCopy}
						disabled={!mappedStr}
					>
						{copied ? "Copied!" : "Copy to Clipboard"}
					</Button>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onClose}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default MapModal;
