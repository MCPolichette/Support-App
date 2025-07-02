// AdToolPlayground.jsx
import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Tabs, Tab } from "react-bootstrap";
// Import or define preset HTMLs (these will be stored separately)
// For now these are placeholders to simulate imports
import skateboardHTML from "../components/htmlTemplates/SkateboardBlog";
// import travelBlogHTML from "../htmlTemplates/travelBlog";
import muppetConspiracyHTML from "../components/htmlTemplates/MuppetBlog";

const AdToolPlayground = () => {
	const presets = {
		"Skate Blog": skateboardHTML,
		// "Travel Blog": travelBlogHTML,
		MuppetWire: muppetConspiracyHTML,
	};

	const [activeTab, setActiveTab] = useState("Skate Blog");
	const [htmlCode, setHtmlCode] = useState(presets[activeTab]);
	const [iframeKey, setIframeKey] = useState(0); // to force reload iframe

	const handleTabSelect = (tab) => {
		setActiveTab(tab);
		setHtmlCode(presets[tab]);
		setIframeKey((prev) => prev + 1); // force iframe reload
	};

	const handleCodeChange = (e) => {
		setHtmlCode(e.target.value);
	};

	return (
		<Container fluid data-bs-theme="dark">
			<Row className="my-4">
				<Col md={6}>
					<Card
						className="h-100 card-drop-in "
						style={{
							animationDelay: `.3s`,
							animationName: "dropInFromTop",
						}}
					>
						<Card.Header>
							<Tabs
								style={{ backgroundColor: "lightgrey" }}
								activeKey={activeTab}
								onSelect={handleTabSelect}
								id="html-tabs"
							>
								{Object.keys(presets).map((label) => (
									<Tab
										eventKey={label}
										title={label}
										key={label}
									/>
								))}
							</Tabs>
						</Card.Header>
						<Card.Body>
							<Form>
								<Form.Group controlId="htmlInput">
									<Form.Control
										as="textarea"
										rows={30}
										value={htmlCode}
										onChange={handleCodeChange}
									/>
								</Form.Group>
							</Form>
						</Card.Body>
					</Card>
				</Col>
				<Col md={6}>
					<Card
						className="h-100 card-drop-in "
						style={{
							animationDelay: `.3s`,
							animationName: "dropInFromBottom",
						}}
					>
						<Card.Header>Rendered Preview</Card.Header>
						<Card.Body>
							<iframe
								key={iframeKey}
								title="Blog Preview"
								srcDoc={htmlCode}
								style={{
									width: "100%",
									height: "100%",
									border: "1px solid #ccc",
									borderRadius: "4px",
								}}
								sandbox="allow-scripts allow-same-origin"
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default AdToolPlayground;
