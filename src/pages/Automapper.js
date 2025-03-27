import React, { useState } from "react";
import { file_reader } from "../logic/file_reader.js";
import { feedfile } from "../logic/feedFile.js";
import InfoDisplay from "../components/InfoDisplay.js";
import MapDisplay from "../components/tables/MapDisplay.js";
//import ShopifyModal from "../components/modals/ShopifyModal.js"; // Import modal

const Automapper = () => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [showRefresh, setShowRefresh] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [mappingComplete, setMappingComplete] = useState(false);

	// Handles file selection
	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setSelectedFile(file);
		setLoading(true); // Show loading animation
		if (file) {
			console.log(file);
			file_reader(event.target).then(() => {
				console.log("test");
				setLoading(false); // Hide loading animation
				setMappingComplete(true); // Show mapped data
			});

			// .then(() => {
			// 	check_for_blank_columns(
			// 		feedFile.merchant_layout,
			// 		feedFile.data_rows
			// 	);
			// 	determine_fields(feedFile.merchant_layout);
			// 	// if (
			// 	// 	feedFile.merchant_layout[31] ===
			// 	// 	// shopify_API_feed_examples[0]?.column_layout[31]
			// 	// ) {
			// 	// 	// showShopifyModal();
			// 	// }
			// 	setShowRefresh(true);
			// });
		}
		// if (
		// 	feedfile.merchant_layout[31] ===
		// 	shopify_API_feed_examples[0]?.column_layout[31]
		// ) {
		// 	setShowModal(true); // Open modal if Shopify feed detected
		// }
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
							<MapDisplay />
							{/* 
						<div className="d-grid col-6 mx-auto gap-2">
							<button
								id="variant-toggle"
								type="button"
								hidden
								className="btn btn-success btn-lg"
								onClick="variant_toggle()"
							>
								Variant mapping is available - Click Here{" "}
							</button>
							<button
								id="editing-toggle"
								type="button"
								className="btn btn-outline-secondary btn-sm"
								onClick="is_editing_toggle()"
							>
								Click to adjust Mapping
							</button>
							<button
								type="button"
								className="btn btn-lg btn-primary"
								data-bs-toggle="modal"
								data-bs-target="#pipe_modal"
							>
								Give Me the Pipe Delimited Map!
							</button>
						</div> */}

							<div className="row justify-content-md-center text-break">
								<div className="col-4">
									<h5>
										<strong>Notes:</strong>
									</h5>
									<ul
										className="list-group list-group-flush"
										id="mapping_notes"
									></ul>
								</div>
								<div
									id="display_att_map"
									className="col-4"
									hidden
								>
									<h5>
										<strong>str Attributes:</strong>
									</h5>
									<ul
										className="list-group list-group-flush"
										id="att-map"
									></ul>
								</div>
								<div
									id="display_errors"
									className="col-4"
									hidden
								>
									<h5>
										<strong>Errors:</strong>
									</h5>

									<ul
										className="list-group list-group-flush"
										id="mapping_errors"
									></ul>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Automapper;
