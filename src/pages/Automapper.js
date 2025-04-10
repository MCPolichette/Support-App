import React, { useState } from "react";
import { file_reader } from "../logic/file_reader.js";
import MapDisplay from "../components/tables/MapDisplay.js";
import autoMapHeaders from "../logic/mappingEngine";
import MapModal from "../components/modals/MapModal";
import fieldAliases from "../logic/fieldAliases.json";

const Automapper = () => {
	const [allHeaders, setAllHeaders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [mappingComplete, setMappingComplete] = useState(false);
	const [mappingResults, setMappingResults] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [showMapModal, setShowMapModal] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showRefresh, setShowRefresh] = useState(false);

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
						manual: true,
						score: 99,
				  }
				: m
		);

		setMappingResults({
			...mappingResults,
			mapping: newMapping,
		});
	};

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
				console.log(mapped);
				setMappingResults({
					mapping: mapped,
					warnings: warnings,
					allHeaders: headers,
				});

				setAllHeaders(headers);
				setLoading(false);
				console.log("Warnings:", warnings);
				console.log("Headers:", headers);
				console.log("mapped", mapped);
			});
		}
	};

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

				{mappingComplete && (
					<div className="row mt-4 w-100 text-start">
						{/* You can uncomment this when you're ready for file info again */}
						{/* <div className="col-lg-6 col-md-6 col-sm-12">
							<InfoDisplay
								title="File Information"
								items={Object.values(feedfile.fileInfo)}
							/>
						</div> */}
					</div>
				)}

				{selectedFile && mappingResults && (
					<div className="row mt-4 w-100">
						<div className="col-12">
							<MapDisplay
								mapping={mappingResults?.mapping}
								warnings={mappingResults.warnings}
								allHeaders={mappingResults.allHeaders}
								onOverride={handleOverride}
							/>
						</div>
					</div>
				)}
				{mappingComplete && (
					<div className="mt-3">
						<button
							className="btn btn-outline-secondary"
							onClick={() => setShowMapModal(true)}
						>
							Show Mapped Fields
						</button>
						<MapModal
							show={showMapModal}
							onClose={() => setShowMapModal(false)}
							mapping={mappingResults.mapping}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default Automapper;
