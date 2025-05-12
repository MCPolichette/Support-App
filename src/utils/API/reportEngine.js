import { runAPI } from "./apiRunner";
import { getSettings } from "./_AdminApiModules";
import { getReportTexts } from "../../utils/getTime";

export async function adminReportAPI({
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
			updateProgress(
				`Running ${name.replace(/_/g, " - ")} ${
					getReportTexts(startDate, endDate).dateRange
				} `
			);

			const current = await runAPI(
				{ startDate, endDate, report_id: mod.id },
				getSettings().key,
				merchant,
				networkCode
			);
			results[`${name}_current`] = current;
			updateProgress(
				`Running ${name.replace(/_/g, " - ")}${
					getReportTexts(previousStartDate, previousEndDate).dateRange
				}`
			);

			const previous = await runAPI(
				{
					startDate: previousStartDate,
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
