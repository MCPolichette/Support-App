const getMerchantLogo = (id) =>
	id === "23437"
		? `https://static.avantlink.com/merchant-logos/23437`
		: `https://static.avantlink.com/merchant-logos/${id}.png`;

export const TableTopper = ({ id, text }) => (
	<div
		style={{
			height: "100px",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			padding: "0 10px",
			borderBottom: "1px solid #ccc",
		}}
	>
		<img
			src={getMerchantLogo(id)}
			alt="Left"
			style={{ height: "80px", margin: "0 10px" }}
		/>
		<div
			style={{
				flex: 1,
				textAlign: "center",
				fontSize: "1.5rem",
				fontWeight: "bold",
			}}
		>
			{text}
		</div>
		<img
			src="/style/avantlink.png"
			alt="Left Banner"
			style={{ height: "80px" }}
		/>
	</div>
);
