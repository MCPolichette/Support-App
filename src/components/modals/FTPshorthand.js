import React, { useState } from "react";
import {
	Form,
	Button,
	InputGroup,
	FormControl,
	Alert,
	Tab,
	Tabs,
	Container,
} from "react-bootstrap";

const FTPshorthand = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [batchServer, setBatchServer] = useState("batch.avantlink.com");
	const [filename, setFilename] = useState("");
	const [ftpUrl, setFtpUrl] = useState("");
	const [copied, setCopied] = useState(false);
	const [inputUrl, setInputUrl] = useState("");
	const [parsed, setParsed] = useState(null);
	const [activeTab, setActiveTab] = useState("create");

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
		<Container className="mt-4">
			<div
				style={{
					minHeight: "480px",
					maxHeight: "480px",
					overflowY: "auto",
				}}
			>
				<Tabs
					activeKey={activeTab}
					onSelect={(k) => setActiveTab(k)}
					className="mb-3"
				>
					<Tab eventKey="create" title="Create FTP URL">
						<h4>Building an FTP URL</h4>
						<Form>
							<Form.Group controlId="username" className="mb-3">
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

							<Form.Group controlId="password" className="mb-3">
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
									<InputGroup.Text>ftp://</InputGroup.Text>
									<FormControl
										type="text"
										value={batchServer}
										onChange={(e) =>
											setBatchServer(e.target.value)
										}
										placeholder="batch.example.com"
									/>
								</InputGroup>
							</Form.Group>

							<Form.Group controlId="filename" className="mb-3">
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

							<Button variant="primary" onClick={buildFtpUrl}>
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
									{copied ? "Copied!" : "Copy to Clipboard"}
								</Button>
							</div>
						)}
					</Tab>

					<Tab eventKey="parse" title="Parse FTP URL">
						<h4>FTP URL Breakdown</h4>
						<Form>
							<Form.Group controlId="ftpUrl" className="mb-3">
								<Form.Label>Paste full FTP URL</Form.Label>
								<Form.Control
									type="text"
									value={inputUrl}
									onChange={(e) =>
										setInputUrl(e.target.value)
									}
									placeholder="ftp://username:password@server.com/file.csv"
								/>
							</Form.Group>
							<Button variant="primary" onClick={parseFtpUrl}>
								Parse URL
							</Button>
						</Form>

						{parsed && (
							<Alert variant="light" className="mt-4">
								<strong>
									Here is the current file URL that our system
									is importing from:
								</strong>
								<br />
								Batch Server: <code>{parsed.batchServer}</code>
								<br />
								User Name: <code>{parsed.username}</code>
								<br />
								Password: <code>{parsed.password}</code>
								<br />
								Filename: <code>{parsed.filename}</code>
							</Alert>
						)}
					</Tab>
				</Tabs>
			</div>
		</Container>
	);
};

export default FTPshorthand;
