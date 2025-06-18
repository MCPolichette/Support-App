// components/GlobalAlert.js
import React from "react";
import { Alert, Row, Col } from "react-bootstrap";

const GlobalAlert = ({ alert }) => {
	if (!alert?.message) return null;

	return (
		<Alert
			variant={alert.variant || "info"}
			className="shadow position-absolute top-0 start-50 translate-middle-x mt-3"
			style={{ zIndex: 1000, minWidth: "80%" }}
		>
			<Row className="justify-content-md-center text-center">
				<h3>{alert.message}</h3>
			</Row>
		</Alert>
	);
};

export default GlobalAlert;

// EXAMPLE COMPENENT USAGE:
// const [alert, setAlert] = useState(null);
// const showAlert = (variant, message, duration = 1000) => {
// 	setAlert({ variant, message });
// 	setTimeout(() => setAlert(null), duration);
// };

// const handleSave = () => {
// 	// do something...
// 	showAlert("success", "Settings saved!");
// };

// {/* Drop this once per page where alerts might show */}
{
	/* <GlobalAlert alert={alert} /> */
}
