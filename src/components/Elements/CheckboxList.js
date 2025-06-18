import React, { useState } from "react";
import Form from "react-bootstrap/Form";

const CheckboxList = ({ list = [] }) => {
	const [selected, setSelected] = useState([]);

	const handleChange = (item) => {
		setSelected((prev) =>
			prev.includes(item)
				? prev.filter((w) => w !== item)
				: [...prev, item]
		);
	};

	return (
		<Form>
			{list.map((item, idx) => (
				<Form.Check
					type="checkbox"
					key={idx}
					id={`checkbox-${item}`}
					label={item.value}
					checked={selected.includes(item.value)}
					onChange={() => handleChange(item.value)}
				/>
			))}

			{/* Optional preview */}
			{selected.length > 0 && (
				<div className="mt-3">
					<strong>Selected:</strong> {selected.join(", ")}
				</div>
			)}
		</Form>
	);
};

export default CheckboxList;
