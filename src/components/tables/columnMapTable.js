import React from "react";
import { Table } from "react-bootstrap";
import { TableTopper } from "./tableExtras";

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
			return `${(parseFloat(value) * 100).toFixed(2)}%`;
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
		case "end":
			return "text-end";
		case "percent":
			return "text-center";
		default:
			return "text-start";
	}
};

const ColumnMapTable = ({
	title,
	tableMap,
	table = [],
	limit,
	topperText,
	id,
}) => {
	const safeLimit = limit == null ? 20 : limit;
	const displayedRows = table.slice(0, safeLimit);
	return (
		<div className="mb-1">
			{topperText && <TableTopper id={id} text={topperText} />}
			{title && <h5>{title}</h5>}
			<Table striped bordered hover size="sm">
				<thead>
					<tr>
						{tableMap.map((col, idx) => (
							<th
								key={idx}
								className="border border-primary text-center align-middle"
							>
								{Array.isArray(col.label) ? (
									<>
										{col.label.map((line, i) => (
											<div key={i}>{line}</div>
										))}
									</>
								) : (
									col.label || `Col ${idx}`
								)}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{displayedRows.map((row, rowIdx) => (
						<tr key={rowIdx}>
							{row.map((cell, colIdx) => {
								const colMeta = tableMap[colIdx] || {};
								return (
									<td
										key={colIdx}
										className={`${getAlignmentClass(
											colMeta.type
										)} ${colMeta.className || ""}`}
									>
										{formatValue(cell, colMeta.type)}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
};

export default ColumnMapTable;
