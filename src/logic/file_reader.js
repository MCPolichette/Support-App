import { feedfile } from "./automapperLogic/feedFile.js";
import { formatBytes } from "../utils/conversions.js";
import Papa from "papaparse";

// MAIN FILE READER
export function file_reader(input) {
	return new Promise((resolve, reject) => {
		try {
			const file = input.files[0];
			const reader = new FileReader();

			reader.onload = function () {
				const text = reader.result;
				const allLines = text
					.split("\n")
					.filter((line) => line.trim() !== "");

				const rawHeaderLine = allLines[0];
				const delimiter = determineDelimiter(rawHeaderLine);
				const headerRow = cleanInput(rawHeaderLine, delimiter);

				file_data(input, headerRow.length, allLines.length);
				// SAMPLE ROW CONVERSION
				const sampleLimit = 500;
				const sampleRowsAsObjects = [];

				for (
					let i = 1;
					i < Math.min(allLines.length, sampleLimit + 1);
					i++
				) {
					const values = cleanInput(allLines[i], delimiter);

					const rowObj = {};
					headerRow.forEach((key, idx) => {
						rowObj[key] = values[idx];
					});
					sampleRowsAsObjects.push(rowObj);
				}

				console.log(
					`Sample size: ${sampleRowsAsObjects.length} rows used`
				);
				resolve({
					delimiter: delimiter,
					headers: headerRow,
					sampleRows: sampleRowsAsObjects,
				});
			};
			reader.onerror = function () {
				reject(reader.error);
			};
			reader.readAsText(file);
		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
}
// CLEAN INPUT USING DYNAMIC DELIMITER & QUOTE HANDLING
function cleanInput(line, delimiter) {
	const config = {
		delimiter: delimiter || "", // Auto-detect if not specified
		newline: "", // Auto-detect
		quoteChar: '"',
		escapeChar: '"',
		header: false,
	};

	const result = Papa.parse(line, config);
	return result.data[0]; //  line as array
}

// DETECT DELIMITER FROM HEADER ROW
function determineDelimiter(header) {
	if (!header || typeof header !== "string") {
		feedfile.fileInfo.Delimiter.value = "Unknown";
		return ",";
	}
	if (header.includes("|")) {
		feedfile.fileInfo.Delimiter.value = "-|- PIPES";
		return "|";
	}
	if (header.includes("\t")) {
		feedfile.fileInfo.Delimiter.value = `-'\t'- TABS`;
		return "\t";
	}
	if (header.includes(",")) {
		feedfile.fileInfo.Delimiter.value = "-,- COMMAS";
		return ",";
	}
	feedfile.fileInfo.Delimiter.value = "Unknown";
	return ",";
}

// FILE METADATA
function file_data(myFile, colCount, rowCount) {
	let file = myFile.files[0];
	feedfile.fileData = [
		"FILE NAME:   " +
			(feedfile.fileInfo.File_Name.value = file.name.replace(
				/ *\([^)]*\) */g,
				""
			)),
		"SIZE:  " +
			formatBytes((feedfile.fileInfo.File_Size.value = file.size)),
		"FILE TYPE:  " + (feedfile.fileInfo.File_Type.value = file.type),
		"DELIMITER:  " + feedfile.fileInfo.Delimiter.value,
		"Number of Rows:   " + rowCount,
		"Number of Columns:   " + colCount,
	];
}
