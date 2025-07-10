export function formatBytes(bytes) {
	if (bytes === 0) return "0 Bytes";
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	const num = bytes / Math.pow(1024, i);
	return `${num.toFixed(1)} ${sizes[i]}`;
}

export function formatNumber(value, style = "int", decimals = null) {
	const numericValue = typeof value === "string" ? parseFloat(value) : value;

	// Handle invalid or empty inputs
	if (isNaN(numericValue)) return "";

	let decimalPlaces = decimals;

	// Default decimal rules
	if (decimalPlaces === null) {
		if (style === "dollar" || style === "percent") {
			decimalPlaces = 2;
		} else {
			decimalPlaces = 0;
		}
	}

	const formatted = numericValue.toLocaleString(undefined, {
		minimumFractionDigits: decimalPlaces,
		maximumFractionDigits: decimalPlaces,
	});

	switch (style) {
		case "dollar":
			return `$${formatted}`;
		case "percent":
			return `${formatted}%`;
		case "int":
		default:
			return formatted;
	}
}
