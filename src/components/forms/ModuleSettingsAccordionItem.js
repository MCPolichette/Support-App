// Updated ModuleSettingsAccordionItem.js
import React from "react";
import { Accordion, Card, Row, Col, Button } from "react-bootstrap";
import SortAndLimitControls from "./SortAndLimitControls";
import HeaderSettingsRow from "./HeaderSettingsRow";

const ModuleSettingsAccordionItem = ({
	index,
	moduleName,
	moduleData,
	onSortChange,
	onLimitChange,
	toggleYoyDisplay,
	setFormSelections,
	onSave,
	onSaveDefault,
}) => {
	const toggleHeaderDisplay = (moduleName, headerName) => {
		setFormSelections((prevModules) => {
			const updatedModules = { ...prevModules };
			const updatedModule = { ...updatedModules[moduleName] };
			const updatedHeaders = { ...updatedModule.headers };

			const headerSettings = updatedHeaders[headerName];

			if (headerSettings !== undefined) {
				if (typeof headerSettings === "object") {
					updatedHeaders[headerName] = {
						...headerSettings,
						display: headerSettings.display === false,
					};
				} else {
					updatedHeaders[headerName] = {
						yoy: headerSettings,
						display: true,
					};
				}
			}

			updatedModule.headers = updatedHeaders;
			updatedModules[moduleName] = updatedModule;

			return updatedModules;
		});
	};

	return (
		<Card key={moduleName} className="mb-2">
			<Accordion.Item eventKey={index.toString()}>
				<Accordion.Header style={{ padding: "1px 8px" }}>
					Adjust {moduleName.replace(/_/g, " ")} Headers
				</Accordion.Header>
				<Accordion.Body>
					<Row className="mb-2">
						<Col>
							<Button
								size="sm"
								variant="primary"
								onClick={() => onSave(moduleName)}
							>
								Save for this report
							</Button>{" "}
							<Button
								size="sm"
								variant="secondary"
								onClick={() => onSaveDefault(moduleName)}
							>
								Save as default
							</Button>
						</Col>
						<Col>
							<SortAndLimitControls
								moduleName={moduleName}
								moduleData={moduleData}
								onSortChange={onSortChange}
								onLimitChange={onLimitChange}
							/>
						</Col>
					</Row>
					<Row>
						<h5>Headers to display</h5>
						{Object.entries(moduleData.headers || {}).map(
							([headerName, headerSettings], index) => (
								<Col
									key={headerName}
									sm={12}
									md={6}
									lg={4}
									className="mb-2"
								>
									<HeaderSettingsRow
										moduleName={moduleName}
										headerName={headerName}
										headerSettings={headerSettings}
										toggleHeaderDisplay={
											toggleHeaderDisplay
										}
										toggleYoyDisplay={toggleYoyDisplay}
									/>
								</Col>
							)
						)}
					</Row>
				</Accordion.Body>
			</Accordion.Item>
		</Card>
	);
};

export default ModuleSettingsAccordionItem;
