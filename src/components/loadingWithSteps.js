import React from "react";
import { Row, Col, Button, Stack } from "react-bootstrap";
//TODO.. THIS DOESNT WORK YET.. and I'll adress it later

const Loading = (modules, completedModules, loadingStage, continueButton) => {
	console.log(modules, completedModules, loadingStage, continueButton);
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
				className="position-absolute top-0 start-0 w-100 h-100 d-flex   align-items-center justify-content-center"
				style={{ zIndex: 10 }}
			>
				<Col md={4}>
					<h3>Step 1: Running APIs</h3>
				</Col>
				<Col md={2}>
					{loadingStage != "Ready To Build Tables." && (
						<div
							className="spinner-border text-primary"
							role="status"
						>
							<h1 className="visually-hidden">Loading...</h1>
						</div>
					)}
				</Col>
				<Col md={6} className="bg-white rounded shadow-sm p-3">
					<h5 className="mb-3">Running Reports</h5>
					<div
						style={{
							maxHeight: "300px",
							overflowY: "auto",
						}}
					>
						{Object.entries(modules)
							.filter(([_, mod]) => mod.inReport)
							.map(([name, mod]) => (
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

				<Stack gap={2} className="col-md-5 mx-auto">
					<h5 style={{ textAlign: "center" }}>{loadingStage}</h5>
					{continueButton}
				</Stack>
			</Row>
		</Row>
	);
};
export default Loading;
