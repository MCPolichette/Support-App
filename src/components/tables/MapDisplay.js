import React from "react";
import fieldAliases from "../../logic/automapperLogic/fieldAliases.json";
import { Dropdown } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
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
	showVariantMap = false,
	newAtt,
}) => {
	return (
		<div className="table-responsive">
			<table className="table table-bordered largeFont table-hover table-sm align-middle">
				<thead className="table-light">
					<tr className="align-middle">
						<th>File Column Header</th>
						<th>Mapped Field</th>
						{showVariantMap && <th>Mapped Variant</th>}
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
								<td>
									<strong> {row.header}</strong>
								</td>

								<td className="text-start">
									<Row>
										<Col md={6}>
											<Dropdown>
												<Dropdown.Toggle
													id={`dropdown-${row.header}`}
													variant={getVariant(row)}
													size="sm"
												>
													{row.fieldName
														? `${row.fieldName} — ${row.valueTitle}`
														: "Unassigned"}
												</Dropdown.Toggle>

												<Dropdown.Menu>
													<Dropdown.Item
														onClick={() =>
															onOverride(
																row.header,
																"",
																{
																	valueTitle:
																		"Unassigned",
																}
															)
														}
													>
														Unassigned
													</Dropdown.Item>
													{fieldAliases.map(
														(field, i) => (
															<Dropdown.Item
																key={i}
																onClick={() =>
																	onOverride(
																		row.header,
																		field.fieldName
																	)
																}
															>
																{
																	field.fieldName
																}{" "}
																—{" "}
																{
																	field.valueTitle
																}
															</Dropdown.Item>
														)
													)}
												</Dropdown.Menu>
											</Dropdown>

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
										</Col>
										<Col md={6}>
											{!row.fieldName && (
												<div className="d-flex align-top justify-content-end">
													<button
														className="btn  btn-outline-secondary btn-sm"
														onClick={() =>
															newAtt(
																"attribute",
																row.header
															)
														}
													>
														Add Custom Attribute
													</button>
												</div>
											)}
										</Col>
									</Row>
								</td>

								{showVariantMap && (
									<td>
										<span className="">
											<strong>
												{row.variant || "—"}
											</strong>
										</span>
									</td>
								)}

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
