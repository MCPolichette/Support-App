import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import ParrallelPulseForm from "../forms/ParrallelPulseForm";

const REIDateConverter = () => {
	const [rangeInput, setRangeInput] = useState("");
	const [convertedRange, setConvertedRange] = useState(null);

	const handleConvert = () => {
		const parts = rangeInput.split("–").map((p) => p.trim());
		if (parts.length !== 2) {
			setConvertedRange("Invalid date range");
			return;
		}

		const [startRaw, endRaw] = parts;
		const [startMonth, startDay, startYear] = startRaw
			.split("/")
			.map(Number);
		const [endMonth, endDay, endYear] = endRaw.split("/").map(Number);
		const pad = (n) => String(n).padStart(2, "0");

		const startFormatted = `${startYear}-${pad(startMonth)}-${pad(
			startDay
		)} 00:00:00`;
		const endFormatted = `${endYear}-${pad(endMonth)}-${pad(
			endDay
		)} 23:59:59`;

		setConvertedRange(`'${startFormatted}' AND '${endFormatted}'`);
	};

	return (
		<>
			<ParrallelPulseForm />
			{/* <Form.Group>
				<Form.Label>
					Enter Date Range (MM/DD/YYYY – MM/DD/YYYY)
				</Form.Label>
				<Form.Control
					type="text"
					value={rangeInput}
					onChange={(e) => setRangeInput(e.target.value)}
					placeholder="e.g. 12/31/2023 – 3/30/2024"
				/>
			</Form.Group>
			<Button variant="primary" className="mt-3" onClick={handleConvert}>
				Convert
			</Button>
			{convertedRange && (
				<div className="mt-3">
					<strong>Converted:</strong> <code>{convertedRange}</code>
				</div>
			)} */}
		</>
	);
};

export default REIDateConverter;
