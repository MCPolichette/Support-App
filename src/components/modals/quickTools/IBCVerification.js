import React, { useState } from "react";
import { Container, Row, Col, Stack, Button, Alert } from "react-bootstrap";
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
	const [report, setReport] = useState({ headers: [], data: [] });
	const [stage, setStage] = useState("input");
	const [results, setResults] = useState({});
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
				setResults({
					title: "ERROR No Items present in this report.",
					notes: "Not enough details in the most recent reports.  This may be a lack of sales. OR an indicator that the Merchant does not send item data in the order confirmation script.  You should take time to review ",
				});
			} else {
				const missingData = [];
				const brandNames = [];
				const departments = [];
				const categories = [];
				const subcategories = [];

				productSoldReport.forEach((product) => {
					if (!product["Product Name"]) {
						missingData.push(product["Product SKU"]); // Collect SKUs missing product names
					}
					if (
						product["Brand Name"] &&
						!brandNames.includes(product["Brand Name"])
					) {
						brandNames.push(product["Brand Name"]); // Unique Brand Name
					}
					if (
						product["Department"] &&
						!departments.includes(product["Department"])
					) {
						departments.push(product["Department"]); // Unique Department
					}
					if (
						product["Category"] &&
						!categories.includes(product["Category"])
					) {
						categories.push(product["Category"]); // Unique Category
					}
					if (
						product["Subcategory"] &&
						!subcategories.includes(product["Subcategory"])
					) {
						subcategories.push(product["Subcategory"]); // Unique Subcategory
					}
				});
				const percent = (
					((productSoldReport.length - missingData.length) /
						productSoldReport.length) *
					100
				).toFixed(2);
				function confidence() {
					if (productSoldReport.length === 0) {
						return {
							notes: "No Items in this report.  Its not possible to determine whether or Not IBC can be turned on.",
							alertType: "danger",
						};
					} else if (productSoldReport.length > 1 && percent === 0) {
						return {
							notes: "There are items in the report, BUT NO Items were recognized.  Do not turn on IBC",
							alertType: "danger",
						};
					} else if (productSoldReport.length > 1 && percent < 50) {
						return {
							notes: "There are items in the report, BUT Less than Half of The Items were recognized.",
							alertType: "danger",
						};
					} else if (productSoldReport.length > 1 && percent < 75) {
						return {
							notes: "There are items in the report, and many items are recognized.  However I recommend updating the datafeed.",
							alertType: "warning",
						};
					} else if (productSoldReport.length > 1 && percent < 95) {
						return {
							notes: "Mostly Good, Still recommend look into feed status, and import statuses.",
							alertType: "info",
						};
					} else if (productSoldReport.length > 1 && percent > 95) {
						return {
							notes: "SUCCESS - more than 95% of items recognized!",
							alertType: "success",
						};
					}
				}
				const x = confidence();
				setResults({
					title: "API ran successfully",
					missingData: missingData,
					brandNames: brandNames,
					departments: departments,
					categories: categories,
					subcategories: subcategories,
					numOfProducts: productSoldReport.length,
					percentOfRecognizedSkus: percent + "%",
					alertVariant: x.alertType,
					notes: x.notes,
				});

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
				<Col md={12}>
					<MerchantAndNetworkInput
						selectedMerchant={merchantId}
						selectedNetwork={network}
						setSelectedMerchant={setMerchantId}
						setSelectedNetwork={setNetwork}
					/>
					{merchantId !== "" && (
						<Stack>
							<Button onClick={checkProducts}>
								Run Product Report API
							</Button>
						</Stack>
					)}
				</Col>

				<hr />
			</Row>
			{stage === "input" && (
				<Row>
					<h5>Tool Function:</h5>
					<p>
						This tool runs a product Sold API for the selected
						merchant.
					</p>
					<p>
						From the subsequent report we will wither provide a
						confirmation that IBC can be turned on. OR supply copy,
						indicating what changes need to be done in order to
						satisfy the request.
					</p>
					{/* missingData:{results.missingData}
					percentOfRecognizedSkus: */}
				</Row>
			)}
			{stage === "loading" && <h1>LOADING</h1>}
			{stage === "results" && (
				<>
					<Row>
						<Col>
							<h3>{results.title}</h3>
							<h6>
								Confidence Score:{" "}
								{results.percentOfRecognizedSkus}{" "}
							</h6>
							<hr />
						</Col>
					</Row>
					<Row>
						<Col sm={5}>
							<ul
								style={{
									listStyleType: "none",
									paddingLeft: 0,
								}}
							>
								<li
									style={{
										display: "flex",
										justifyContent: "space-between",
									}}
								>
									<span>Number of Products Sold:</span>
									<strong>{results.numOfProducts}</strong>
								</li>
								<li
									style={{
										display: "flex",
										justifyContent: "space-between",
									}}
								>
									<span>Brand Names Listed:</span>
									<strong>{results.brandNames.length}</strong>
								</li>
								<li
									style={{
										display: "flex",
										justifyContent: "space-between",
									}}
								>
									<span>Unique Departments:</span>
									<strong>
										{results.departments.length}
									</strong>
								</li>
								<li
									style={{
										display: "flex",
										justifyContent: "space-between",
									}}
								>
									<span>Unique Categories:</span>
									<strong>{results.categories.length}</strong>
								</li>
								<li
									style={{
										display: "flex",
										justifyContent: "space-between",
									}}
								>
									<span>Unique Subcategories:</span>
									<strong>
										{results.subcategories.length}
									</strong>
								</li>
							</ul>
						</Col>
						<Col sm={7}>
							<Alert variant={results.alertVariant}>
								<li>{results.notes}</li>
								<li>
									Over the {results.numOfProducts} products in
									this report. We found{" "}
									{results.missingData.length} products that
									were not found in the current datafeed.
								</li>
								<li>
									For a total of{" "}
									<strong>
										{results.percentOfRecognizedSkus}{" "}
									</strong>
									of the total skus recognized.
								</li>
							</Alert>
						</Col>
					</Row>
					<Row>
						<ColumnMapTable
							title={"Reports Shows results below:"}
							tableMap={report.headers}
							table={report.data}
							limit={10}
							id={merchantId}
							hideTools={true}
						/>
					</Row>
				</>
			)}
		</Container>
	);
};

export default IBCVerification;
