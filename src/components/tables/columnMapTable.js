import React from "react";
import { Table } from "react-bootstrap";

const formatValue = (value, type) => {
	if (value == null || value === "") return "";

	switch (type) {
		case "dollar":
			return `$${parseFloat(value).toLocaleString(undefined, {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})}`;
		case "int":
			return parseInt(value, 10).toLocaleString();
		case "percent":
			return `${parseFloat(value).toFixed(2)}%`;
		case "float":
			return parseFloat(value).toFixed(2);
		default:
			return value;
	}
};

const getAlignmentClass = (type) => {
	switch (type) {
		case "dollar":
		case "int":
		case "float":
			return "text-end";
		case "percent":
			return "text-center";
		default:
			return "text-start";
	}
};

const ColumnMapTable = ({ title, tableMap }) => {
	return (
		<div className="mb-5">
			<h5>{title}</h5>
			<Table striped bordered hover size="sm">
				<thead>
					<tr>
						{tableMap.map((col, idx) => (
							<th
								key={idx}
								className={`${getAlignmentClass(col.type)} ${
									col.className || ""
								}`}
							>
								{col.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					<tr>
						{tableMap.map((col, idx) => (
							<td
								key={idx}
								className={`${getAlignmentClass(col.type)} ${
									col.className || ""
								}`}
							>
								{formatValue(col.value, col.type)}
							</td>
						))}
					</tr>
				</tbody>
			</Table>
		</div>
	);
};

export default ColumnMapTable;
