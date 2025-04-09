import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateKey = () => {
	const [uuid, setUuid] = useState(localStorage.getItem("avl_UUID") || "");
	const [showModal, setShowModal] = useState(true);
	const [error, setError] = useState("");

	const handleSaveUUID = () => {
		if (uuid.length === 32) {
			localStorage.setItem("avl_UUID", uuid);
			setShowModal(false);
			setError("");
		} else {
			setError("UUID must be exactly 33 characters long.");
		}
	};

	return (
		<div className="container mt-5">
			<h2 className="mb-4">Update Key</h2>
			<div className="alert alert-danger mt-4" role="alert">
				<h5 className="alert-heading">⚠️ Important Report Notice</h5>
				<p className="mb-2">
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
			</div>

			{showModal && (
				<div className="card p-4 shadow-sm">
					<div className="mb-3">
						<label htmlFor="uuidInput" className="form-label">
							Enter UUID:
						</label>
						<input
							type="text"
							id="uuidInput"
							className={`form-control ${
								error ? "is-invalid" : ""
							}`}
							value={uuid}
							onChange={(e) => setUuid(e.target.value)}
						/>
						{error && (
							<div className="invalid-feedback">{error}</div>
						)}
					</div>
					<button
						className="btn btn-primary"
						onClick={handleSaveUUID}
					>
						Save
					</button>
				</div>
			)}

			{!showModal && (
				<div className="alert alert-success mt-3">UUID saved! ✅</div>
			)}
		</div>
	);
};

export default UpdateKey;
