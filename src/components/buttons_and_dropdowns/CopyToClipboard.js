import React, { useState } from "react";
import { Button, ToastContainer, Toast } from "react-bootstrap";

const CopyToClipboard = (props) => {
	const textTest = props.text || "Copy to Clipboard";
	const [copied, setCopied] = useState(false);

	const copyText = (id) => {
		console.log(id);
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
		<div>
			<Button
				style={{ width: "100%", marginBottom: "10px" }}
				className="btn-lg btn-block"
				variant="outline-primary"
				onClick={() => copyText(props.divId)}
			>
				{textTest}
			</Button>
			<ToastContainer position="center-center" className="p-3">
				<Toast
					show={copied}
					onClose={() => setCopied(false)}
					delay={1200}
					autohide
					bg="success"
				>
					<Toast.Body className="text-white text-center">
						Copied to clipboard!
					</Toast.Body>
				</Toast>
			</ToastContainer>
		</div>
	);
};

export default CopyToClipboard;
