import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { extractMonthYear } from "../../utils/getTime";

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
	const selectedDate = extractMonthYear(date.start);
	const currentYear = new Date().getFullYear();
	const yearRange = Array.from({ length: 10 }, (_, i) => currentYear - i);

	const [month, setMonth] = useState(selectedDate.month);
	const [year, setYear] = useState(selectedDate.year);

	const handleMonthChange = (e) => {
		setMonth(e.target.value);
		onChange?.(e.target.value, year);
	};

	const handleYearChange = (e) => {
		setYear(e.target.value);
		onChange?.(month, e.target.value);
	};

	return (
		<Row>
			<Form.Group as={Row} className="mb-3" controlId="monthYearSelector">
				<Col lg={12}>
					<Form.Label>Select Month & Year</Form.Label>
				</Col>
				<Col md={6}>
					<Form.Select value={month} onChange={handleMonthChange}>
						{months.map((m) => (
							<option key={m.value} value={m.value}>
								{m.name}
							</option>
						))}
					</Form.Select>
				</Col>
				<Col md={6}>
					<Form.Select value={year} onChange={handleYearChange}>
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
