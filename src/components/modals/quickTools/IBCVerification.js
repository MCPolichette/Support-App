import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { runAPI } from "../../../utils/API/apiRunner";
import { getSettings } from "../../../utils/API/_AdminApiModules";
import MerchantAndNetworkInput from "../../forms/MerchantAndNetworkInput";
import { getDefaultStartDate, getDefaultEndDate } from "../../../utils/getTime";
import ColumnMapTable from "../../tables/columnMapTable";
import { ProductSummary } from "../../../logic/comparisonLogic/SingleReportSummaryMaps";
import { setSeconds } from "date-fns";

const IBCVerification = () => {
	const settings = getSettings();
	console.log(settings);
	const [merchantId, setMerchantId] = useState("");
	const [network, setNetwork] = useState("US");
	const [report, setReport] = useState({ headers: [], data: [] });
	const [stage, setStage] = useState("input");
	const startDate = getDefaultStartDate("first-of-last-month");
	const endDate = getDefaultEndDate();
	const checkProducts = async () => {
		try {
			setStage("loading");
			const productSoldReport = await runAPI(
				{ report_id: 18, startDate: startDate, endDate: endDate },
				settings.key,
				merchantId
			);
			console.log(productSoldReport);

			const errorMessage =
				"Invalid authentication key supplied for admin/private login-specific request.";
			if (
				Array.isArray(productSoldReport) &&
				productSoldReport.length === 1 &&
				productSoldReport[0] === errorMessage
			) {
				// TODO: Should Put in a Alert here.. explaining the Error Message
			} else {
				console.log("the right part is working");
				const productSummaryTable = ProductSummary(productSoldReport, {
					year: "recently",
				}).tableDisplay;
				setReport({
					headers: productSummaryTable.headers,
					data: productSummaryTable.data,
				});
				console.log(productSummaryTable);
				setStage("results");
			}
		} catch (err) {
			setStage("error", err);
		}
	};
	console.log(stage);
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
			{stage === "loading" && <h1>LOADING</h1>}
			<Row>
				{stage === "results" && (
					<ColumnMapTable
						title={"Reports Shows results below:"}
						tableMap={report.headers}
						table={report.data}
						limit={10}
						id={merchantId}
						showTools={false}
					/>
				)}
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
