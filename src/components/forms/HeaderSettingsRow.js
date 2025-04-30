import React from "react";
import { Form } from "react-bootstrap";

const HeaderSettingsRow = ({
	moduleName,
	headerName,
	headerSettings,
	toggleHeaderDisplay,
	toggleYoyDisplay,
	headers,
}) => {
	const isObject = typeof headerSettings === "object";
	const display = isObject
		? headerSettings.display !== false
		: headerSettings !== false;
	const yoyEnabled = isObject ? headerSettings.yoy === true : false;
	console.log(headers);

	return (
		<Form.Group controlId={`header-${moduleName}-${headerName}`}>
			<div className="d-flex align-items-center justify-content-between border rounded px-2 py-1">
				<Form.Check
					type="switch"
					id={`switch-${moduleName}-${headerName}`}
					checked={display}
					onClick={(e) => e.stopPropagation()}
					onChange={() => toggleHeaderDisplay(moduleName, headerName)}
					className="me-2"
				/>
				<span className="flex-grow-1 small">{headerName}</span>
				<Form.Check
					type="checkbox"
					label="YoY"
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
					className="ms-2"
				/>
			</div>
		</Form.Group>
	);
};

export default HeaderSettingsRow;
