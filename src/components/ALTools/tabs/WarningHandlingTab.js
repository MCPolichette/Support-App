import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const WarningHandlingTab = () => {
	return (
		<Form style={{ fontSize: "0.8rem" }}>
			{/* Ignore variation in */}
			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Ignore variation in:
				</Form.Label>
				<Col sm={8}>
					<Form.Check
						type="checkbox"
						label="Product counts"
						id="blnSkipWarningProductCount"
						defaultChecked
					/>
					<Form.Check
						type="checkbox"
						label="Product SKUs"
						id="blnSkipWarningMatchSku"
						defaultChecked
					/>
					<Form.Check
						type="checkbox"
						label="Departments"
						id="blnSkipWarningMatchDepartment"
						defaultChecked
					/>
					<Form.Check
						type="checkbox"
						label="Categories"
						id="blnSkipWarningMatchCategory"
						defaultChecked
					/>
					<Form.Check
						type="checkbox"
						label="Subcategories"
						id="blnSkipWarningMatchSubCategory"
						defaultChecked
					/>
				</Col>
			</Row>

			{/* Ignore accessibility of */}
			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Ignore accessibility of:
				</Form.Label>
				<Col sm={8}>
					<Form.Check
						type="checkbox"
						label="Buy URLs"
						id="blnSkipWarningAccessibleBuyUrl"
					/>
					<Form.Check
						type="checkbox"
						label="Thumbnail Images"
						id="blnSkipWarningAccessibleThumbnailImage"
					/>
					<Form.Check
						type="checkbox"
						label="Large Images"
						id="blnSkipWarningAccessibleLargeImage"
					/>
				</Col>
			</Row>
		</Form>
	);
};

export default WarningHandlingTab;
