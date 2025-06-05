import React, { useState } from "react";
import {
	Form,
	Button,
	InputGroup,
	Row,
	Col,
	Stack,
	Image,
	Badge,
	Tabs,
	Tab,
} from "react-bootstrap";
import DateRangePicker from "./DateRangePicker";
import ReportSettings from "./ReportSettingsPanel";
import {
	getLastYearSameWeek,
	getPreviousYearMonthRange,
	getMonthRange,
	getDefaultStartDate,
	extractMonthYear,
} from "../../utils/getTime";
import {
	_adminApiModules,
	getSettings,
} from "../../utils/API/_AdminApiModules";
import MonthYearSelector from "./MonthYearPicker";

const CompareDatesPicker = ({
	startDate,
	setStartDate,
	endDate,
	setEndDate,
	previousPeriodStart,
	setPreviousPeriodStart,
	previousPeriodEnd,
	setPreviousPeriodEnd,
}) => {
	const oneYearPrior = (x) => {
		return {
			month: x.month,
			year: x.year - 1,
		};
	};
	const [disabledButton, setDisabledButton] = useState("disabled");
	const [monthlyDateCs, setMonthlyDateCs] = useState(
		extractMonthYear(startDate)
	);
	const [monthlyDatePs, setMonthlyDatePs] = useState(
		oneYearPrior(monthlyDateCs)
	);
	console.log(monthlyDatePs);
	const [activeTab, setActiveTab] = useState("dates");
	const setDates = (cOrP, date) => {
		if (cOrP === "current") {
			setStartDate(getMonthRange(date).firstDay);
			setEndDate(getMonthRange(date).endDay);
		} else if (cOrP === "prior") {
			setPreviousPeriodStart(getMonthRange(date).firstDay);
			setPreviousPeriodEnd(getMonthRange(date).endDay);
			console.log(getMonthRange(date).firstDay);
		}
		console.log(date, previousPeriodEnd, previousPeriodStart);
	};

	const autoChangePreviousMonthYear = (date) => {
		console.log(date);
		setMonthlyDateCs(date);
		setMonthlyDatePs(oneYearPrior(date));
		setDates("current", date);
		setDates("prior", oneYearPrior(date));
	};
	const updatePreviousMonth = (date) => {
		setMonthlyDatePs(date);
		setDates("prior", date);
	};
	return (
		<Row className="border border border-primary">
			<Tabs
				fill
				activeKey={activeTab}
				onSelect={(k) => setActiveTab(k)}
				className="mb-3 text-bg-secondary"
			>
				<Tab eventKey="dates" title="Compare Selected Dates">
					<Row>
						<Col md={6} className="pe-3 border-end">
							<h5>
								<strong>Primary Week </strong>
							</h5>
							<DateRangePicker
								startDate={startDate}
								endDate={endDate}
								onStartChange={setStartDate}
								onEndChange={setEndDate}
								otherFunction={() => setDisabledButton(false)}
							/>
							<Button
								variant="info"
								size="sm"
								className={"mt-1 "}
								hidden={disabledButton}
								onClick={() => {
									const newDates = getLastYearSameWeek(
										startDate,
										endDate
									);
									setPreviousPeriodStart(newDates.start);
									setPreviousPeriodEnd(newDates.end);
									setDisabledButton(true);
								}}
							>
								Set Comparison Dates to match YoY
							</Button>
						</Col>

						<Col md={6}>
							<h5>
								<strong>Comparison Week </strong>
							</h5>
							<DateRangePicker
								startDate={previousPeriodStart}
								endDate={previousPeriodEnd}
								onStartChange={setPreviousPeriodStart}
								onEndChange={setPreviousPeriodEnd}
							/>
							{disabledButton === false && (
								<Badge pill bg="warning" text="dark">
									Dates may not Match YOY
								</Badge>
							)}
						</Col>
					</Row>
					<br />
				</Tab>
				<Tab
					eventKey="months"
					title="Compare Month over Month"
					className="text-dark"
				>
					<Row>
						<Col lg={6} className="pe-3 border-end">
							<h5>
								<strong>Primary Month</strong>
							</h5>
							<MonthYearSelector
								date={monthlyDateCs}
								onChange={(m) => {
									autoChangePreviousMonthYear(m);
								}}
							/>
						</Col>

						<Col lg={6}>
							<h5>
								<strong>Comparison Month</strong>
							</h5>
							<MonthYearSelector
								date={monthlyDatePs}
								onChange={(m) => {
									updatePreviousMonth(m);
								}}
							/>
						</Col>
					</Row>
				</Tab>
			</Tabs>
		</Row>
	);
};
export default CompareDatesPicker;
