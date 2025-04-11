// This is where we handle all the warnings for the automapper.

export function autoMapperWarningHandler(array) {
	const seen = new Set();
	const duplicates = new Set();
	const matches = []; //Identified scenarios for specific warning badges.
	const warnings = []; //Identified critical issues.

	// is Match, is our SPECIFIC value catch, and application of unique scenarios. like modals and suggestions.
	function isMatch(value) {
		//First we check for specific fieldNames.
		switch (value.fieldName) {
			case "strAttribute1":
				console.log("I GOT A MATCH");
				// code block}
				break;
			default:
			// code block
		}
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
		warnings.push(`Duplicate values found: ${[...duplicates].join(", ")}`);
	}

	// if (matches.length > 0) {
	// 	warnings.push(
	// 		`Matched value "${options.matchValue}" found ${matches.length} time(s)`
	// 	);
	// }

	// Could also return diagnostics or raw lists
	return { warnings, duplicates: [...duplicates], matches };
}
