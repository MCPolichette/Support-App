import React, { useState } from "react";
import { Form, Button, InputGroup, Row, Col, Alert } from "react-bootstrap";

//TODO: Filters for ampersands and other characters that may adversly affect the link parameters.  (encoding may be optional)
const UTMBuilder = () => {
	const [utm, setUtm] = useState({
		utm_campaign: "",
		utm_source: "",
		utm_medium: "",
	});
	const [otherFields, setOtherFields] = useState([]);
	const [output, setOutput] = useState("");

	const handleChange = (key, value) => {
		setUtm((prev) => ({ ...prev, [key]: value }));
	};

	const handleOtherChange = (index, key, value) => {
		const updated = [...otherFields];
		updated[index] = { key, value };
		setOtherFields(updated);
	};

	const addOtherField = () => {
		setOtherFields([...otherFields, { key: "", value: "" }]);
	};

	const buildQueryString = () => {
		const staticParts = Object.entries(utm)
			.filter(([, value]) => value.trim() !== "")
			.map(([key, value]) => `${key}=${value.trim()}`);

		const dynamicParts = otherFields
			.filter((f) => f.key.trim() && f.value.trim())
			.map((f) => `${f.key.trim()}=${f.value.trim()}`);

		const allParams = [...staticParts, ...dynamicParts].join("&");
		setOutput(`avad=[COOKIE_STRING]&${allParams}`);
	};

	return (
		<div className="p-4">
			<Row>
				<Col md={7}>
					<h4>UTM Builder</h4>

					<Form>
						<InputGroup className="mb-2">
							<InputGroup.Text>utm_campaign =</InputGroup.Text>
							<Form.Control
								type="text"
								value={utm.utm_campaign}
								onChange={(e) =>
									handleChange("utm_campaign", e.target.value)
								}
							/>
						</InputGroup>

						<InputGroup className="mb-2">
							<InputGroup.Text>utm_source =</InputGroup.Text>
							<Form.Control
								type="text"
								value={utm.utm_source}
								onChange={(e) =>
									handleChange("utm_source", e.target.value)
								}
							/>
						</InputGroup>

						<InputGroup className="mb-2">
							<InputGroup.Text>utm_medium =</InputGroup.Text>
							<Form.Control
								type="text"
								value={utm.utm_medium}
								onChange={(e) =>
									handleChange("utm_medium", e.target.value)
								}
							/>
						</InputGroup>
						{otherFields.map((field, index) => (
							<Row key={index} className="mb-2">
								<Col md={5}>
									<InputGroup>
										<InputGroup.Text>param</InputGroup.Text>
										<Form.Control
											type="text"
											placeholder="param"
											value={field.key}
											onChange={(e) =>
												handleOtherChange(
													index,
													e.target.value,
													field.value
												)
											}
										/>
									</InputGroup>
								</Col>
								<Col md={7}>
									<InputGroup>
										<InputGroup.Text>=</InputGroup.Text>
										<Form.Control
											type="text"
											placeholder="value"
											value={field.value}
											onChange={(e) =>
												handleOtherChange(
													index,
													field.key,
													e.target.value
												)
											}
										/>
									</InputGroup>
								</Col>
							</Row>
						))}
						<Button
							variant="secondary"
							onClick={addOtherField}
							className="mb-3"
						>
							Add More Fields
						</Button>

						<div>
							<Button
								variant="primary"
								onClick={buildQueryString}
							>
								GO!
							</Button>
						</div>
					</Form>

					{output && (
						<Alert variant="success" className="mt-4">
							<code>{output}</code>
						</Alert>
					)}
				</Col>
				<Col md={5}>
					<h6 className="mt-2">AvantLink Dynamic Variables</h6>
					<ul style={{ fontSize: "0.9em", paddingLeft: "1.2em" }}>
						<li>
							<code>[PUBLISHER_ID]</code> – AvantLink Affiliate ID
						</li>
						<li>
							<code>[WEBSITE_ID]</code> – For affiliates with
							multiple websites
						</li>
						<li>
							<code>[TOOL_TYPE]</code> – "ml", "cl", "df", etc.
						</li>
						<li>
							<code>[AD_NAME]</code> – Name of the ad/tool being
							used
						</li>
						<li>
							<code>[AD_ID]</code> – ID of the selected ad
						</li>
						<li>
							<code>[WEBSITE_URL]</code> – returns the whole
							Website URL
						</li>
						<hr></hr>
						<li>
							<code>[COOKIE_STRING]</code> - Our "avad" Website ID
							followed by unique clickthrough ID
						</li>

						<li>
							<code>[MERCHANT_TAG_GROUPS]</code>
						</li>
						<li>
							<code>[MERCHANT_TAG_CATEGORY]</code>
						</li>
						<li>
							<code>[MERCHANT_GROUP_TAG_GROUPS]</code>
						</li>
						<li>
							<code>[MERCHANT_GROUP_TAG_CATEGORY]</code>
						</li>
						<a href="https://support.avantlink.com/hc/en-us/articles/8042980594075-UTM-Parameters-URL-Variables">
							Documentation
						</a>
					</ul>
				</Col>
			</Row>
		</div>
	);
};

export default UTMBuilder;
