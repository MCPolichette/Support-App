import React from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import DynamicComparisonReportTable from "./DynamicComparisonReportTable"; // adjust path if needed
import { _adminApiModules } from "../../utils/_AdminApiModules";

const DynamicComparisonReportContainer = ({
	completedModules,
	reportResults,
}) => {
	return (
		<Container fluid className="mt-4">
			{completedModules.map((moduleName, idx) => {
				const moduleSettings = _adminApiModules[moduleName];

				if (!moduleSettings) {
					console.warn(
						`Module settings not found for: ${moduleName}`
					);
					return null;
				}

				const { sortBy, headers, mergeBy, staticDisplay, inReport } =
					moduleSettings;

				// Create headers list based on what's set to true
				const activeHeaders = headers
					? Object.keys(headers).filter((header) => headers[header])
					: [];

				return (
					<Row key={idx} className="mb-5">
						<Col>
							{/* INFO Styled Topper */}
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
								headers={activeHeaders}
								sortBy={sortBy}
								mergeBy={mergeBy}
								staticDisplay={staticDisplay}
								limit={100}
							/>
						</Col>
					</Row>
				);
			})}
		</Container>
	);
};

export default DynamicComparisonReportContainer;
