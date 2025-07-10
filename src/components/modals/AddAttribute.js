import React, { useState } from "react";
import { Form, Button, InputGroup, Row, Col, Alert } from "react-bootstrap";

const AddAttribute = ({ onConfirm, mapping = [], header }) => {
	console.log(header);
	const [customTitle, setCustomTitle] = useState(header);

	// Get already used txtAttributes
	const used = mapping.map((m) => m.fieldName);
	const available = Array.from(
		{ length: 9 },
		(_, i) => `txtAttribute${i + 2}`
	);
	const nextAttr = available.find((a) => !used.includes(a));
	const attributeFields = mapping.filter((m) =>
		/Attribute\d+$/.test(m.fieldName)
	);

	const handleConfirm = () => {
		if (!nextAttr || !customTitle) return;
		onConfirm(header || "", nextAttr, {
			valueTitle: customTitle,
		});
		setCustomTitle("");
	};
	if (!header) {
		return (
			<Alert variant="warning">
				Cannot add attribute — no header selected.
			</Alert>
		);
	}

	return (
		<Row className="align-items-end ">
			<Col md={6}>
				{!nextAttr ? (
					<Alert variant="danger">
						No available txtAttribute slots left (2–10).
					</Alert>
				) : (
					<Form.Group controlId="customAttrInput">
						<Form.Label>
							<h6>Add Custom Attribute</h6>
						</Form.Label>
						<p>auto-populated with the file's column header</p>
						<InputGroup>
							<Form.Control
								type="text"
								placeholder="e.g. Material Type"
								value={customTitle}
								onChange={(e) => setCustomTitle(e.target.value)}
							/>
							<Button
								variant="outline-primary"
								onClick={handleConfirm}
								disabled={!customTitle}
							>
								Add
							</Button>
						</InputGroup>
					</Form.Group>
				)}
			</Col>

			<Col md={6}>
				<h6 className="mt-2">Mapped Custom Attributes</h6>
				<ul className="mb-2">
					{attributeFields.map((field, i) => (
						<li key={i}>
							<b>{field.valueTitle}</b> as:{" "}
							<code>{field.fieldName}</code>
						</li>
					))}
				</ul>

				<code hidden id="attMapTxt">
					{"<Fields>\n"}
					{attributeFields.map(
						(field) =>
							`<Field><name>${field.fieldName}</name><title>${field.valueTitle}</title><type>${field.valueType}</type></Field>\n`
					)}
					{"</Fields>"}
				</code>
			</Col>
		</Row>
	);
};

export default AddAttribute;
