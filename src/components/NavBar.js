import React, { useState } from "react";
import { Link } from "react-router-dom";
import _PageDirectory from "../pages/__PageDirectory";
import StylizedModal from "../components/modals/_ModalStylized";
import UpdateKey from "../components/modals/UpdateKey";

const Navbar = () => {
	const [modalOpen, setModalOpen] = useState(false);
	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
			<div className="container">
				<Link className="navbar-brand" to="/">
					Chetti.Tools Support App
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav me-auto">
						<li className="nav-item dropdown">
							<a
								className="nav-link dropdown-toggle"
								href="#"
								id="pageDropdown"
								role="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								Tools
							</a>
							<ul
								className="dropdown-menu"
								aria-labelledby="pageDropdown"
							>
								{_PageDirectory.map((page, index) => (
									<li key={index}>
										<Link
											className="dropdown-item"
											to={page.route}
										>
											{page.title}
										</Link>
									</li>
								))}
								<li>
									--
									<Link
										type="button"
										className="btn btn-outline-secondary btn-sm"
										onClick={() => setModalOpen(true)}
									>
										Update Key
									</Link>
									--
									<StylizedModal
										show={modalOpen}
										onHide={() => setModalOpen(false)}
										title="Update Key"
									>
										<UpdateKey />
									</StylizedModal>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
