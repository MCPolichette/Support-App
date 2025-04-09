import React from "react";
import { Link } from "react-router-dom";
import _PageDirectory from "../pages/__PageDirectory";

const Navbar = () => (
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
								<Link
									className="dropdown-item"
									to="/update_key"
								>
									Update Key
								</Link>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</nav>
);

export default Navbar;
