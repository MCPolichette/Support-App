import {
	calculateFillRatio,
	validatePrice,
	isValidURL,
} from "./automapperUtils";
import fieldAliases from "./fieldAliases.json";

// Normalizes a header string for matching
function normalizeHeader(header = "") {
	return header
		.toLowerCase()
		.replace(/["']/g, "")
		.replace(/[\s_]+/g, "")
		.replace(/(variant|catalog|item|product)/g, "")
		.trim();
}
function getPreviewValue(rows, header) {
	for (let i = 0; i < rows.length; i++) {
		const val = rows[i][header];
		if (val && String(val).trim() !== "") {
			return String(val).trim();
		}
	}
	return "";
}

export default function autoMapHeaders(uploadedHeaders = [], sampleRows = []) {
	const normalizedHeaders = uploadedHeaders.map(normalizeHeader);
	const usedFieldNames = new Set();

	const mapped = [];
	const unmatched = [];
	const requiredWarnings = [];

	for (let i = 0; i < normalizedHeaders.length; i++) {
		const header = uploadedHeaders[i];
		const normalized = normalizedHeaders[i];
		let bestMatch = null;

		fieldAliases.forEach((field) => {
			(field.matches || []).forEach((alias, index) => {
				if (normalizeHeader(alias) === normalized) {
					const aliasScore = Math.max(10 - index, 1);
					const fillRatio = calculateFillRatio(sampleRows, header);
					const finalScore = Math.round(aliasScore * fillRatio);

					if (
						!usedFieldNames.has(field.fieldName) &&
						(!bestMatch || finalScore > bestMatch.score)
					) {
						bestMatch = {
							fieldName: field.fieldName,
							valueTitle: field.valueTitle,
							header,
							score: finalScore,
							required: field.required,
							valueType: field.valueType,
							preview: getPreviewValue(sampleRows, header),
							fillRatio,
							isPrice: validatePrice(sampleRows, header),
							isURL: isValidURL(sampleRows, header),
							manual: false,
						};
						console.log(bestMatch);
					}
				}
			});
		});

		if (bestMatch) {
			usedFieldNames.add(bestMatch.fieldName);
			mapped.push(bestMatch);
			console.log(mapped);
		} else {
			mapped.push({
				header,
				fieldName: "",
				valueTitle: "",
				score: 0,
				required: false,
				manual: false,
				preview: getPreviewValue(sampleRows, header),
				fillRatio: calculateFillRatio(sampleRows, header),
				isPrice: validatePrice(sampleRows, header),
				isURL: isValidURL(sampleRows, header),
			});
			console.log("FIELDName forced blank");
		}
	}

	// Check for missing required fields
	fieldAliases.forEach((field) => {
		if (field.required && !usedFieldNames.has(field.fieldName)) {
			requiredWarnings.push({
				fieldName: field.fieldName,
				valueTitle: field.valueTitle,
				message: "Required field not matched",
			});
		}
	});
	const hasDepartment = mapped.some((m) => m.fieldName === "strDepartment");
	const category = mapped.find(
		(m) => m.fieldName === "strCategory" && m.fillRatio > 0.3
	);
	const subcategory = mapped.find(
		(m) => m.fieldName === "strSubcategory" && m.fillRatio > 0.3
	);
	const googleCategory = mapped.find(
		(m) => m.header.toLowerCase().includes("google") && m.fillRatio > 0.3
	);

	if (!hasDepartment) {
		if (category) {
			category.fieldName = "strDepartment";
			category.valueTitle = "Department (from Category)";
			category.manual = true;
			category.required = category.promotedFrom = "strCategory";

			if (subcategory) {
				subcategory.fieldName = "strCategory";
				subcategory.valueTitle = "Category (from Subcategory)";
				subcategory.manual = true;
				subcategory.promotedFrom = "strSubcategory";
			}

			requiredWarnings.push({
				fieldName: "strDepartment",
				valueTitle: "Department",
				message:
					"No Department found, but Category was mapped as Department; Subcategory as Category.",
			});
		} else if (googleCategory) {
			googleCategory.fieldName = "strDepartment";
			googleCategory.valueTitle =
				"Department (from Google Product Category)";
			googleCategory.manual = true;
			googleCategory.promotedFrom = "Google Product Category";

			requiredWarnings.push({
				fieldName: "strDepartment",
				valueTitle: "Department",
				message:
					"No Department found, but Google Product Category was used instead.",
			});
		}
	}

	return {
		mapped,
		unmatched,
		requiredWarnings,
		allHeaders: uploadedHeaders,
	};
}
