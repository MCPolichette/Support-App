import React, { useState } from "react";
import {
	Form,
	Button,
	InputGroup,
	FormControl,
	Alert,
	Container,
} from "react-bootstrap";
const AffPopup = () => {
	const [affiliateID, setAffiliateId] = useState("");
	const [src, setSrc] = useState("");

	function openPopup() {
		setSrc(
			"https://classic.avantlink.com/admin/affiliate_application_detail.php?lngApplicationId=" +
				affiliateID
		);
	}
	//1469885
	return (
		<Container className="mt-4">
			<InputGroup className="mb-2">
				<Form.Label>
					<h5>
						<strong>Affiliate ID: {"   "} </strong>
					</h5>
				</Form.Label>

				<Form.Control
					type="text"
					placeholder="Enter Affiliate ID"
					value={affiliateID}
					onChange={(e) => setAffiliateId(e.target.value)}
				/>
			</InputGroup>
			<Button onClick={openPopup}>TEST</Button>

			{src != "" && (
				<iframe
					src={src}
					style={{ width: "100%", height: "500px", border: "none" }}
					title="Embedded Content"
				/>
			)}
		</Container>
	);
};

export default AffPopup;
