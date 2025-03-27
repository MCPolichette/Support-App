import React from "react";

const InfoList = ({ title, data }) => {
	console.log(data);
	return (
		<div className="col-lg-6 col-md-6 col-sm-12">
			<div className="alert alert-info shadow">
				<h5 className="mb-3">{title}</h5>
				<ul className="mt-3">
					{data.map((item, index) => (
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

export default InfoList;
