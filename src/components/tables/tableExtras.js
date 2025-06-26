import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";

// fallback to remote if local logo fails
const getRemoteMerchantLogo = (id) =>
	id === "23437"
		? `https://static.avantlink.com/merchant-logos/23437`
		: `https://static.avantlink.com/merchant-logos/${id}.png`;

const getLocalMerchantLogo = (id) => `/style/merchant_logos/${id}.png`;

export const TableTopper = ({ id, text }) => {
	const [logoSrc, setLogoSrc] = useState(getLocalMerchantLogo(id));

	function formatTextToHeadings(textArray) {
		if (!Array.isArray(textArray) || textArray.length === 0) return "";

		return (
			<Col md={6} className="d-flex flex-column align-items-center">
				<h4 className="mb-1">{textArray[0]}</h4>
				{textArray.slice(1).map((line, index) => (
					<h5 key={index} className="mb-0">
						{line}
					</h5>
				))}
			</Col>
		);
	}
	const title = formatTextToHeadings(text);
	// Attempt to verify local image loads
	useEffect(() => {
		const img = new Image();
		img.onload = () => {
			setLogoSrc(getLocalMerchantLogo(id));
		};
		img.onerror = () => {
			setLogoSrc(getRemoteMerchantLogo(id));
		};
		img.src = getLocalMerchantLogo(id);
	}, [id]);

	return (
		<Row className="justify-content-md-center  bg-light p-4 align-items-center">
			<Col
				md={3}
				className="d-flex justify-content-center"
				style={{ height: "70px" }}
			>
				<img
					src={logoSrc}
					alt="Merchant Logo"
					style={{ height: "auto" }}
				/>
			</Col>

			{title}

			<Col md={3} className="d-flex justify-content-center">
				<img
					src="/style/Avantlink_fullcolor.png"
					alt="Avantlink Banner"
					style={{ height: "65px" }}
				/>
			</Col>
		</Row>
	);
};
