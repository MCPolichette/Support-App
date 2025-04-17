import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const UpdateKey = ({ onClose, Warnings }) => {
	const [uuid, setUuid] = useState(localStorage.getItem("avl_UUID") || "");
	const [showForm, setShowForm] = useState(true);
	const [error, setError] = useState("");

	const handleSaveUUID = () => {
		if (uuid.length === 32) {
			localStorage.setItem("avl_UUID", uuid);
			setShowForm(false);
			setError("");
		} else {
			setError("UUID must be exactly 33 characters long.");
		}
	};

	return (
		<div>
			{Warnings}

			{showForm ? (
				<div className="p-3 bg-white border rounded shadow-sm">
					<Form.Group className="mb-3" controlId="uuidInput">
						<Form.Label>Enter UUID:</Form.Label>
						<Form.Control
							type="text"
							value={uuid}
							onChange={(e) => setUuid(e.target.value)}
							isInvalid={!!error}
						/>
						<Form.Control.Feedback type="invalid">
							{error}
						</Form.Control.Feedback>
					</Form.Group>
					<Button variant="primary" onClick={handleSaveUUID}>
						Save
					</Button>
				</div>
			) : (
				<Alert variant="success" className="mt-3">
					UUID saved! ✅
				</Alert>
			)}
		</div>
	);
};

export default UpdateKey;
