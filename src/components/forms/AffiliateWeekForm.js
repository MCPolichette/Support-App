import React, { useState } from "react";
import {
	Form,
	Button,
	InputGroup,
	Row,
	Col,
	Stack,
	Image,
} from "react-bootstrap";
import DateRangePicker from "./DateRangePicker";
import ReportSettings from "./ReportSettingsPanel";
import {
	getDefaultStartDate,
	getDefaultEndDate,
	getLastYearSameWeek,
} from "../../utils/getTime";
import {
	_adminApiModules,
	getSettings,
} from "../../utils/API/_AdminApiModules";

const getMerchantLogo = (id) =>
	id === "23437"
		? `https://static.avantlink.com/merchant-logos/23437`
		: `https://static.avantlink.com/merchant-logos/${id}.png`;

const AffiliateWeekForm = ({
	setDates,
	merchantId,
	setMerchantId,
	setNetwork,
	handleRunReport,
	loading,
	openSettings,
	commonMerchants,
	setModules,
}) => {
	const settings = getSettings();
	commonMerchants = settings.commonMerchants || [];
	console.log(settings);

	function determineMerchantSettings(data) {
		if (data) {
			const index = commonMerchants.findIndex((m) => m.id === data);
			return settings.commonMerchants[index];
		} else if (settings.commonMerchants) {
			return settings.commonMerchants[0];
		} else {
			return { id: null, network: "US", reportMap: _adminApiModules };
		}
	}
	const [startDate, setStartDate] = useState(getDefaultStartDate());
	const [endDate, setEndDate] = useState(getDefaultEndDate());
	const [previousPeriodStart, setPreviousPeriodStart] = useState(
		getLastYearSameWeek(startDate, endDate).start
	);
	const [previousPeriodEnd, setPreviousPeriodEnd] = useState(
		getLastYearSameWeek(startDate, endDate).end
	);
	const [formSelections, setFormSelections] = useState(
		determineMerchantSettings(
			(settings.primaryMerchant.id || null).reportMap
		)
	);
	const [selectedMerchant, setSelectedMerchant] = useState(
		determineMerchantSettings(settings.primaryMerchant.id || null)
	);
	let network = determineMerchantSettings(
		(settings.primaryMerchant.id || null).network
	);

	const saveMerchantSettings = () => {
		console.log("THIS ISNT WORKING YET");
	};

	const updateSettingsRunReport = () => {
		setMerchantId(selectedMerchant.id);
		setNetwork(network);
		setModules(formSelections);
		setDates({
			startDate: startDate,
			endDate: endDate,
			previousPeriodStart: previousPeriodStart,
			previousPeriodEnd: previousPeriodEnd,
		});
		handleRunReport();

		// TODO: I should just use the handleRunReport, and pass in these variables... and not have to set the state on the page.
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
						{selectedMerchant.id && (
							<Image
								src={getMerchantLogo(selectedMerchant.id)}
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
							value={selectedMerchant.id}
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
								checked={selectedMerchant.network === "US"}
								onChange={() => (network = "US")}
							/>
							<Form.Check
								inline
								label="CA"
								name="network"
								type="radio"
								id="network-ca"
								checked={selectedMerchant.network === "CA"}
								onChange={() => (network = "CA")}
							/>
							<Form.Check
								inline
								label="AU"
								name="network"
								type="radio"
								id="network-au"
								checked={selectedMerchant.network === "AU"}
								onChange={() => (network = "AU")}
							/>
						</div>
					</div>
				</Col>
			</Row>
			<Row>
				<hr />
				<Col md={6}>
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
				<Col md={6}>
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
							/>
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
						</Col>
					</Row>
				</Col>
			</Row>

			<hr />
			<Row>
				<ReportSettings
					modules={selectedMerchant.reportMap}
					setModules={setFormSelections}
					merchantId={selectedMerchant.id}
				/>
			</Row>

			<div className="d-flex justify-content-end">
				<Stack>
					<Button
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
								/>{" "}
							</h6>
						)}
					</Button>
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

export default AffiliateWeekForm;
