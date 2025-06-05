const fs = require("fs");
const path = require("path");
const https = require("https");

//ATTENTION!
//+================================+
//This tool is used to download static merchant logos.
// replace the list below with the needed logos, then  navigate to /support-app and run

// "node downloadlogos.js"
// to begin the process

// 1. Define your list of merchant IDs
const merchantIds = ["10248", "16017", "18601", "28465"];

// 2. Output folder
const outputDir = path.join(__dirname, "public/style/merchant_logos");

// 3. Make sure output folder exists
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}
function downloadLogo(id) {
	const url =
		id === "23437"
			? `https://static.avantlink.com/merchant-logos/23437`
			: `https://static.avantlink.com/merchant-logos/${id}.png`;

	const filePath = path.join(outputDir, `${id}.png`);

	// Skip if file already exists
	if (fs.existsSync(filePath)) {
		console.log(`🟡 Skipped (already exists): ${id}`);
		return Promise.resolve({ success: true, skipped: true, id });
	}

	return new Promise((resolve) => {
		const file = fs.createWriteStream(filePath);
		https
			.get(url, (response) => {
				if (response.statusCode !== 200) {
					fs.unlink(filePath, () => {});
					console.warn(
						`⚠️ Failed to fetch logo for ${id} (Status: ${response.statusCode})`
					);
					return resolve({ success: false, id });
				}

				response.pipe(file);
				file.on("finish", () => {
					file.close();
					console.log(`✅ Downloaded: ${id}`);
					resolve({ success: true, id });
				});
			})
			.on("error", (err) => {
				fs.unlink(filePath, () => {});
				console.error(`❌ Error downloading logo ${id}:`, err.message);
				resolve({ success: false, id });
			});
	});
}

// Download all, tracking failures
(async () => {
	const failed = [];

	for (const id of merchantIds) {
		const result = await downloadLogo(id);
		if (!result.success) failed.push(id);
	}

	console.log("\n🎯 Download complete.");
	if (failed.length > 0) {
		console.log(`\n🚫 Failed to download ${failed.length} logo(s):`);
		failed.forEach((id) => console.log(` - ${id}`));
	} else {
		console.log("✅ All logos downloaded or already existed!");
	}
})();
