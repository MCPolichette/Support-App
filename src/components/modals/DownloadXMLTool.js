import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";

const SafeXMLDownloader = () => {
	const [url, setUrl] = useState("");
	const [downloading, setDownloading] = useState(false);

	const handleDownload = async () => {
		setDownloading(true);
		try {
			const response = await fetch(url, { mode: "cors" });

			if (!response.ok) {
				throw new Error(
					`Error: ${response.status} ${response.statusText}`
				);
			}

			const buffer = await response.arrayBuffer();
			const blob = new Blob([buffer], {
				type: "application/octet-stream",
			});

			// Extract a simple filename from the URL
			let fileName = "download.xml";
			try {
				const parsed = new URL(url);
				const parts = parsed.pathname.split("/");
				const last = parts[parts.length - 1];
				if (last) fileName = last;
			} catch (e) {}

			const blobUrl = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = blobUrl;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(blobUrl);
		} catch (err) {
			console.error("Download failed:", err);
			alert("Could not download file. See console for details.");
		} finally {
			setDownloading(false);
		}
	};

	return (
		<Form>
			<Form.Group>
				<Form.Label>Enter XML File URL</Form.Label>
				<InputGroup>
					<Form.Control
						type="text"
						placeholder="https://..."
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						disabled={downloading}
					/>
					<Button
						variant="primary"
						disabled={!url.trim() || downloading}
						onClick={handleDownload}
					>
						{downloading ? "Downloading…" : "Download XML"}
					</Button>
				</InputGroup>
			</Form.Group>
		</Form>
	);
};

export default SafeXMLDownloader;
