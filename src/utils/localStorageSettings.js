// src/utils/localStorageSettings.js

const SETTINGS_KEY = "ChettiToolsSettings";

/**
 * Load full settings object from localStorage
 */
export function getSettings() {
	try {
		const stored = localStorage.getItem(SETTINGS_KEY);
		return stored ? JSON.parse(stored) : getDefaultSettings();
	} catch (err) {
		console.error("Failed to load settings:", err);
		return getDefaultSettings();
	}
}

/**
 * Save full settings object to localStorage
 */
export function saveSettings(newSettings) {
	try {
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
	} catch (err) {
		console.error("Failed to save settings:", err);
	}
}

/**
 * Return default structure
 */
export function getDefaultSettings() {
	return {
		commonMerchants: [],
		customReports: {},
	};
}

/**
 * Add a merchant to the commonMerchants list
 */
export function addCommonMerchant(merchantId) {
	const settings = getSettings();
	if (!settings.commonMerchants.includes(merchantId)) {
		settings.commonMerchants.push(merchantId);
		saveSettings(settings);
	}
}

/**
 * Remove a merchant from commonMerchants list
 */
export function removeCommonMerchant(merchantId) {
	const settings = getSettings();
	settings.commonMerchants = settings.commonMerchants.filter(
		(id) => id !== merchantId
	);
	saveSettings(settings);
}

/**
 * Add or update a custom report
 */
export function addCustomReport(categoryName, reportName, reportData) {
	const settings = getSettings();
	if (!settings.customReports) {
		settings.customReports = {};
	}
	if (!settings.customReports[categoryName]) {
		settings.customReports[categoryName] = {};
	}
	settings.customReports[categoryName][reportName] = reportData;
	saveSettings(settings);
}

/**
 * Remove a custom report
 */
export function removeCustomReport(categoryName, reportName) {
	const settings = getSettings();
	if (settings.customReports[categoryName]) {
		delete settings.customReports[categoryName][reportName];

		// If the category is now empty, delete it entirely
		if (Object.keys(settings.customReports[categoryName]).length === 0) {
			delete settings.customReports[categoryName];
		}
		saveSettings(settings);
	}
}
