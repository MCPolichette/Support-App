import React, { createContext, useContext, useState, useEffect } from "react";
import { DefaultReportArray as DefaultReportList } from "./API/defaultReports";
import { getSettings } from "../utils/API/_AdminApiModules";

const ReportContext = createContext();
export const useReportContext = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
	const [reportList, setReportList] = useState({});

	useEffect(() => {
		const settings = getSettings();
		const customReports = settings.customReports || {};
		const merged = { ...DefaultReportList };

		Object.entries(customReports).forEach(([categoryName, reports]) => {
			if (!merged[categoryName]) merged[categoryName] = {};

			Object.entries(reports).forEach(([reportName, reportConfig]) => {
				if (!merged[categoryName][reportName]) {
					merged[categoryName][reportName] = {
						...reportConfig,
						inReport: false,
						custom: true,
					};
				}
			});
		});

		setReportList(merged);
	}, []);

	const addReport = (categoryName, reportName, newReport) => {
		setReportList((prev) => ({
			...prev,
			[categoryName]: {
				...(prev[categoryName] || {}),
				[reportName]: newReport,
			},
		}));
	};

	const removeReportByName = (reportName) => {
		setReportList((prev) => {
			const updated = {};

			for (const [category, reports] of Object.entries(prev)) {
				const filteredReports = Object.fromEntries(
					Object.entries(reports).filter(
						([key]) => key !== reportName
					)
				);
				updated[category] = filteredReports;
			}

			return updated;
		});
	};

	const setReportInReportFalse = (reportName) => {
		setReportList((prev) => {
			const updated = {};

			for (const [category, reports] of Object.entries(prev)) {
				updated[category] = {};

				for (const [key, value] of Object.entries(reports)) {
					updated[category][key] =
						key === reportName
							? { ...value, inReport: false }
							: value;
				}
			}

			return updated;
		});
	};

	const updateReportByName = (reportName, updatedReport) => {
		setReportList((prev) => {
			const updated = {};

			for (const [category, reports] of Object.entries(prev)) {
				updated[category] = {};

				for (const [key, value] of Object.entries(reports)) {
					updated[category][key] =
						key === reportName
							? { ...value, ...updatedReport }
							: value;
				}
			}

			return updated;
		});
	};

	const resetReports = () => {
		setReportList({ ...DefaultReportList });
	};

	return (
		<ReportContext.Provider
			value={{
				reportList,
				setReportList,
				addReport,
				removeReportByName,
				setReportInReportFalse,
				updateReportByName,
				resetReports,
			}}
		>
			{children}
		</ReportContext.Provider>
	);
};
