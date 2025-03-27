import React from "react";
import { Modal, Button } from "react-bootstrap";

const ShopifyModal = ({ show, handleClose }) => {
	return (
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>Shopify Datafeed Detected</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>This appears to be a Shopify Datafeed.</p>
				{/* <img
					src="assets/shopify_september_2022.png"
					alt="Shopify Example"
					className="img-fluid"
				/>
				<img
					src="assets/second_feed.png"
					alt="Second Example"
					className="img-fluid mt-2"
				/> */}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ShopifyModal;
