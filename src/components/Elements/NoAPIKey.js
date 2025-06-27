import React, { useState } from "react";
import { getSettings } from "../../utils/localStorageSettings";
import StylizedModal from "../modals/_ModalStylized";
import SettingsModal from "../modals/SettingsModal";
import {
	Alert,
	Row,
	Col,
	Stack,
	Button,
	Badge,
	CloseButton,
} from "react-bootstrap";
const settings = getSettings();
console.log("GET SETTINGS!!", settings);
export const NoApiKey = () => {
	const [showNotes, setShowNotes] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	if (!settings.key) {
		return (
			<Alert
				variant="warning"
				style={{
					fontSize: 10,
					position: "fixed",
					bottom: "1em",
					right: "1.8em",
					width: "200px",
				}}
				className="p-3 rounded transition-shadow my-card"
			>
				<Row>
					<Col>
						<h4>No API Key present on this browser</h4>
						<Button
							variant="Warning"
							onClick={() => setModalOpen(true)}
						>
							Click to open Settings
						</Button>
					</Col>
				</Row>
				<StylizedModal
					show={modalOpen}
					onHide={() => setModalOpen(false)}
					title="Update Settings"
				>
					<SettingsModal />
				</StylizedModal>
			</Alert>
		);
	} else return <></>;
};
