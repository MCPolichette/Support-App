import React, { useState } from "react";
import { startCrawl } from "../logic/domainCrawler";
import useServerStatus from "../utils/useServerStatus";

const CrawlerPage = () => {
	const [url, setUrl] = useState("https://example.com");
	const [searchTerm, setSearchTerm] = useState("domain");
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

	const serverOnline = useServerStatus();

	const handleStart = () => {
		startCrawl(
			url,
			searchTerm,
			setStatus,
			setResults,
			setErrors,
			setProgress
		);
	};

	return (
		<div className="container py-5">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h2 className="text-center">Recursive Link Crawler</h2>
				<span
					className={`badge ${
						serverOnline ? "bg-success" : "bg-danger"
					}`}
				>
					Server: {serverOnline ? "Online" : "Offline"}
				</span>
			</div>

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
					{/* <button
						onClick={downloadCSV}
						className="btn btn-success mb-3"
					>
						Download CSV
					</button> */}
					<pre className="bg-light p-3 border rounded">
						{JSON.stringify(results, null, 2)}
					</pre>
				</>
			)}
		</div>
	);
};

export default CrawlerPage;
