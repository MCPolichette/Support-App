import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

// The custom toggle (clickable label)
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
	<a
		href="#"
		ref={ref}
		onClick={(e) => {
			e.preventDefault();
			onClick(e);
		}}
	>
		{children} &#x25bc;
	</a>
));

// The searchable menu
const CustomMenu = React.forwardRef(
	({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
		const [value, setValue] = useState("");

		return (
			<div
				ref={ref}
				style={style}
				className={className}
				aria-labelledby={labeledBy}
			>
				<Form.Control
					autoFocus
					className="mx-3 my-2 w-auto"
					placeholder="Type to filter..."
					onChange={(e) => setValue(e.target.value)}
					value={value}
				/>
				<ul className="list-unstyled mb-0">
					{React.Children.toArray(children).filter(
						(child) =>
							!value ||
							child.props.children
								.toLowerCase()
								.includes(value.toLowerCase())
					)}
				</ul>
			</div>
		);
	}
);

// Main component using the dropdown
const ObjectDropdown = ({ items = [] }) => {
	const [selected, setSelected] = useState(null);

	const handleSelect = (eventKey) => {
		const chosen = items.find((item) => item.id.toString() === eventKey);
		setSelected(chosen?.value || "");
	};

	return (
		<>
			<Dropdown onSelect={handleSelect}>
				<Dropdown.Toggle
					as={CustomToggle}
					id="dropdown-custom-components"
				>
					{selected || "Choose an item"}
				</Dropdown.Toggle>

				<Dropdown.Menu as={CustomMenu}>
					{items.map((item) => (
						<Dropdown.Item key={item.id} eventKey={item.id}>
							{item.value}
						</Dropdown.Item>
					))}
				</Dropdown.Menu>
			</Dropdown>
			{selected && <div className="mt-2">Selected: {selected}</div>}
		</>
	);
};

export default ObjectDropdown;
