import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Badge } from "react-bootstrap";
import pages from "../pages/__PageDirectory";
import StylizedModal from "./modals/_ModalStylized";
import SettingsModal from "./modals/SettingsModal";

const AppNavbar = ({ settings, onSettingsChange }) => {
	const [modalOpen, setModalOpen] = useState(false);
	const reports = pages.filter(page => page.category === "reports" &&
		(!page.devOnly || settings.showDev) && (!page.keyRequired || settings.validKey));
	const closeSettings = () => { setModalOpen(false); onSettingsChange(); };
	return (
		<>
			<Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="px-3" collapseOnSelect>
				<Navbar.Brand as={Link} to="/">Chetti.Tools</Navbar.Brand>
				<Navbar.Toggle aria-controls="main-navigation" />
				<Navbar.Collapse id="main-navigation">
					<Nav className="me-auto">
						<Nav.Link as={NavLink} to="/" end eventKey="home">Home</Nav.Link>
						<NavDropdown title="Reports" id="reports-menu">
							{reports.map(page => <NavDropdown.Item as={Link} to={page.route} key={page.route} eventKey={page.route}>{page.title}</NavDropdown.Item>)}
							{!settings.validKey && <NavDropdown.Item onClick={() => setModalOpen(true)}>Add API key in Settings</NavDropdown.Item>}
						</NavDropdown>
						<Nav.Link as={NavLink} to="/automapper" eventKey="automapper">Automapper</Nav.Link>
						<Nav.Link as="button" onClick={() => setModalOpen(true)}>Settings</Nav.Link>
					</Nav>
					{settings.validKey && <Badge bg="secondary">API key configured</Badge>}
				</Navbar.Collapse>
			</Navbar>
			<StylizedModal show={modalOpen} onHide={closeSettings} title="Settings">
				{modalOpen && <SettingsModal />}
			</StylizedModal>
		</>
	);
};
export default AppNavbar;
