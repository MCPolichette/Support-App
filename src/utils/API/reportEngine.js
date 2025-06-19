import { runAPI } from "./apiRunner";
import { getSettings } from "./_AdminApiModules";
import { getReportTexts } from "../../utils/getTime";

export async function adminReportAPI({
	reportList,
	selectedModules,
	startDate,
	endDate,
	previousStartDate,
	previousEndDate,
	merchant,
	networkCode,
	updateProgress = () => {},
}) {
	console.log(
		startDate,
		endDate,
		previousStartDate,
		previousEndDate,
		merchant,
		networkCode
	);

	const results = {};

	for (const [name, mod] of selectedModules) {
		try {
			let currStart = startDate;
			let prevStart = previousStartDate;

			// If the report is marked ytd, override the start dates
			if (mod.ytd === true) {
				const currYear = startDate.split("-")[0];
				const prevYear = previousStartDate.split("-")[0];
				currStart = `${currYear}-01-01`;
				prevStart = `${prevYear}-01-01`;
			}
			console.log(currStart, prevStart, mod.id);

			updateProgress(
				`Running ${name.replace(/_/g, " - ")} ${
					getReportTexts(currStart, endDate).dateRange
				} `
			);

			const current = await runAPI(
				{ startDate: currStart, endDate, report_id: mod.id },
				getSettings().key,
				merchant,
				networkCode
			);
			results[`${name}_current`] = current;

			updateProgress(
				`Running ${name.replace(/_/g, " - ")} ${
					getReportTexts(prevStart, previousEndDate).dateRange
				}`
			);

			const previous = await runAPI(
				{
					startDate: prevStart,
					endDate: previousEndDate,
					report_id: mod.id,
				},
				getSettings().key,
				merchant,
				networkCode
			);
			results[`${name}_previous`] = previous;

			updateProgress(`${name} ✅`);
		} catch (error) {
			console.error(`${name} failed`, error);
			updateProgress(`${name} ❌`);
		}
	}

	return results;
}
