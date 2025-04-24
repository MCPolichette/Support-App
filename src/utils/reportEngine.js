import { runAPI } from "./apiRunner";
import { getSettings } from "./_ApiApiModules";

export async function adminReportAPI({
	selectedModules,
	startDate,
	endDate,
	previousStartDate,
	previousEndDate,
	merchant,
	updateProgress = () => {},
}) {
	const results = {};

	for (const [name, mod] of selectedModules) {
		try {
			updateProgress(`Running ${name.replace(/_/g, " ")}`);

			const current = await runAPI(
				{ startDate, endDate, report_id: mod.id },
				getSettings().key,
				merchant
			);
			results[`${name}_current`] = current;

			const previous = await runAPI(
				{
					startDate: previousStartDate,
					endDate: previousEndDate,
					report_id: mod.id,
				},
				getSettings().key,
				merchant
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
