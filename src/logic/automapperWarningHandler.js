// This is where we handle all the warnings for the automapper.

export function autoMapperWarningHandler(array) {
	const dataArray = [];
	let parents = false;
	const seen = new Set();
	const duplicates = new Set();
	const matches = []; //Identified scenarios for specific warning badges.
	const warnings = "text"; //Identified critical issues.

	// is Match, is our SPECIFIC value catch, and application of unique scenarios. like modals and suggestions.
	function isMatch(value) {
		//First we check for specific fieldNames.
		switch (value.fieldName) {
			case "strAttribute1":
				if (parents) {
					console.log("multiple parents identified");
				} else {
					parents = true;
					dataArray.push({
						title: "Parent Group Identified",
						type: "success",
						description:
							"Variant Mapping Should be Available.  Click the Variant Mapping button above.",
					});
				}
				break;
			default:
			// code block
		}
	}
	function getMissingRequiredFields(completedFields) {
		const requiredFields = [
			{
				field: "strAttribute1",
				title: "No Parent Group Id",
				type: "info",
				description: "Only Required if mapping in a variant feed",
			},
			{
				field: "strProductName",
				title: "ProductName MISSING",
				type: "danger",
				description: "Required for Feed Import.",
			},
			{
				field: "strProductSKU",
				title: "ProductSKU MISSING",
				type: "danger",
				description: "Required for Feed Import.",
			},
			{
				field: "dblProductPrice",
				title: "ProductPrice MISSING",
				type: "danger",
				description: "Required for Feed Import.",
			},
			{
				field: "txtLongDescription",
				title: "LongDescription MISSING",
				type: "danger",
				description: "Required for Feed Import.",
			},
			{
				field: "strBuyURL",
				title: "BuyURL MISSING",
				type: "danger",
				description: "Required for Feed Import.",
			},
			{
				field: "strLargeImage",
				title: "LargeImage MISSING",
				type: "danger",
				description: "Required for Feed Import.",
			},
			{
				field: "strDepartment",
				title: "Department MISSING",
				type: "danger",
				description: "Required for Feed Import.",
			},
		];

		const result = requiredFields.filter(
			(map) => !completedFields.has(map.field)
		);
		if (result.find((item) => item.field === "strAttribute1")) {
			parents = false;
		}

		return result;
	}

	for (const field of array) {
		const value = field.fieldName;
		// Only check for duplicates if the value is not blank
		if (value && value.trim() !== "") {
			if (seen.has(value)) {
				duplicates.add(value);
			} else {
				seen.add(value);
			}
		}

		// Check for specific fields, or values for specific troubleshooting.
		if (isMatch(field)) {
			matches.push(field);
		}
	}

	if (duplicates.size > 0) {
		console.log("DUPLICATES", duplicates);
		const duplicateWarning = (
			<div>
				The Following Columns have been mapped more than once:
				{[...duplicates].map((d, i) => (
					<code key={i} className="d-block">
						{d}
					</code>
				))}
			</div>
		);
		dataArray.push({
			title: "Duplicated Columns",
			type: "warning",
			description: duplicateWarning,
		});
	}
	const missing = getMissingRequiredFields(seen);
	if (missing) {
		console.log(missing);
		dataArray.push(...missing);
	}
	console.log(dataArray);

	return { dataArray };
}
