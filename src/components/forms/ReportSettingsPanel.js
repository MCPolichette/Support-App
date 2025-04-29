import React, { useState, useEffect } from "react";
import {
	Accordion,
	Card,
	Form,
	Button,
	Alert,
	Row,
	Col,
} from "react-bootstrap";

const ReportSettings = ({ modules, toggleHeaderDisplay, merchantId }) => {
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		console.log("Modules updated:", modules);
	}, [modules]);

	const saveSettingsForMerchant = () => {
		try {
			const settingsRaw = localStorage.getItem("ChettiToolsSettings");
			if (!settingsRaw) return;

			const settings = JSON.parse(settingsRaw);
			if (!settings.commonMerchants) return;

			const merchantIndex = settings.commonMerchants.findIndex(
				(m) => m.id === merchantId
			);

			if (merchantIndex === -1) return;

			const reportMap = {};
			Object.entries(modules).forEach(([moduleName, moduleData]) => {
				if (!moduleData.inReport) return;
				const headersMap = {};
				Object.entries(moduleData.headers || {}).forEach(
					([headerName, headerSettings]) => {
						headersMap[headerName] =
							typeof headerSettings === "object"
								? headerSettings.display !== false
								: headerSettings !== false;
					}
				);
				reportMap[moduleName] = headersMap;
			});

			settings.commonMerchants[merchantIndex].reportMap = reportMap;
			localStorage.setItem(
				"ChettiToolsSettings",
				JSON.stringify(settings)
			);
			setSuccess(true);
			setTimeout(() => setSuccess(false), 3000);
		} catch (error) {
			console.error("Error saving settings:", error);
		}
	};

	return (
		<div className="position-relative">
			<Accordion defaultActiveKey="">
				{Object.entries(modules)
					.filter(([_, mod]) => mod.inReport)
					.map(([moduleName, moduleData], index) => (
						<Card key={moduleName} className="mb-2">
							<Accordion.Item eventKey={index.toString()}>
								<Accordion.Header
									style={{ padding: "1px 8px" }}
								>
									{moduleName.replace(/_/g, " ")}
								</Accordion.Header>
								<Accordion.Body>
									<Row>
										{moduleData.headers &&
											Object.entries(
												moduleData.headers
											).map(
												([
													headerName,
													headerSettings,
												]) => {
													const display =
														typeof headerSettings ===
														"object"
															? headerSettings.display !==
															  false
															: headerSettings !==
															  false;
													return (
														<Col
															key={headerName}
															md={4}
															className="mb-2"
														>
															<Form.Group
																controlId={`header-${moduleName}-${headerName}`}
																className="mb-1"
															>
																<Form.Check
																	type="checkbox"
																	label={
																		<span
																			style={{
																				fontSize:
																					"11px",
																				paddingTop:
																					"4px",
																				paddingBottom:
																					"4px",
																			}}
																		>
																			{
																				headerName
																			}
																		</span>
																	}
																	checked={
																		display
																	}
																	onClick={(
																		e
																	) => {
																		e.stopPropagation(); // Important: prevent accordion toggle
																	}}
																	onChange={() =>
																		toggleHeaderDisplay(
																			moduleName,
																			headerName
																		)
																	}
																/>
															</Form.Group>
														</Col>
													);
												}
											)}
									</Row>
								</Accordion.Body>
							</Accordion.Item>
						</Card>
					))}
			</Accordion>
			<Button
				variant="success"
				size="sm"
				className="mt-3"
				onClick={saveSettingsForMerchant}
			>
				Save Display Settings for Selected Merchant
			</Button>
			{success && (
				<Alert
					variant="success"
					className="shadow position-absolute"
					style={{ top: "10px", right: "10px" }}
				>
					Settings saved! ✅
				</Alert>
			)}
		</div>
	);
};

export default ReportSettings;
