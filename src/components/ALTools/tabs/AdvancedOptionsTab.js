import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const AdvancedOptionsTab = () => {
	return (
		<Form style={{ fontSize: "0.8rem" }}>
			{/* Checkboxes */}
			{[
				[
					"Disguise Downloads?",
					"(For http downloads only: disallow gzip compression and obfuscate user agent.)",
				],
				[
					"Repeat Downloads?",
					"(If the first download attempt fails, try again a few minutes later.)",
				],
				[
					"Convert XML Format?",
					"(Convert non-ASCII XML to regular ASCII.)",
				],
				[
					"Convert Line Endings?",
					"(Convert literal '\\n' text to line feeds.)",
				],
				[
					"Strip Control Characters?",
					"(Remove non-printable unicode characters)",
				],
			].map(([label, description], idx) => (
				<Row className="mb-2" key={idx}>
					<Form.Label column sm={4} className="text-end fw-bold">
						{label}
					</Form.Label>
					<Col sm={8}>
						<Form.Check
							type="checkbox"
							label={
								<span className="fw-normal">{description}</span>
							}
						/>
					</Col>
				</Row>
			))}

			<hr className="my-3" />

			{/* Substitute Sale Price */}
			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Substitute Sale Price?
				</Form.Label>
				<Col sm={8}>
					<Form.Check
						type="checkbox"
						defaultChecked
						label={
							<span className="fw-normal">
								(If the regular product price is empty or $0,
								the sale price
								<br />
								will be used if available.)
							</span>
						}
					/>
				</Col>
			</Row>

			{/* Currency Conversion */}
			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Convert Pricing Currency?
				</Form.Label>
				<Col sm={4}>
					<Form.Select size="sm" defaultValue="">
						<option value=""></option>
						<option value="AUD">AUD - Australian Dollars</option>
						<option value="CAD">CAD - Canadian Dollars</option>
						<option value="CHF">CHF - Swiss Francs</option>
						<option value="EUR">EUR - Euros</option>
						<option value="GBP">GBP - British Pounds</option>
						<option value="JPY">JPY - Japanese Yen</option>
						<option value="NZD">NZD - New Zealand Dollars</option>
						<option value="USD">USD - U.S. Dollars</option>
					</Form.Select>
				</Col>
			</Row>
			<Row className="mb-3">
				<Col
					sm={{ span: 8, offset: 4 }}
					className="fst-italic text-muted"
				>
					(Convert all product pricing{" "}
					<strong>
						<em>from</em>
					</strong>{" "}
					this currency to the proper network currency.)
				</Col>
			</Row>

			<hr className="my-3" />

			{/* Category Handling */}
			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Explode Category Information?
				</Form.Label>
				<Col sm={1}>
					<Form.Check type="checkbox" />
				</Col>
			</Row>
			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Category Piece Delimiter:
				</Form.Label>
				<Col sm={2}>
					<Form.Control size="sm" type="text" defaultValue=">" />
				</Col>
			</Row>
			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Minimum Required Pieces:
				</Form.Label>
				<Col sm={2}>
					<Form.Select size="sm" defaultValue="0">
						{Array.from({ length: 11 }, (_, i) => (
							<option key={i} value={i}>
								{i}
							</option>
						))}
					</Form.Select>
				</Col>
			</Row>
			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Reverse Piece Order?
				</Form.Label>
				<Col sm={1}>
					<Form.Check type="checkbox" />
				</Col>
			</Row>
			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Starting Piece Index:
				</Form.Label>
				<Col sm={2}>
					<Form.Select size="sm" defaultValue="0">
						{Array.from({ length: 11 }, (_, i) => (
							<option key={i} value={i}>
								{i}
							</option>
						))}
					</Form.Select>
				</Col>
			</Row>
			<Row className="mb-3">
				<Form.Label column sm={4} className="text-end fw-bold">
					Shift Empty Categories?
				</Form.Label>
				<Col sm={8}>
					<Form.Check
						type="checkbox"
						label={
							<span className="fw-normal">
								(Applied after category parsing and field
								builder rules.)
							</span>
						}
					/>
				</Col>
			</Row>

			<hr className="my-3" />

			{/* Deduping */}
			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Dedupe Sequentially?
				</Form.Label>
				<Col sm={8}>
					<Form.Check
						type="checkbox"
						label={
							<span className="fw-normal">
								(Sequential deduping considers only the previous
								one record.)
							</span>
						}
					/>
				</Col>
			</Row>
			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Dedupe By Field(s):
				</Form.Label>
				<Col sm={8}>
					<Form.Control size="sm" type="text" />
				</Col>
			</Row>
			<Row className="mb-3">
				<Col
					sm={{ span: 8, offset: 4 }}
					className="fst-italic text-muted"
				>
					(Enter pipe-delimited list of fields.)
				</Col>
			</Row>

			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Dedupe Globally?
				</Form.Label>
				<Col sm={8}>
					<Form.Check
						type="checkbox"
						label={
							<span className="fw-normal">
								(Global deduping considers all previous
								records.)
							</span>
						}
					/>
				</Col>
			</Row>
			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Dedupe By Field(s):
				</Form.Label>
				<Col sm={8}>
					<Form.Control
						size="sm"
						type="text"
						defaultValue="strProductSKU"
					/>
				</Col>
			</Row>
			<Row className="mb-3">
				<Col
					sm={{ span: 8, offset: 4 }}
					className="fst-italic text-muted"
				>
					(Enter pipe-delimited list of fields.)
				</Col>
			</Row>

			<hr className="my-3" />

			{/* Image and URL Deduping */}
			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Skip URL Deduping?
				</Form.Label>
				<Col sm={8}>
					<Form.Check
						type="checkbox"
						label={
							<span className="fw-normal">
								(Do not remove products with identical Buy and
								Image URLs.)
							</span>
						}
					/>
				</Col>
			</Row>

			<hr className="my-3" />

			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Auto-scale Imagery?
				</Form.Label>
				<Col sm={8}>
					<Form.Check
						type="checkbox"
						defaultChecked
						label={
							<span className="fw-normal">
								(Rewrite all product image URLs to go through
								our scaling script.)
							</span>
						}
					/>
				</Col>
			</Row>

			<hr className="my-3" />

			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Add Variant IBC Records?
				</Form.Label>
				<Col sm={8}>
					<Form.Check
						type="checkbox"
						label={
							<span className="fw-normal">
								(If variant details are available, add one
								item-based commission record
								<br />
								for each variant SKU, in addition to the
								overall/parent product SKU.)
							</span>
						}
					/>
				</Col>
			</Row>
		</Form>
	);
};

export default AdvancedOptionsTab;
