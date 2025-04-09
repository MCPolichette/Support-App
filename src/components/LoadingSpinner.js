import React from "react";

const LoadingSpinner = ({ message = "Loading..." }) => {
	return (
		<div className="flex flex-col items-center py-4">
			<div className="flex justify-center items-center h-screen">
				<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
			</div>
			<span className="text-blue-600 font-semibold">{message}</span>
		</div>
	);
};

export default LoadingSpinner;
