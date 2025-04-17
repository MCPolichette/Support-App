import React, { useState, useEffect } from "react";
import {
	Form,
	Button,
	Alert,
	Badge,
	InputGroup,
	Row,
	Col,
	Image,
} from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

const SETTINGS_KEY = "ChettiToolsSettings";

const getSettings = () => {
	try {
		const raw = localStorage.getItem(SETTINGS_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
};

const saveSettings = (newSettings) => {
	localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
};

const getMerchantLogo = (id) => {
	return id === "23437"
		? `https://static.avantlink.com/merchant-logos/23437`
		: `https://static.avantlink.com/merchant-logos/${id}.png`;
};

const SettingsModal = () => {
	const [settings, setSettings] = useState(getSettings());
	const [uuid, setUuid] = useState(settings.key || "");
	const [editKey, setEditKey] = useState(!settings.key);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [newMerchantId, setNewMerchantId] = useState("");

	const updateSettings = (updatedFields) => {
		const updated = { ...settings, ...updatedFields };
		setSettings(updated);
		saveSettings(updated);
		setSuccess(true);
		setTimeout(() => setSuccess(false), 800);
	};

	const handleSaveUUID = () => {
		if (uuid.length !== 32) {
			setError("UUID must be exactly 32 characters long.");
			return;
		}
		updateSettings({ key: uuid, validKey: true });
		setEditKey(false);
		setError("");
	};

	const handleAddMerchant = () => {
		if (!newMerchantId || settings.commonMerchants?.includes(newMerchantId))
			return;
		const updated = [...(settings.commonMerchants || []), newMerchantId];
		updateSettings({ commonMerchants: updated });
		setNewMerchantId("");
	};

	const handleRemoveMerchant = (id) => {
		const updated = (settings.commonMerchants || []).filter(
			(mid) => mid !== id
		);
		let updates = { commonMerchants: updated };
		if (settings.primaryMerchant === id) {
			updates.primaryMerchant = "";
		}
		updateSettings(updates);
	};

	const handlePrimaryChange = (e) => {
		updateSettings({ primaryMerchant: e.target.value });
	};

	const renderMerchantList = () => {
		if (!settings.commonMerchants?.length)
			return <p>No merchants added yet.</p>;

		return (
			<Row className="g-3">
				{settings.commonMerchants.map((id) => {
					const isPrimary = settings.primaryMerchant === id;
					return (
						<Col
							xs={6}
							md={4}
							key={id}
							className={`text-center position-relative`}
							style={{ cursor: "pointer" }}
							onClick={() =>
								updateSettings({ primaryMerchant: id })
							}
						>
							<div
								className={`border rounded p-2 bg-white ${
									isPrimary
										? "border-primary shadow-lg"
										: "border-secondary"
								}`}
							>
								<Image
									src={getMerchantLogo(id)}
									alt={`Merchant ${id}`}
									fluid
									style={{
										maxHeight: "50px",
										objectFit: "contain",
										width: "100%",
									}}
								/>
								<div
									className={`small mt-2 ${
										isPrimary
											? "fw-bold text-primary"
											: "text-muted"
									}`}
								>
									ID: {id}
								</div>
								{isPrimary && (
									<Badge
										bg="primary"
										className="position-absolute top-0 start-0 m-1"
									>
										Primary
									</Badge>
								)}
							</div>
							<Button
								variant="danger"
								size="sm"
								className="position-absolute top-0 end-0 m-1"
								onClick={(e) => {
									e.stopPropagation();
									handleRemoveMerchant(id);
								}}
								title="Remove"
							>
								<Trash size={14} />
							</Button>
						</Col>
					);
				})}
			</Row>
		);
	};

	return (
		<div className="p-4 bg-white border rounded shadow-sm">
			<h5 className="mb-3">Chetti.Tools Settings</h5>
			{success && (
				<div
					className="position-fixed top-15 start-50 translate-middle-x mt-3"
					style={{ zIndex: 1050, width: "auto", maxWidth: "90%" }}
				>
					<Alert variant="success" className="shadow">
						Settings saved! ✅
					</Alert>
				</div>
			)}
			{/* UUID Section */}
			{editKey ? (
				<Form.Group className="mb-3">
					<Form.Label>Enter Key:</Form.Label>
					<InputGroup>
						<Form.Control
							type="text"
							value={uuid}
							onChange={(e) => setUuid(e.target.value)}
							isInvalid={!!error}
						/>
						<Button variant="primary" onClick={handleSaveUUID}>
							Save Key
						</Button>
					</InputGroup>
					<Form.Control.Feedback type="invalid">
						{error}
					</Form.Control.Feedback>
				</Form.Group>
			) : (
				<Row className="d-flex align-items-center mb-3">
					<Col md={8} className="align-middle">
						<Button
							disabled
							bg="primary"
							className="me-2 "
							size="sm"
						>
							API Key stored in browser
						</Button>
						<Button
							size="sm"
							variant="outline-secondary"
							onClick={() => setEditKey(true)}
						>
							Edit / Update
						</Button>
					</Col>
				</Row>
			)}
			{/* Merchant Logo List */}
			<hr />
			<h5>Merchant Settings</h5>
			<p>
				Add frequently used merchants and set a primary one for quick
				access in reporting tools.
			</p>
			<Form.Group className="mb-4">
				<Form.Label>Common Merchants:</Form.Label>
				{renderMerchantList()}
			</Form.Group>
			{/* Add New Merchant */}
			<Form.Group className="mb-4">
				<Form.Label>Add Merchant by ID:</Form.Label>
				<InputGroup>
					<Form.Control
						type="text"
						placeholder="Merchant ID"
						value={newMerchantId}
						onChange={(e) => setNewMerchantId(e.target.value)}
					/>
					<Button variant="success" onClick={handleAddMerchant}>
						Add
					</Button>
				</InputGroup>
			</Form.Group>
			<hr />
			<Form.Group className="mb-4">
				<Form.Check
					type="switch"
					id="dev-toggle"
					label="Show Development Items"
					checked={settings.showDev || false}
					onChange={(e) =>
						updateSettings({ showDev: e.target.checked })
					}
				/>
				<Form.Text className="text-muted">
					When enabled, you'll see unfinished or in-progress features.
				</Form.Text>
			</Form.Group>{" "}
		</div>
	);
};

export default SettingsModal;
