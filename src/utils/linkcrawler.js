// linkcrawler.js - scans <a> links recursively for URL parameter matches (e.g., "avad=")
import { CRAWLER_API_URL, CRAWLER_TOKEN } from "./config";
console.log("🔧 CRAWLER_API_URL:", CRAWLER_API_URL);

let foundLinks = [];
let scannedPages = new Set();
let startTime;
let crawlTimer;
const MAX_PAGES = 500;

export async function startCrawl(
	baseUrl,
	searchTerms,
	setStatus,
	setResults,
	setErrors,
	setProgress
) {
	console.log("🚀 startCrawl() triggered");
	foundLinks = [];
	scannedPages = new Set();
	startTime = Date.now();

	console.log("🔍 Base URL:", baseUrl);
	console.log("🔍 Search Terms:", searchTerms);

	setStatus("Crawling...");
	setResults([]);
	setErrors({});
	setProgress({
		percent: 0,
		scanned: 0,
		total: 0,
		remaining: 0,
		eta: "--",
		elapsed: "0 sec",
	});

	crawlTimer = setInterval(() => {
		const elapsed = Math.floor((Date.now() - startTime) / 1000);
		setProgress((prev) => ({ ...prev, elapsed: `${elapsed} sec` }));
	}, 1000);

	await crawl(
		baseUrl,
		baseUrl,
		searchTerms,
		setStatus,
		setResults,
		setErrors,
		setProgress
	);

	clearInterval(crawlTimer);
	setStatus("Crawl completed.");
}

async function crawl(
	url,
	baseUrl,
	searchTerms,
	setStatus,
	setResults,
	setErrors,
	setProgress
) {
	try {
		const normalizedUrl = new URL(url).toString();
		if (scannedPages.has(normalizedUrl)) {
			console.log("♻️ Already scanned:", normalizedUrl);
			return;
		}
		scannedPages.add(normalizedUrl);

		if (scannedPages.size > MAX_PAGES) {
			console.warn("🚫 Max page limit reached.");
			return;
		}

		console.log("🌐 Scanning:", normalizedUrl);
		setProgress((prev) => ({
			...prev,
			scanned: scannedPages.size,
			remaining: Math.max(prev.total - scannedPages.size, 0),
			percent: (scannedPages.size / (prev.total || 1)) * 100,
		}));

		const fetchUrl = `${CRAWLER_API_URL}/fetch?url=${encodeURIComponent(
			normalizedUrl
		)}`;
		console.log("📡 Fetching:", fetchUrl);
		const fetchRes = await fetch(fetchUrl, {
			headers: { "x-api-token": CRAWLER_TOKEN },
		});

		if (!fetchRes.ok) throw new Error(`Fetch failed: ${normalizedUrl}`);

		const text = await fetchRes.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(text, "text/html");
		if (!doc || !doc.querySelectorAll) {
			console.warn("⚠️ DOM parsing failed for:", normalizedUrl);
			return;
		}

		const anchors = Array.from(doc.querySelectorAll("a"));
		let linksToFollow = [];

		anchors.forEach((a) => {
			try {
				const href = a.getAttribute("href");
				if (!href || href.startsWith("#") || href.startsWith("mailto:"))
					return;
				const absoluteUrl = new URL(href, normalizedUrl).href.split(
					"#"
				)[0];
				if (scannedPages.has(absoluteUrl)) return;

				const matched = searchTerms.some((term) =>
					absoluteUrl.includes(term)
				);
				if (matched) {
					const urlObj = new URL(absoluteUrl);
					const params = new URLSearchParams(urlObj.search);
					foundLinks.push({
						page: normalizedUrl,
						href: absoluteUrl,
						anchorText: a.textContent.trim() || "No anchor text",
						title: a.getAttribute("title") || "No title",
						rel: a.getAttribute("rel") || "",
						url: urlObj.origin + urlObj.pathname,
						merchant_id: params.get("merchant_id") || null,
						website_id: params.get("website_id") || null,
						avad: params.get("avad") || null,
						ctc: params.get("ctc") || null,
					});
					setResults([...foundLinks]);
					console.log(`✅ Found match: ${absoluteUrl}`);
				}

				if (absoluteUrl.startsWith(baseUrl)) {
					linksToFollow.push(absoluteUrl);
				}
			} catch (e) {
				console.warn("⛔ Skipping bad href:", e.message);
			}
		});

		setProgress((prev) => ({
			...prev,
			total: scannedPages.size + linksToFollow.length,
			remaining: linksToFollow.length,
		}));

		for (const link of linksToFollow) {
			await crawl(
				link,
				baseUrl,
				searchTerms,
				setStatus,
				setResults,
				setErrors,
				setProgress
			);
		}
	} catch (err) {
		console.error("❌ Error fetching:", url, err);
		setErrors((prev) => ({
			...prev,
			errors: (prev.errors || 0) + 1,
			fetchErrors: (prev.fetchErrors || 0) + 1,
		}));
	}
}

export function downloadCSV() {
	if (!foundLinks.length) return;
	const headers = [
		"Page",
		"Href",
		"Anchor Text",
		"Title",
		"Rel",
		"URL",
		"Merchant ID",
		"Website ID",
		"AVAD",
		"CTC",
	];

	const rows = foundLinks.map((link) => [
		link.page,
		link.href,
		link.anchorText,
		link.title,
		link.rel,
		link.url,
		link.merchant_id,
		link.website_id,
		link.avad,
		link.ctc,
	]);

	let csvContent =
		"data:text/csv;charset=utf-8," +
		headers.join(",") +
		"\n" +
		rows
			.map((r) => r.map((field) => `"${field ?? ""}"`).join(","))
			.join("\n");

	const encodedUri = encodeURI(csvContent);
	const link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", `crawler_output_${Date.now()}.csv`);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
