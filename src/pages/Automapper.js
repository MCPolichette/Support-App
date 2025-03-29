import React, { useState } from "react";
import { file_reader } from "../logic/file_reader.js";
import { feedfile } from "../logic/feedFile.js";
import InfoDisplay from "../components/InfoDisplay.js";
import MapDisplay from "../components/tables/MapDisplay.js";
import autoMapHeaders from "../logic/mappingEngine";
import ShopifyModal from "../components/modals/ShopifyModal.js"; // Import modal

const Automapper = () => {
	const [allHeaders, setAllHeaders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [mappingComplete, setMappingComplete] = useState(false);
	const [mappingResults, setMappingResults] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [showRefresh, setShowRefresh] = useState(false);
	const [showModal, setShowModal] = useState(false);

	// Handles file selection
	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setSelectedFile(file);
		setLoading(true); // Show loading animation
		if (file) {
			console.log(file);
			file_reader(event.target).then((parsed) => {
				const { headers, sampleRows } = parsed;
				const mapping = autoMapHeaders(headers, sampleRows);
				console.log(mapping); // For now, just confirm in console
				// Store in state
				setMappingResults(mapping);
				setAllHeaders(headers);
				setLoading(false);
				setMappingComplete(true);
				console.log("HEADERS:", headers);
				console.log("SAMPLE ROWS:", sampleRows);
			});
		}
	};

	// Reloads the page
	const handleRefresh = () => {
		window.location.reload();
	};

	return (
		<div className="container container-fluid d-flex flex-column min-vh-100 justify-content-center align-items-center">
			<div className="row flex-column text-center">
				<h2>Datafeed Automapper 2.0</h2>
				{/* Refresh Page Button */}
				{showRefresh && (
					<button
						id="refresh_page"
						type="button"
						className="btn btn-primary btn-lg mb-3"
						// onClick={handleRefresh}
					>
						Map a new file
					</button>
				)}

				{/* File Input */}
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

				{/* Show Loading Spinner while processing */}
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

				{/* Show selected file info after mapping is complete */}
				{mappingComplete && (
					<div className="row mt-4 w-100 text-start">
						<div className="col-lg-6 col-md-6 col-sm-12">
							<InfoDisplay
								title="File Information"
								items={Object.values(feedfile.fileInfo)}
							/>
						</div>
						<div className="col-lg-6 col-md-6 col-sm-12">
							<div className="alert alert-warning shadow">
								<p>Additional Content Here</p>
							</div>
						</div>
					</div>
				)}
				{/* Show selected file name */}
				{selectedFile && (
					<div className="row mt-4 w-100">
						<div className="col-12">
							<MapDisplay
								mapping={mappingResults?.mapped}
								warnings={mappingResults?.requiredWarnings}
								unmatched={mappingResults?.unmatched}
								allHeaders={mappingResults?.allHeaders}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Automapper;
