// linkcrawler.js - logic extracted from legacy app.js file

let foundParams = [];
let scannedPages = new Set();
let startTime;
let crawlTimer;
let progressUpdater;

export async function startCrawl(
	baseUrl,
	searchTerm,
	setStatus,
	setResults,
	setErrors,
	setProgress
) {
	foundParams = [];
	scannedPages = new Set();
	startTime = Date.now();

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
		searchTerm,
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
	searchTerm,
	setStatus,
	setResults,
	setErrors,
	setProgress
) {
	if (scannedPages.has(url)) return;
	scannedPages.add(url);

	setProgress((prev) => ({
		...prev,
		scanned: scannedPages.size,
		remaining: Math.max(prev.total - scannedPages.size, 0),
		percent: (scannedPages.size / (prev.total || 1)) * 100,
	}));

	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`Fetch failed: ${url}`);

		const text = await response.text();
		const found = text
			.split("\n")
			.filter((line) => line.includes(searchTerm));

		found.forEach((line) =>
			foundParams.push({ url, snippet: line.trim() })
		);
		setResults([...foundParams]);

		// Pull all internal links
		const doc = new DOMParser().parseFromString(text, "text/html");
		const links = Array.from(doc.querySelectorAll("a"))
			.map((a) => a.href)
			.filter(
				(href) => href.startsWith(baseUrl) && !scannedPages.has(href)
			);

		setProgress((prev) => ({
			...prev,
			total: scannedPages.size + links.length,
			remaining: links.length,
		}));

		for (const link of links) {
			await crawl(
				link,
				baseUrl,
				searchTerm,
				setStatus,
				setResults,
				setErrors,
				setProgress
			);
		}
	} catch (err) {
		console.error("Error fetching:", url, err);
		setErrors((prev) => ({
			...prev,
			errors: (prev.errors || 0) + 1,
			fetchErrors: (prev.fetchErrors || 0) + 1,
		}));
	}
}

export function downloadCSV() {
	if (!foundParams.length) return;
	const headers = ["URL", "Snippet"];
	const rows = foundParams.map((row) => [
		row.url,
		row.snippet.replace(/\"/g, '"'),
	]);

	let csvContent =
		"data:text/csv;charset=utf-8," +
		headers.join(",") +
		"\n" +
		rows
			.map((r) =>
				r.map((field) => `"${field.replace(/"/g, '""')}"`).join(",")
			)
			.join("\n");

	const encodedUri = encodeURI(csvContent);
	const link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", `crawler_output_${Date.now()}.csv`);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
