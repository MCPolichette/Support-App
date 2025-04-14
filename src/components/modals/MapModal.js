import React, { useState } from "react";
import { Button, Row, Col } from "react-bootstrap";

const MapModal = ({ mapping = [], type }) => {
	const [copied, setCopied] = useState(false);
	const mappedStr = mapping.map((m) => m.fieldName).join("|");
	const mappedVarStr = mapping.map((m) => m.variant).join("|");

	const handleCopy = (target) => {
		navigator.clipboard.writeText(target).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		});
	};

	return (
		<div className="p-4">
			<Row>
				<Col md={7}>
					<h4>TITLE GOES HERE!</h4>
					<div className="mb-3">
						<pre className="bg-light p-2 border rounded text-wrap">
							{mappedStr || "No fields mapped yet."}
						</pre>
						<Button
							variant="outline-primary"
							onClick={handleCopy(mappedStr)}
							disabled={!mappedStr}
						>
							{copied ? "Copied!" : "Copy to Clipboard"}
						</Button>
					</div>
					{type && (
						<div className="mb-3">
							<pre className="bg-light p-2 border rounded text-wrap">
								{mappedStr || "No fields mapped yet."}
							</pre>
							<Button
								variant="outline-primary"
								onClick={handleCopy(mappedVarStr)}
								disabled={!mappedVarStr}
							>
								{copied ? "Copied!" : "Copy to Clipboard"}
							</Button>
						</div>
					)}
				</Col>
				<Col md={5}>
					<h6 className="mt-2">AvantLink Dynamic Variables</h6>
				</Col>
			</Row>
		</div>
	);
};

export default MapModal;
