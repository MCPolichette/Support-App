import React from "react";

const ToolContainer = ({ children, className = "", style = {}, ...props }) => (
	<div
		{...props}
		className={`container mt-4 shadow callout-info card-drop-in ${className}`.trim()}
		style={{ backgroundColor: "lightgrey", padding: "2rem", ...style }}
	>
		{children}
	</div>
);

export default ToolContainer;
