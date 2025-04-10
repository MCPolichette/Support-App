import React from "react";
import fieldAliases from "../../logic/fieldAliases.json";

const getVariant = (row) => {
	if (row.manual) return "info";
	if (row.fieldName) return "primary";
	return "secondary";
};

const truncatePreview = (text, maxLength = 50) => {
	if (!text) return "";
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + "…";
};

const truncateImageURL = (url, tailLength = 12) => {
	if (!url) return "";
	const base = url.slice(0, 30);
	const tail = url.slice(-tailLength);
	return `${base}…${tail}`;
};

const MapDisplay = ({
	mapping = [],
	warnings = [],
	allHeaders = [],
	onOverride,
}) => {
	return (
		<div className="table-responsive">
			<table className="table table-bordered table-hover align-middle">
				<thead className="table-light">
					<tr>
						<th>Original Header</th>
						<th>Mapped Field</th>
						<th>Preview</th>
						<th>Score</th>
					</tr>
				</thead>
				<tbody>
					{mapping.map((row, index) => {
						const requiredField = fieldAliases.find(
							(f) => f.fieldName === row.fieldName
						)?.required;
						const isImageURL =
							row.isURL &&
							row.fieldName?.toLowerCase().includes("image");
						const fullPreview = row.preview || "";

						return (
							<tr key={index}>
								<td>{row.header}</td>
								<td className="text-start">
									<div className="dropdown">
										<button
											className={`btn btn-sm btn-${getVariant(
												row
											)} dropdown-toggle`}
											type="button"
											data-bs-toggle="dropdown"
											aria-expanded="false"
										>
											{row.fieldName
												? `${row.fieldName} — ${row.valueTitle}`
												: "Unassigned"}
										</button>
										<ul className="dropdown-menu">
											{fieldAliases.map((field, i) => (
												<li key={i}>
													<button
														type="button"
														className="dropdown-item"
														onClick={() =>
															onOverride(
																row.header,
																field.fieldName
															)
														}
													>
														{field.fieldName} —{" "}
														{field.valueTitle}
													</button>
												</li>
											))}
										</ul>
										{requiredField && (
											<span className="badge bg-success ms-2">
												Required
											</span>
										)}
										{row.manual && (
											<span className="badge bg-info ms-2">
												Manual
											</span>
										)}
									</div>
								</td>
								<td
									className="text-truncate"
									style={{ maxWidth: "240px" }}
									title={fullPreview}
								>
									{row.fillRatio === 0 ? (
										<span className="text-muted fst-italic">
											NO data in column
										</span>
									) : isImageURL ? (
										truncateImageURL(fullPreview)
									) : (
										truncatePreview(fullPreview)
									)}
								</td>
								<td>{row.score}</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			{warnings.length > 0 && (
				<div className="alert alert-warning mt-3">
					<h5>Warnings</h5>
					<ul className="mb-0">
						{warnings.map((warning, idx) => (
							<li key={idx}>
								<strong>
									{warning.valueTitle || warning.fieldName}:
								</strong>{" "}
								{warning.message}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default MapDisplay;
