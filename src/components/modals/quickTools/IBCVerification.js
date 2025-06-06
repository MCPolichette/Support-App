import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { runAPI } from "../../../utils/API/apiRunner";
import { getSettings } from "../../../utils/API/_AdminApiModules";
import MerchantAndNetworkInput from "../../forms/MerchantAndNetworkInput";
import { getDefaultStartDate, getDefaultEndDate } from "../../../utils/getTime";
import ColumnMapTable from "../../tables/columnMapTable";
import { ProductSummary } from "../../../logic/comparisonLogic/SingleReportSummaryMaps";

const IBCVerification = () => {
	const settings = getSettings();
	console.log(settings);
	const [merchantId, setMerchantId] = useState("");
	const [network, setNetwork] = useState("US");
	const [report, setReport] = useState({});
	const startDate = getDefaultStartDate("first-of-last-month");
	const endDate = getDefaultEndDate();
	const checkProducts = async () => {
		try {
			const productSoldReport = await runAPI(
				{ report_id: 18, startDate: startDate, endDate: endDate },
				settings.key,
				merchantId
			);
			const errorMessage =
				"Invalid authentication key supplied for admin/private login-specific request.";
			if (
				Array.isArray(productSoldReport) &&
				productSoldReport.length === 1 &&
				productSoldReport[0] === errorMessage
			) {
				// TODO: Should Put in a Alert here.. explaining the Error Message
			} else {
				console.log(productSoldReport);
				console.log("success");
				const productSummaryTable =
					ProductSummary(productSoldReport).tableDisplay;
				setReport({
					data: productSummaryTable.headers,
					data: productSummaryTable.data,
				});
			}
		} catch (err) {}
	};

	return (
		<Container className="mt-4">
			<Row>
				<Col md={9}>
					<MerchantAndNetworkInput
						selectedMerchant={merchantId}
						selectedNetwork={network}
						setSelectedMerchant={setMerchantId}
						setSelectedNetwork={setNetwork}
					/>
				</Col>
				<Col md={3}>
					{merchantId != "" && (
						<Button onClick={checkProducts}>
							Run Product Report API
						</Button>
					)}
				</Col>
				<hr />
			</Row>

			<Row>
				<ColumnMapTable
					title={["Most Sold Products ", startDate + "to" + endDate]}
					tableMap={report.map}
					table={report.data}
					limit={10}
				/>
			</Row>

			<Row>
				<h5>Tool Function:</h5>
				<p>
					This tool runs a product Sold API for the selected merchant.
				</p>
				<p>
					From the subsequent report we will wither provide a
					confirmation that IBC can be turned on. OR supply copy,
					indicating what changes need to be done in order to satisfy
					the request.
				</p>
			</Row>
		</Container>
	);
};

export default IBCVerification;
