import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Automapper from "./pages/Automapper.js";
import RecursiveCrawler from "./pages/RecursiveCrawler";
import Home from "./pages/home.js";
import FishUSA from "./pages/FishUSA.js";
import UpdateKey from "./pages/UpdateKey.js";
import Navbar from "./components/NavBar.js";

function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/automapper" element={<Automapper />} />
				<Route path="/fish_usa" element={<FishUSA />} />
				<Route path="/website_scanner" element={<RecursiveCrawler />} />
				<Route path="/update_key" element={<UpdateKey />} />
			</Routes>
		</Router>
	);
}

export default App;
