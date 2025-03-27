import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Automapper from "./pages/Automapper.js";
import Home from "./pages/home.js";
import FishUSA from "./pages/FishUSA.js";

const Navbar = () => (
	<nav className="navbar navbar-expand-lg navbar navbar-dark bg-primary fixed-top">
		<div className="container ">
			<Link className="navbar-brand" to="/">
				AvantLink Support App
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
				<ul className="navbar-nav">
					<li className="nav-item">
						<Link className="nav-link" to="/">
							Home
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/automapper">
							Automapper
						</Link>
					</li>
				</ul>
			</div>
		</div>
	</nav>
);

function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/automapper" element={<Automapper />} />
				<Route path="/fish_usa" element={<FishUSA />} />
			</Routes>
		</Router>
	);
}

export default App;
