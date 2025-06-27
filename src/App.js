// Basics:
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
// FrameWork:
import Navbar from "./components/NavBar.js";
import { ReportProvider } from "./utils/reportContext.js";
import { FloatingCenterButton } from "./components/PDFelements.js";
// PAGES:
import Automapper from "./pages/Automapper.js";
import RecursiveCrawler from "./pages/RecursiveCrawler";
import Home from "./pages/home.js";
import QuickTools from "./pages/QuickTools.js";
import ParrallelPulseReport from "./pages/ParrallelPulseReport.js";
import OutageEstimate from "./pages/OutageEstimate.js";
import { NoApiKey } from "./components/Elements/NoAPIKey.js";

function App() {
	return (
		<Router>
			<Navbar />
			<div className=" text-white bg-opacity-75">
				<h1>NAVBAR GOES HERE!</h1>
				{/* This is a Stupid simple solution for padding.  YES I know there are better ways to do this. but this was my way.  and who else will ever read this? */}
			</div>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/automapper" element={<Automapper />} />
				<Route path="/website_scanner" element={<RecursiveCrawler />} />
				<Route path="/more_tools" element={<QuickTools />} />
				<Route path="/outage_estimate" element={<OutageEstimate />} />

				<Route
					path="/ParrallelPulse"
					element={
						<ReportProvider>
							<ParrallelPulseReport />
						</ReportProvider>
					}
				/>
			</Routes>
			<NoApiKey />
		</Router>
	);
}

export default App;
