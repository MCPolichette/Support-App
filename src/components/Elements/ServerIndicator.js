import React from "react";
import useServerStatus from "../../utils/server/useServerStatus";

const ServerIndicator = () => {
	const serverIsUp = useServerStatus(
		"http://raspberrypi.local:4000/api/ping"
	);

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
