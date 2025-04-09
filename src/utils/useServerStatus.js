// 📁 utils/useServerStatus.js
import { useState, useEffect } from "react";
import { CRAWLER_API_URL, CRAWLER_TOKEN } from "./config";

export default function useServerStatus() {
	const [serverOnline, setServerOnline] = useState(false);

	useEffect(() => {
		const checkServer = async () => {
			try {
				const res = await fetch(`${CRAWLER_API_URL}/status`, {
					headers: { "x-api-token": CRAWLER_TOKEN },
				});
				setServerOnline(res.ok);
				console.log("CRAWLER URL", CRAWLER_API_URL);
				console.log(
					`🌐 Crawler server status: ${
						res.ok ? "Online ✅" : "Offline ❌"
					}`
				);
			} catch (err) {
				console.error("❌ Server status check failed:", err);
				setServerOnline(false);
			}
		};

		checkServer();
	}, []);

	return serverOnline;
}
