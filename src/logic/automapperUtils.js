// utils for automapper logic that isn't matching fields directly

/**
 * Checks if columns are mostly blank based on a sample of rows
 * @param {string[]} headers - Array of column headers
 * @param {Array<Object>} rows - Array of row objects
 * @param {number} sampleSize - Number of rows to check
 * @returns {Array<{ header: string, mostlyBlank: boolean }>}
 */
export function checkForBlankColumns(
	headers = [],
	rows = [],
	sampleSize = 500
) {
	const sample = rows.slice(0, sampleSize);

	return headers.map((header) => {
		const filledCount = sample.filter((row) => {
			const value = row[header];
			return (
				value !== null &&
				value !== undefined &&
				String(value).trim() !== ""
			);
		}).length;

		return {
			header,
			mostlyBlank: filledCount === 0,
		};
	});
}

/**
 * Gets the most common values for a given field
 * Useful for category / subcategory suggestions
 * @param {Array<Object>} rows
 * @param {string} fieldName
 * @param {number} limit
 * @returns {Array<{ value: string, count: number }>}
 */
export function getTopValues(rows, fieldName, limit = 10) {
	const counts = {};
	rows.forEach((row) => {
		const value = String(row[fieldName] || "").trim();
		if (value) {
			counts[value] = (counts[value] || 0) + 1;
		}
	});

	return Object.entries(counts)
		.map(([value, count]) => ({ value, count }))
		.sort((a, b) => b.count - a.count)
		.slice(0, limit);
}
export function calculateFillRatio(rows = [], header = "") {
	if (!rows.length) return 0;
	const filledCount = rows.filter((row) => {
		const val = row[header];
		return val !== null && val !== undefined && String(val).trim() !== "";
	}).length;

	return filledCount / rows.length;
}
