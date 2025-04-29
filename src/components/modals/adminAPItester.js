import React, { useState } from "react";
import {
	Form,
	Button,
	Spinner,
	Alert,
	InputGroup,
	Container,
} from "react-bootstrap";
const getSettings = () => {
	try {
		const raw = localStorage.getItem("ChettiToolsSettings");
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
};

const AvantLinkApiTester = () => {
	const [path, setPath] = useState("");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState("");
	const [error, setError] = useState("");
	const settings = getSettings();

	const handleTest = async () => {
		const apiKey = settings.key;

		if (!apiKey) {
			setError("No API key found in localStorage.");
			console.error(
				"Missing API key in localStorage under 'avantlink_api_key'"
			);
			return;
		}

		if (!path.trim()) {
			setError("Please enter a valid API path.");
			return;
		}

		const url = `https://api.avantlink.com/${path}`;
		console.log("➡️ Fetching URL:", url);

		setLoading(true);
		setError("");
		setResult("");

		try {
			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
				},
			});
			console.log("📡 Raw response:", response);

			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`
				);
			}

			const data = await response.json();
			console.log("✅ Parsed JSON:", data);
			setResult(JSON.stringify(data, null, 2));
		} catch (err) {
			console.error("❌ Error fetching API:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container className="my-5">
			<h4 className="mb-4">AvantLink API Tester</h4>

			<Form.Group className="mb-3">
				<Form.Label>
					API Path (e.g. <code>affiliates/1234</code>)
				</Form.Label>
				<InputGroup>
					<Form.Control
						placeholder="Enter API path..."
						value={path}
						onChange={(e) => setPath(e.target.value)}
					/>
					<Button variant="primary" onClick={handleTest}>
						{loading ? (
							<Spinner animation="border" size="sm" />
						) : (
							"Send Request"
						)}
					</Button>
				</InputGroup>
			</Form.Group>

			{error && (
				<Alert variant="danger" className="mt-3">
					{error}
				</Alert>
			)}

			{result && (
				<Form.Group className="mt-4">
					<Form.Label>Response:</Form.Label>
					<Form.Control
						as="textarea"
						rows={10}
						value={result}
						readOnly
						style={{ fontFamily: "monospace" }}
					/>
				</Form.Group>
			)}
		</Container>
	);
};

export default AvantLinkApiTester;
