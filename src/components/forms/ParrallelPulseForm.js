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
import {
	getDefaultStartDate,
	getDefaultEndDate,
	getLastYearSameWeek,
} from "../../utils/getTime";
import {
	_adminApiModules,
	getSettings,
} from "../../utils/API/_AdminApiModules";
import CompareDatesPicker from "./CompareDatesPicker";
import MerchantAndNetworkInupt from "./MerchantAndNetworkInput";
import { DefaultReportArray } from "../../logic/comparisonLogic/defaultReports";
import ReportSelection from "./ReportSelection";

const getMerchantLogo = (id) =>
	id === "23437"
		? `https://static.avantlink.com/merchant-logos/23437`
		: `https://static.avantlink.com/merchant-logos/${id}.png`;

const ParrallelPulseForm = ({
	handleRunReport,
	loading,
	openSettings,
	commonMerchants,
}) => {
	const settings = getSettings();
	commonMerchants = settings.commonMerchants || [];
	function determineMerchantSettings(data) {
		if (data) {
			console.log(data, commonMerchants[0]);
			const index = commonMerchants.findIndex((m) => m.id === data);
			console.log(index);

			return settings.commonMerchants[index];
		} else if (settings.commonMerchants) {
			return settings.commonMerchants[0];
		} else {
			return { id: null, network: "US", reportMap: _adminApiModules };
		}
	}
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
	const [disabledButton, setDisabledButton] = useState("disabled");
	const [formSelections, setFormSelections] = useState(
		settings.commonMerchants[0].reportmap || _adminApiModules
	);
	const [selectedMerchant, setSelectedMerchant] = useState(
		settings.commonMerchants[0].id || null
	);
	const [selectedNetwork, setSelectedNetwork] = useState(
		settings.commonMerchants[0].network || null
	);
	const saveMerchantSettings = () => {
		console.log("THIS ISNT WORKING YET");
	};
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
						<Button
							variant="link"
							size="sm"
							className="text-decoration-none"
							onClick={openSettings}
						>
							Update Merchants in Settings →
						</Button>
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
