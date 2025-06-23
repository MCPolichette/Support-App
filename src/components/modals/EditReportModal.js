import React, { useState } from "react";
import { Form, Stack, InputGroup, Button, Alert } from "react-bootstrap";
import { Master_List_of_Reports_Array } from "../../utils/API/masterListofReports";
import { getSettings } from "../../utils/API/_AdminApiModules";
import { useReportContext } from "../../utils/reportContext";
import GlobalAlert from "../Elements/GlobalAlert";
import { addCustomReport } from "../../utils/localStorageSettings";

const EditReportModal = ({ reportEditor, reportName, categoryName }) => {
	const { addReport, updateReportByName } = useReportContext();
	const [reportMap, setReportMap] = useState(reportEditor?.headers || []);
	const [settings, setSettings] = useState(getSettings());
	const [customReports, setCustomReports] = useState(
		settings.customReports || {}
	);
	const [customName, setCustomName] = useState("");
	const [error, setError] = useState("");
	const [alert, setAlert] = useState(null);

	const masterFieldList =
		Master_List_of_Reports_Array[reportName]?.headers || [];

	const showAlert = (variant, message, duration = 3000) => {
		setAlert({ variant, message });
		setTimeout(() => setAlert(null), duration);
	};

	const handleAddField = (e) => {
		const selectedKey = e.target.value;
		const selectedField = masterFieldList.find(
			(f) => f.value === selectedKey
		);
		if (!selectedField) return;

		const alreadyExists = reportMap.some(
			(f) => f.value === selectedField.value
		);
		if (!alreadyExists) {
			setReportMap((prev) => [...prev, selectedField]);
		}
	};

	const handleToggleField = (idx) => {
		setReportMap((prev) => prev.filter((_, i) => i !== idx));
	};

	const handleToggleComp = (idx) => {
		setReportMap((prev) =>
			prev.map((field, i) =>
				i === idx ? { ...field, comp: !field.comp } : field
			)
		);
	};

	const handleSave = () => {
		if (reportMap.length === 0) {
			setError("You must select at least one field.");
			return;
		}
		setError("");
		updateReportByName(reportName, {
			...reportEditor,
			headers: reportMap,
		});
		showAlert("success", "Settings Saved!");
	};

	const handleSaveCustomReport = () => {
		const trimmedName = customName.trim();

		if (reportMap.length === 0) {
			showAlert("danger", "You must select at least one field.");
			return;
		}
		if (trimmedName.length === 0) {
			showAlert("danger", "You must type in a Report Name.");
			return;
		}
		if (customReports[trimmedName]) {
			showAlert("danger", "A report with this name already exists.");
			return;
		}

		const newReport = {
			...reportEditor,
			headers: reportMap,
			reportTitle: trimmedName,
		};

		addReport(categoryName, trimmedName, newReport);
		addCustomReport(categoryName, trimmedName, newReport);
		setCustomName("");
		showAlert("success", `Saved "${trimmedName}" to Local Storage`);
	};

	return (
		<div className="p-3 bg-white border rounded shadow-sm">
			<GlobalAlert alert={alert} />
			<h5>Customize: {reportEditor?.titleDisplay}</h5>

			{error && <Alert variant="danger">{error}</Alert>}

			<Form>
				<h6 className="text-muted">Visible Fields</h6>
				{reportMap.map((field, idx) => (
					<div key={idx} className="d-flex align-items-center mb-2">
						<strong>
							<Form.Check
								type="checkbox"
								label={field.label}
								checked
								onChange={() => handleToggleField(idx)}
							/>
						</strong>
						{field.format !== "string" && (
							<Form.Check
								type="checkbox"
								id={`comp-toggle-${idx}`}
								label="Compare"
								className="ms-3 text-nowrap"
								checked={field.comp}
								onChange={() => handleToggleComp(idx)}
							/>
						)}
					</div>
				))}

				<h6 className="text-muted">Add Field</h6>
				<Form.Select className="mb-2" onChange={handleAddField}>
					<option value="">Select a field...</option>
					{masterFieldList
						.filter(
							(f) => !reportMap.some((r) => r.value === f.value)
						)
						.map((field) => (
							<option key={field.value} value={field.value}>
								{field.label}
							</option>
						))}
				</Form.Select>

				<hr />

				<Stack className="mb-3">
					<Button
						variant="primary"
						className="me-2"
						onClick={handleSave}
					>
						Save Change for this Report
					</Button>
				</Stack>

				<InputGroup className="mb-3">
					<Form.Control
						id="customNameInput"
						placeholder="Custom Report Name"
						aria-label="Custom Report Name"
						value={customName}
						onChange={(e) => setCustomName(e.target.value)}
					/>
					<Button
						variant="outline-secondary"
						onClick={handleSaveCustomReport}
					>
						Save Report to Local Storage
					</Button>
				</InputGroup>
			</Form>
		</div>
	);
};

export default EditReportModal;
