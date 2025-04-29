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
import "./SettingsModal.css";

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
	const [newMerchantId, setNewMerchantId] = useState("");
	const [newMerchantNetwork, setNewMerchantNetwork] = useState("US");
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");

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
		const commonMerchants = settings.commonMerchants || [];
		if (
			!newMerchantId ||
			commonMerchants.some((m) => m.id === newMerchantId)
		)
			return;

		const updated = [
			...commonMerchants,
			{ id: newMerchantId, network: newMerchantNetwork },
		];
		updateSettings({ commonMerchants: updated });
		setNewMerchantId("");
	};

	const handleRemoveMerchant = (id) => {
		const filtered = (settings.commonMerchants || []).filter(
			(m) => m.id !== id
		);
		const updates = { commonMerchants: filtered };
		if (settings.primaryMerchant?.id === id) {
			updates.primaryMerchant = null;
		}
		updateSettings(updates);
	};

	const moveMerchant = (index, direction) => {
		const cardElements = document.querySelectorAll(".merchant-card");
		const card = cardElements[index];
		if (card) {
			card.classList.add(direction > 0 ? "moving-right" : "moving-left");
			setTimeout(() => {
				card.classList.remove("moving-right", "moving-left");
			}, 300);
		}

		const merchants = [...(settings.commonMerchants || [])];
		const newIndex = index + direction;
		if (newIndex < 0 || newIndex >= merchants.length) return;
		[merchants[index], merchants[newIndex]] = [
			merchants[newIndex],
			merchants[index],
		];
		updateSettings({ commonMerchants: merchants });
	};

	const renderMerchantList = () => {
		const merchants = settings.commonMerchants || [];
		if (!merchants.length) return <p>No merchants added yet.</p>;

		return (
			<div className="d-flex flex-wrap gap-3 merchant-list">
				{merchants.map((m, index) => {
					const isPrimary = settings.primaryMerchant?.id === m.id;
					return (
						<div
							key={m.id}
							className={`merchant-card ${
								isPrimary ? "primary" : ""
							}`}
							onClick={() =>
								updateSettings({ primaryMerchant: m })
							}
						>
							<div className="d-flex align-items-center">
								<Image
									className="merchant-logo"
									src={getMerchantLogo(m.id)}
									alt={`Merchant ${m.id}`}
									style={{
										height: "40px",
										marginRight: "10px",
									}}
								/>
							</div>
							<div>
								<div className="fw-bold small">
									{m.id} | {m.network}
								</div>
							</div>
							<div className="mt-2 d-flex justify-content-center">
								<Button
									size="sm"
									variant="outline-secondary"
									onClick={(e) => {
										e.stopPropagation();
										moveMerchant(index, -1);
									}}
									className="me-1"
								>
									◀
								</Button>
								<Button
									size="sm"
									variant="outline-secondary"
									onClick={(e) => {
										e.stopPropagation();
										moveMerchant(index, 1);
									}}
									className="me-1"
								>
									▶
								</Button>
								<Button
									variant="danger"
									size="sm"
									onClick={(e) => {
										e.stopPropagation();
										handleRemoveMerchant(m.id);
									}}
								>
									<Trash size={14} />
								</Button>
							</div>
							{isPrimary && (
								<Badge
									bg="primary"
									className="
									position-absolute 
									top-0 end-0
									 m-1"
								>
									Primary
								</Badge>
							)}
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<div className="p-4 bg-white border rounded shadow-sm">
			<h5 className="mb-3">Chetti.Tools Settings</h5>
			<h6 className="mt-3">API Key</h6>
			{editKey ? (
				<Form.Group className="mb-4">
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
				<div className="mb-3">
					<Button disabled variant="success" className="me-2">
						API Key Stored
					</Button>
					<Button
						variant="outline-secondary"
						size="sm"
						onClick={() => setEditKey(true)}
					>
						Edit Key
					</Button>
				</div>
			)}
			{success && (
				<Alert variant="success" className="shadow position-absolute ">
					Settings saved! ✅
				</Alert>
			)}
			<h6>Merchant Setup</h6>{" "}
			<Form.Group className="mb-3">
				<Form.Label>Add Merchant by ID:</Form.Label>
				<InputGroup className="mb-2">
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
				<div>
					<Form.Check
						inline
						type="radio"
						label="US"
						id="network-default-us"
						name="new-network"
						checked={newMerchantNetwork === "US"}
						onChange={() => setNewMerchantNetwork("US")}
					/>
					<Form.Check
						inline
						type="radio"
						label="CA"
						id="network-default-ca"
						name="new-network"
						checked={newMerchantNetwork === "CA"}
						onChange={() => setNewMerchantNetwork("CA")}
					/>
					<Form.Check
						inline
						type="radio"
						label="AU"
						id="network-default-au"
						name="new-network"
						checked={newMerchantNetwork === "AU"}
						onChange={() => setNewMerchantNetwork("AU")}
					/>
				</div>
			</Form.Group>
			<h6 className="mt-4">Common Merchants</h6>
			{renderMerchantList()}
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
