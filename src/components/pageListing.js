import React from "react";
import { Link } from "react-router-dom";

const PageListing = ({ title, link, description, buttonParams }) => {
	return (
		<div className="card-body">
			<h5 className="card-title">{title}</h5>
			<p className="card-text">{description}</p>
			<Link to={link} className="btn btn-primary">
				{title}
			</Link>
		</div>
	);
};
export default PageListing;
