export function formatBytes(bytes) {
	if (bytes === 0) return "0 Bytes";
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	const num = bytes / Math.pow(1024, i);
	return `${num.toFixed(1)} ${sizes[i]}`;
}
