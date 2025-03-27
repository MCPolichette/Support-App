import React from "react";

const InfoDisplay = ({ title, items = [] }) => {
	return (
		<div className="col-lg-6 col-md-6 col-sm-12">
			<div className="alert alert-info shadow">
				<h5 className="mb-3">{title}</h5>
				<ul className="mt-3">
					{items.map((item, index) => (
						<li key={index}>
							{" "}
							<strong>{item.label}:</strong> {item.value}{" "}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default InfoDisplay;
