// 📁 utils/domainCrawler.js

import { CRAWLER_API_URL, CRAWLER_TOKEN } from "../utils/config";
import * as cheerio from "cheerio";

const RATE_LIMIT = 300; // ms between page requests

let scannedPages = new Set();
let foundLinks = [];
let pendingRequests = 0;
let totalPagesDiscovered = 0;
let startTime;
let elapsedInterval;
let errorData = { errors: 0, fetchErrors: 0, serverErrors: 0 };

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function startCrawl(
	url,
	searchTerm,
	setStatus,
	setResults,
	setErrors,
	setProgress
) {
	scannedPages.clear();
	foundLinks = [];
	pendingRequests = 0;
	totalPagesDiscovered = 0;
	startTime = Date.now();
	errorData = { errors: 0, fetchErrors: 0, serverErrors: 0 };

	if (!url || !searchTerm) {
		alert("Please enter both a URL and a search term.");
		return;
	}

	console.log("🚀 Starting full scan...");
	setStatus("Starting scan...");
	if (typeof setProgress === "function") {
		setProgress({ remaining: 0, eta: "Calculating...", elapsed: "0 sec" });
	}

	elapsedInterval = setInterval(() => updateProgress(setProgress), 1000);
	const baseDomain = new URL(url).origin;

	await crawlPage(url, searchTerm, baseDomain, setProgress);

	clearInterval(elapsedInterval);
	setStatus("✅ Done");
	if (typeof setProgress === "function") {
		setProgress((prev) => ({ ...prev, percent: 100 }));
	}
	setResults([...foundLinks]);
	setErrors({ ...errorData });
}

async function crawlPage(pageUrl, searchTerm, baseDomain, setProgress) {
	const normalizedUrl = normalizeUrl(pageUrl);
	if (scannedPages.has(normalizedUrl)) return;

	scannedPages.add(normalizedUrl);
	console.log(scannedPages + "ScannedPAges");

	pendingRequests++;
	totalPagesDiscovered++;

	updateProgress(setProgress);
	console.log(`🌐 Scanning: ${normalizedUrl}`);

	try {
		const proxyUrl = `${CRAWLER_API_URL}/fetch?url=${encodeURIComponent(
			normalizedUrl
		)}`;

		console.log(`📱 Fetching: ${proxyUrl}`);
		const res = await fetch(proxyUrl, {
			headers: { "x-api-token": CRAWLER_TOKEN },
		});
		console.log("ATTENTION ATTENTION ATTENTION ATTENTION");
		console.log(res.body);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const html = await res.text();
		console.log("🔍 HTML snapshot:", html.slice(0, 300));

		const $ = cheerio.load(html);
		const links = $("a");
		console.log(`🔗 Found ${links.length} <a> tags on ${normalizedUrl}`);

		const linkCountMap = {};

		links.each(async (_, link) => {
			const href = $(link).attr("href");
			const rel = $(link).attr("rel") || "No rel attribute";

			if (!href) return;

			let absoluteUrl;
			try {
				absoluteUrl = normalizeUrl(new URL(href, normalizedUrl).href);
			} catch {
				console.log(`❌ Skipping invalid URL: ${href}`);
				return;
			}

			if (
				href.startsWith("#") ||
				absoluteUrl.endsWith("/#") ||
				absoluteUrl === `${normalizedUrl}#` ||
				!absoluteUrl.startsWith("http")
			) {
				return;
			}

			linkCountMap[absoluteUrl] = (linkCountMap[absoluteUrl] || 0) + 1;

			const isInternal = absoluteUrl.startsWith(baseDomain);
			const linkText = $(link).text().trim();

			if (isInternal) {
				console.log(`🏠 Internal link: ${absoluteUrl}`);
				if (!scannedPages.has(absoluteUrl)) {
					scannedPages.add(absoluteUrl);
					await delay(RATE_LIMIT);
					await crawlPage(
						absoluteUrl,
						searchTerm,
						baseDomain,
						setProgress
					);
				}
			} else {
				console.log(`🌐 External link: ${absoluteUrl}`);

				const matches =
					absoluteUrl
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					linkText.toLowerCase().includes(searchTerm.toLowerCase());

				if (matches) {
					const count = linkCountMap[absoluteUrl];
					foundLinks.push({
						page: normalizedUrl,
						href: absoluteUrl,
						rel,
						count,
						match: searchTerm,
					});
					console.log(
						`✅ Matched external link: ${absoluteUrl} (x${count})`
					);
				}
			}
		});
	} catch (error) {
		errorData.errors++;
		if (error.message.includes("500")) errorData.serverErrors++;
		else errorData.fetchErrors++;
		console.error(`❌ Error scanning ${normalizedUrl}:`, error);
	} finally {
		pendingRequests--;
		updateProgress(setProgress);
		checkCompletion();
	}
}

function normalizeUrl(url) {
	try {
		let u = new URL(url);
		u.hash = "";
		u.searchParams.sort();
		return u.href.replace(/\/$/, "");
	} catch {
		return url;
	}
}

function updateProgress(setProgress) {
	if (typeof setProgress !== "function") return;

	const elapsed = Math.floor((Date.now() - startTime) / 1000);
	const scanned = scannedPages.size;
	const percent =
		totalPagesDiscovered === 0 ? 0 : (scanned / totalPagesDiscovered) * 100;
	const eta =
		pendingRequests > 0
			? `${Math.ceil((elapsed / scanned) * pendingRequests)}s`
			: "--";

	setProgress({
		percent,
		scanned,
		total: totalPagesDiscovered,
		remaining: pendingRequests,
		eta,
		elapsed: `${elapsed} sec`,
	});
}

function checkCompletion() {
	if (pendingRequests === 0) {
		console.log("🎉 Scan complete!");
		clearInterval(elapsedInterval);
	}
}
