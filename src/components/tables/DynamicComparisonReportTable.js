import React, { useState } from "react";
import { Table } from "react-bootstrap";
import "./DynamicComparisonReportTable.css";

const formatNumber = (value, dataType) => {
	const num = parseFloat(value);
	if (isNaN(num)) return "-";

	switch (dataType) {
		case "currency":
			return (
				"$" +
				num.toLocaleString(undefined, { minimumFractionDigits: 2 })
			);
		case "percent":
			return num.toFixed(2) + "%";
		case "int":
			return Math.round(num).toLocaleString();
		default:
			return value;
	}
};

const calculateChange = (current, previous) => {
	const cur = parseFloat(current) || 0;
	const prev = parseFloat(previous) || 0;
	const delta = cur - prev;
	const percent = prev !== 0 ? (delta / prev) * 100 : 0;
	return { delta, percent };
};

const DynamicComparisonReportTable = ({
	title,
	currentPeriodReport = [],
	previousPeriodReport = [],
	reportSettings = {},
	hiddenFields = [],
}) => {
	const [sortConfig, setSortConfig] = useState({
		key: reportSettings.sortBy,
		direction: "desc",
	});

	const headersConfig = reportSettings.headers || {};
	const joinKey = reportSettings.joinKey;

	const prevLookup = Object.fromEntries(
		previousPeriodReport.map((row) => [row[joinKey], row])
	);

	const combinedRows = currentPeriodReport.map((cur) => {
		const prev = prevLookup[cur[joinKey]] || {};
		const displayValues = [];
		const dynamicFields = [];

		Object.keys(headersConfig).forEach((field) => {
			if (hiddenFields.includes(field)) return;
			const yoy = headersConfig[field]?.yoy ?? headersConfig[field]; // fallback if simple true/false
			const dataType = headersConfig[field]?.dataType || "string";
			const curVal = cur[field] || "";
			const prevVal = prev[field] || "";

			if (yoy) {
				const { delta, percent } = calculateChange(curVal, prevVal);
				dynamicFields.push({
					label: field,
					current: curVal,
					previous: prevVal,
					delta,
					percent,
					dataType,
				});
			} else {
				displayValues.push({ label: field, value: curVal });
			}
		});
		return {
			joinKey: cur[joinKey],
			displayValues,
			dynamicFields,
		};
	});

	const sortedRows = [...combinedRows];
	if (sortConfig.key && sortedRows.length > 1) {
		sortedRows.sort((a, b) => {
			const aField = a.dynamicFields.find(
				(f) => f.label === sortConfig.key
			);
			const bField = b.dynamicFields.find(
				(f) => f.label === sortConfig.key
			);
			const aVal = parseFloat(aField?.current || 0);
			const bVal = parseFloat(bField?.current || 0);

			if (sortConfig.direction === "asc") {
				return aVal - bVal;
			} else {
				return bVal - aVal;
			}
		});
	}

	const toggleSort = (field) => {
		if (sortConfig.key === field) {
			setSortConfig({
				key: field,
				direction: sortConfig.direction === "asc" ? "desc" : "asc",
			});
		} else {
			setSortConfig({ key: field, direction: "desc" });
		}
	};

	return (
		<div className="mb-5">
			<h4 className="mb-3">{title}</h4>
			<Table
				bordered
				striped
				hover
				responsive
				size="sm"
				className="dynamic-table"
			>
				<thead>
					<tr>
						<th>Static Info</th>
						{[
							...new Set(
								combinedRows.flatMap((r) =>
									r.dynamicFields.map((f) => f.label)
								)
							),
						].map((field) => (
							<React.Fragment key={field}>
								<th
									onClick={() => toggleSort(field)}
									style={{ cursor: "pointer" }}
									className={
										sortConfig.key === field
											? sortConfig.direction === "asc"
												? "sort-asc"
												: "sort-desc"
											: ""
									}
								>
									{field}
								</th>
								<th>Prev</th>
								<th>Δ%</th>
								<th>Δ</th>
							</React.Fragment>
						))}
					</tr>
				</thead>
				<tbody>
					{sortedRows.map((row, idx) => (
						<tr key={idx}>
							<td>
								{row.displayValues.map((val, i) => (
									<div key={i}>
										<strong>{val.label}:</strong>{" "}
										{val.value}
									</div>
								))}
							</td>
							{row.dynamicFields.map((field, i) => (
								<React.Fragment key={i}>
									<td>
										{formatNumber(
											field.current,
											field.dataType
										)}
									</td>
									<td>
										{formatNumber(
											field.previous,
											field.dataType
										)}
									</td>
									<td>
										{field.percent === "-"
											? "-"
											: formatNumber(
													field.percent,
													"percent"
											  )}
									</td>
									<td>
										{formatNumber(
											field.delta,
											field.dataType
										)}
									</td>
								</React.Fragment>
							))}
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
};

export default DynamicComparisonReportTable;
