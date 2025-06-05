import React from "react";
import useServerStatus from "../../utils/server/useServerStatus";

const ServerIndicator = () => {
	const serverIsUp = useServerStatus("http://136.60.219.176:3001/ping");

	return (
		<div>
			<p>
				Server status:{" "}
				<span style={{ color: serverIsUp ? "limegreen" : "gray" }}>
					{serverIsUp ? "🟢 Online" : "⚪ Offline"}
				</span>
			</p>
		</div>
	);
};

export default ServerIndicator;
