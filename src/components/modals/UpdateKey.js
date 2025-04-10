import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const UpdateKey = ({ onClose }) => {
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
			<Alert variant="danger">
				<Alert.Heading>⚠️ Important Report Notice</Alert.Heading>
				<p>
					This report has been updated with backlogged data going back
					to <strong>2023</strong>.
				</p>
				<p className="mb-0">
					<strong>
						Please leave the START date set to January 1st, 2025
					</strong>{" "}
					to ensure an accurate report. You may select any END DATE up
					to <strong>yesterday</strong>.
				</p>
			</Alert>

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
