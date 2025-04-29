import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const SecondaryFileTab = (params) => {
	return (
		<Form>
			{/* <Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Secondary Feed File Url:
				</Form.Label>
				<Col sm={8}>
					<Form.Control
						size="sm"
						type="text"
						defaultValue="https://feedURL.xml"
					/>
				</Col>
			</Row> */}

			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Secondary Feed Delimiter:
				</Form.Label>
				<Col sm={4}>
					<code>
						<Form.Select size="sm" defaultValue="">
							<option value="">{params.delimiter}</option>
							<option value=",">comma</option>
							<option value="|">pipe "|"</option>
							<option value="tab">tab</option>
							<option value=";">semicolon</option>
							<option value="xml">xml</option>
						</Form.Select>
					</code>
				</Col>
			</Row>

			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Secondary Feed Column Layout:
				</Form.Label>
				<Col sm={8}>
					<Form.Control
						size="sm"
						type="text"
						defaultValue={params.mappedVarStr}
					/>
				</Col>
			</Row>

			<Row className="mb-3">
				<Form.Label column sm={4} className="text-end fw-bold">
					Secondary Feed Skip Rows:
				</Form.Label>
				<Col sm={2}>
					<Form.Select size="sm" defaultValue="1">
						{Array.from({ length: 50 }, (_, i) => (
							<option key={i} value={i}>
								{i}
							</option>
						))}
					</Form.Select>
				</Col>
			</Row>

			<hr className="my-3" />

			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Key Field(s):
				</Form.Label>
				<Col sm={8}>
					<Form.Control
						size="sm"
						type="text"
						defaultValue="variant-sku"
					/>
				</Col>
			</Row>
			<Row className="mb-1">
				<Col
					sm={{ span: 8, offset: 4 }}
					className="fst-italic text-muted"
				>
					(Enter pipe-delimited list of fields from secondary feed
					file.)
				</Col>
			</Row>

			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Join Field(s):
				</Form.Label>
				<Col sm={8}>
					<Form.Control
						size="sm"
						type="text"
						defaultValue="strAttribute1"
					/>
				</Col>
			</Row>
			<Row className="mb-3">
				<Col
					sm={{ span: 8, offset: 4 }}
					className="fst-italic text-muted"
				>
					(Enter pipe-delimited list of fields from primary feed
					file.)
				</Col>
			</Row>

			<hr className="my-3" />
			<h6 className="text-muted">
				Variants XML Construction From Secondary Feed
			</h6>

			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Group Variants?
				</Form.Label>
				<Col sm={1}>
					<Form.Check type="checkbox" defaultChecked />
				</Col>
			</Row>

			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Group By Field(s):
				</Form.Label>
				<Col sm={8}>
					<Form.Control
						size="sm"
						type="text"
						defaultValue="strProductSKU"
					/>
				</Col>
			</Row>
			<Row>
				<Col
					sm={{ span: 8, offset: 4 }}
					className="fst-italic text-muted mb-3"
				>
					(Enter pipe-delimited list of fields from secondary feed
					file.)
				</Col>
			</Row>
		</Form>
	);
};

export default SecondaryFileTab;
