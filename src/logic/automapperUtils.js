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
export function validatePrice(rows = [], header = "") {
	let numericCount = 0;
	let totalChecked = 0;

	const priceRegex = /^\$?\d{1,6}(\.\d{1,2})?$/;

	for (let i = 0; i < Math.min(500, rows.length); i++) {
		const val = rows[i][header];
		if (val === undefined || val === null || val === "") continue;

		totalChecked++;
		const strVal = String(val).replace(/,/g, "").trim();

		if (!isNaN(strVal) && priceRegex.test(strVal)) {
			numericCount++;
		}
	}

	return totalChecked > 0 && numericCount / totalChecked >= 0.6;
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
export function calculateFillRatio(rows = [], header = "", valueType = "") {
	if (!rows.length) return 0;

	let filledCount = 0;

	rows.forEach((row) => {
		let val = row[header];
		if (val !== null && val !== undefined) {
			val = String(val).trim();

			if (val) {
				if (valueType === "number" && isNaN(parseFloat(val))) return;
				if (valueType === "url" && !isValidURL(val)) return;

				filledCount++;
			}
		}
	});

	return filledCount / rows.length;
}

export function isValidURL(val) {
	try {
		const url = new URL(val);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
}
