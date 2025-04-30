import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const SortAndLimitControls = ({
	moduleName,
	moduleData,
	onSortChange,
	onLimitChange,
}) => {
	return (
		<Row className="mb-3">
			<Col md={6}>
				<Form.Group controlId={`sortby-${moduleName}`}>
					<Form.Label className="fw-bold small">Sort by</Form.Label>
					<Form.Select
						size="sm"
						value={moduleData.sortBy || ""}
						onChange={(e) =>
							onSortChange(moduleName, e.target.value)
						}
					>
						{/* ONLY options here */}
						{Object.entries(moduleData.headers || {})
							.filter(([_, h]) =>
								typeof h === "object"
									? h.display !== false
									: h !== false
							)
							.map(([headerName]) => (
								<option key={headerName} value={headerName}>
									{headerName}
								</option>
							))}
					</Form.Select>
				</Form.Group>
			</Col>
			<Col md={6}>
				<Form.Group controlId={`limit-${moduleName}`}>
					<Form.Label className="fw-bold small">
						Display limit:
					</Form.Label>
					<Form.Control
						type="number"
						size="sm"
						value={moduleData.limit || "10"}
						placeholder="Enter limit"
						onChange={(e) =>
							onLimitChange(moduleName, e.target.value)
						}
					/>
				</Form.Group>
			</Col>
		</Row>
	);
};

export default SortAndLimitControls;
