import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const DateRangePicker = ({
	startDate,
	endDate,
	onStartChange,
	onEndChange,
}) => {
	return (
		<Form>
			<Row className="g-2 align-items-end">
				<Col md={12} lg={6}>
					<Form.Group controlId="startDate">
						<Form.Label>Start Date</Form.Label>
						<Form.Control
							type="date"
							value={startDate}
							onChange={(e) => onStartChange(e.target.value)}
						/>
					</Form.Group>
				</Col>
				<Col md={12} lg={6}>
					<Form.Group controlId="endDate">
						<Form.Label>End Date</Form.Label>
						<Form.Control
							type="date"
							value={endDate}
							onChange={(e) => onEndChange(e.target.value)}
						/>
					</Form.Group>
				</Col>
			</Row>
		</Form>
	);
};

export default DateRangePicker;
