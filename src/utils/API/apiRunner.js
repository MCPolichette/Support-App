// utils/apiRunner.js
import { getSettings } from "./_AdminApiModules";

export async function runAPI(params, API_KEY, merchantId, network) {
	const settings = getSettings();
	console.log(params);
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
	} = applyDefaults({
		...params,
		merchant_id: merchantId,
		networkCode: network,
	});

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
		`&output=json${networkParam}`;
	console.log(url);
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error("API returned error status");
		const json = await response.json();

		return json;
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
