import { useEffect, useState } from "react";

const useServerStatus = (
	url = "http://136.60.219.176:3001/ping",
	interval = 10000 // check every 10 seconds
) => {
	const [online, setOnline] = useState(false);

	useEffect(() => {
		let isMounted = true;

		const checkStatus = () => {
			fetch(url, { method: "GET" })
				.then((res) => {
					if (!res.ok) throw new Error("Server error");
					return res.json();
				})
				.then(() => {
					if (isMounted) setOnline(true);
				})
				.catch(() => {
					if (isMounted) setOnline(false);
				});
		};

		checkStatus(); // initial check
		const intervalId = setInterval(checkStatus, interval);

		return () => {
			isMounted = false;
			clearInterval(intervalId);
		};
	}, [url, interval]);

	return online;
};

export default useServerStatus;
