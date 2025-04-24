export const getSettings = () => {
	try {
		const raw = localStorage.getItem("ChettiToolsSettings");
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
};

export const _adminApiModules = {
	Performance_Summary: { id: 1, inReport: true },
	Performance_Summary_By_Ad_Campaign: { id: 24, inReport: false },
	Performance_Summary_By_Discount: { id: 100, inReport: false },
	Performance_Summary_By_Ad_Tool: { id: 9, inReport: false },
	Performance_Summary_By_Affiliate: { id: 15, inReport: true },
	Performance_Summary_by_Affiliate_Tag_Group: { id: 25, inReport: false },
	Performance_Summary_By_Affiliate_Website: { id: 20, inReport: true },
	Performance_Summary_By_Custom_Tracking_Code: {
		id: 22,
		inReport: false,
	},
	Performance_Summary_By_Day: { id: 12, inReport: false },
	Performance_Summary_By_Hour: { id: 29, inReport: false },
	Performance_Summary_By_Month: { id: 48, inReport: false },
	Performance_Summary_By_Product_Ad_Tools: { id: 31, inReport: false },
	Performance_Summary_By_Sub_Affiliate_Partners: {
		id: 96,
		inReport: false,
	},
	Performance_Summary_By_Week: { id: 50, inReport: false },
	Calendar_Period_Trending: { id: 63, inReport: false },
	Calendar_Period_Trending_By_Affiliate: { id: 65, inReport: false },
	Calendar_Period_Trending_By_Affiliate_Website: {
		id: 66,
		inReport: false,
	},
	Rolling_Period_Trending: { id: 67, inReport: false },
	Rolling_Period_Trending_By_Affiliate: { id: 69, inReport: false },
	Rolling_Period_Trending_By_Affiliate_Website: {
		id: 70,
		inReport: false,
	},
	Affiliate_Application_Approvals: { id: 85, inReport: false },
	Ad_Impressions_Summary: { id: 2, inReport: false },
	Ad_Impressions_Detail: { id: 3, inReport: false },
	Click_Throughs_Summary: { id: 5, inReport: false },
	Click_Throughs_Detail: { id: 6, inReport: false },
	Referral_Domain_By_Affiliate: { id: 79, inReport: false },
	Last_Click_Through_to_Sale_Summary: { id: 72, inReport: false },
	First_Click_Through_to_Sale_Summary: { id: 83, inReport: false },
	Sales_Commissions_Detail: { id: 8, inReport: false },
	Sale_Hit_Tracking_Trails: { id: 19, inReport: false },
	Datafeed_Download_Summary: { id: 16, inReport: false },
	Invalid_Affiliate_Links: { id: 23, inReport: false },
	Product_Sold: { id: 18, inReport: true },
	Outlet_Summary: { id: 90, inReport: false },
};
