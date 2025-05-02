import React from "react";
import { Col, Form, Tooltip } from "react-bootstrap";

const HeaderSettingsRow = ({
	moduleName,
	headerName,
	headerSettings,
	toggleHeaderDisplay,
	toggleYoyDisplay,
}) => {
	const isObject = typeof headerSettings === "object";
	const display = isObject
		? headerSettings.display !== false
		: headerSettings !== false;
	const yoyEnabled = isObject ? headerSettings.yoy === true : false;
	return (
		<Form.Group controlId={`header-${moduleName}-${headerName}`}>
			<div className="d-flex align-items-center border-bottom">
				<Col
					md={3}
					data-toggle="tooltip"
					data-placement="top"
					title="display header"
				>
					<Form.Check
						type="switch"
						id={`switch-${moduleName}-${headerName}`}
						checked={display}
						onClick={(e) => e.stopPropagation()}
						onChange={() =>
							toggleHeaderDisplay(moduleName, headerName)
						}
						className="me-2"
					/>
				</Col>
				<Col md={8}>
					<span className="flex-grow-1 small">{headerName}</span>
				</Col>
				<Col
					data-toggle="tooltip"
					data-placement="top"
					title="Compare selected times"
					md={2}
				>
					<Form.Check
						type="checkbox"
						id={`yoy-${moduleName}-${headerName}`}
						checked={yoyEnabled}
						disabled={!display}
						onClick={(e) => e.stopPropagation()}
						onChange={(e) =>
							toggleYoyDisplay(
								moduleName,
								headerName,
								e.target.checked
							)
						}
						className="ms-2 "
					/>
				</Col>
			</div>
		</Form.Group>
	);
};

export default HeaderSettingsRow;
