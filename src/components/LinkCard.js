import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import StylizedModal from "./modals/_ModalStylized";

const LinkCard = ({ title, text, route, modal }) => {
	const [showModal, setShowModal] = useState(false);
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
			<div className="card h-100 position-relative shadow bg-light-subtle">
				<div className="card-body d-flex flex-column justify-content-between">
					<div>
						<h5 className="card-title">{title}</h5>
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
