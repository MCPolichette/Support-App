import { Col, Row } from "react-bootstrap";
import ColumnMapTable from "../../components/tables/columnMapTable";
import { PageBreaker } from "../../components/PDFelements";
import "../../components/tables/smallFontStyle.css";

// Utility Functions
export function percentChange(curr, prev) {
	if (!prev || isNaN(curr) || isNaN(prev)) return "–";
	return ((curr / prev - 1) * 100).toFixed(2) + "%";
}

export function difference(curr, prev, format = "int") {
	const diff = curr - prev;
	switch (format) {
		case "percent":
			return (diff * 100).toFixed(2) + "%";
		case "dollar":
			return "$" + diff.toFixed(2);
		case "int":
		default:
			return Math.round(diff);
	}
}

// Main Table Component
export const CustomCompTable = ({
	reportType,
	topperText,
	title,
	limit,
	key,
	merchantId,
	array,
	currLabel,
	prevLabel,
	reports,
}) => {
	let grossSalesCurr = 0;
	const determineSCDValues = () => {
		if (reports["Sales_Commissions_Detail_current"]) {
			const SCD = reports["Sales_Commissions_Detail_current"];
			console.log(SCD);
			SCD.forEach((row) => {
				if (row["Transaction Type"] === "SALE") {
					grossSalesCurr =
						grossSalesCurr + Number(row["Transaction Amount"]);
				} else {
					return;
				}
			});
		} else return;
	};
	determineSCDValues();

	let totalColumns = 0;
	const headersArr = [];
	const dataArr = [];
	//TODO  THIS IS HOW WE MAKE DYNAMIC SHIT WORK!!!!!
	console.log(reports);
	const reportC = reports[array.compReports.curr];
	const reportP = reports[array.compReports.prev];
	console.log(array.compReports.curr, reportP);
	function addComparativeHeaders(element) {
		const endBorder = element.addClass + " border-right border-dark ";
		headersArr.push({
			label: [element.label, currLabel],
			type: element.format,
			className: element.addClass,
		});
		headersArr.push({
			label: [element.label, prevLabel],
			type: element.format,
			className: element.addClass,
		});
		headersArr.push({
			label: [currLabel + " vs", prevLabel + " %", "Change"],
			type: element.format,
			className: element.addClass,
		});
		headersArr.push({
			label: [currLabel + " vs", prevLabel, "Change"],
			type: element.format,
			className: endBorder,
		});
		totalColumns += 4;
	}

	function buildHeaders(array) {
		if (!array.headers) return;
		array.headers.forEach((element) => {
			if (element.comp === true) {
				addComparativeHeaders(element);
			} else {
				headersArr.push({
					label: element.label,
					type: element.format,
					className: element.addClass,
				});
				totalColumns += 1;
			}
		});
	}

	function buildHorizontalComp() {
		const sortedArray = Object.values(reportC).sort((a, b) => {
			return parseFloat(b["Sales"]) - parseFloat(a["Sales"]);
		});

		Object.entries(sortedArray).forEach(([i, curr]) => {
			if (!curr || typeof curr !== "object") return;

			const match =
				reportP[i] && typeof reportP[i] === "object" ? reportP[i] : {};
			const row = [];

			// AOV
			curr["AOV"] = curr["Sales"] / curr["# of Sales"];
			match["AOV"] = match["Sales"] / match["# of Sales"];

			// Total Spend
			curr["Total Spend"] =
				curr["Network Commission"] + curr["Commission"];
			match["Total Spend"] =
				match["Network Commission"] + match["Commission"];

			// ROA
			curr["ROA"] = curr["Sales"] / curr["Total Spend"];
			match["ROA"] = match["Sales"] / match["Total Spend"];

			array.headers.forEach((element) => {
				const valCurr = curr[element.value];
				const valPrev = match[element.value];
				if (element.comp) {
					row.push(valCurr);
					row.push(valPrev);
					row.push(percentChange(valCurr, valPrev));
					row.push(difference(valCurr, valPrev, element.format));
				} else {
					row.push(valCurr);
				}
			});

			dataArr.push(row);
		});
	}
	switch (reportType) {
		case "verticalComp":
			buildHeaders(array);
			const cReport = reports[array.compReports.curr][0];
			const pReport = reports[array.compReports.prev][0];
			const cRow = [];
			const pRow = [];
			const compRow = [];
			array.headers.forEach((col) => {
				if (col.value === "selectedTime") {
					cRow.push(currLabel);
					pRow.push(prevLabel);
					compRow.push("Difference:");
				} else {
					cRow.push(cReport[col.value]);
					pRow.push(pReport[col.value]);
					compRow.push(cReport[col.value] - pReport[col.value]);
				}
			});
			dataArr.push(cRow, pRow, compRow);
			return (
				<>
					<ColumnMapTable
						id={merchantId}
						topperText={topperText}
						title={title}
						tableMap={headersArr}
						table={dataArr}
						limit={limit}
					/>
				</>
			);
		case "yoyHorizontal":
			console.log(array);
			buildHeaders(array);
			buildHorizontalComp();
			console.log("horizontalComp", array);
			if (array.headers.length <= 4) {
				return (
					<>
						<ColumnMapTable
							id={merchantId}
							topperText={topperText}
							title={title}
							tableMap={headersArr}
							table={dataArr}
							limit={limit}
						/>
					</>
				);
			} else {
				console.log(array.headers.length);
				const rowTitles = array.headers.filter(
					(obj) => obj.comp === false
				);
				console.log(rowTitles);
				const midpoint =
					Math.round(
						(array.headers.length - rowTitles.length) * 0.5
					) *
						4 +
					rowTitles.length;

				const firstTableMap = headersArr.slice(0, midpoint);
				const secondTableMap = headersArr.slice(midpoint);

				secondTableMap.unshift(headersArr[0]);
				const firstTable = dataArr.map((row) => row.slice(0, midpoint));
				const secondTable = dataArr.map((row) => {
					const x = row[0];
					const sliced = row.slice(midpoint);
					console.log(sliced);
					sliced.unshift(x);
					return sliced;
				});
				console.log(
					"++++++++++++++++++++++++++++++++++++++++++++++",
					"midpoint",
					midpoint,
					"array",
					array.headers.length,
					"firstTableMap",
					firstTableMap,
					"secondTableMap",
					secondTableMap
				);
				return (
					<Row>
						<Col>
							<ColumnMapTable
								id={merchantId}
								topperText={topperText}
								title={title}
								tableMap={firstTableMap}
								table={firstTable}
								limit={10}
							/>
							<ColumnMapTable
								id={merchantId}
								title={title + " Continued from above"}
								tableMap={secondTableMap}
								table={secondTable}
								limit={10}
							/>

							<PageBreaker />
						</Col>
					</Row>
				);
			}

		case "currentOnly":
			console.log("currentOnly");
	}
};

// Example usage definition
const exampleArray = [
	{
		value: "Affiliate Name",
		format: "string",
		label: "Affiliate Name",
		comp: true,
		addClass: "",
	},
];
