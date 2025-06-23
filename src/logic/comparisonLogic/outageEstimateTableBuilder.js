import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import ColumnMapTable from "../../components/tables/columnMapTable";
import { ProductSummary } from "./SingleReportSummaryMaps";
import { ProductAttributeDeltaTables } from "./productSoldMaps";
import { TableTopper } from "../../components/tables/tableExtras";
import { PageBreaker } from "../../components/PDFelements";
import YoySalesConversionChart from "../../components/graphs/YoySalesConversionChart";
import { CustomCompTable } from "./DynamicTableConstructor";
import { defaultReportArray } from "../../utils/API/_AdminApiModules";
const OutageReport = ({ mid, reports, currentDates, previousDates }) => {
	const reportList = defaultReportArray;
	const getReport = (text) => {
		return reports[text]?.[0];
	};
	const reportTitle = (text, dates) => {
		return text + " " + dates;
	};

	return (
		<Container className="container pt-0">
			<Row className="mb-5">
				<TableTopper
					text={reportTitle(
						"Outage Report for ",
						currentDates.dateRange
					)}
					id={mid}
				/>
			</Row>
		</Container>
	);
};

export default OutageReport;
