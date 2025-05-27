import { useEffect, useState } from "react";

const useServerStatus = (url = "http://192.168.86.35:4000/api/ping") => {
	const [online, setOnline] = useState(false);

	useEffect(() => {
		fetch(url)
			.then((res) => {
				if (!res.ok) throw new Error("Server responded with error");
				return res.json();
			})
			.then(() => setOnline(true))
			.catch(() => setOnline(false));
	}, [url]);

	return online;
};

export default useServerStatus;
