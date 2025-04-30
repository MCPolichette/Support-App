import React, { useState } from "react";
import { Form, Button, InputGroup, Row, Col, Image } from "react-bootstrap";
import DateRangePicker from "./DateRangePicker";
import ReportSettings from "./ReportSettingsPanel";

const getMerchantLogo = (id) =>
	id === "23437"
		? `https://static.avantlink.com/merchant-logos/23437`
		: `https://static.avantlink.com/merchant-logos/${id}.png`;

const AffiliateWeekForm = ({
	currentStartDate,
	currentEndDate,
	previousPeriodStart,
	previousPeriodEnd,
	setCurrentStartDate,
	setCurrentEndDate,
	setPreviousPeriodStart,
	setPreviousPeriodEnd,
	merchantId,
	setMerchantId,
	network,
	setNetwork,
	handleRunReport,
	loading,
	openSettings,
	commonMerchants,
	modules,
	setModules,
}) => {
	const [formSelections, setFormSelections] = useState(modules);

	const updateSettingsRunReport = () => {
		handleRunReport();
		setModules(formSelections);
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
						{merchantId && (
							<Image
								src={getMerchantLogo(merchantId)}
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
							value={merchantId}
							onChange={(e) => setMerchantId(e.target.value)}
						/>
					</InputGroup>
					<Form.Text className="text-muted">
						Select from below or manually enter an ID
					</Form.Text>

					<div className="d-flex flex-wrap mt-2">
						{commonMerchants.map((m) => (
							<Button
								key={m.id}
								variant={
									m.id === merchantId
										? "primary"
										: "outline-secondary"
								}
								size="sm"
								className="me-2 mb-2"
								onClick={() => {
									setMerchantId(m.id);
									setNetwork(m.network);
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
					<div>
						<Form.Label>Network</Form.Label>
						<div>
							<Form.Check
								inline
								label="US"
								name="network"
								type="radio"
								id="network-us"
								checked={network === "US"}
								onChange={() => setNetwork("US")}
							/>
							<Form.Check
								inline
								label="CA"
								name="network"
								type="radio"
								id="network-ca"
								checked={network === "CA"}
								onChange={() => setNetwork("CA")}
							/>
							<Form.Check
								inline
								label="AU"
								name="network"
								type="radio"
								id="network-au"
								checked={network === "AU"}
								onChange={() => setNetwork("AU")}
							/>
						</div>
					</div>
					<Row>
						<hr />
						<Col md={6} className="pe-3 border-end">
							<h5>
								<strong>Primary Week </strong>
							</h5>
							<DateRangePicker
								startDate={currentStartDate}
								endDate={currentEndDate}
								onStartChange={setCurrentStartDate}
								onEndChange={setCurrentEndDate}
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
					modules={formSelections}
					setModules={setFormSelections}
					merchantId={merchantId}
				/>
			</Row>

			<div className="d-flex justify-content-end">
				<Button
					variant="primary"
					onClick={updateSettingsRunReport}
					disabled={loading}
				>
					{loading ? "Running..." : "Run Report"}
				</Button>
			</div>
		</Form>
	);
};

export default AffiliateWeekForm;
