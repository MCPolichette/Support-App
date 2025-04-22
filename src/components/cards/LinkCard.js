import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Badge } from "react-bootstrap";
import StylizedModal from "../modals/_ModalStylized";

const LinkCard = ({ title, text, route, modal, dev }) => {
	const [showModal, setShowModal] = useState(false);
	const [showDev, setShowDev] = useState(dev);
	const hasRoute = !!route;
	const hasModal = !!modal;

	const renderButton = () => {
		if (hasRoute && hasModal) {
			return (
				<div className="d-flex gap-2">
					<Link to={route} className="btn btn-outline-primary">
						Go to {title}
					</Link>
					<Button
						variant="primary"
						onClick={() => setShowModal(true)}
					>
						Open {title}
					</Button>
				</div>
			);
		} else if (hasRoute) {
			return (
				<Link to={route} className="btn btn-primary">
					Go to {title}
				</Link>
			);
		} else if (hasModal) {
			return (
				<Button variant="primary" onClick={() => setShowModal(true)}>
					Open {title}
				</Button>
			);
		}
		return null;
	};

	return (
		<div className="col-12 col-md-6 col-lg-4 mb-4">
			<div className="card h-100 position-relative  bg-light-subtle bg-light-subtle  transition-shadow my-card">
				<div className="card-body d-flex flex-column justify-content-between">
					<div>
						<h5 className="card-title">{title}</h5>
						{showDev && (
							<h5 className="mt-4 text-muted">
								<Badge bg="warning" text="dark">
									Not published yet.
								</Badge>
							</h5>
						)}
						<p className="card-text">{text}</p>
					</div>
					{(hasRoute || hasModal) && (
						<div className="mt-4">{renderButton()}</div>
					)}
				</div>
			</div>

			{hasModal && (
				<StylizedModal
					show={showModal}
					onHide={() => setShowModal(false)}
					title={title}
				>
					{modal}
				</StylizedModal>
			)}
		</div>
	);
};

export default LinkCard;
