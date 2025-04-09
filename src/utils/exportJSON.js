import { saveAs } from "file-saver";

export function exportJSON(data, filename = "export.json") {
	if (!data || !data.length) return;

	const jsonString = JSON.stringify(data, null, 2); // Pretty print with 2-space indentation
	const blob = new Blob([jsonString], {
		type: "application/json;charset=utf-8;",
	});
	saveAs(blob, filename);
}
