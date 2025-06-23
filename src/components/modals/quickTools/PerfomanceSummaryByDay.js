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
import LoadingOverlay from "../../LoadingOverlay";
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

	useEffect(() => {
		if (stage === "baseline") {
			const oneMonthPrior = get30DaysPrior(startDate);

			console.log(oneMonthPrior);
			runDayReport(oneMonthPrior);
		} else {
			return;
		}
	});
	function nothing() {
		return "";
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
			console.log(performanceSummaryReport);
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
							/>
						</Col>
						<Col sm={4}>
							<Alert variant="success">
								<h4>Choosing Baseline Period</h4>
								<p>
									The Default Baseline Period is generally the
									2 weeks prior to the outage. However, there
									are circumstances and scenarios where one
									may choose different time periods based on
									the size of the outage, and the click
									performances
								</p>
								<Row>
									<h4>Adjust Baseline Dates</h4>
									<DateRangePicker
										startDate={suggestedBaselineStart}
										endDate={suggestedBaselineEnd}
										onStartChange={
											setSuggestedBaselineStart
										}
										onEndChange={setSuggestedBaselineEnd}
										otherFunction={nothing}
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
