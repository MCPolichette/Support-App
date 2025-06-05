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
	const [isFallback, setIsFallback] = useState(false);

	// Attempt to verify local image loads
	useEffect(() => {
		const img = new Image();
		img.onload = () => {
			setLogoSrc(getLocalMerchantLogo(id));
			setIsFallback(false);
		};
		img.onerror = () => {
			setLogoSrc(getRemoteMerchantLogo(id));
			setIsFallback(true);
		};
		img.src = getLocalMerchantLogo(id);
	}, [id]);

	return (
		<Row
			className="justify-content-md-center bg-light p-4"
			// style={{
			// 	height: "auto",
			// }}
		>
			<Col md="auto">
				<img
					src={logoSrc}
					alt="Merchant Logo"
					style={{ height: "68px" }}
				/>
				{isFallback && (
					<span
						style={{
							position: "absolute",
							top: 0,
							right: 0,
							backgroundColor: "red",
							color: "white",
							fontSize: "0.6rem",
							padding: "2px 4px",
							borderRadius: "3px",
						}}
					>
						remote
					</span>
				)}
			</Col>

			<Col md={6}>
				<h4>{text}</h4>
			</Col>
			<Col md={2}>
				<img
					src="/style/Avantlink_fullcolor.png"
					alt="Avantlink Banner"
					style={{ height: "65px" }}
				/>
			</Col>
		</Row>
	);
};
