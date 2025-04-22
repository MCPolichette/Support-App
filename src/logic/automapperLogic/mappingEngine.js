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
	console.log(rows, header);
	for (let i = 0; i < rows.length; i++) {
		const val = rows[i][header];
		console.log(val);
		if (val && String(val).trim() !== "") {
			return String(val).trim();
		}
	}
	return "";
}

export default function autoMapHeaders(uploadedHeaders = [], sampleRows = []) {
	const normalizedHeaders = uploadedHeaders.map(normalizeHeader);
	const usedFieldNames = new Set();

	const candidateMap = {}; // fieldName -> best match

	// STEP 1: Collect best match per fieldName
	for (let i = 0; i < normalizedHeaders.length; i++) {
		const header = uploadedHeaders[i];
		const normalized = normalizedHeaders[i];

		fieldAliases.forEach((field) => {
			(field.matches || []).forEach((alias, index) => {
				if (normalizeHeader(alias) === normalized) {
					const aliasScore = Math.max(10 - index, 1);
					const fillRatio = calculateFillRatio(sampleRows, header);
					const finalScore = Math.round(aliasScore * fillRatio);

					const candidate = {
						fieldName: field.fieldName,
						valueTitle: field.valueTitle,
						header,
						score: finalScore,
						variant: field.variant,
						required: field.required,
						valueType: field.valueType,
						preview: getPreviewValue(sampleRows, header),
						fillRatio,
						isPrice: validatePrice(sampleRows, header),
						isURL: isValidURL(sampleRows, header),
						manual: false,
					};
					if (
						!candidateMap[field.fieldName] ||
						finalScore > candidateMap[field.fieldName].score
					) {
						candidateMap[field.fieldName] = candidate;
					} else if (
						!candidateMap[field.fieldName] &&
						finalScore > 0 &&
						field.required
					) {
						// fallback: assign something low-quality if it's the only option
						candidateMap[field.fieldName] = candidate;
					}
				}
			});
		});
	}

	// STEP 2: Build mapped array based on best candidates
	const mapped = uploadedHeaders.map((header) => {
		const match = Object.values(candidateMap).find(
			(m) => m.header === header
		);

		if (match) {
			usedFieldNames.add(match.fieldName);
			return match;
		}

		// Unmatched fallback
		return {
			header,
			fieldName: "",
			valueTitle: "",
			score: 0,
			required: false,
			variant: false,
			manual: false,
			preview: getPreviewValue(sampleRows, header),
			fillRatio: calculateFillRatio(sampleRows, header),
			isPrice: validatePrice(sampleRows, header),
			isURL: isValidURL(sampleRows, header),
		};
	});

	// STEP 3: Check for missing required fields
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

	// STEP 4: Apply Department promotion logic
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
			category.required = true;
			category.promotedFrom = "strCategory";

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
			googleCategory.required = true;
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
		unmatched: [], // unused for now
		requiredWarnings,
		allHeaders: uploadedHeaders,
	};
}
