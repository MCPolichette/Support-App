import React from "react";
import { Table } from "react-bootstrap";

const formatNumber = (value) => {
	const num = parseFloat(value);
	return isNaN(num)
		? "-"
		: num.toLocaleString(undefined, { minimumFractionDigits: 2 });
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
	headers = [],
	sortBy = null,
	limit = 100,
	mergeBy = "Affiliate Id",
	staticDisplay = ["Affiliate Name", "Affiliate"],
}) => {
	const prevLookup = Object.fromEntries(
		previousPeriodReport.map((row) => [row[mergeBy], row])
	);

	const combinedRows = currentPeriodReport.map((cur) => {
		const prev = prevLookup[cur[mergeBy]] || {};
		const result = {
			mergeKey: cur[mergeBy],
			displayValues: staticDisplay.map((field) => cur[field] || ""),
		};

		headers.forEach((key) => {
			const curVal = cur[key] || "0";
			const prevVal = prev[key] || "0";
			const { delta, percent } = calculateChange(curVal, prevVal);
			result[key] = {
				current: curVal,
				previous: prevVal,
				delta,
				percent,
			};
		});

		return result;
	});

	if (sortBy && headers.includes(sortBy)) {
		combinedRows.sort(
			(a, b) =>
				parseFloat(b[sortBy].current) - parseFloat(a[sortBy].current)
		);
	}

	const rowsToRender = combinedRows.slice(0, limit);

	return (
		<div className="mb-5">
			<h4 className="mb-3">{title}</h4>
			<Table bordered striped hover responsive size="sm">
				<thead>
					<tr>
						<th>{staticDisplay.join(" / ")}</th>
						{headers.map((key) => (
							<React.Fragment key={key}>
								<th>{key} (Now)</th>
								<th>{key} (Prev)</th>
								<th>{key} Δ%</th>
								<th>{key} Δ</th>
							</React.Fragment>
						))}
					</tr>
				</thead>
				<tbody>
					{rowsToRender.map((row, idx) => (
						<tr key={idx}>
							<td>
								{row.displayValues.map((val, i) => (
									<div key={i}>{val}</div>
								))}
							</td>
							{headers.map((key) => (
								<React.Fragment key={key}>
									<td>{formatNumber(row[key].current)}</td>
									<td>{formatNumber(row[key].previous)}</td>
									<td>{formatNumber(row[key].percent)}%</td>
									<td>{formatNumber(row[key].delta)}</td>
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
