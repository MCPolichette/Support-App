import React, { useState, useEffect } from "react";
import {
	Container,
	Row,
	Col,
	Stack,
	Button,
	Spinner,
	Alert,
} from "react-bootstrap";
import { runAPI } from "../../../utils/API/apiRunner";
import { getSettings } from "../../../utils/API/_AdminApiModules";
import MerchantAndNetworkInput from "../../forms/MerchantAndNetworkInput";
import {
	getDefaultStartDate,
	getDefaultEndDate,
	get30DaysPrior,
	getBaselineRange,
	getReportTexts,
} from "../../../utils/getTime";
import PerformanceSummaryByTimeGraph from "../../graphs/PerformanceSummaryByTime";
import DateRangePicker from "../../forms/DateRangePicker";
// import LoadingOverlay from "../../LoadingOverlay";
const PerformanceSummaryByDay = ({
	startingStage,
	mId,
	mNetwork,
	start,
	end,
	runReport,
}) => {
	const [baselineDays, setBaselineDays] = useState(14);
	const settings = getSettings();
	const [merchantId, setMerchantId] = useState(mId || "");
	const [network, setNetwork] = useState(mNetwork || "US");
	const [stage, setStage] = useState(startingStage || "input");
	const [results, setResults] = useState(["Clicks", "Sales VS Clicks"]);
	const [startDate, setStartDate] = useState(
		start || getDefaultStartDate("first-of-last-month")
	);
	const [suggestedBaselineStart, setSuggestedBaselineStart] = useState(
		getBaselineRange(startDate, baselineDays).start
	);
	const [suggestedBaselineEnd, setSuggestedBaselineEnd] = useState(
		getBaselineRange(startDate, baselineDays).end
	);
	const [endDate, setEndDate] = useState(end || getDefaultEndDate());
	const [baseSummary, setBaseSummary] = useState({
		clicks: 0,
		sales: 0,
		numOfSales: 0,
	});
	const [outageSummary, setOutageSummary] = useState({
		clicks: 0,
		sales: 0,
		numOfSales: 0,
	});

	useEffect(() => {
		if (stage === "baseline") {
			const oneMonthPrior = get30DaysPrior(startDate);
			console.log(oneMonthPrior);
			runDayReport(oneMonthPrior);
		} else {
			return;
		}
	});
	function updateGraphData() {
		const data = results.data;
		const referenceDate = new Date(`${startDate}T00:00:00`);
		const baseLineDates = {
			end: new Date(`${suggestedBaselineEnd}T00:00:00`),
			start: new Date(`${suggestedBaselineStart}T00:00:00`),
		};
		baseLineDates.end.setDate(baseLineDates.end.getDate() + 1);
		baseLineDates.start.setDate(baseLineDates.start.getDate());
		const oSummary = { clicks: 0, sales: 0, numOfSales: 0 };
		const bSummary = { clicks: 0, sales: 0, numOfSales: 0 };
		for (let i = 0; i < data.length; i++) {
			const dayDate = new Date(`${data[i].Date}T00:00:00`);
			const clicks = Number(data[i]["Click Throughs"]);
			const sales = Number(data[i]["Sales"]);
			const numOfSales = Number(data[i]["# of Sales"]);
			const isBaseline =
				dayDate < baseLineDates.end && dayDate > baseLineDates.start;
			const isOutage = dayDate >= referenceDate;
			if (isBaseline) {
				bSummary.clicks = bSummary.clicks + clicks;
				bSummary.sales = bSummary.sales + sales;
				bSummary.numOfSales = bSummary.numOfSales + numOfSales;
			} else if (isOutage) {
				oSummary.clicks = oSummary.clicks + clicks;
				oSummary.sales = oSummary.sales + sales;
				oSummary.numOfSales = oSummary.numOfSales + numOfSales;
			}
		}
		oSummary.conversionRate = oSummary.numOfSales / oSummary.clicks;
		bSummary.conversionRate = bSummary.numOfSales / bSummary.clicks;
		setBaseSummary(bSummary);
		setOutageSummary(oSummary);
	}

	const runDayReport = async (newStartDate) => {
		const apiStart = newStartDate || startDate;
		setStage("loading");
		try {
			const performanceSummaryReport = await runAPI(
				{ report_id: 12, startDate: apiStart, endDate: endDate },
				settings.key,
				merchantId
			);
			const errorMessage =
				"Invalid authentication key supplied for admin/private login-specific request.";
			if (
				Array.isArray(performanceSummaryReport) &&
				performanceSummaryReport.length === 1 &&
				performanceSummaryReport[0] === errorMessage
			) {
				setResults({
					title: "ERROR No Data present in this report.",
				});
			} else {
			}
			setResults({ data: performanceSummaryReport });
			setStage("results");
		} catch (err) {
			setStage("error", err);
		}
	};

	return (
		<Container>
			<Row>
				{stage === "input" && (
					<Col md={12}>
						<MerchantAndNetworkInput
							selectedMerchant={merchantId}
							selectedNetwork={network}
							setSelectedMerchant={setMerchantId}
							setSelectedNetwork={setNetwork}
						/>
						{merchantId !== "" && (
							<Stack>
								<Button>Run Product Report API</Button>
							</Stack>
						)}
						<hr />
					</Col>
				)}
			</Row>
			{stage === "start" && (
				<Row>
					<h5>Stage ==="start"</h5>
				</Row>
			)}
			{stage === "loading" && (
				<div>
					<h3>
						<Spinner />
						{"   "}LOADING...{"   "}
						<Spinner />
					</h3>
					<h6>Running Performance Summary by Day Report</h6>
					<h5>
						{startDate} to {endDate}
					</h5>
				</div>
			)}
			{stage === "results" && (
				<>
					<Row>
						<Col sm={8}>
							<PerformanceSummaryByTimeGraph
								data={results.data}
								hAxisTitle={"TODO"}
								reportFormat={"Clicks"}
								baselineDays={{
									start: suggestedBaselineStart,
									end: suggestedBaselineEnd,
								}}
								outageDates={{ start: startDate, end: endDate }}
								setBaseSummary={setBaseSummary}
								setOutageSummary={setOutageSummary}
							/>
						</Col>
						<Col sm={4}>
							<Alert variant="success" className="small">
								<h4>Choosing Baseline Period</h4>
								<p>
									The Default Baseline Period is generally the
									2 weeks prior to the outage. However, there
									are circumstances and scenarios where one
									may choose different time periods based on
									the size of the outage, and the click
									performances
								</p>
								<dl>
									<dt>Baseline Data</dt>
									<dd>-Clicks={baseSummary.clicks}</dd>
									<dd>-sales={baseSummary.sales}</dd>
									<dd>
										-Number of Sales=
										{baseSummary.numOfSales}
									</dd>
									<dd>
										-Conversion rate=
										{baseSummary.conversionRate}
									</dd>
									<dt>Outage Data</dt>
									<dd>-Clicks={outageSummary.clicks}</dd>
									<dd>-sales={outageSummary.sales}</dd>
									<dd>
										-Number of Sales=
										{outageSummary.numOfSales}
									</dd>
									<dd>
										-Conversion rate=
										{outageSummary.conversionRate}
									</dd>
								</dl>

								<Row>
									<h4>Adjust Baseline Dates</h4>
									<DateRangePicker
										startDate={suggestedBaselineStart}
										endDate={suggestedBaselineEnd}
										onStartChange={
											setSuggestedBaselineStart
										}
										onEndChange={setSuggestedBaselineEnd}
										otherFunction={updateGraphData}
									/>
								</Row>
							</Alert>
						</Col>

						<Button
							variant="primary"
							size="lg"
							className="mt-2"
							onClick={() =>
								runReport({
									start: suggestedBaselineStart,
									end: suggestedBaselineEnd,
								})
							}
						>
							Use Baseline Dates{" - "}
							{
								getReportTexts(
									suggestedBaselineStart,
									suggestedBaselineEnd
								).dateRange
							}
						</Button>
					</Row>
				</>
			)}
		</Container>
	);
};

export default PerformanceSummaryByDay;
