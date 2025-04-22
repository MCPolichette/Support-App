import { runAPI } from "./apiRunner";

export function adminReportAPI(params, merchant) {
	const browserStorage = localStorage.getItem(browserStorage);
	const Report_id = params.report_id;
	switch (Report_id) {
		case 18:
			console.log("Product Sold Report");
			const report = runAPI(params, browserStorage.key, merchant);
			return report;

		//
	}
}

// *******************************************
// ALL MERCHANT REPORT IDS (for reference)
// *******************************************
// 1 "   Performance Summary"
// 24   " Performance Summary By Ad Campaign"
// 100   " Performance Summary By Discount"
// 9   " Performance Summary By Ad Tool"
// 15   " Performance Summary By Affiliate"
// 25   " Performance Summary by Affiliate Tag Group"
// 20   " Performance Summary By Affiliate Website"
// 22   " Performance Summary By Custom Tracking Code"
// 12   " Performance Summary By Day"
// 29   " Performance Summary By Hour"
// 48   " Performance Summary By Month"
// 31   " Performance Summary By Product Ad Tools"
// 96   " Performance Summary By Sub Affiliate Partners"
// 50   " Performance Summary By Week"
// 63   " Calendar Period Trending"
// 65   " Calendar Period Trending By Affiliate"
// 66   " Calendar Period Trending By Affiliate Website"
// 67   " Rolling Period Trending"
// 69   " Rolling Period Trending By Affiliate"
// 70   " Rolling Period Trending By Affiliate Website"
// 85   " Affiliate Application Approvals"
// 2   " Ad Impressions (Summary)"
// 3   " Ad Impressions (Detail)"
// 5   " Click Throughs (Summary)"
// 6   " Click Throughs (Detail)"
// 79   " Referral Domain By Affiliate"
// 72   " Last Click Through to Sale Summary"
// 83   " First Click Through to Sale Summary"
// 8   " Sales/Commissions (Detail)"
// 19   " Sale Hit Tracking Trails"
// 16   " Datafeed Download Summary"
// 23   " Invalid Affiliate Links"
