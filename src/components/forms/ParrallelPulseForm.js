import React, { useState } from "react";
import { Form, Button, Row, Col, Stack, Image } from "react-bootstrap";
import {
	getDefaultStartDate,
	getDefaultEndDate,
	getLastYearSameWeek,
} from "../../utils/getTime";
import { getSettings } from "../../utils/API/_AdminApiModules";
import CompareDatesPicker from "./CompareDatesPicker";
import MerchantAndNetworkInupt from "./MerchantAndNetworkInput";
import { DefaultReportArray } from "../../logic/comparisonLogic/defaultReports";
import ReportSelection from "./ReportSelection";

const getMerchantLogo = (id) =>
	id === "23437"
		? `https://static.avantlink.com/merchant-logos/23437`
		: `https://static.avantlink.com/merchant-logos/${id}.png`;

const ParrallelPulseForm = ({ handleRunReport, loading, commonMerchants }) => {
	const settings = getSettings();
	commonMerchants = settings.commonMerchants || [];

	const [startDate, setStartDate] = useState(
		getDefaultStartDate("last7days")
	);
	const [endDate, setEndDate] = useState(getDefaultEndDate());
	const [previousPeriodStart, setPreviousPeriodStart] = useState(
		getLastYearSameWeek(startDate, endDate).start
	);
	const [previousPeriodEnd, setPreviousPeriodEnd] = useState(
		getLastYearSameWeek(startDate, endDate).end
	);

	const [selectedMerchant, setSelectedMerchant] = useState(
		settings.commonMerchants[0].id || null
	);
	const [selectedNetwork, setSelectedNetwork] = useState(
		settings.commonMerchants[0].network || null
	);

	const updateSettingsRunReport = () => {
		handleRunReport(
			{
				startDate: startDate,
				endDate: endDate,
				previousPeriodStart: previousPeriodStart,
				previousPeriodEnd: previousPeriodEnd,
			},
			selectedMerchant,
			selectedNetwork
		);
	};

	return (
		<Form className="shadow-sm p-4 bg-white border rounded ">
			<MerchantAndNetworkInupt
				selectedMerchant={selectedMerchant}
				selectedNetwork={selectedNetwork}
				setSelectedMerchant={setSelectedMerchant}
				setSelectedNetwork={setSelectedNetwork}
			/>
			<Row>
				<Col md={5}>
					<Form.Text className="text-muted">
						Select from below or manually enter an ID
					</Form.Text>

					<div className="d-flex flex-wrap ">
						{commonMerchants.map((m) => (
							<Button
								key={m.id}
								variant={
									m.id === selectedMerchant
										? "primary"
										: "outline-secondary"
								}
								size="sm"
								className="me-2 mb-2"
								onClick={() => {
									setSelectedMerchant(m.id);
									setSelectedNetwork(m.network);
								}}
							>
								<Image
									src={getMerchantLogo(m.id)}
									alt={`Merchant ${m.id}`}
									style={{ height: "24px" }}
									className="me-1"
								/>
								{m.id} ({m.network})
							</Button>
						))}
						<p>Add/Remove Listed Merchants in Tools - Settings</p>
					</div>
				</Col>
				<Col md={7}>
					<CompareDatesPicker
						startDate={startDate}
						setStartDate={setStartDate}
						endDate={endDate}
						setEndDate={setEndDate}
						previousPeriodStart={previousPeriodStart}
						setPreviousPeriodStart={setPreviousPeriodStart}
						previousPeriodEnd={previousPeriodEnd}
						setPreviousPeriodEnd={setPreviousPeriodEnd}
					/>
				</Col>
			</Row>

			<Row>
				<hr />
				<ReportSelection reportsData={DefaultReportArray} />
			</Row>
			<hr />

			<div className="d-flex justify-content-end">
				<Stack>
					<Button
						variant="success"
						onClick={updateSettingsRunReport}
						disabled={loading}
					>
						{loading ? "Running..." : "Run Report"}
					</Button>
				</Stack>
			</div>
			<hr />
		</Form>
	);
};

export default ParrallelPulseForm;
