import React, { useState, useEffect } from "react";
import { startCrawl, downloadCSV } from "../utils/linkcrawler";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CrawlerPage() {
	const [url, setUrl] = useState("");
	const [searchTerm, setSearchTerm] = useState("avad");
	const [status, setStatus] = useState("Idle");
	const [results, setResults] = useState([]);
	const [errors, setErrors] = useState({});
	const [progress, setProgress] = useState({
		percent: 0,
		scanned: 0,
		total: 0,
		remaining: 0,
		eta: "--",
		elapsed: "0 sec",
	});
	const [serverOnline, setServerOnline] = useState(false);

	useEffect(() => {
		const checkStatus = async () => {
			try {
				const res = await fetch("/status");
				setServerOnline(res.ok);
				console.log("✅ Server status:", res.status, await res.text());
			} catch (err) {
				console.error("Status check failed:", err);
				setServerOnline(false);
			}
		};
		checkStatus();
	}, []);

	const handleStart = () => {
		if (!url || !searchTerm)
			return alert("Enter both URL and search terms");
		try {
			const formatted = url.startsWith("http") ? url : `https://${url}`;
			const u = new URL(formatted);
			console.log("🎯 Triggering crawl with:", u.href, searchTerm);
			startCrawl(
				u.href,
				searchTerm,
				setStatus,
				setResults,
				setErrors,
				setProgress
			);
		} catch (e) {
			alert("Invalid URL format");
		}
	};

	return (
		<div style={{ padding: "2rem" }}>
			<h1>🔎 Parameter Scanner</h1>
			<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
				<span>
					Server:{" "}
					<strong style={{ color: serverOnline ? "green" : "red" }}>
						{serverOnline ? "Online" : "Offline"}
					</strong>
				</span>
				{status !== "Idle" && <LoadingSpinner />}
			</div>

			<div style={{ marginTop: "1rem" }}>
				<input
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder="Enter website URL (e.g., https://example.com)"
					style={{ width: "400px", padding: "0.5rem" }}
				/>
				<br />
				<input
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Search parameters (comma-separated, e.g., avad,merchant_id)"
					style={{
						width: "400px",
						padding: "0.5rem",
						marginTop: "0.5rem",
					}}
				/>
				<br />
				<button style={{ marginTop: "1rem" }} onClick={handleStart}>
					Start Crawl
				</button>
				<button
					onClick={downloadCSV}
					style={{ marginLeft: "1rem" }}
					disabled={results.length === 0}
				>
					Download CSV
				</button>
			</div>

			<div style={{ marginTop: "2rem" }}>
				<h3>Status: {status}</h3>
				<p>Progress: {progress.percent.toFixed(1)}%</p>
				<p>
					Scanned: {progress.scanned} / {progress.total}
				</p>
				<p>Remaining: {progress.remaining}</p>
				<p>Elapsed: {progress.elapsed}</p>
				<p>Errors: {errors.errors || 0}</p>
			</div>

			{results.length > 0 && (
				<div style={{ marginTop: "2rem" }}>
					<h2>Results ({results.length} found)</h2>
					<table border="1" cellPadding="4">
						<thead>
							<tr>
								<th>Page</th>
								<th>Href</th>
								<th>Anchor</th>
								<th>Title</th>
								<th>Rel</th>
								<th>URL</th>
								<th>Merchant ID</th>
								<th>Website ID</th>
								<th>AVAD</th>
								<th>CTC</th>
							</tr>
						</thead>
						<tbody>
							{results.map((r, i) => (
								<tr key={i}>
									<td>{r.page}</td>
									<td>
										<a
											href={r.href}
											target="_blank"
											rel="noopener noreferrer"
										>
											{r.href}
										</a>
									</td>
									<td>{r.anchorText}</td>
									<td>{r.title}</td>
									<td>{r.rel}</td>
									<td>{r.url}</td>
									<td>{r.merchant_id}</td>
									<td>{r.website_id}</td>
									<td>{r.avad}</td>
									<td>{r.ctc}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
