// utils/exportCSV.js
import { saveAs } from "file-saver";

export function exportToCSV(data, filename = "export.csv") {
	if (!data || !data.length) return;

	const headers = Object.keys(data[0]);
	const rows = data.map((row) =>
		headers.map((field) => JSON.stringify(row[field] ?? "")).join(",")
	);

	const csvContent = [headers.join(","), ...rows].join("\n");
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	saveAs(blob, filename);
}
