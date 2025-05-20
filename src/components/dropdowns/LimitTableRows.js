import React from "react";
import { Dropdown, ButtonGroup } from "react-bootstrap";

const LimitTableRows = ({ displayedRows, setDisplayedRows, maxRows }) => {
	const dropdownarray = (max) => {
		if (max <= 1) return [1];
		const baseOptions = [1, 2, 3, 4, 5, 10, 15, 20, 25];
		const filtered = baseOptions.filter((val) => val < max);
		// Avoid duplicate if max is already in baseOptions
		if (!filtered.includes(max)) {
			filtered.push(max);
		}

		return filtered;
	};
	const dropDownOptions = dropdownarray(maxRows);

	return (
		<div className="position-relative d-print-none">
			<Dropdown
				as={ButtonGroup}
				size="sm"
				className="position-absolute dropdown-toggle  "
				style={{
					top: "-10px",
					right: "-25px",
					zIndex: 10,
					opacity: 0.8,
				}}
				variant="warning"
			>
				<Dropdown.Toggle variant="warning" size="sm" className="">
					Display total {displayedRows.length}
				</Dropdown.Toggle>
				<Dropdown.Menu>
					{dropDownOptions.map((option, idx) => (
						<Dropdown.Item
							style={{ opacity: 1.8 }}
							key={idx}
							active={option === displayedRows}
							onClick={() =>
								setDisplayedRows(displayedRows.slice(0, option))
							}
						>
							{option}
						</Dropdown.Item>
					))}
				</Dropdown.Menu>
			</Dropdown>
		</div>
	);
};

export default LimitTableRows;
