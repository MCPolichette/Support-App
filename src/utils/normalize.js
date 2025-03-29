export function normalizeHeader(input = "") {
	return input
		.toLowerCase()
		.replaceAll("'", "")
		.replaceAll('"', "")
		.replaceAll(",", "")
		.replaceAll("|", "")
		.replaceAll(/\t/g, "")
		.replaceAll("-", "")
		.replaceAll("_", "")
		.replaceAll(" ", "")
		.replaceAll("item", "")
		.replaceAll("product", "")
		.replaceAll("catalog", "")
		.replaceAll("variant", "")
		.replaceAll("\r", "");
}
