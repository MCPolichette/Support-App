import React from "react";

const MapDisplay = ({
	mapping = [],
	warnings = [],
	unmatched = [],
	allHeaders = [],
}) => {
	// Create a unified map of column data
	const mappedByHeader = mapping.reduce((acc, item) => {
		acc[item.header] = item;
		return acc;
	}, {});

	return (
		<div id="tableDisplay">
			{warnings.length > 0 && (
				<div className="alert alert-warning">
					<h6>Missing Required Fields</h6>
					<ul className="mb-0">
						{warnings.map((warn, index) => (
							<li key={index}>
								<b>{warn.valueTitle}</b> ({warn.fieldName}) –{" "}
								{warn.message}
							</li>
						))}
					</ul>
				</div>
			)}
			<div className="table-responsive shadow p-3 mb-4 bg-body rounded">
				<h5 className="mb-3">Field Mapping Preview</h5>
				<table className="table table-sm table-bordered border-primary">
					<thead className="table-light">
						<tr>
							<th>Col #</th>
							<th>Source Header</th>
							<th>Matched Field</th>
							<th>Confidence</th>
							<th>Required</th>
						</tr>
					</thead>
					<tbody>
						{allHeaders.length > 0 ? (
							allHeaders.map((header, index) => {
								const match = mappedByHeader[header];
								return (
									<tr key={index}>
										<td>{index + 1}</td>
										<td>{header}</td>
										<td>{match?.fieldName || "—"}</td>
										<td>
											{match ? (
												<span>
													{match.valueTitle}{" "}
													<span className="text-muted">
														({match.score})
													</span>
												</span>
											) : (
												<span className="text-muted">
													No match
												</span>
											)}
										</td>
										<td>
											{match?.required ? "Yes" : "No"}
										</td>
									</tr>
								);
							})
						) : (
							<tr>
								<td colSpan="5" className="text-center">
									No headers found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* {unmatched.length > 0 && (
				<div className="alert alert-secondary">
					<h6>Unmatched Headers</h6>
					<ul className="mb-0">
						{unmatched.map((un, idx) => (
							<li key={idx}>
								<b>{un.header}</b> –{" "}
								{un.reason || "No alias match"}
							</li>
						))}
					</ul>
				</div>
			)} */}
		</div>
	);
};

export default MapDisplay;
