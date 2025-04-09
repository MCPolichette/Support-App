let CRAWLER_API_URL = "https://fallback-url.ngrok-free.app";

fetch("/crawler-tunnel.txt")
	.then((res) => res.text())
	.then((text) => {
		CRAWLER_API_URL = text.trim();
		console.log("✅ Tunnel URL loaded:", CRAWLER_API_URL);
	})
	.catch((err) => {
		console.warn("⚠️ Failed to load tunnel file. Using fallback.");
	});

export const CRAWLER_TOKEN = "iheartbeer";
export { CRAWLER_API_URL };
