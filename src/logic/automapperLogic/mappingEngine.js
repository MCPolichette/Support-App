import { calculateFillRatio, validatePrice, isValidURL } from "./automapperUtils";
import fieldAliases from "./fieldAliases.json";

function normalizeHeader(header = "") {
	return header.toLowerCase().replace(/["']/g, "")
		.replace(/[\s_-]+/g, "").replace(/(variant|catalog|item|product)/g, "").trim();
}

function fieldDetails(field) {
	return {
		fieldName: field.fieldName, valueTitle: field.valueTitle,
		variant: field.variant || "", required: !!field.required,
		valueType: field.valueType || "string",
	};
}

// Populated candidates beat empty ones; header strength then determines the winner.
// Equal header matches use fill ratio, then original column order.
function compareCandidates(a, b) {
	return Number(b.fillRatio > 0) - Number(a.fillRatio > 0) ||
		b.headerScore - a.headerScore || b.fillRatio - a.fillRatio ||
		a.columnIndex - b.columnIndex || a.fieldIndex - b.fieldIndex;
}

export function assignField(mapping, columnIndex, fieldName, custom = {}) {
	if (fieldName && mapping.some(row => row.columnIndex !== columnIndex && row.fieldName === fieldName)) {
		return mapping; // Keep the first assignment; never silently move another column.
	}
	const field = fieldAliases.find(item => item.fieldName === fieldName) || {
		fieldName, valueTitle: fieldName, valueType: "string",
	};
	return mapping.map(row => row.columnIndex === columnIndex ? {
		...row, ...fieldDetails(field), valueTitle: custom.valueTitle || field.valueTitle,
		manual: true, score: "NA", assignmentNote: undefined, promotedFrom: undefined,
	} : row);
}

export default function autoMapHeaders(uploadedHeaders = [], sampleRows = []) {
	const mapped = uploadedHeaders.map((header, columnIndex) => {
		const value = sampleRows.map(row => row[header]).find(value =>
			value !== null && value !== undefined && String(value).trim() !== "");
		const preview = value === undefined ? "" : String(value).trim();
		return {
			header, columnIndex, fieldName: "", valueTitle: "", variant: "",
			required: false, manual: false, score: 0, preview,
			fillRatio: calculateFillRatio(sampleRows, header),
			isPrice: validatePrice(sampleRows, header), isURL: isValidURL(preview),
		};
	});
	const candidates = [];
	for (const row of mapped) {
		fieldAliases.forEach((field, fieldIndex) => {
			if (!field.fieldName) return;
			const aliases = [...new Set((field.matches || []).map(normalizeHeader))];
			const aliasIndex = aliases.indexOf(normalizeHeader(row.header));
			if (aliasIndex < 0) return;
			candidates.push({ ...row, field, fieldIndex, headerScore: Math.max(10 - aliasIndex, 1) });
		});
	}
	const usedFields = new Set();
	const usedColumns = new Set();
	for (const candidate of candidates.sort(compareCandidates)) {
		if (usedFields.has(candidate.field.fieldName) || usedColumns.has(candidate.columnIndex)) continue;
		usedFields.add(candidate.field.fieldName);
		usedColumns.add(candidate.columnIndex);
		const row = mapped[candidate.columnIndex];
		Object.assign(row, fieldDetails(candidate.field), { score: candidate.headerScore });
		const alternatives = candidates.filter(other =>
			other.field.fieldName === candidate.field.fieldName && other.columnIndex !== candidate.columnIndex);
		if (alternatives.length) {
			const runnerUp = alternatives[0];
			const reason = candidate.fillRatio > 0 && runnerUp.fillRatio === 0
				? "it contained data while the other candidate columns were empty in the sampled rows"
				: candidate.headerScore > runnerUp.headerScore ? "it had the stronger header match"
				: candidate.fillRatio > runnerUp.fillRatio ? "the header matches tied and it had more populated sampled rows"
				: "the matches tied and it appeared first in the file";
			row.assignmentNote = {
				title: `${candidate.field.valueTitle}: competing columns`, type: "info",
				description: `${[candidate, ...alternatives].map(item => `"${item.header}" (column ${item.columnIndex + 1})`).join(", ")} could fit this field. Assigned "${candidate.header}" because ${reason}. Only one column was assigned to this field.`,
			};
		}
	}

	const price = mapped.find(row => row.fieldName === "dblProductPrice");
	const salePrice = mapped.find(row => row.fieldName === "dblProductSalePrice");
	if ((!price || price.fillRatio === 0) && salePrice?.fillRatio > 0) {
		if (price) Object.assign(price, { fieldName: "", valueTitle: "", variant: "", required: false, assignmentNote: undefined });
		Object.assign(salePrice, fieldDetails(fieldAliases.find(field => field.fieldName === "dblProductPrice")), {
			assignmentNote: {
				title: "Sale price used as Price", type: "info",
				description: `${price ? `The regular price column "${price.header}" was empty in the sampled rows.` : "No regular price column was found."} Assigned "${salePrice.header}" as required Price because it was the only available price type with data.`,
			},
		});
	}

	// Preserve the existing category fallback, using the field catalog's spelling.
	if (!mapped.some(row => row.fieldName === "strDepartment")) {
		const category = mapped.find(row => row.fieldName === "strCategory" && row.fillRatio > 0.3);
		const subcategory = mapped.find(row => row.fieldName === "strSubCategory" && row.fillRatio > 0.3);
		const google = mapped.find(row => row.header.toLowerCase().includes("google") && row.fillRatio > 0.3);
		const fallback = category || google;
		if (fallback) {
			Object.assign(fallback, fieldDetails(fieldAliases.find(field => field.fieldName === "strDepartment")));
			if (category && subcategory) Object.assign(subcategory, fieldDetails(fieldAliases.find(field => field.fieldName === "strCategory")));
		}
	}
	const requiredWarnings = fieldAliases.filter(field => field.required && !mapped.some(row => row.fieldName === field.fieldName))
		.map(field => ({ fieldName: field.fieldName, valueTitle: field.valueTitle, message: "Required field not matched" }));
	return { mapped, requiredWarnings, warnings: requiredWarnings, allHeaders: uploadedHeaders, unmatched: mapped.filter(row => !row.fieldName) };
}
