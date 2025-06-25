// For generating test links:
const [link, setLink] = useState("");
const updateLink = (mid, network) => {
	let wid = "US";
	switch (network) {
		case "US":
			wid = "98cf33eb-248e-4c66-b168-4c6cf7ad5f4e";
			return;
		case "CA":
			wid = "437f2f54-14b6-43e6-954f-e4b187532fec";
			return;
		case "AU":
			wid = "c165a47b-ee8e-4fe6-bf5c-87f7be0c6748";
			return;
	}
	setLink(
		"https://www.avantlink.com/click.php?tool_type=cl&mid=" +
			mid +
			"&website_id=" +
			wid
	);
};
