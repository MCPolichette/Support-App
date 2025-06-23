import React from "react";
import { Row, Col, Spinner, Stack } from "react-bootstrap";
import { TableTopper } from "./tables/tableExtras";

const LoadingOverlay = ({
	modules,
	completedModules,
	loadingStage,
	merchantReference,
	tableButton,
}) => {
	return (
		<Row>
			<div
				className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
				style={{
					backgroundColor: "rgba(255, 255, 255, 0.7)",
					backdropFilter: "blur(4px)",
					zIndex: 10,
				}}
			></div>
			<Row
				className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
				style={{ zIndex: 10 }}
			>
				<Col md={6} className="d-flex justify-content-center">
					<Row>
						<Col sm={12} className="d-flex justify-content-center">
							{loadingStage !== "Ready To Build Tables." && (
								<Spinner
									animation="border"
									size="xl"
									variant="secondary"
								/>
							)}
						</Col>
						<Col className="d-flex justify-content-center" sm={12}>
							<h3>Step 1: Running APIs</h3>
						</Col>
					</Row>
				</Col>

				<Col md={6} className="bg-white rounded shadow-sm p-3">
					<h5 className="mb-3">Running Reports</h5>
					<div style={{ maxHeight: "300px", overflowY: "auto" }}>
						{Object.entries(modules)
							.filter(([_, mod]) => mod.inReport)
							.map(([name]) => (
								<div
									key={name}
									className="d-flex align-items-center mb-2 small"
								>
									<span
										className="me-2"
										style={{
											fontSize: "1.2rem",
											color: "#0d6efd",
										}}
									>
										{completedModules.includes(name)
											? "✅"
											: "⏳"}
									</span>
									<span>{name.replace(/_/g, " ")}</span>
								</div>
							))}
					</div>
				</Col>

				<TableTopper id={merchantReference} text={loadingStage} />
				<Stack gap={2} className="col-md-5 mx-auto">
					{tableButton}
				</Stack>
			</Row>
		</Row>
	);
};

export default LoadingOverlay;
