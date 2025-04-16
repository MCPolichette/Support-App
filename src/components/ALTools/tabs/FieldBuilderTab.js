import React from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";

const FieldBuilderTab = () => {
	const maxFields = 7;

	const buildRows = Array.from({ length: maxFields }, (_, i) => ({
		fieldName:
			i === 0
				? "strDepartment"
				: i === 1
				? "txtAttribute1"
				: i === 2
				? "txtLongDescription"
				: i === 3
				? "strProductSKU"
				: "",
		formula:
			i === 1
				? "%%FILE2.txtAttribute1%%"
				: i === 2
				? ""
				: i === 3
				? ""
				: "",
		search: i === 0 || i === 2 || i === 3 ? "#^$#" : "",
		replace:
			i === 0
				? "General"
				: i === 2
				? "%%strProductName%%"
				: i === 3
				? "%%strAttribute1%%"
				: "",
		format: "",
	}));

	return (
		<Form style={{ fontSize: "0.8rem" }}>
			<Row className="mb-3">
				<Col sm={{ span: 8, offset: 2 }}>
					<strong>
						<a
							href="javascript:void 0"
							onClick={() =>
								window.open(
									"help.php?page=merchant_datafeed_build_fields",
									"help",
									"width=800,height=600,directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no"
								)
							}
						>
							<img
								src="https://classic.avantlink.com/images/icons/help.png"
								alt="help"
								style={{ border: "0", marginRight: "0.5rem" }}
							/>
						</a>
						Field Builder - create or modify custom fields:
					</strong>
				</Col>
			</Row>

			{buildRows.map((row, i) => (
				<div key={i} className="mb-3 border-bottom pb-3">
					<Row className="align-items-center mb-2">
						<Form.Label column sm={2} className="text-end fw-bold">
							#{i + 1}) Field:
						</Form.Label>
						<Col sm={3}>
							<Form.Control
								size="sm"
								type="text"
								defaultValue={row.fieldName}
							/>
						</Col>
						<Col sm="auto">
							<strong>=</strong>
						</Col>
						<Col sm={5}>
							<Form.Control
								size="sm"
								type="text"
								defaultValue={row.formula}
							/>
						</Col>
					</Row>

					<Row className="align-items-center mb-2">
						<Form.Label column sm={2} className="text-end fw-bold">
							Regex search for
						</Form.Label>
						<Col sm={4}>
							<Form.Control
								size="sm"
								type="text"
								defaultValue={row.search}
							/>
						</Col>
						<Col sm="auto">
							<strong>replace with</strong>
						</Col>
						<Col sm={4}>
							<Form.Control
								size="sm"
								type="text"
								defaultValue={row.replace}
							/>
						</Col>
					</Row>

					<Row className="align-items-center">
						<Form.Label column sm={2} className="text-end fw-bold">
							Formatting:
						</Form.Label>
						<Col sm={4}>
							<Form.Select size="sm" defaultValue={row.format}>
								<option value="">None</option>
								<option value="strtolower">Lower Case</option>
								<option value="pcase">Proper Case</option>
								<option value="strtoupper">Upper Case</option>
								<option value="trim">Trim</option>
							</Form.Select>
						</Col>
					</Row>
				</div>
			))}
		</Form>
	);
};

export default FieldBuilderTab;
