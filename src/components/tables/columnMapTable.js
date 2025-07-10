import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { TableTopper } from "./tableExtras";
import "./smallFontStyle.css";
import LimitTableRows from "../buttons_and_dropdowns/LimitTableRows";
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
		case "end":
			return "text-end";
		case "percent":
			return "text-center";
		default:
			return "text-start";
	}
};
const setRows = (limit, table) => {
	let safeLimit = 20;
	if (limit && limit < table.length) {
		safeLimit = limit;
	} else {
		safeLimit = table.length;
	}
	return safeLimit;
};
const checkforData = (data) => {
	if (data.length) {
		return true;
	} else {
		console.log("DATA has no length, error");
	}
};
const ColumnMapTable = ({
	title,
	tableMap,
	table = [],
	limit,
	topperText,
	id,
	hideTools,
	classes,
}) => {
	const [displayedRows, setDisplayedRows] = useState(
		table.slice(0, setRows(limit, table))
	);
	const [displayTable, setDisplayTable] = useState(checkforData(table));
	const [visibleCols, setVisibleCols] = useState(tableMap.map(() => true));
	const hideColumn = (index) => {
		const updatedCols = [...visibleCols];
		updatedCols[index] = false;
		setVisibleCols(updatedCols);
	};
	return (
		<div className="mb-1">
			{topperText && <TableTopper id={id} text={topperText} />}

			<LimitTableRows
				hidden={hideTools}
				displayTable={displayTable}
				setDisplayTable={setDisplayTable}
				displayedRows={displayedRows}
				table={table}
				setDisplayedRows={setDisplayedRows}
				title={title}
			/>
			{displayTable ? (
				<div>
					{title && <h5>{title}</h5>}
					<Table striped bordered hover size="sm" className={classes}>
						<thead>
							<tr className="blacktop">
								{tableMap.map((col, idx) =>
									visibleCols[idx] ? (
										<th
											key={idx}
											className={col.className}
											style={{ position: "relative" }}
										>
											<span
												className="d-print-none"
												style={{
													position: "absolute",
													top: 0,
													right: 4,
													cursor: "pointer",
													color: "red",
													fontWeight: "bold",
												}}
												onClick={() => hideColumn(idx)}
												title="Hide column"
											>
												×
											</span>
											{Array.isArray(col.label)
												? col.label.map((line, i) => (
														<div key={i}>
															{line}
														</div>
												  ))
												: col.label || `Col ${idx}`}
										</th>
									) : null
								)}
							</tr>
						</thead>
						<tbody>
							{displayedRows.map((row, rowIdx) => (
								<tr key={rowIdx}>
									{row.map((cell, colIdx) => {
										if (!visibleCols[colIdx]) return null;
										const colMeta = tableMap[colIdx] || {};
										return (
											<td
												key={colIdx}
												className={`${getAlignmentClass(
													colMeta.type
												)} ${colMeta.className || ""}`}
											>
												{formatValue(
													cell,
													colMeta.type
												)}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</Table>
				</div>
			) : (
				<div />
			)}
		</div>
	);
};

export default ColumnMapTable;
