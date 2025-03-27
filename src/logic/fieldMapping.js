// fieldMapping.js - Handles field mapping
import { feedfile } from "./feedFile";
import fields from "./all_fields.json";

export function determine_fields(arr) {
	feedfile.fileInfo.Number_of_Columns.value = arr.length;
	console.log("columns set.. why is it not displaying?");
	const fieldMap = {};
	fields.all_fields.forEach((field) => {
		field.matches.forEach((match) => {
			fieldMap[match] = field; // Map match to field object
		});
	});

	arr.forEach((array_element, index) => {
		const matchedField = fieldMap[array_element.toLowerCase()];
		if (matchedField) {
			feedfile.maps.import_map[index] = matchedField.field_name;
			feedfile.maps.map_for_variants[index] = matchedField.field_name;
			feedfile.maps.variant_map[index] = matchedField.variant || "";
		} else {
			feedfile.maps.import_map[index] = ""; // No match found
		}
	});
}

export function check_for_blank_columns(arr, allRows) {
	const sampleSize = Math.min(100, allRows.length); // Limit to 100 rows
	let blank_columns = new Array(arr.length).fill(false);
	let test_columns = new Array(arr.length).fill(0);

	// 🔥 Process a sample instead of all rows
	for (let i = 1; i < sampleSize; i++) {
		let values = allRows[i]?.split(determineDelimiter(allRows[0])) || [];
		if (values.length === arr.length) {
			values.forEach((val, idx) => {
				if (!val) test_columns[idx]++;
			});
		}
	}

	// 🔥 Determine completely empty columns
	test_columns.forEach((count, index) => {
		if (count === sampleSize - 1) {
			blank_columns[index] = true;
		}
		if (count > 0 && count < sampleSize - 1) {
			feedfile.contains_empty_values.push({
				i: index,
				percent: ((count / sampleSize) * 100).toFixed(2),
			});
		}
	});

	feedfile.blank_columns = blank_columns
		.map((isEmpty, index) => (isEmpty ? index : null))
		.filter((val) => val !== null); // Remove null values
}
function determineDelimiter(header) {
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
