import { feedfile } from "./feedFile.js";
import { determine_fields, check_for_blank_columns } from "./fieldMapping.js";

export function file_reader(input) {
	return new Promise((resolve, reject) => {
		try {
			const file = input.files[0];
			const reader = new FileReader();

			reader.onload = function () {
				const text = reader.result;
				const allLines = text.split("\n");
				feedfile.maps.merchant_layout = cleanInput(allLines[0]);
				feedfile.maps.first_row = cleanInput(allLines[1] || "");
				check_for_blank_columns(
					feedfile.maps.merchant_layout,
					allLines
				);
				determine_fields(feedfile.maps.merchant_layout);
				console.log(feedfile);
				file_data(input);
				resolve({
					headers: feedfile.maps.merchant_layout,
					sampleRows: [feedfile.maps.first_row], // Expand if needed
				});
			};

			reader.onerror = function () {
				reject(reader.error); // ❌ reject if error occurs
			};
			reader.readAsText(file);
		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
}

function cleanInput(line) {
	return line.replaceAll(/["'\t,|]/g, "<newcolumn>").split("<newcolumn>");
}

function file_data(myFile) {
	let file = myFile.files[0];
	feedfile.fileInfo.File_Name.value = file.name.replace(/ *\([^)]*\) */g, "");
	feedfile.fileInfo.File_Size.value = file.size + " bytes";
	feedfile.fileInfo.File_Type.value = file.type;
	console.log(file);
}
