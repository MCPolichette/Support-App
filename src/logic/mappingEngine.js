import { normalizeHeader } from "../utils/normalize";
import fieldAliases from "./fieldAliases.json";
import { calculateFillRatio } from "../logic/automapperUtils";

export default function autoMapHeaders(uploadedHeaders = [], sampleRows = []) {
	const normalizedHeaders = uploadedHeaders.map(normalizeHeader);
	const usedFieldNames = new Set();

	const mapped = [];
	const unmatched = [];
	const requiredWarnings = [];

	for (let i = 0; i < normalizedHeaders.length; i++) {
		const header = uploadedHeaders[i];
		const normalized = normalizedHeaders[i];
		let bestMatch = null;

		fieldAliases.forEach((field) => {
			field.matches.forEach((alias, index) => {
				if (normalizeHeader(alias) === normalized) {
					const aliasScore = Math.max(10 - index, 1);
					const fillRatio = calculateFillRatio(sampleRows, header);
					const finalScore = Math.round(aliasScore * fillRatio);

					if (
						!usedFieldNames.has(field.fieldName) &&
						(!bestMatch || finalScore > bestMatch.score)
					) {
						bestMatch = {
							fieldName: field.fieldName,
							valueTitle: field.valueTitle,
							header,
							score: finalScore,
							required: field.required,
							valueType: field.valueType,
						};
					}
				}
			});
		});

		if (bestMatch) {
			usedFieldNames.add(bestMatch.fieldName);
			mapped.push(bestMatch);
		} else {
			unmatched.push({ header, reason: "No alias match found" });
		}
	}

	// Check for missing required fields
	fieldAliases.forEach((field) => {
		if (field.required && !usedFieldNames.has(field.fieldName)) {
			requiredWarnings.push({
				fieldName: field.fieldName,
				valueTitle: field.valueTitle,
				message: "Required field not matched",
			});
		}
	});

	return {
		mapped,
		unmatched,
		requiredWarnings,
		allHeaders: uploadedHeaders,
	};
}
