import React from "react";
import { Form, InputGroup, Row, Col, Image } from "react-bootstrap";
const getMerchantLogo = (id) =>
	id === "23437"
		? `https://static.avantlink.com/merchant-logos/23437`
		: `https://static.avantlink.com/merchant-logos/${id}.png`;

const MerchantAndNetworkInupt = ({
	title,
	selectedMerchant,
	selectedNetwork,
	setSelectedMerchant,
	setSelectedNetwork,
}) => {
	return (
		<Row className="align-items-end mb-3">
			<h4>{title}</h4>
			<Col md={5}>
				<InputGroup className="mb-2">
					<Form.Label>
						<h5>
							<strong className="m-2">Merchant:</strong>
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
						onChange={(e) => setSelectedMerchant(e.target.value)}
					/>
				</InputGroup>
			</Col>
			<Col md={7}>
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
	);
};
export default MerchantAndNetworkInupt;
