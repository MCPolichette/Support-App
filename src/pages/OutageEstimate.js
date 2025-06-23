import React, { useState, useEffect } from "react";
import { Spinner, Stack, Button, Row, Col, Container } from "react-bootstrap";
import {
	getDefaultStartDate,
	getDefaultEndDate,
	getLastYearSameWeek,
} from "../utils/getTime";
import StylizedModal from "../components/modals/_ModalStylized";
import PerformanceSummaryByDay from "../components/modals/quickTools/PerfomanceSummaryByDay";
import DateRangePicker from "../components/forms/DateRangePicker";
import MerchantAndNetworkInupt from "../components/forms/MerchantAndNetworkInput";

const getMerchantLogo = (id) =>
	id === "23437"
		? `https://static.avantlink.com/merchant-logos/23437`
		: `https://static.avantlink.com/merchant-logos/${id}.png`;

const OutageEstimate = () => {
	const [startDate, setStartDate] = useState(
		getDefaultStartDate("last7days")
	);
	const [endDate, setEndDate] = useState(getDefaultEndDate());
	const [previousPeriodStart, setPreviousPeriodStart] = useState(
		getLastYearSameWeek(startDate, endDate).start
	);
	const [modalType, setModalType] = useState(null);
	const [previousPeriodEnd, setPreviousPeriodEnd] = useState(
		getLastYearSameWeek(startDate, endDate).end
	);

	const [selectedMerchant, setSelectedMerchant] = useState("");
	const [selectedNetwork, setSelectedNetwork] = useState("");
	const [reportingStage, setReportingStage] = useState("start");
	const [disabledBaselineButton, setDisabledBaselineButton] = useState(true);
	useEffect(() => {
		if (selectedMerchant !== "" && selectedNetwork !== "") {
			setDisabledBaselineButton(false);
		} else {
			setDisabledBaselineButton(true);
		}
	}, [selectedMerchant, selectedNetwork]);
	const determineBaseline = () => {
		setReportingStage("baseline");
		console.log(reportingStage);
		setModalType("PSDay");
	};
	const testfunction = () => {
		console.log("date update");
	};

	return (
		<div className="position-relative card-drop-in ">
			<Button onClick={() => setReportingStage("start")}>
				set to start
			</Button>
			{reportingStage === ("start" || "baseline") && (
				<Container className="shadow-sm p-4 bg-white border rounded ">
					<Row>
						<h1>Outage Estimate 2.0</h1>

						<MerchantAndNetworkInupt
							title="Fill in the Merchant Id and Network to begin"
							selectedMerchant={selectedMerchant}
							selectedNetwork={selectedNetwork}
							setSelectedMerchant={setSelectedMerchant}
							setSelectedNetwork={setSelectedNetwork}
						/>
						<hr />

						<h5 className="text-muted">
							This report compares the duration of the outage with
							a similar period in the past referred to as the
							'baseline' period.
						</h5>
						<p className="text-muted">
							To estimate the sales made by each affiliate, we
							consider their clickthrough rates. This estimation
							is calculated by multiplying the estimated total
							program sales with the ratio of affiliate clicks to
							overall clicks.
						</p>
						<p>
							Additionally, we factor in the baseline average
							order value (AOV) and conversion rate of the
							program, either by multiplying the affiliate clicks
							with the program's baseline AOV and conversion rate
							or by taking the average of both methods. Any actual
							sales that occurred during the outage period are
							excluded from these calculations.
						</p>
						<hr />
					</Row>
					<Row>
						<Col sm={8}>
							<h5>Select Outage period</h5>{" "}
							<DateRangePicker
								startDate={startDate}
								endDate={endDate}
								onStartChange={setStartDate}
								onEndChange={setEndDate}
								otherFunction={testfunction}
							/>
						</Col>
						<Col sm={4} className="d-grid gap-2">
							<Button
								onClick={() => setModalType("PSDay")}
								disabled={disabledBaselineButton}
								variant="secondary"
							>
								Determine Outage Dates (if unsure)
							</Button>
						</Col>
						<Col sm={12} className="d-grid gap-2">
							<Button
								onClick={() => determineBaseline()}
								disabled={disabledBaselineButton}
								variant="success"
								className="m-3"
							>
								Determine BaseLine
							</Button>
						</Col>
					</Row>
				</Container>
			)}
			<StylizedModal
				show={!!modalType}
				onHide={() => setModalType(null)}
				size="xl"
			>
				<PerformanceSummaryByDay
					setPPEnd={setPreviousPeriodEnd}
					setPPStart={setPreviousPeriodStart}
					setReportStage={setReportingStage}
					startingStage={reportingStage}
					mId={selectedMerchant}
					mNetwork={selectedNetwork}
					start={startDate}
					end={endDate}
				/>
			</StylizedModal>
		</div>
	);
};

export default OutageEstimate;
