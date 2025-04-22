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
import StylizedModal from "../components/modals/_ModalStylized";
import SettingsModal from "../components/modals/SettingsModal";
import AffiliateWeekForm from "../components/forms/AffiliateWeekForm";

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

			<AffiliateWeekForm
				startDate={startDate}
				endDate={endDate}
				compStartDate={compStartDate}
				compEndDate={compEndDate}
				setStartDate={setStartDate}
				setEndDate={setEndDate}
				setCompStartDate={setCompStartDate}
				setCompEndDate={setCompEndDate}
				merchantId={merchantId}
				setMerchantId={setMerchantId}
				handleRunReport={handleRunReport}
				loading={loading}
				openSettings={openSettings}
				commonMerchants={commonMerchants}
			/>

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
