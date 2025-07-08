import React, { useState } from "react";
import { Link } from "react-router-dom";
import _PageDirectory from "../pages/__PageDirectory";
import StylizedModal from "../components/modals/_ModalStylized";
import SettingsModal from "./modals/SettingsModal";
import { Navbar, Nav, NavDropdown, Alert, Badge } from "react-bootstrap";
const getSettings = () => {
	try {
		const raw = localStorage.getItem("ChettiToolsSettings");
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
};
const storageSettings =
	JSON.parse(localStorage.getItem("ChettiToolsSettings")) || {};
const showApiTools = storageSettings.validKey;
const visiblePages = _PageDirectory.filter(
	(page) => !page.keyRequired || showApiTools
);
const AppNavbar = () => {
	const settings = getSettings();
	const [modalOpen, setModalOpen] = useState(false);
	return (
		<Navbar
			bg="dark"
			variant="dark"
			expand="lg"
			fixed="top"
			className="px-3"
		>
			<Navbar.Brand as={Link} to="/">
				<b>Chetti.Tools Support App</b>
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="me-auto">
					<NavDropdown title="Tools" id="tools-dropdown">
						{visiblePages.map((page, index) => (
							<NavDropdown.Item
								as={Link}
								to={page.route}
								key={index}
							>
								{page.title}
							</NavDropdown.Item>
						))}
						<NavDropdown.Divider />
						<NavDropdown.Item onClick={() => setModalOpen(true)}>
							Update Settings
						</NavDropdown.Item>
					</NavDropdown>
				</Nav>
			</Navbar.Collapse>
			{settings.admin && (
				<Alert variant="info">
					<Badge bg="success" className="me-2">
						Verified Admin Key
					</Badge>
					You have admin privileges.
				</Alert>
			)}

			<StylizedModal
				show={modalOpen}
				onHide={() => setModalOpen(false)}
				title="Update Settings"
			>
				<SettingsModal />
			</StylizedModal>
		</Navbar>
	);
};

export default AppNavbar;
