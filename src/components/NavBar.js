import React, { useState } from "react";
import { Link } from "react-router-dom";
import _PageDirectory from "../pages/__PageDirectory";
import StylizedModal from "../components/modals/_ModalStylized";
import SettingsModal from "./modals/SettingsModal";
import {
	Navbar,
	Nav,
	NavDropdown,
	Container,
	Alert,
	Badge,
} from "react-bootstrap";

const getSettings = () => {
	try {
		const raw = localStorage.getItem("ChettiToolsSettings");
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
};

const AppNavbar = () => {
	const [settings, setSettings] = useState(getSettings());
	const [modalOpen, setModalOpen] = useState(false);
	return (
		<Navbar bg="primary" variant="dark" expand="lg" fixed="top">
			<Container>
				<Navbar.Brand as={Link} to="/">
					<b>Chetti.Tools Support App</b>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<NavDropdown title="Tools" id="tools-dropdown">
							{_PageDirectory.map((page, index) => (
								<NavDropdown.Item
									as={Link}
									to={page.route}
									key={index}
								>
									{page.title}
								</NavDropdown.Item>
							))}
							<NavDropdown.Divider />
							<NavDropdown.Item
								onClick={() => setModalOpen(true)}
							>
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
			</Container>

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
