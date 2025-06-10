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
	let totalColumns = 0;
	const headersArr = [];
	const dataArr = [];

	const reportC = reports["Performance_Summary_By_Affiliate_current"];
	const reportP = reports["Performance_Summary_By_Affiliate_previous"];

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

	function buildHeaders() {
		if (!array) return;
		array.forEach((element) => {
			if (element.comp) {
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

	function buildData() {
		const sortedArray = Object.values(reportC).sort((a, b) => {
			return parseFloat(b["Sales"]) - parseFloat(a["Sales"]);
		});
		console.log(sortedArray);

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

			array.forEach((element) => {
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

	buildHeaders();

	buildData();

	if (array.length <= 4) {
		return (
			<ColumnMapTable
				id={merchantId}
				topperText={topperText}
				title={title}
				tableMap={headersArr}
				table={dataArr}
				limit={limit}
			/>
		);
	} else {
		console.log(array.length);
		const midpoint = Math.round((array.length - 1) * 0.5) * 4 + 1;
		const firstGraphMap = headersArr.slice(0, midpoint);
		const secondGraphMap = headersArr.slice(midpoint);
		secondGraphMap.unshift(headersArr[0]);
		const firstGraph = dataArr.map((row) => row.slice(0, midpoint));
		const secondGraph = dataArr.map((row) => {
			const x = row[0];
			const sliced = row.slice(midpoint);
			sliced.unshift(x);
			return sliced;
		});

		return (
			<Row>
				<Col>
					<ColumnMapTable
						id={merchantId}
						topperText={topperText}
						title={title}
						tableMap={firstGraphMap}
						table={firstGraph}
						limit={10}
					/>

					<ColumnMapTable
						id={merchantId}
						title={title + " Continued from above"}
						tableMap={secondGraphMap}
						table={secondGraph}
						limit={10}
					/>
					<PageBreaker />
				</Col>
			</Row>
		);
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
