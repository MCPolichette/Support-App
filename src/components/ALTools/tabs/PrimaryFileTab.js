import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const PrimaryFileTab = () => {
	return (
		<Form>
			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Feed File Url:
				</Form.Label>
				<Col sm={8}>
					<Form.Control
						size="sm"
						type="text"
						defaultValue="https://steals.com/feeds/google-products-feed.xml"
					/>
				</Col>
			</Row>

			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Feed XSLT Path:
				</Form.Label>
				<Col sm={8}>
					<Form.Control
						size="sm"
						type="text"
						defaultValue="/home/calico/logic/Google_RSS_V1.xsl"
					/>
				</Col>
			</Row>

			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Feed Delimiter:
				</Form.Label>
				<Col sm={4}>
					<Form.Select size="sm" defaultValue=",">
						<option value=""></option>
						<option value=",">comma</option>
						<option value="|">pipe "|"</option>
						<option value="tab">tab</option>
						<option value=";">semicolon</option>
					</Form.Select>
				</Col>
			</Row>

			<Row className="mb-2">
				<Form.Label
					column
					sm={4}
					className="text-end text-danger fw-bold"
				>
					Feed Column Layout:
				</Form.Label>
				<Col sm={8}>
					<Form.Control
						size="sm"
						type="text"
						defaultValue="strAttribute1|strProductSKU|strProductName|strBuyURL|strLargeImage|dblProductPrice|dblProductSalePrice|strManufacturerPartNumber|strBrandName|strDepartment|strCategory||||strAttribute5|strAttribute6|strAttribute7|strAttribute8|strAttribute9||txtAttribute2|txtAttribute3|txtAttribute4|txtAttribute5|dblItemCommission|txtAttribute6|txtAttribute7|txtAttribute8|txtAttribute9|txtAttribute10|txtShortDescription|txtLongDescription|txtAttribute1|"
					/>
				</Col>
			</Row>

			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Feed Skip Rows:
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
		</Form>
	);
};

export default PrimaryFileTab;
