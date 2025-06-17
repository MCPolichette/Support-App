import React, { createContext, useContext, useState } from "react";
import { DefaultReportArray } from "../logic/comparisonLogic/defaultReports";
const ReportContext = createContext();
export const useReportContext = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
	const [reportList, setReportList] = useState(DefaultReportArray);

	// Add a new report
	const addReport = (newReport) => {
		setReportList((prev) => [...prev, newReport]);
	};

	// Remove a report by ID
	const removeReportById = (id) => {
		setReportList((prev) => prev.filter((r) => r.id !== id));
	};

	// Reset to default
	const resetReports = () => {
		setReportList(DefaultReportArray);
	};

	return (
		<ReportContext.Provider
			value={{
				reportList,
				setReportList,
				addReport,
				removeReportById,
				resetReports,
			}}
		>
			{children}
		</ReportContext.Provider>
	);
};
