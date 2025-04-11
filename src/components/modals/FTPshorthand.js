import React, { useState } from "react";
import { Form, Button, InputGroup, FormControl, Alert } from "react-bootstrap";

const FTPshorthand = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [batchServer, setBatchServer] = useState("");
	const [filename, setFilename] = useState("");
	const [ftpUrl, setFtpUrl] = useState("");
	const [copied, setCopied] = useState(false);

	const buildFtpUrl = () => {
		const encodedPassword = encodeURIComponent(password);
		const cleanServer = batchServer.replace(/^ftp:\/\//i, "");
		const url = `ftp://${username}:${encodedPassword}@${cleanServer}/${filename}`;
		setFtpUrl(url);
		setCopied(false);
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(ftpUrl);
			setCopied(true);
		} catch (err) {
			setCopied(false);
			alert("Failed to copy to clipboard.");
		}
	};
	const [inputUrl, setInputUrl] = useState("");

	// now breaking it down
	const [parsed, setParsed] = useState(null);

	const parseFtpUrl = () => {
		try {
			const url = new URL(inputUrl);
			if (url.protocol !== "ftp:") throw new Error("Not an FTP URL");

			const username = url.username;
			const password = decodeURIComponent(url.password);
			const batchServer = `ftp://${url.host}`;
			const filename = url.pathname.replace(/^\//, "");

			setParsed({ username, password, batchServer, filename });
		} catch (err) {
			alert("Invalid FTP URL format.");
			setParsed(null);
		}
	};

	return (
		<>
			<div className="accordion" id="accordionExample">
				<div className="accordion-item">
					<h2 className="accordion-header">
						<button
							className="accordion-button"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#collapseOne"
							aria-expanded="true"
							aria-controls="collapseOne"
						>
							Creating an FTP string.
						</button>
					</h2>
					<div
						id="collapseOne"
						className="accordion-collapse collapse show"
						data-bs-parent="#accordionExample"
					>
						<div className="accordion-body">
							<div className="p-4">
								<h4>Building an FTP URL</h4>
								<Form>
									<Form.Group
										controlId="username"
										className="mb-3"
									>
										<Form.Label>Username</Form.Label>
										<Form.Control
											type="text"
											value={username}
											onChange={(e) =>
												setUsername(e.target.value)
											}
											placeholder="Enter username"
										/>
									</Form.Group>

									<Form.Group
										controlId="password"
										className="mb-3"
									>
										<Form.Label>Password</Form.Label>
										<Form.Control
											type="text"
											value={password}
											onChange={(e) =>
												setPassword(e.target.value)
											}
											placeholder="Enter password (will be URL encoded)"
										/>
									</Form.Group>

									<Form.Group
										controlId="batchServer"
										className="mb-3"
									>
										<Form.Label>Batch Server</Form.Label>
										<InputGroup>
											<InputGroup.Text>
												ftp://
											</InputGroup.Text>
											<FormControl
												type="text"
												value={batchServer}
												onChange={(e) =>
													setBatchServer(
														e.target.value
													)
												}
												placeholder="batch.example.com"
											/>
										</InputGroup>
									</Form.Group>

									<Form.Group
										controlId="filename"
										className="mb-3"
									>
										<Form.Label>Filename</Form.Label>
										<Form.Control
											type="text"
											value={filename}
											onChange={(e) =>
												setFilename(e.target.value)
											}
											placeholder="myfile.csv"
										/>
									</Form.Group>

									<Button
										variant="primary"
										onClick={buildFtpUrl}
									>
										Generate FTP Link
									</Button>
								</Form>

								{ftpUrl && (
									<div className="mt-4">
										<Alert variant="secondary">
											<code>{ftpUrl}</code>
										</Alert>
										<Button
											variant="outline-success"
											onClick={handleCopy}
										>
											{copied
												? "Copied!"
												: "Copy to Clipboard"}
										</Button>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="accordion-item">
					<h2 className="accordion-header">
						<button
							className="accordion-button collapsed"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#collapseTwo"
							aria-expanded="false"
							aria-controls="collapseTwo"
						>
							Breaking Down an FTP URL
						</button>
					</h2>
					<div
						id="collapseTwo"
						className="accordion-collapse collapse"
						data-bs-parent="#accordionExample"
					>
						<div className="accordion-body">
							<div className="p-4">
								<h4>FTP URL Breakdown</h4>
								<Form>
									<Form.Group
										controlId="ftpUrl"
										className="mb-3"
									>
										<Form.Label>
											Paste full FTP URL
										</Form.Label>
										<Form.Control
											type="text"
											value={inputUrl}
											onChange={(e) =>
												setInputUrl(e.target.value)
											}
											placeholder="ftp://username:password@server.com/file.csv"
										/>
									</Form.Group>
									<Button
										variant="primary"
										onClick={parseFtpUrl}
									>
										Parse URL
									</Button>
								</Form>

								{parsed && (
									<Alert variant="light" className="mt-4">
										<strong>
											Here is the current file URL that
											our system is importing from:
										</strong>
										<br />
										Batch Server:{" "}
										<code>{parsed.batchServer}</code>
										<br />
										User Name:{" "}
										<code>{parsed.username}</code>
										<br />
										Password: <code>{parsed.password}</code>
										<br />
										Filename: <code>{parsed.filename}</code>
									</Alert>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default FTPshorthand;
