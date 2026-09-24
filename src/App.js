// Basics:
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// FrameWork:
import Navbar from "./components/NavBar.js";
import { ReportProvider } from "./utils/reportContext.js";
import { getSettings } from "./utils/localStorageSettings";
// PAGES:
import Automapper from "./pages/Automapper.js";
import RecursiveCrawler from "./pages/RecursiveCrawler";
import Home from "./pages/home.js";
import ParrallelPulseReport from "./pages/ParrallelPulseReport.js";
import OutageEstimate from "./pages/OutageEstimate.js";
import AdToolPlayground from "./pages/AdToolPlayground.jsx";
import MarkKReport from "./pages/MarkKalbachReport.js";
import { NoApiKey } from "./components/Elements/NoAPIKey.js";

function App() {
	const [settings, setSettings] = useState(getSettings);
	return (
		<Router>
			<Navbar settings={settings} onSettingsChange={() => setSettings(getSettings())} />
			<Routes>
				<Route path="/" element={<Home settings={settings} />} />
				<Route path="/automapper" element={<Automapper />} />
				<Route path="/website_scanner" element={<RecursiveCrawler />} />
				<Route path="/more_tools" element={<Navigate to="/" replace />} />
				<Route path="/outage_estimate" element={<OutageEstimate />} />
				<Route path="/adTools" element={<AdToolPlayground />} />
				<Route path="/markk" element={<MarkKReport />} />

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
