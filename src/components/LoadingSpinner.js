import React from "react";

const LoadingSpinner = ({ message = "Loading..." }) => {
	return (
		<div className="text-center py-4">
			<span className="text-blue-600 font-semibold animate-pulse">
				{message}
			</span>
		</div>
	);
};

export default LoadingSpinner;
