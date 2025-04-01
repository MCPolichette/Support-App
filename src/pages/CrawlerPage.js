import React, { useState } from "react";
import { startCrawl, downloadCSV } from "../utils/linkcrawler";
import LoadingSpinner from "../components/LoadingSpinner";

const CrawlerPage = () => {
	const [url, setUrl] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState("Waiting to start...");
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

	const handleStart = async () => {
		setLoading(true);
		await startCrawl(
			url,
			searchTerm,
			setStatus,
			setResults,
			setErrors,
			setProgress
		);
		setLoading(false);
	};

	return (
		<div className="container py-5">
			<h2 className="text-center mb-4">Recursive Link Crawler</h2>
			<div className="mb-3">
				<label className="form-label">Website URL:</label>
				<input
					type="text"
					className="form-control"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder="https://example.com"
				/>
			</div>
			<div className="mb-3">
				<label className="form-label">Search Term:</label>
				<input
					type="text"
					className="form-control"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="e.g., avad="
				/>
			</div>
			<button
				onClick={handleStart}
				className="btn btn-primary w-100 mb-3"
			>
				Start Crawl
			</button>

			<h5>Status: {status}</h5>
			{loading && <LoadingSpinner message="Scanning site..." />}

			<div className="progress mb-3">
				<div
					className="progress-bar"
					role="progressbar"
					style={{ width: `${progress.percent}%` }}
				>
					{progress.percent.toFixed(1)}%
				</div>
			</div>
			<p>
				Pages Scanned: {progress.scanned} / {progress.total}
			</p>
			<p>Remaining: {progress.remaining}</p>
			<p>ETA: {progress.eta}</p>
			<p>Elapsed Time: {progress.elapsed}</p>
			<p>
				Errors: {errors.errors || 0}, Server: {errors.serverErrors || 0}
				, Fetch: {errors.fetchErrors || 0}
			</p>

			{results.length > 0 && (
				<>
					<button
						onClick={downloadCSV}
						className="btn btn-success mb-3"
					>
						Download CSV
					</button>
					<pre className="bg-light p-3 border rounded">
						{JSON.stringify(results, null, 2)}
					</pre>
				</>
			)}
		</div>
	);
};

export default CrawlerPage;
