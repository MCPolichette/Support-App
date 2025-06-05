import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { extractMonthYear, getMonthRange } from "../../utils/getTime";

const MonthYearSelector = ({ date, onChange }) => {
	const months = [
		{ value: "01", name: "January" },
		{ value: "02", name: "February" },
		{ value: "03", name: "March" },
		{ value: "04", name: "April" },
		{ value: "05", name: "May" },
		{ value: "06", name: "June" },
		{ value: "07", name: "July" },
		{ value: "08", name: "August" },
		{ value: "09", name: "September" },
		{ value: "10", name: "October" },
		{ value: "11", name: "November" },
		{ value: "12", name: "December" },
	];
	const currentYear = new Date().getFullYear();
	const yearRange = Array.from({ length: 10 }, (_, i) => currentYear - i);

	const handleMonthChange = (e) => {
		onChange({ ...date, month: e.target.value });
	};

	const handleYearChange = (e) => {
		onChange({ ...date, year: e.target.value });
	};

	return (
		<Row>
			<Form.Group as={Row} className="mb-3" controlId="monthYearSelector">
				<Col lg={12}>
					<Form.Label>Select Month & Year</Form.Label>
				</Col>
				<Col md={6}>
					<Form.Select
						value={date.month}
						onChange={handleMonthChange}
					>
						{months.map((m) => (
							<option key={m.value} value={m.value}>
								{m.name}
							</option>
						))}
					</Form.Select>
				</Col>
				<Col md={6}>
					<Form.Select value={date.year} onChange={handleYearChange}>
						{yearRange.map((y) => (
							<option key={y} value={y}>
								{y}
							</option>
						))}
					</Form.Select>
				</Col>
			</Form.Group>
		</Row>
	);
};

export default MonthYearSelector;
