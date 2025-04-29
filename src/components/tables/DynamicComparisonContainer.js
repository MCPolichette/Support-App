import React from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import DynamicComparisonReportTable from "./DynamicComparisonReportTable"; // adjust path if needed

const DynamicComparisonReportContainer = ({
	completedModules,
	reportResults,
	modules,
}) => {
	return (
		<Container fluid className="mt-4">
			{completedModules.map((moduleName, idx) => {
				const moduleData = modules[moduleName]; // <- grab module's header settings from modules

				// if (!moduleSettings || !moduleData) {
				// 	console.warn(
				// 		`Module settings not found for: ${moduleName}`
				// 	);
				// 	return null;
				// }

				// Build hidden fields dynamically
				const hiddenHeaders = moduleData.headers
					? Object.entries(moduleData.headers)
							.filter(([headerName, headerSettings]) => {
								if (typeof headerSettings === "object") {
									return headerSettings.display === false;
								}
								return headerSettings === false;
							})
							.map(([headerName]) => headerName)
					: [];

				return (
					<Row key={idx} className="mb-5">
						<Col>
							<Alert variant="info">
								<strong>
									{moduleName.replaceAll("_", " ")}
								</strong>{" "}
								comparison report
							</Alert>

							<DynamicComparisonReportTable
								title={moduleName.replaceAll("_", " ")}
								currentPeriodReport={
									reportResults[`${moduleName}_current`]
								}
								previousPeriodReport={
									reportResults[`${moduleName}_previous`]
								}
								reportSettings={moduleData}
								limit={100}
								hiddenFields={hiddenHeaders} // <--- clean hidden fields now
							/>
						</Col>
					</Row>
				);
			})}
		</Container>
	);
};

export default DynamicComparisonReportContainer;
