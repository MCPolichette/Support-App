// components/LinkCard.js
import React from "react";
import { Link } from "react-router-dom";

const LinkCard = ({ title, text, route }) => (
	<div className="col-4 mb-4">
		<div className="card h-100 position-relative shadow bg-light-subtle">
			<div className="card-body pb-5">
				{" "}
				{/* Padding bottom for spacing above button */}
				<h5 className="card-title">{title}</h5>
				<p className="card-text">{text}</p>
				<Link
					to={route}
					className="btn btn-primary position-absolute"
					style={{ bottom: "1rem", left: "1rem" }}
				>
					{title}
				</Link>
			</div>
		</div>
	</div>
);

export default LinkCard;
