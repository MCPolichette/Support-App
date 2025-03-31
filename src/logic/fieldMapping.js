// fieldMapping.js - Now using fieldAliases.json
import { feedfile } from "./feedFile";
import fieldAliases from "./fieldAliases.json";

export function determine_fields(headerArray) {
	feedfile.fileInfo.Number_of_Columns.value = headerArray.length;
	const fieldMap = {};

	fieldAliases.forEach((field) => {
		field.matches.forEach((match) => {
			fieldMap[match.toLowerCase()] = field;
		});
	});

	headerArray.forEach((header, index) => {
		const normalizedHeader = header.toLowerCase();
		const matchedField = fieldMap[normalizedHeader];

		if (matchedField) {
			feedfile.maps.import_map[index] = matchedField.fieldName;
			feedfile.maps.map_for_variants[index] = matchedField.fieldName;
			feedfile.maps.variant_map[index] = matchedField.variant || "";
		} else {
			feedfile.maps.import_map[index] = ""; // No match found
		}
	});
}

export function check_for_blank_columns(headerArray, allRows) {
	const sampleSize = Math.min(100, allRows.length);
	let blankColumns = new Array(headerArray.length).fill(false);
	let valueCounts = new Array(headerArray.length).fill(0);

	const delimiter = determineDelimiter(allRows[0]);

	for (let i = 1; i < sampleSize; i++) {
		let values = allRows[i]?.split(delimiter) || [];
		if (values.length === headerArray.length) {
			values.forEach((val, idx) => {
				if (!val.trim()) valueCounts[idx]++;
			});
		}
	}

	valueCounts.forEach((count, index) => {
		if (count === sampleSize - 1) {
			blankColumns[index] = true;
		}
		if (count > 0 && count < sampleSize - 1) {
			feedfile.maps.contains_empty_values.push({
				i: index,
				percent: ((count / sampleSize) * 100).toFixed(2),
			});
		}
	});

	feedfile.blank_columns = blankColumns
		.map((isEmpty, index) => (isEmpty ? index : null))
		.filter((val) => val !== null);
}

export function determineDelimiter(header) {
	if (!header || typeof header !== "string") {
		feedfile.fileInfo.Delimiter.value = "Unknown";
		return "";
	}

	if (header.includes("|")) {
		feedfile.fileInfo.Delimiter.value = "-|- PIPES";
		return "|";
	}
	if (header.includes("\t")) {
		feedfile.fileInfo.Delimiter.value = "-\t- TABS";
		return "\t";
	}
	if (header.includes(",")) {
		feedfile.fileInfo.Delimiter.value = "-,- COMMAS";
		return ",";
	}

	feedfile.fileInfo.Delimiter.value = "Unknown";
	return "";
}
