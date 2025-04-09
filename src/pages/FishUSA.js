import React, { useState } from "react";
import { runFishUSAReport } from "../logic/fishUSAreport";
import LoadingSpinner from "../components/LoadingSpinner";
import DateRangePicker from "../components/DateRangePicker";

const FishUSA = () => {
	const getDefaultStartDate = () => {
		//
		// const date = new Date();
		// date.setDate(date.getDate() - 7);
		// console.log(date.toISOString().split("T")[0]);
		// return date.toISOString().split("T")[0];
		return "2025-01-01";
	};

	const getDefaultEndDate = () => {
		const date = new Date();
		date.setDate(date.getDate() - 1);
		return date.toISOString().split("T")[0];
	};

	const [uuid, setUuid] = useState(localStorage.getItem("avl_UUID") || "");
	const [showModal, setShowModal] = useState(!uuid);
	const [startDate, setStartDate] = useState(getDefaultStartDate());
	const [endDate, setEndDate] = useState(getDefaultEndDate());
	const [errorModal, setErrorModal] = useState("");
	const [loading, setLoading] = useState(false);

	const handleRunReport = async () => {
		const today = new Date().toISOString().split("T")[0];
		if (endDate === today) {
			setErrorModal("End date cannot be today. Today isn't done yet.");
			return;
		}

		setLoading(true);
		await runFishUSAReport({ uuid, startDate, endDate });
		setLoading(false);
	};

	const handleSaveUUID = () => {
		if (uuid) {
			localStorage.setItem("avl_UUID", uuid);
			setShowModal(false);
		}
	};

	return (
		<div className="container container-fluid d-flex flex-column min-vh-100 justify-content-center align-items-center">
			<h1 className="text-2xl font-bold mb-4">FishUSA Custom Report</h1>
			<div className="alert alert-danger mt-4" role="alert">
				<h5 className="alert-heading">⚠️ Important Report Notice</h5>
				<p className="mb-2">
					This report has been updated with backlogged data going back
					to <strong>2023</strong>.
				</p>
				<p className="mb-0">
					<strong>
						Please leave the START date set to January 1st, 2025
					</strong>{" "}
					to ensure an accurate report. You may select any END DATE up
					to <strong>yesterday</strong>.
				</p>
			</div>

			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded shadow">
						<h2 className="text-lg font-semibold mb-2">
							Enter AVL UUID
						</h2>
						<input
							type="text"
							value={uuid}
							onChange={(e) => setUuid(e.target.value)}
							className="border p-2 w-full mb-4"
						/>
						<button
							onClick={handleSaveUUID}
							className="bg-blue-600 text-white px-4 py-2 rounded"
						>
							Save
						</button>
					</div>
				</div>
			)}

			{!showModal && (
				<div className="w-full max-w-md">
					<DateRangePicker
						startDate={startDate}
						endDate={endDate}
						onStartChange={setStartDate}
						onEndChange={setEndDate}
					/>

					{loading ? (
						<LoadingSpinner message="Running FishUSA report..." />
					) : (
						<button
							onClick={handleRunReport}
							className="btn btn-primary"
						>
							Run Report
						</button>
					)}
				</div>
			)}

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
		</div>
	);
};

export default FishUSA;

//
//
//
//
//
//
// Adjusted Affiliate Earnings =
// Adjusted Network Earnings

//
//
// Adjusted Sales

//
//
//
// IN THE WEBSITE API Number_of_Adjustments, Conversion_Rate,
//
//
//
//
//
//
//
//
