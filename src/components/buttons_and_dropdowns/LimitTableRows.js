import React from "react";
import { Dropdown, ButtonGroup, Badge } from "react-bootstrap";

const LimitTableRows = ({
	displayTable,
	setDisplayTable,
	displayedRows,
	table,
	setDisplayedRows,
	title,
	hidden,
}) => {
	const dropdownarray = (max) => {
		if (max <= 1) return false;
		const baseOptions = [1, 2, 3, 4, 5, 10, 15, 20, 25];
		const filtered = baseOptions.filter((val) => val < max);
		// Avoid duplicate if max is already in baseOptions
		if (!filtered.includes(max)) {
			filtered.push(max);
		}

		return filtered;
	};
	if (hidden == true) {
		return "";
	} else {
		const dropDownOptions = dropdownarray(table.length);
		return (
			<div className="position-relative d-print-none">
				{displayTable ? (
					<Badge
						size="sm"
						className="position-absolute   "
						style={{
							top: "-1em",
							left: "-2.5em",
							zIndex: 8,
							opacity: 0.8,
						}}
						pill
						bg="warning"
						text="dark"
						onClick={() => setDisplayTable(false)}
					>
						Hide Table
					</Badge>
				) : (
					<Badge
						pill
						bg="warning"
						text="dark"
						onClick={() => setDisplayTable(true)}
					>
						Click Here to Display {title}
					</Badge>
				)}

				{dropDownOptions && (
					<Dropdown
						as={ButtonGroup}
						size="sm"
						className="position-absolute dropdown-toggle  "
						style={{
							top: "-2em",
							right: "-25px",
							zIndex: 8,
							opacity: 0.8,
						}}
						variant="warning"
					>
						<Dropdown.Toggle
							variant="warning"
							size="sm"
							className=""
						>
							Adjust Rows - {displayedRows.length}
						</Dropdown.Toggle>
						<Dropdown.Menu>
							{dropDownOptions.map((option, idx) => (
								<Dropdown.Item
									style={{ opacity: 1.8 }}
									key={idx}
									active={option === displayedRows}
									onClick={() =>
										setDisplayedRows(table.slice(0, option))
									}
								>
									{option}
								</Dropdown.Item>
							))}
						</Dropdown.Menu>
					</Dropdown>
				)}
			</div>
		);
	}
};

export default LimitTableRows;
