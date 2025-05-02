// Updated ModuleSettingsAccordionItem.js
import React, { useState } from "react";
import { Accordion, Card, Row, Col, Button, Stack } from "react-bootstrap";
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
	merchantId,
}) => {
	const [commonMerchant, setCommonMerchant] = useState(false);
	console.log(merchantId);

	const [success, setSuccess] = useState(false);

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
					Adjust {moduleName.replace(/_/g, " ")} Headers for{" "}
					{merchantId}
				</Accordion.Header>
				<Accordion.Body>
					<Row className="mb-2">
						<Col>
							<Stack gap={0} className=" mx-auto">
								<Button
									size="sm"
									variant="primary"
									onClick={() => onSave(moduleName)}
								>
									Save for this report for {merchantId}
								</Button>{" "}
								<Button
									size="sm"
									variant="secondary"
									onClick={() => onSaveDefault(moduleName)}
								>
									Save as default
								</Button>
							</Stack>
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
