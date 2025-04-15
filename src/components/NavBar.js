import React, { useState } from "react";
import { Link } from "react-router-dom";
import _PageDirectory from "../pages/__PageDirectory";
import StylizedModal from "../components/modals/_ModalStylized";
import UpdateKey from "../components/modals/UpdateKey";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";

const AppNavbar = () => {
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
								Update Key
							</NavDropdown.Item>
						</NavDropdown>
					</Nav>
				</Navbar.Collapse>
			</Container>

			<StylizedModal
				show={modalOpen}
				onHide={() => setModalOpen(false)}
				title="Update Key"
			>
				<UpdateKey />
			</StylizedModal>
		</Navbar>
	);
};

export default AppNavbar;
