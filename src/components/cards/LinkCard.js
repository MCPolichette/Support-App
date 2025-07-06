import React, { useState } from "react";
import { Form, Card, Button, Badge } from "react-bootstrap";
import StylizedModal from "../modals/_ModalStylized";
import { Link } from "react-router-dom";

const LinkCard = ({
	title,
	text = "",
	route,
	modal,
	dev,

	cardInput,
	list = [],
}) => {
	const [showModal, setShowModal] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const hasRoute = !!route;
	const hasModal = !!modal;
	const isCardInput = !!cardInput;

	// Cache delay and direction using useState so they don’t change on rerenders
	const [delay] = useState(() => Math.random() * 0.5);
	const [direction] = useState(() =>
		Math.random() > 0.5 ? "dropInFromTop" : "dropInFromBottom"
	);

	const handleChange = (e) => {
		setInputValue(e.target.value);
	};

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
		} else if (isCardInput) {
			return (
				<div>
					<p>
						<strong>Enter Affiliate ID:</strong>
					</p>
					<Form.Control
						type="text"
						placeholder="Enter Affiliate ID"
						value={inputValue}
						onChange={handleChange}
					/>
					<Button
						className="mt-2"
						onClick={() =>
							window.open(cardInput + inputValue, "_blank")
						}
					>
						Open Popup
					</Button>
				</div>
			);
		}

		return null;
	};

	return (
		<div className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
			<Card
				className="card-drop-in bg-light-subtle transition-shadow my-card h-100 position-relative"
				style={{
					animationDelay: `${delay}s`,
					animationName: direction,
				}}
			>
				<div className="card-body  d-flex flex-column justify-content-between">
					<div>
						<h5 className="card-title">{title}</h5>
						{dev && (
							<h6 className="mt-1 text-muted">
								<Badge bg="warning" text="dark">
									Not published yet.
								</Badge>
							</h6>
						)}
						<p className="">{text}</p>
						<ul>
							{list.map((item) => (
								<li className="">◾{item}</li>
							))}
						</ul>
					</div>
					{(hasRoute || hasModal || isCardInput) && (
						<div className="mt-1">{renderButton()}</div>
					)}
				</div>
			</Card>

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
