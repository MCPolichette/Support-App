import React, { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import DateRangePicker from "../components/DateRangePicker";
import StylizedModal from "../components/modals/_ModalStylized";
import SettingsModal from "../components/modals/SettingsModal";
import UpdateKey from "../components/modals/UpdateKey";
import { Form, Button, InputGroup, Row, Col, Alert } from "react-bootstrap";

import {
	getDefaultStartDate,
	getDefaultEndDate,
	getLastYearSameWeek,
} from "../utils/getTime";

//Initially being built as the REI Report.

const AffiliateWeekReport = () => {
	const [modalType, setModalType] = useState("noKey");
	const [uuid, setUuid] = useState(localStorage.getItem("avl_UUID") || ""); //UUID check
	//REPORT INFO
	const [merchantId, setMerchantId] = useState("10248"); //TODO change this to blank.
	const [startDate, setStartDate] = useState(getDefaultStartDate());
	const [endDate, setEndDate] = useState(getDefaultEndDate());
	const [compStartDate, setCompStartDate] = useState(
		getLastYearSameWeek(startDate, endDate).start
	);
	const [compEndDate, setCompEndDate] = useState(
		getLastYearSameWeek(startDate, endDate).end
	);
	//MODALS
	const [errorModal, setErrorModal] = useState("");
	const [loading, setLoading] = useState(false);
	const [activeHeader, setActiveHeader] = useState("step1");
	const openModal = (type, header = "") => {
		setModalType(type);
		setActiveHeader(header);
	};
	const closeModal = () => setModalType(null);
	//REPORTS
	const handleRunReport = async () => {
		const today = new Date().toISOString().split("T")[0];
		if (endDate === today) {
			setErrorModal("End date cannot be today. Today isn't done yet.");
			return;
		}
	};
	return (
		<div className="container container-fluid d-flex flex-column min-vh-100 justify-content-center align-items-center">
			{/* BELOW is the template for the REQUIRED API KEY PAGES.  Continue to paste it at the top of the containers, for visibility. */}
			<Row>
				<h1 className="text-2xl font-bold mb-4">
					AffiliateWeekReport Custom Report
				</h1>
				<Col md={12}>
					<Form className="w-100 mt-4">
						<Row className="mb-3">
							<Col md={4}>
								<Form.Group controlId="merchantId">
									<Form.Label>Merchant ID</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter Merchant ID"
										value={merchantId || "10248"}
										onChange={(e) =>
											setMerchantId(e.target.value)
										}
									/>
								</Form.Group>
							</Col>

							<Col md={4}>
								<Form.Group controlId="startDate">
									<Form.Label>Primary Week</Form.Label>
									<DateRangePicker
										startDate={startDate}
										endDate={endDate}
										onStartChange={setStartDate}
										onEndChange={setEndDate}
									/>
								</Form.Group>
							</Col>

							<Col md={4}>
								<Form.Group controlId="comparisonDate">
									<Form.Label>
										Comparison Week (Last Year)
									</Form.Label>
									<DateRangePicker
										startDate={compStartDate}
										endDate={compEndDate}
										onStartChange={setCompStartDate}
										onEndChange={setCompEndDate}
									/>
								</Form.Group>
							</Col>
						</Row>

						<Button
							variant="primary"
							onClick={handleRunReport}
							disabled={loading}
						>
							{loading ? "Running..." : "Run Report"}
						</Button>
					</Form>
				</Col>
			</Row>

			<StylizedModal
				show={!!modalType}
				onHide={closeModal}
				title={activeHeader}
			>
				{modalType === "noKey" && <SettingsModal />}
				{/* {modalType === "step1" && (
					<DateRangePicker
						startDate={startDate}
						endDate={endDate}
						onStartChange={setStartDate}
						onEndChange={setEndDate}
					/>
				)} */}
				{errorModal && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white p-6 rounded shadow">
							<p className="text-red-600 mb-4">{errorModal}</p>
							<button
								onClick={() => setErrorModal("")}
								className="bg-red-600 text-white px-4 py-2 rounded"
							>
								Close
							</button>
						</div>
					</div>
				)}
			</StylizedModal>
		</div>
	);
};

export default AffiliateWeekReport;
