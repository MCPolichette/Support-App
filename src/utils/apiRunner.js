// utils/apiRunner.js

export async function runAPI(params, API_KEY, merchant) {
	const {
		report_id,
		startDate,
		endDate,
		networkCode,
		merchant_id,
		merchant_parent_id,
		affiliate_id,
		website_id,
		affiliate_group_id,
	} = applyDefaults({ ...params, merchant_id: merchant?.id });
	console.log(
		"API SENT",
		report_id,
		"Line 16 in // utils/apiRunner.js for Troubleshoting."
	);

	const networkParam = getNetworkParam(networkCode);

	const url =
		`https://classic.avantlink.com/api.php?module=AdminReport` +
		`&auth_key=${API_KEY}` +
		`&merchant_id=${merchant_id}` +
		`&merchant_parent_id=${merchant_parent_id}` +
		`&affiliate_id=${affiliate_id}` +
		`&website_id=${website_id}` +
		`&date_begin=${startDate}` +
		`&date_end=${endDate}` +
		`&affiliate_group_id=${affiliate_group_id}` +
		`&report_id=${report_id}` +
		`&output=xml${networkParam}`;

	try {
		const response = await fetch(url);
		const text = await response.text();
		const xmlDoc = new window.DOMParser().parseFromString(text, "text/xml");
		console.log(xmlDoc);
		const adminVerification = localStorage.getItem("ChettiToolsSettings");
		adminVerification.admin = true;
		return xmlDoc;
	} catch (error) {
		console.error("Error fetching API:", error);
	}
}

function applyDefaults(params) {
	return {
		merchant_id: params.merchant_id ?? 0,
		merchant_parent_id: params.merchant_parent_id ?? 0,
		affiliate_id: params.affiliate_id ?? 0,
		website_id: params.website_id ?? 0,
		affiliate_group_id: params.affiliate_group_id ?? 0,
		report_id: params.report_id,
		startDate: params.startDate,
		endDate: params.endDate,
		type: params.type,
		networkCode: params.networkCode,
	};
}

function getNetworkParam(code) {
	switch (code) {
		case "CA":
			return "&filter_network=CA";
		case "AU":
			return "&filter_network=AU";
		case "US":
		default:
			return ""; // US is default/no param
	}
}
