import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Master_List_of_Reports_Array } from "../../logic/comparisonLogic/masterListofReports";
import { getSettings } from "../../utils/API/_AdminApiModules";
import { useReportContext } from "../../utils/reportContext";

const Edit_Report_Modal = ({ onClose, onSave, reportEditor, reportName }) => {
	const { addReport, removeReportById, resetReports } = useReportContext();
	console.log(useReportContext);
	const [reportMap, setReportMap] = useState(reportEditor.headers || []);
	const [error, setError] = useState("");
	const [settings, setSettings] = useState(getSettings());
	const [customReports, setCustomReports] = useState(settings.reports || []);
	const [success, setSuccess] = useState(false);
	const updateSettings = (updatedFields) => {
		const updated = { ...settings, ...updatedFields };
		setSettings(updated);
		// saveSettings(updated);
		setSuccess(true);
		setTimeout(() => setSuccess(false), 800);
	};
	console.log(settings);
	const masterFieldList = Master_List_of_Reports_Array[reportName].headers;

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
		console.log({ ...reportEditor, headers: reportMap });
	};

	return (
		<div className="p-3 bg-white border rounded shadow-sm">
			<h5>Customize: {reportEditor.titleDisplay}</h5>
			{error && <Alert variant="danger">{error}</Alert>}

			<Form>
				<h6 className="text-muted">Visible Fields</h6>
				{reportMap.map((field, idx) => (
					<div key={idx} className="d-flex align-items-center mb-2">
						<strong>
							{" "}
							<Form.Check
								type="checkbox"
								label={field.label}
								checked
								onChange={() => handleToggleField(idx)}
							/>
						</strong>
						{field.format != "string" && (
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

				<hr />
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

				<div className="d-flex justify-content-end mt-4">
					<Button
						variant="secondary"
						className="me-2"
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button variant="primary" onClick={handleSave}>
						Save Changes
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default Edit_Report_Modal;
