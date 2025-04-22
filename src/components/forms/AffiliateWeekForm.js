// AffiliateWeekForm.js
import React, { useState } from "react";
import { Form, Button, InputGroup, Row, Col, Image } from "react-bootstrap";
import DateRangePicker from "../DateRangePicker";

const getMerchantLogo = (id) =>
	id === "23437"
		? `https://static.avantlink.com/merchant-logos/23437`
		: `https://static.avantlink.com/merchant-logos/${id}.png`;

const AffiliateWeekForm = ({
	startDate,
	endDate,
	compStartDate,
	compEndDate,
	setStartDate,
	setEndDate,
	setCompStartDate,
	setCompEndDate,
	merchantId,
	setMerchantId,
	handleRunReport,
	loading,
	openSettings,
	commonMerchants,
}) => {
	return (
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
	);
};

export default AffiliateWeekForm;
