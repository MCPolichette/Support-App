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
	getDefaultStartDate,
	getDefaultEndDate,
	getLastYearSameWeek,
	getMonthRange,
	getPreviousYearMonthRange,
} from "../../utils/getTime";
import {
	_adminApiModules,
	getSettings,
} from "../../utils/API/_AdminApiModules";
import MonthYearSelector from "./MonthYearPicker";
import CompareDatesPicker from "./CompareDatesPicker";

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

	const [activeTab, setActiveTab] = useState("dates");

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
		<Form className="shadow-sm p-4 bg-white border rounded mb-4">
			<Row className="align-items-end mb-3">
				<h4>Comparison Reports</h4>
				<hr />
				<Col md={6}>
					<InputGroup className="mb-2">
						<Form.Label>
							<h5>
								<strong>Merchant:_ </strong>
							</h5>
						</Form.Label>
						{selectedMerchant && (
							<Image
								src={getMerchantLogo(selectedMerchant)}
								style={{
									maxHeight: "36px",
									background: "#fff",
									border: "1px solid #ccc",
									borderRadius: "4px",
								}}
								className="me-2"
							/>
						)}
						<Form.Control
							type="text"
							placeholder="Enter Merchant ID"
							value={selectedMerchant}
							onChange={(e) =>
								setSelectedMerchant(e.target.value)
							}
						/>
					</InputGroup>
				</Col>
				<Col md={6}>
					<div>
						<Form.Label>Network</Form.Label>
						<div>
							<Form.Check
								inline
								label="US"
								name="network"
								type="radio"
								id="network-us"
								checked={selectedNetwork === "US"}
								onChange={() => setSelectedNetwork("US")}
							/>
							<Form.Check
								inline
								label="CA"
								name="network"
								type="radio"
								id="network-ca"
								checked={selectedNetwork === "CA"}
								onChange={() => setSelectedNetwork("CA")}
							/>
							<Form.Check
								inline
								label="AU"
								name="network"
								type="radio"
								id="network-au"
								checked={selectedNetwork === "AU"}
								onChange={() => setSelectedNetwork("AU")}
							/>
						</div>
					</div>
				</Col>
			</Row>
			<Row>
				<hr />
				<Col md={5}>
					<Form.Text className="text-muted">
						Select from below or manually enter an ID
					</Form.Text>

					<div className="d-flex flex-wrap mt-2">
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

			<hr />
			{/* TODO  
			-Move these COMMENTED ROWS / settings into a MODAL, where the details can be edited..   
			-Have a standard report. and an option to SELECT a custom report.. (made in the modal, and mapped in the same way that the above merchant details are displayed.   (with a single modal that opens up and allows one to edit, and SAVE on click. e.g LOAD STATE > SAVE STATE 
			-But the overall document should rely on defaults.. I'm working way to fucking hard on making this part adjustable now, and I need/want a working product sooner.. THIS can be fined tuned once I HAVE REAL REPORTS GOING))
			 */}
			{/* <Row>
				<ReportSettings
					modules={formSelections}
					setModules={setFormSelections}
					merchantId={selectedMerchant.id}
				/>
			</Row> */}

			<div className="d-flex justify-content-end">
				<Stack>
					{/* <Button
						variant="info "
						onClick={saveMerchantSettings()}
						disabled
					>
						{loading ? (
							"Saving..."
						) : (
							<h6>
								Save All Settings to
								<Image
									src={getMerchantLogo(selectedMerchant)}
									style={{
										maxHeight: "36px",
										background: "#fff",
										border: "1px solid #ccc",
										borderRadius: "4px",
									}}
									className="me-2"
								/>
							</h6>
						)}
					</Button> */}
					<Button
						variant="success"
						onClick={updateSettingsRunReport}
						disabled={loading}
					>
						{loading ? "Running..." : "Run Report"}
					</Button>
				</Stack>
			</div>
		</Form>
	);
};

export default ParrallelPulseForm;
