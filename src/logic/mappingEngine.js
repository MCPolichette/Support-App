import { calculateFillRatio } from "./automapperUtils";
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

export function autoMapHeaders(headerArray, sampleRows) {
	const mapped = [];
	const usedFieldNames = new Set();

	// Pre-normalize aliases for all fields
	const normalizedFields = fieldAliases.map((field) => ({
		...field,
		normalizedMatches: field.matches.map(normalizeHeader),
	}));

	headerArray.forEach((header) => {
		const normalized = normalizeHeader(header);
		let bestMatch = null;

		normalizedFields.forEach((field) => {
			const index = field.normalizedMatches.indexOf(normalized);
			if (index !== -1) {
				const baseScore = 10 - index;
				const fillRatio = calculateFillRatio(
					sampleRows,
					header,
					field.valueType || ""
				);
				const score = Math.round(baseScore * fillRatio * 10); // e.g. 90 = high confidence

				if (!bestMatch || score > bestMatch.score) {
					bestMatch = {
						fieldName: field.fieldName,
						valueTitle: field.valueTitle,
						score,
						required: field.required || false,
						header,
					};
				}
			}
		});

		if (bestMatch) {
			mapped.push(bestMatch);
			usedFieldNames.add(bestMatch.fieldName);
		}
	});

	// Build required field warnings
	const requiredWarnings = [];
	fieldAliases.forEach((field) => {
		if (field.required && !usedFieldNames.has(field.fieldName)) {
			requiredWarnings.push({
				fieldName: field.fieldName,
				valueTitle: field.valueTitle,
				message: "Required field not matched",
			});
		}
	});

	// Department fallback logic
	if (!usedFieldNames.has("strDepartment")) {
		const googleCat = mapped.find((m) => m.fieldName === "strAttribute10");
		const category = mapped.find((m) => m.fieldName === "strCategory");
		const subcategory = mapped.find(
			(m) => m.fieldName === "strSubcategory"
		);

		const googleFilled =
			googleCat && calculateFillRatio(sampleRows, googleCat.header) > 0;
		const categoryFilled =
			category && calculateFillRatio(sampleRows, category.header) > 0;
		const subcatFilled =
			subcategory &&
			calculateFillRatio(sampleRows, subcategory.header) > 0;

		// Promote Google Category
		if (googleFilled && !categoryFilled && !subcatFilled) {
			requiredWarnings.push({
				fieldName: "strDepartment",
				valueTitle: "Department",
				message:
					"Google Product Category was promoted to Department, as no Category or Subcategory values were detected.",
			});
			if (googleCat) {
				googleCat.fieldName = "strDepartment";
				googleCat.valueTitle = "Department";
				usedFieldNames.add("strDepartment");
			}
		}

		// Promote Category → Department, and Subcategory → Category
		else if (categoryFilled) {
			requiredWarnings.push({
				fieldName: "strDepartment",
				valueTitle: "Department",
				message:
					"Category was promoted to Department, as no field explicitly mapped to Department.",
			});
			if (category) {
				category.fieldName = "strDepartment";
				category.valueTitle = "Department";
				usedFieldNames.add("strDepartment");
			}
			if (subcatFilled && subcategory) {
				subcategory.fieldName = "strCategory";
				subcategory.valueTitle = "Category";
				usedFieldNames.add("strCategory");
			}
		}

		// Subcategory only
		else if (subcatFilled) {
			requiredWarnings.push({
				fieldName: "strDepartment",
				valueTitle: "Department",
				message:
					"Subcategory was promoted to Department, as no better option was found.",
			});
			if (subcategory) {
				subcategory.fieldName = "strDepartment";
				subcategory.valueTitle = "Department";
				usedFieldNames.add("strDepartment");
			}
		} else {
			requiredWarnings.push({
				fieldName: "strDepartment",
				valueTitle: "Department",
				message: "Required field not matched",
			});
		}
	}

	return { mapping: mapped, warnings: requiredWarnings };
}
