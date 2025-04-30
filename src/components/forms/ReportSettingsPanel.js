// Updated ReportSettingsPanel.js
import React, { useState, useEffect } from "react";
import { Accordion, Col, Alert, Form } from "react-bootstrap";
import ModuleSettingsAccordionItem from "./ModuleSettingsAccordionItem";

const ReportSettings = ({
	modules,
	setModules,
	toggleHeaderDisplay,
	merchantId,
}) => {
	const [success, setSuccess] = useState(false);
	const [localModules, setLocalModules] = useState(modules);
	const [saving, setSaving] = useState({});
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);

	useEffect(() => {
		setLocalModules(modules);
		setInitialLoadComplete(true);
	}, [modules]);

	const toggleYoyDisplay = (moduleName, headerName, value) => {
		setLocalModules((prevModules) => {
			const updatedModules = { ...prevModules };
			const module = updatedModules[moduleName];
			if (!module || !module.headers) return updatedModules;

			if (typeof module.headers[headerName] !== "object") {
				module.headers[headerName] = {};
			}

			module.headers[headerName] = {
				...module.headers[headerName],
				yoy: value,
			};

			return updatedModules;
		});
	};

	const handleSaveReportSettings = async (moduleName) => {
		setSaving((prev) => ({ ...prev, [moduleName]: true }));
		setModules((prev) => ({
			...prev,
			[moduleName]: localModules[moduleName],
		}));
		setSuccess(true);
		setTimeout(() => setSuccess(false), 2000);
		setSaving((prev) => ({ ...prev, [moduleName]: false }));
	};

	const handleSaveDefaultSettings = async (moduleName) => {
		setSaving((prev) => ({ ...prev, [moduleName]: true }));
		try {
			const settingsRaw = localStorage.getItem("ChettiToolsSettings");
			if (!settingsRaw) return;
			const settings = JSON.parse(settingsRaw);
			if (!settings.commonMerchants) return;

			const merchantIndex = settings.commonMerchants.findIndex(
				(m) => m.id === merchantId
			);
			if (merchantIndex === -1) return;

			const reportMap =
				settings.commonMerchants[merchantIndex].reportMap || {};
			reportMap[moduleName] = localModules[moduleName];
			settings.commonMerchants[merchantIndex].reportMap = reportMap;

			localStorage.setItem(
				"ChettiToolsSettings",
				JSON.stringify(settings)
			);
			setSuccess(true);
			setTimeout(() => setSuccess(false), 2000);
		} catch (e) {
			console.error("Failed to save default settings", e);
		}
		setSaving((prev) => ({ ...prev, [moduleName]: false }));
	};

	return (
		<div className="row">
			<Col md={3}>
				<h5>Reports:</h5>
				{Object.entries(localModules).map(([name, mod]) => (
					<Form.Check
						key={name}
						type="checkbox"
						id={`mod-${name}`}
						label={
							<span style={{ fontSize: "0.85rem" }}>
								{name.replace(/_/g, " ")}
							</span>
						}
						checked={mod.inReport}
						onChange={() =>
							setLocalModules((prev) => ({
								...prev,
								[name]: {
									...prev[name],
									inReport: !prev[name].inReport,
								},
							}))
						}
						className="mb-1"
					/>
				))}
			</Col>

			<Col md={9}>
				<h5>Adjust Available columns for display</h5>
				<Accordion defaultActiveKey="0">
					{Object.entries(localModules)
						.filter(([_, moduleData]) => moduleData.inReport)
						.map(([moduleName, moduleData], i) => (
							<ModuleSettingsAccordionItem
								key={moduleName}
								index={i}
								moduleName={moduleName}
								moduleData={moduleData}
								onSortChange={(name, value) =>
									setLocalModules((prev) => ({
										...prev,
										[name]: {
											...prev[name],
											sortBy: value,
										},
									}))
								}
								onLimitChange={(name, value) =>
									setLocalModules((prev) => ({
										...prev,
										[name]: {
											...prev[name],
											limit: value,
										},
									}))
								}
								toggleYoyDisplay={toggleYoyDisplay}
								setFormSelections={setLocalModules}
								onSave={() =>
									handleSaveReportSettings(moduleName)
								}
								onSaveDefault={() =>
									handleSaveDefaultSettings(moduleName)
								}
								isDisabled={
									!initialLoadComplete || saving[moduleName]
								}
							/>
						))}
				</Accordion>
			</Col>
		</div>
	);
};

export default ReportSettings;
