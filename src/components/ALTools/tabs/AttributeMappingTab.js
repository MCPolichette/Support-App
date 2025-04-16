import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const AttributeMappingTab = () => {
	return (
		<Form>
			<Row className="mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Attribute Column Mapping:
				</Form.Label>
				<Col sm={8}>
					<Form.Control
						as="textarea"
						rows={15}
						cols={65}
						style={{
							fontSize: "0.75rem",
							fontFamily: "monospace",
							whiteSpace: "pre",
						}}
						defaultValue={`<Fields>
</Fields>`}
					/>
				</Col>
			</Row>

			<Row className="mt-4 mb-2">
				<Form.Label column sm={4} className="text-end fw-bold">
					Example:
				</Form.Label>
				<Col sm={8}>
					<div
						style={{
							fontSize: "0.75rem",
							fontFamily: "monospace",
							whiteSpace: "pre-wrap",
						}}
					>
						&lt;Fields&gt;
						<br />
						<br />
						&lt;Field&gt;&lt;name&gt;strAttribute1&lt;/name&gt;&lt;title&gt;Keyword&lt;/title&gt;&lt;type&gt;string&lt;/type&gt;&lt;/Field&gt;
						<br />
						<br />
						&lt;Field&gt;&lt;name&gt;strAttribute4&lt;/name&gt;&lt;title&gt;Brand
						Sale
						URL&lt;/title&gt;&lt;type&gt;link&lt;/type&gt;&lt;/Field&gt;
						<br />
						<br />
						&lt;Field&gt;&lt;name&gt;txtAttribute1&lt;/name&gt;&lt;title&gt;Variants
						XML&lt;/title&gt;&lt;type&gt;xml&lt;/type&gt;&lt;compression&gt;gz&lt;/compression&gt;&lt;/Field&gt;
						<br />
						<br />
						&lt;/Fields&gt;
					</div>
				</Col>
			</Row>
		</Form>
	);
};

export default AttributeMappingTab;
