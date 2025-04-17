import React, { useState, useEffect } from "react";
import {
	Form,
	Button,
	InputGroup,
	Row,
	Col,
	Alert,
	Image,
	Badge,
} from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner";
import DateRangePicker from "../components/DateRangePicker";
import StylizedModal from "../components/modals/_ModalStylized";
import SettingsModal from "../components/modals/SettingsModal";

import {
	getDefaultStartDate,
	getDefaultEndDate,
	getLastYearSameWeek,
} from "../utils/getTime";

const getSettings = () => {
	try {
		const raw = localStorage.getItem("ChettiToolsSettings");
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
};

const getMerchantLogo = (id) => {
	return id === "23437"
		? `https://static.avantlink.com/merchant-logos/23437`
		: `https://static.avantlink.com/merchant-logos/${id}.png`;
};

const AffiliateWeekReport = () => {
	const settings = getSettings();
	const [modalType, setModalType] = useState(settings.key ? null : "noKey");

	const [merchantId, setMerchantId] = useState(
		settings.primaryMerchant || ""
	);
	const [uuid] = useState(settings.key || "");

	const [startDate, setStartDate] = useState(getDefaultStartDate());
	const [endDate, setEndDate] = useState(getDefaultEndDate());
	const [compStartDate, setCompStartDate] = useState(
		getLastYearSameWeek(startDate, endDate).start
	);
	const [compEndDate, setCompEndDate] = useState(
		getLastYearSameWeek(startDate, endDate).end
	);

	const [errorModal, setErrorModal] = useState("");
	const [loading, setLoading] = useState(false);

	const handleRunReport = async () => {
		const today = new Date().toISOString().split("T")[0];
		if (endDate === today) {
			setErrorModal("End date cannot be today. Today isn't done yet.");
			return;
		}
	};

	const openSettings = () => setModalType("noKey");

	const commonMerchants = settings.commonMerchants || [];

	return (
		<div className="container mt-5">
			<Row className="mb-4">
				<Col>
					<h1 className="mb-2">AffiliateWeekReport</h1>
					<p className="text-muted">
						Custom weekly affiliate performance report
					</p>
				</Col>
			</Row>

			<Form className="shadow-sm p-4 bg-white border rounded mb-4">
				<h5 className="mb-3">Step 1: Merchant & Date Selection</h5>

				<Row className="align-items-end mb-3">
					<Col md={6}>
						<Form.Label>Merchant</Form.Label>
						<InputGroup>
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
							{commonMerchants.map((id) => (
								<Button
									key={id}
									variant={
										id === merchantId
											? "primary"
											: "outline-secondary"
									}
									size="sm"
									className="me-2 mb-2"
									onClick={() => setMerchantId(id)}
								>
									<Image
										src={getMerchantLogo(id)}
										alt={`Merchant ${id}`}
										style={{ height: "24px" }}
										className="me-1"
									/>
									{id}
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

					<Col md={3}>
						<Form.Label>Primary Week</Form.Label>
						<DateRangePicker
							startDate={startDate}
							endDate={endDate}
							onStartChange={setStartDate}
							onEndChange={setEndDate}
						/>
					</Col>

					<Col md={3}>
						<Form.Label>Comparison Week (Last Year)</Form.Label>
						<DateRangePicker
							startDate={compStartDate}
							endDate={compEndDate}
							onStartChange={setCompStartDate}
							onEndChange={setCompEndDate}
						/>
					</Col>
				</Row>

				<div className="d-flex justify-content-end">
					<Button
						variant="primary"
						onClick={handleRunReport}
						disabled={loading}
					>
						{loading ? "Running..." : "Run Report"}
					</Button>
				</div>
			</Form>

			{/* Placeholder for future steps */}
			<Form className="shadow-sm p-4 bg-light border rounded">
				<h5 className="mb-3">More Report Options (Coming Soon)</h5>
				<p className="text-muted mb-0">
					Filters, partner types, and detailed metrics will be added
					here.
				</p>
			</Form>

			<StylizedModal
				show={!!modalType}
				onHide={() => setModalType(null)}
				title="Settings"
			>
				{modalType === "noKey" && <SettingsModal />}
			</StylizedModal>

			{errorModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-4 rounded shadow">
						<p className="text-danger mb-3">{errorModal}</p>
						<Button
							variant="danger"
							onClick={() => setErrorModal("")}
						>
							Close
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default AffiliateWeekReport;
