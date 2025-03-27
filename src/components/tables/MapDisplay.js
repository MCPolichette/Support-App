import React from "react";

const MapDisplay = () => {
	return (
		<div id="tableDisplay">
			<div className="table-responsive shadow p-3 mb-5 bg-body rounded">
				<table
					id="table_map"
					className="table table-sm align-middle table-bordered border-primary map_layout"
				></table>
			</div>
		</div>
	);
};

export default MapDisplay;
