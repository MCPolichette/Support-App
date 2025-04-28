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
			{/* {completedModules.map((moduleName, idx) => {
				const moduleSettings = _adminApiModules[moduleName];
				const hiddenHeaders = hidden.moduleName;
				if (!moduleSettings) {
					console.warn(
						`Module settings not found for: ${moduleName}`
					);
					return null;
				}

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
								reportSettings={moduleSettings}
								limit={100}
								hiddenFields={hiddenHeaders}
							/>
						</Col>
					</Row>
				);
			})} */}
		</Container>
	);
};

export default DynamicComparisonReportContainer;
