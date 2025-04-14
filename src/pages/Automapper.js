import React, { useState } from "react";
import { file_reader } from "../logic/file_reader.js";
import { feedfile } from "../referenceFiles/feedFile.js";
import MapDisplay from "../components/tables/MapDisplay.js";
//logic
import { autoMapperWarningHandler } from "../logic/automapperWarningHandler.js";
import autoMapHeaders from "../logic/mappingEngine";
import fieldAliases from "../logic/fieldAliases.json";
//modals
import StylizedModal from "../components/modals/_ModalStylized.js";
import MapModal from "../components/modals/MapModal";

//cards
import StatusCard from "../components/cards/StatusCard.js";
import InfoCard from "../components/cards/InfoCard.js";

const Automapper = () => {
	const [allHeaders, setAllHeaders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [mappingResults, setMappingResults] = useState(null);
	const [NotesAndWarnings, setNotesAndWarnings] = useState({ dataArray: [] });
	const [selectedFile, setSelectedFile] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [showRefresh, setShowRefresh] = useState(false);
	const [showVariantMap, setShowVariantMap] = useState(false);

	const handleOverride = (header, newFieldName) => {
		const field = fieldAliases.find((f) => f.fieldName === newFieldName);
		if (!field) {
			return;
		}

		const newMapping = mappingResults.mapping.map((m) =>
			m.header === header
				? {
						...m,
						fieldName: field.fieldName,
						valueTitle: field.valueTitle,
						variant: field.variant,
						manual: true,
						score: 99,
				  }
				: m
		);
		setNotesAndWarnings(autoMapperWarningHandler(newMapping));
		// console.log(NotesAndWarnings.dataArray);
		setMappingResults({
			...mappingResults,
			mapping: newMapping,
		});
	};
	const documentData = feedfile.fileData;
	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setSelectedFile(file);
		setLoading(true);

		if (file) {
			file_reader(event.target).then((parsed) => {
				const { headers, sampleRows } = parsed;
				const { mapped, warnings } = autoMapHeaders(
					headers,
					sampleRows
				);
				setMappingResults({
					mapping: mapped,
					warnings: warnings,
					allHeaders: headers,
				});

				setAllHeaders(headers);
				setNotesAndWarnings(autoMapperWarningHandler(mapped));
				setLoading(false);
				console.log("Warnings:", warnings);
				console.log("Headers:", headers);
				console.log("mapped", mapped);
			});
		}
	};
	const toggleButton = (
		<div className="d-grid gap-2">
			<button
				className={`btn btn-sm ${
					showVariantMap ? "btn-outline-info" : "btn-outline-success"
				}`}
				onClick={() => setShowVariantMap((prev) => !prev)}
			>
				{showVariantMap ? "RETURN TO STANDARD MAP" : "GET VARIANT MAP"}
			</button>
		</div>
	);

	const handleRefresh = () => {
		window.location.reload();
	};

	return (
		<div className="container container-fluid d-flex flex-column min-vh-100 justify-content-center align-items-center">
			<div className="row flex-column text-center">
				<h2>Datafeed Automapper 2.0</h2>

				{showRefresh && (
					<button
						id="refresh_page"
						type="button"
						className="btn btn-primary btn-lg mb-3"
						onClick={handleRefresh}
					>
						Map a new file
					</button>
				)}
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
										onClick={() => setShowModal(true)}
									>
										{showVariantMap
											? "Give Me the Variant Pipe Delimited Map"
											: "Give Me the Standard Pipe Delimited Map"}
									</button>

									<StylizedModal
										show={showModal}
										onHide={() => setShowModal(false)}
										title="map"
									>
										<MapModal
											mapping={mappingResults?.mapping}
											type={showVariantMap}
										/>
									</StylizedModal>
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
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Automapper;
