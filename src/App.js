import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Automapper from "./pages/Automapper.js";
import Home from "./pages/home.js";
import FishUSA from "./pages/FishUSA.js";
import Navbar from "./components/NavBar.js";

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
