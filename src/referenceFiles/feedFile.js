// feedfile.js - Stores feed data
export const feedfile = {
	settings: {
		rows_to_check: 150,
	},
	maps: {
		complete: false,
		import_map: [],
		merchant_layout: [],
		data_rows: [],
		variant_map: [],
		map_for_variants: [],
		blank_columns: [],
		contains_empty_values: [],
		required_fields: [
			"strDepartment",
			"strProductSKU",
			"strProductName",
			"dblProductPrice",
			"strLargeImage",
			"txtLongDescription",
			"strBuyURL",
		],
	},
	fileInfo: {
		File_Name: { label: "File Name", value: "" },
		File_Size: { label: "File Size", value: "" },
		File_Type: { label: "File Type", value: "" },
		Number_of_Columns: { label: "Columns", value: 0 },
		Delimiter: { label: "Delimiter", value: "" },
	},
};
