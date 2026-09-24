import React, { useState } from "react";
import { file_reader } from "../logic/file_reader.js";
import { feedfile } from "../logic/automapperLogic/feedFile.js";
import MapDisplay from "../components/tables/MapDisplay.js";
import { Container, Row, Col } from "react-bootstrap";
//logic
import { autoMapperWarningHandler } from "../logic/automapperLogic/automapperWarningHandler.js";
import autoMapHeaders, { assignField } from "../logic/automapperLogic/mappingEngine.js";
//modals
import StylizedModal from "../components/modals/_ModalStylized.js";
import MapModal from "../components/modals/MapModal";
import AddAttribute from "../components/modals/AddAttribute.js";

//cards
import StatusCard from "../components/cards/StatusCard.js";
import InfoCard from "../components/cards/InfoCard.js";

const Automapper = () => {
	const [showRefresh, setShowRefresh] = useState(false);
	const [loading, setLoading] = useState(false);
	const [mappingResults, setMappingResults] = useState(null);
	const [NotesAndWarnings, setNotesAndWarnings] = useState({ dataArray: [] });
	const [selectedFile, setSelectedFile] = useState(null);
	const [modalType, setModalType] = useState(null);
	const [showVariantMap, setShowVariantMap] = useState(false);
	const openModal = (type, header = "") => {
		setModalType(type);
		setActiveHeader(header);
	};
	const closeModal = () => setModalType(null);
	const [activeHeader, setActiveHeader] = useState("");
	const handleOverride = (columnIndex, newFieldName, custom = {}) => {
		const newMapping = assignField(mappingResults.mapping, columnIndex, newFieldName, custom);
		setNotesAndWarnings(autoMapperWarningHandler(newMapping));
		setMappingResults({ ...mappingResults, mapping: newMapping });
	};

	const documentData = feedfile.fileData;
	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setSelectedFile(file);
		setLoading(true);
		setShowRefresh(true);

		if (file) {
			file_reader(event.target).then((parsed) => {
				const { headers, sampleRows } = parsed;
				const { mapped } = autoMapHeaders(
					headers,
					sampleRows
				);

				setMappingResults({
					mapping: mapped,
					warnings: [],
					allHeaders: headers,
				});
				setNotesAndWarnings(autoMapperWarningHandler(mapped));
				setLoading(false);
			});
		}
	};
	const toggleButton = (
		<div className="d-grid gap-2">
			<button
				className={`btn btn-lg ${
					showVariantMap ? "btn-outline-info" : "btn-outline-success"
				}`}
				onClick={() => setShowVariantMap((prev) => !prev)}
			>
				<strong>
					{showVariantMap
						? "RETURN TO STANDARD MAP"
						: "GET VARIANT MAP"}
				</strong>
			</button>
		</div>
	);

	const handleRefresh = () => {
		setShowRefresh(false);
		window.location.reload();
	};

	return (
		<Container className="container container-fluid d-flex flex-column justify-content-center align-items-center">
			<Row>
				<h2>Datafeed Automapper 2.0</h2>

				{showRefresh ? (
					<button
						id="refresh_page"
						type="button"
						className="btn btn-info mb-3"
						onClick={handleRefresh}
					>
						Map a new file
					</button>
				) : (
					<div id="file_input">
						<label htmlFor="formFileLg" className="form-label h6">
							Select Feed-File to Map
						</label>
						<input
							className="form-control form-control-lg"
							id="formFileLg"
							type="file"
							onChange={handleFileChange}
						/>
					</div>
				)}

				{loading && (
					<div className="d-flex justify-content-center mt-4">
						<div
							className="spinner-border text-primary"
							role="status"
						>
							<span className="visually-hidden">Loading...</span>
						</div>
					</div>
				)}
				{selectedFile && mappingResults && (
					<div>
						<div className="row mt-4 w-100 text-start">
							<div className="col-lg-6 col-md-6 col-sm-12">
								<StatusCard
									status="success"
									title="File Stats"
									items={documentData}
								/>
								<div className="d-grid gap-2">
									<button
										className={`btn btn-lg  ${
											showVariantMap
												? "btn-success"
												: "btn-primary"
										}`}
										type="button"
										onClick={() => openModal("map")}
									>
										{showVariantMap
											? "Give Me the Variant Pipe Delimited Map"
											: "Give Me the Standard Pipe Delimited Map"}
									</button>
								</div>
							</div>
							<div className="col-lg-6 col-md-6 col-sm-12">
								<InfoCard
									items={NotesAndWarnings.dataArray}
									showVariantMap={showVariantMap}
									parentGroup={mappingResults}
									button={toggleButton}
								/>
							</div>
						</div>

						<div className="row mt-4 w-100">
							<div className="col-12">
								<MapDisplay
									mapping={mappingResults?.mapping}
									warnings={mappingResults.warnings}
									allHeaders={mappingResults.allHeaders}
									onOverride={handleOverride}
									showVariantMap={showVariantMap}
									newAtt={openModal}
								/>
							</div>
						</div>
					</div>
				)}
			</Row>
			<StylizedModal
				show={!!modalType}
				onHide={closeModal}
				title={
					modalType === "map"
						? "CopyPasta and Additional Details"
						: "Add Custom Attribute"
				}
			>
				{modalType === "map" && (
					<MapModal
						mapping={mappingResults?.mapping}
						type={showVariantMap}
						delimiter={feedfile.fileInfo.Delimiter.value}
					/>
				)}
				{modalType === "attribute" && (
					<AddAttribute
						onConfirm={(_, fieldName, custom) => handleOverride(activeHeader, fieldName, custom)}
						mapping={mappingResults.mapping}
						header={mappingResults.mapping[activeHeader]?.header}
					/>
				)}
			</StylizedModal>
		</Container>
	);
};

export default Automapper;
