// Basics:
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
// FrameWork:
import Navbar from "./components/NavBar.js";

// PAGES:
import Automapper from "./pages/Automapper.js";
import RecursiveCrawler from "./pages/RecursiveCrawler";
import Home from "./pages/home.js";
import FishUSA from "./pages/FishUSA.js";
import QuickTools from "./pages/QuickTools.js";

function App() {
	return (
		<Router>
			<Navbar />
			<div className="container text-white bg-opacity-75">
				<h1>NAVBAR GOES HERE!</h1>
				{/* This is a Stupid simple solution for padding.  YES I know there are smarter ways to do this. but this was my way.  and who else will ever read this? */}
			</div>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/automapper" element={<Automapper />} />
				<Route path="/fish_usa" element={<FishUSA />} />
				<Route path="/website_scanner" element={<RecursiveCrawler />} />
				<Route path="/more_tools" element={<QuickTools />} />
			</Routes>
		</Router>
	);
}

export default App;
