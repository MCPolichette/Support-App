import React, { useState } from "react";
import { Button, Row, Col, Toast, ToastContainer } from "react-bootstrap";
import SecondaryFileTab from "../ALTools/tabs/SecondaryFileTab";
import CopyToClipboard from "../buttons_and_dropdowns/CopyToClipboard";

const MapModal = ({ mapping = [], type, delimiter }) => {
	const getAttributeFields = (arr) => {
		return arr.filter(
			(obj) => obj.fieldName && obj.fieldName.includes("Attribute")
		);
	};
	const [copied, setCopied] = useState(false);
	const mappedStr = type
		? mapping
				.map((m) => {
					if (m.fieldName === "strProductSKU") return "strAttribute1";
					if (m.fieldName === "strAttribute1") return "strProductSKU";
					return m.fieldName;
				})
				.join("|")
		: mapping.map((m) => m.fieldName).join("|");

	const mappedVarStr = mapping
		.map((m) => (m.variant || m.variant === 0 ? m.variant : ""))
		.join("|");

	const attributeFields = getAttributeFields(mapping || []);

	const copyToClipboard = (id) => {
		const element = document.getElementById(id);
		const copy = element ? element.innerText : id;

		try {
			navigator.clipboard.writeText(copy).then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 1500);
			});
		} catch (err) {
			console.error("Clipboard copy failed:", err);
		}
	};

	return (
		<div className="p-4">
			<Row>
				<h4>"DELIMITER: " {delimiter}</h4>
				<hr></hr>
				<Col md={7}>
					<h6
						style={{ width: "100%", marginTop: "10%" }}
						className="mt-2"
					>
						Attributes Mapped
					</h6>
					<div className="mb-3 d-flex justify-content-between align-items-start gap-2">
						<ul>
							{attributeFields.map((field, i) => (
								<li key={i}>
									<b>{field.valueTitle} </b>
									as:
									<code> {field.fieldName}</code> :
									{field.valueType}
								</li>
							))}
						</ul>

						<code hidden id="attMapTxt">
							{"<Fields>\n"}
							{attributeFields.map(
								(field) =>
									"<Field><name>" +
									field.fieldName +
									"</name><title>" +
									field.valueTitle +
									"</title><type>" +
									field.valueType +
									"</type></Field>"
							)}
							{"</Fields>"}
						</code>
					</div>
					<Button
						style={{ width: "100%", marginBottom: "10px" }}
						className="btn-lg btn-block"
						variant="outline-primary"
						onClick={() => copyToClipboard("attMapTxt")}
						disabled={!mappedVarStr}
					>
						Copy Attribute Map
					</Button>
				</Col>
				<Col md={5}>
					<h6>Primary Feed</h6>
					<div className="mb-3 d-flex justify-content-between align-items-start gap-2">
						<pre
							style={{ width: "75%" }}
							className="bg-light p-2 border rounded flex-grow-1"
							id="primaryPipeMap"
						>
							{mappedStr || "No fields mapped yet."}
						</pre>
					</div>
					<CopyToClipboard
						divId="primaryPipeMap"
						text="Copy Primary Map"
					/>

					{type && (
						<div style={{ width: "100%", marginTop: "15%" }}>
							<h6>Secondary Feed</h6>
							<div className="mb-3 d-flex justify-content-between align-items-start gap-2">
								<pre
									style={{ width: "75%" }}
									className="bg-light p-2 border rounded  flex-grow-1"
									id="secondaryPipeMap"
								>
									{mappedVarStr || "No fields mapped yet."}
								</pre>
							</div>
							<CopyToClipboard
								divId="secondaryPipeMap"
								text="Copy Secondary Map"
							/>
						</div>
					)}
				</Col>

				<hr></hr>
			</Row>

			<Row>
				<SecondaryFileTab
					delimiter={delimiter}
					mappedVarStr={mappedVarStr}
				/>
			</Row>
		</div>
	);
};

export default MapModal;
