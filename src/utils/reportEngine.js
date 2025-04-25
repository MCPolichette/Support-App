import { runAPI } from "./apiRunner";
import { getSettings } from "./_AdminApiModules";

export async function adminReportAPI({
	selectedModules,
	startDate,
	endDate,
	previousStartDate,
	previousEndDate,
	merchant,
	updateProgress = () => {},
}) {
	const results = {};

	for (const [name, mod] of selectedModules) {
		try {
			updateProgress(`Running ${name.replace(/_/g, " ")}`);

			const current = await runAPI(
				{ startDate, endDate, report_id: mod.id },
				getSettings().key,
				merchant
			);
			results[`${name}_current`] = current;

			// const previous = await runAPI(
			// 	{
			// 		startDate: previousStartDate,
			// 		endDate: previousEndDate,
			// 		report_id: mod.id,
			// 	},
			// 	getSettings().key,
			// 	merchant
			// );
			// results[`${name}_previous`] = previous;
			updateProgress(`${name} ✅`);
		} catch (error) {
			console.error(`${name} failed`, error);
			updateProgress(`${name} ❌`);
		}
	}

	return results;
}

export function comparisonDisplaySwitch(reportName, reportResults) {
	const dispSettings = {};

	switch (reportName) {
		case "Performance_Summary":
			dispSettings.currentReport =
				reportResults.Performance_Summary_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Performance_Summary_previous;
			dispSettings.headers = [
				"Ad Impressions",
				"Click Throughs",
				"Sales",
				"# of Sales",
				"Mobile Sales",
				"# of Mobile Sales",
				"Commissions",
				"Incentives",
				"Network Commissions",
				"# of Adjustments",
				"Conversion Rate",
				"New Customers",
				"New Customer %",
				"New Customer Sales",
				"Average Sale Amount",
				"Click Through Rate",
				"CPC Earnings",
				"Network CPC Earnings",
				"Placement Earnings",
			];
			dispSettings.sortBy = "# of Sales";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 1;
			dispSettings.title = "Performance Summary";

			break;

		case "Performance_Summary_By_Ad_Campaign":
			dispSettings.currentReport =
				reportResults.Performance_Summary_By_Ad_Campaign_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Performance_Summary_By_Ad_Campaign_previous;
			dispSettings.headers = [
				"Merchant",
				"Merchant Id",
				"Ad Id",
				"Ad Type",
				"Ad Campaign/Subscription",
				"Ad Impressions",
				"Click Throughs",
				"Sales",
				"# of Sales ?",
				"Mobile Sales",
				"# of Mobile Sales ?",
				"Commissions",
				"Incentives",
				"Network Commissions",
				"# of Adjustments",
				"Conversion Rate",
				"New Customers ?",
				"New Customer %",
				"New Customer Sales",
				"Average Sale Amount",
				"Click Through Rate",
			];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Performance_Summary_By_Ad_Campaign";

			break;

		case "Performance_Summary_By_Discount":
			dispSettings.currentReport =
				reportResults.Performance_Summary_By_Discount_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Performance_Summary_By_Discount_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Performance_Summary_By_Discount";

			break;

		case "Performance_Summary_By_Ad_Tool":
			dispSettings.currentReport =
				reportResults.Performance_Summary_By_Ad_Tool_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Performance_Summary_By_Ad_Tool_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Performance_Summary_By_Ad_Tool";

			break;

		case "Performance_Summary_By_Affiliate":
			dispSettings.currentReport =
				reportResults.Performance_Summary_By_Affiliate_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Performance_Summary_By_Affiliate_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Performance_Summary_By_Affiliate";

			break;

		case "Performance_Summary_by_Affiliate_Tag_Group":
			dispSettings.currentReport =
				reportResults.Performance_Summary_by_Affiliate_Tag_Group_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Performance_Summary_by_Affiliate_Tag_Group_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Performance_Summary_by_Affiliate_Tag_Group";

			break;

		case "Performance_Summary_By_Affiliate_Website":
			dispSettings.currentReport =
				reportResults.Performance_Summary_By_Affiliate_Website_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Performance_Summary_By_Affiliate_Website_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Performance_Summary_By_Affiliate_Website";

			break;

		case "Performance_Summary_By_Custom_Tracking_Code":
			dispSettings.currentReport =
				reportResults.Performance_Summary_By_Custom_Tracking_Code_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Performance_Summary_By_Custom_Tracking_Code_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Performance_Summary_By_Custom_Tracking_Code";

			break;
		case "Performance_Summary_By_Day":
			dispSettings.currentReport =
				reportResults.Performance_Summary_By_Day_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Performance_Summary_By_Day_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Performance_Summary_By_Day";

			break;

		case "Performance_Summary_By_Hour":
			dispSettings.currentReport =
				reportResults.Performance_Summary_By_Hour_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Performance_Summary_By_Hour_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Performance_Summary_By_Hour";

			break;

		case "Performance_Summary_By_Month":
			dispSettings.currentReport =
				reportResults.Performance_Summary_By_Month_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Performance_Summary_By_Month_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Performance_Summary_By_Month";

			break;

		case "Performance_Summary_By_Product_Ad_Tools":
			dispSettings.currentReport =
				reportResults.Performance_Summary_By_Product_Ad_Tools_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Performance_Summary_By_Product_Ad_Tools_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Performance_Summary_By_Product_Ad_Tools";

			break;

		case "Performance_Summary_By_Sub_Affiliate_Partners":
			dispSettings.currentReport =
				reportResults.Performance_Summary_By_Sub_Affiliate_Partners_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Performance_Summary_By_Sub_Affiliate_Partners_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title =
				"Performance_Summary_By_Sub_Affiliate_Partners";

			break;
		case "Performance_Summary_By_Week":
			dispSettings.currentReport =
				reportResults.Performance_Summary_By_Week_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Performance_Summary_By_Week_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Performance_Summary_By_Week";

			break;

		case "Calendar_Period_Trending":
			dispSettings.currentReport =
				reportResults.Calendar_Period_Trending_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Calendar_Period_Trending_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Calendar_Period_Trending";

			break;

		case "Calendar_Period_Trending_By_Affiliate":
			dispSettings.currentReport =
				reportResults.Calendar_Period_Trending_By_Affiliate_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Calendar_Period_Trending_By_Affiliate_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Calendar_Period_Trending_By_Affiliate";

			break;

		case "Calendar_Period_Trending_By_Affiliate_Website":
			dispSettings.currentReport =
				reportResults.Calendar_Period_Trending_By_Affiliate_Website_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Calendar_Period_Trending_By_Affiliate_Website_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title =
				"Calendar_Period_Trending_By_Affiliate_Website";

			break;
		case "Rolling_Period_Trending":
			dispSettings.currentReport =
				reportResults.Rolling_Period_Trending_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Rolling_Period_Trending_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Rolling_Period_Trending";

			break;

		case "Rolling_Period_Trending_By_Affiliate":
			dispSettings.currentReport =
				reportResults.Rolling_Period_Trending_By_Affiliate_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Rolling_Period_Trending_By_Affiliate_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Rolling_Period_Trending_By_Affiliate";

			break;

		case "Rolling_Period_Trending_By_Affiliate_Website":
			dispSettings.currentReport =
				reportResults.Rolling_Period_Trending_By_Affiliate_Website_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Rolling_Period_Trending_By_Affiliate_Website_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Rolling_Period_Trending_By_Affiliate_Website";

			break;

		case "Affiliate_Application_Approvals":
			dispSettings.currentReport =
				reportResults.Affiliate_Application_Approvals_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Affiliate_Application_Approvals_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Affiliate_Application_Approvals";

			break;

		case "Ad_Impressions_Summary":
			dispSettings.currentReport =
				reportResults.Ad_Impressions_Summary_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Ad_Impressions_Summary_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Ad_Impressions_Summary";

			break;

		case "Ad_Impressions_Detail":
			dispSettings.currentReport =
				reportResults.Ad_Impressions_Detail_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Ad_Impressions_Detail_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Ad_Impressions_Detail";

			break;

		case "Click_Throughs_Summary":
			dispSettings.currentReport =
				reportResults.Click_Throughs_Summary_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Click_Throughs_Summary_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Click_Throughs_Summary";

			break;

		case "Click_Throughs_Detail":
			dispSettings.currentReport =
				reportResults.Click_Throughs_Detail_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Click_Throughs_Detail_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Click_Throughs_Detail";

			break;

		case "Referral_Domain_By_Affiliate":
			dispSettings.currentReport =
				reportResults.Referral_Domain_By_Affiliate_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Referral_Domain_By_Affiliate_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Referral_Domain_By_Affiliate";

			break;

		case "Last_Click_Through_to_Sale_Summary":
			dispSettings.currentReport =
				reportResults.Last_Click_Through_to_Sale_Summary_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Last_Click_Through_to_Sale_Summary_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Last_Click_Through_to_Sale_Summary";

			break;

		case "First_Click_Through_to_Sale_Summary":
			dispSettings.currentReport =
				reportResults.First_Click_Through_to_Sale_Summary_current;
			dispSettings.PreviousPeriodReport =
				reportResults.First_Click_Through_to_Sale_Summary_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "First_Click_Through_to_Sale_Summary";

			break;

		case "Sales_Commissions_Detail":
			dispSettings.currentReport =
				reportResults.Sales_Commissions_Detail_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Sales_Commissions_Detail_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Sales_Commissions_Detail";

			break;

		case "Sale_Hit_Tracking_Trails":
			dispSettings.currentReport =
				reportResults.Sale_Hit_Tracking_Trails_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Sale_Hit_Tracking_Trails_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Sale_Hit_Tracking_Trails";

			break;

		case "Datafeed_Download_Summary":
			dispSettings.currentReport =
				reportResults.Datafeed_Download_Summary_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Datafeed_Download_Summary_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Datafeed_Download_Summary";

			break;

		case "Invalid_Affiliate_Links":
			dispSettings.currentReport =
				reportResults.Invalid_Affiliate_Links_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Invalid_Affiliate_Links_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Invalid_Affiliate_Links";

			break;

		case "Product_Sold":
			dispSettings.currentReport = reportResults.Product_Sold_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Product_Sold_previous;
			dispSettings.headers = ["Sales", "# of Sales"];
			dispSettings.sortBy = "# of Sales";
			dispSettings.mergeBy = "Product Sku";
			dispSettings.staticDisplay = ["Product Name", "Product SKU"];
			dispSettings.limit = 100;
			dispSettings.title = "Products Sold Report";

			break;

		case "Outlet_Summary":
			dispSettings.currentReport = reportResults.Outlet_Summary_current;
			dispSettings.PreviousPeriodReport =
				reportResults.Outlet_Summary_previous;
			dispSettings.headers = [];
			dispSettings.sortBy = "";
			dispSettings.mergeBy = "Store Name";
			dispSettings.staticDisplay = [];
			dispSettings.limit = 100;
			dispSettings.title = "Outlet_Summary";

			break;
	}
}
