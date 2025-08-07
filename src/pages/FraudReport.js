import React, { useState } from "react";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import { runAPI } from "../utils/API/apiRunner";
import { getSettings } from "../utils/API/_AdminApiModules";
import { getDefaultStartDate, getDefaultEndDate } from "../utils/getTime";
import Papa from "papaparse";
import { whitelistedAffs } from "../utils/whitelist.js";
import LoadingOverlay from "../components/LoadingOverlay";
import ColumnMapTable from "../components/tables/columnMapTable";

const FraudReport = () => {
	const [filteredData, setFilteredData] = useState([]);
	const [error, setError] = useState(null);
	const [loadingStage, setLoadingStage] = useState("");
	const [excludeRecruited, setExcludeRecruited] = useState(true);
	const exclusionList = whitelistedAffs;
	const startDate = getDefaultStartDate("30days");
	const endDate = getDefaultEndDate();
	const [completedModules, setCompletedModules] = useState([]);
	const [loading, setLoading] = useState(false);
	const [stage, setStage] = useState("input");
	const [tableButton, setTableButton] = useState(<div></div>);
	const [warningReport, setWarningReport] = useState([]);

	// Guess an order ID format from a merchant's order IDs.
	// Returns { format: string, firstDigits: string }
	function detectOrderFormat(orderIds) {
		if (!orderIds || orderIds.length === 0)
			return { format: "unknown", firstDigits: "" };

		// Use the first non-empty ID as a sample
		const sample = String(orderIds.find((x) => x)?.trim() || "");

		// Common patterns
		const rePlainDigits = /^(\d{5,})$/; // 5+ digits
		const reHashDigits = /^#(\d{3,})$/; // #12345
		const reAlphaNumDash = /^[A-Za-z0-9\-]+$/; // letters/numbers/dashes

		let format = "unknown";
		if (rePlainDigits.test(sample)) {
			format = `<${sample.length} digits>`;
		} else if (reHashDigits.test(sample)) {
			const digits = sample.replace("#", "");
			format = `#<${digits.length} digits>`;
		} else if (reAlphaNumDash.test(sample)) {
			// quick heuristic: LETTERS-NUMBERS or mixed
			const parts = sample.split("-");
			if (parts.length === 2) {
				const [p1, p2] = parts;
				if (/^[A-Za-z]+$/.test(p1) && /^\d+$/.test(p2))
					format = `[A-Z]+-<${p2.length} digits>`;
				else if (/^\d+$/.test(p1) && /^[A-Za-z]+$/.test(p2))
					format = `<${p1.length} digits>-[A-Z]+`;
				else format = "alphanumeric-dash";
			} else {
				format = "alphanumeric";
			}
		}

		// First 3–4 digits if any
		const firstDigits =
			sample.match(/\d{3,4}/)?.[0] ||
			sample.replace(/\D/g, "").slice(0, 4) ||
			"";

		return { format, firstDigits };
	}

	// Summarize orders by merchant with counts per dollar amount.
	// Returns array: [{ merchantId, merchantName, orderIds, amountCounts(Map), format, firstDigits }]
	function summarizeByMerchant(orders) {
		const byMerchant = {};
		for (const o of orders) {
			const merchantId = o["Merchant Id"];
			const merchantName = o["Merchant"];
			const orderId = o["Order Id"];
			const amount = Number.parseFloat(o["Transaction Amount"]).toFixed(
				2
			);

			if (!byMerchant[merchantId]) {
				byMerchant[merchantId] = {
					merchantId,
					merchantName,
					orderIds: [],
					amountCounts: new Map(), // amount -> count
				};
			}
			const m = byMerchant[merchantId];
			m.orderIds.push(orderId);
			m.amountCounts.set(amount, (m.amountCounts.get(amount) || 0) + 1);
		}

		// add detected formats
		return Object.values(byMerchant)
			.map((m) => {
				const { format, firstDigits } = detectOrderFormat(m.orderIds);
				return { ...m, format, firstDigits };
			})
			.sort((a, b) => a.merchantName.localeCompare(b.merchantName));
	}
	async function fetchMerchantNormalFormat({
		merchantId,
		settings,
		endDate,
	}) {
		const res = await runAPI(
			{
				report_id: 8,
				startDate: getDefaultStartDate("last7days"),
				endDate,
			},
			settings.key,
			[merchantId] // note: array as your signature shows
		);

		const orderIds = (res || []).map((r) => r["Order Id"]).filter(Boolean);

		return detectOrderFormat(orderIds);
	}

	const handleFileUpload = async (e) => {
		setLoading(true);
		const file = e.target.files[0];
		if (!file) return;
		const mList = [];
		const warningData = [];
		const normalFormatCache = {};

		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: async (results) => {
				try {
					const rawData = results.data;

					const filtered = rawData.filter((row) => {
						const affId = parseInt(row["Affiliate Id"]);
						const numSales = parseFloat(row["# of Sales"]);
						const tags = row["Affiliate Tags"] || "";
						const inExclusionList = exclusionList.includes(affId);
						const recruited = tags
							.trim()
							.startsWith("Affiliate Recruiting");

						return (
							!isNaN(affId) &&
							affId >= 300000 &&
							!isNaN(numSales) &&
							numSales > 1 &&
							!inExclusionList &&
							(!excludeRecruited || !recruited)
						);
					});

					const trimmed = filtered.map((row) => ({
						Affiliate_Id: row["Affiliate Id"],
						Affiliate: row["Affiliate"],
						Affiliate_Name: row["Affiliate Name"],
						Click_Throughs: row["Click Throughs"],
						Sales: row["Sales"],
						Num_Sales: row["# of Sales"],
						Conversion_Rate: row["Conversion Rate"],
						Average_Sale_Amount: row["Average Sale Amount"],
					}));

					setError(null);

					// Only run the API for the first 2 for testing
					const settings = await getSettings();
					const warningList = {};
					const reviewList = {};

					for (let i = 0; i < trimmed.length; i++) {
						const affiliate_Id = trimmed[i].Affiliate_Id;
						const affiliate_Name = trimmed[i].Affiliate_Name;
						const result = await runAPI(
							{
								report_id: 8,
								startDate: startDate,
								endDate: endDate,
								affiliate_id: affiliate_Id,
							},
							settings.key,
							"NULL"
						);
						// TODO
						console.log(
							`Result for Affiliate ID ${affiliate_Id}:`,
							result
						);
						const merchantMap = {};

						//AFFAPIRETURN
						result.forEach((order) => {
							const merchantId = order["Merchant Id"];
							if (!mList.includes(merchantId)) {
								mList.push(merchantId);
							}

							const amount = parseFloat(
								order["Transaction Amount"]
							);
							const itemCount = parseInt(order["Item Count"]);
							const orderId = order["Order Id"];

							if (!merchantMap[merchantId]) {
								merchantMap[merchantId] = {
									orders: [],
									susTotals: {},
								};
							}

							merchantMap[merchantId].orders.push(orderId);

							const key = `${amount.toFixed(2)}|${itemCount}`;
							merchantMap[merchantId].susTotals[key] =
								(merchantMap[merchantId].susTotals[key] || 0) +
								1;
						});

						let hasSuspicious = false;
						let totalMatchCount = 0;

						Object.entries(merchantMap).forEach(
							([merchantId, data]) => {
								Object.entries(data.susTotals).forEach(
									([key, count]) => {
										if (count >= 3) {
											hasSuspicious = true;
											totalMatchCount += count;
										}
									}
								);
							}
						);

						if (hasSuspicious) {
							const merchants = summarizeByMerchant(result);

							// Build blocks with NORMAL format appended (last 7d),
							// and style red+bold if different from the affiliate’s observed format.
							let rowHasDiff = false;
							let totalOrderCount = 0;

							const merchantBlocks = (
								await Promise.all(
									merchants.map(async (m) => {
										const entries = Array.from(
											m.amountCounts.entries()
										)
											.filter(([, count]) => count >= 2)
											.sort((a, b) => b[1] - a[1]);

										if (entries.length === 0) return null;

										// get normal format
										let normal =
											normalFormatCache[m.merchantId];
										if (!normal) {
											try {
												normal =
													await fetchMerchantNormalFormat(
														{
															merchantId:
																m.merchantId,
															settings,
															endDate,
														}
													);
												normalFormatCache[
													m.merchantId
												] = normal;
											} catch {
												normal = {
													format: "unknown",
													firstDigits: "",
												};
											}
										}

										const isDiff =
											(normal?.format || "unknown") !==
											(m?.format || "unknown");
										if (isDiff) rowHasDiff = true;

										// accumulate total orders (count of all amounts)
										totalOrderCount += entries.reduce(
											(sum, [, count]) => sum + count,
											0
										);

										return (
											<div
												key={m.merchantId}
												style={{
													marginBottom: 8,
													fontWeight: isDiff
														? 700
														: undefined,
													color: isDiff
														? "#c62828"
														: undefined,
												}}
											>
												<span>
													<strong>
														{m.merchantId}
													</strong>{" "}
													— {m.merchantName} &nbsp;
													<em>
														(Observed Format:{" "}
														{m.format}
														{m.firstDigits
															? `, first digits: ${m.firstDigits}`
															: ""}
														)
													</em>
												</span>
												<ul
													style={{
														margin: "4px 0 0 16px",
													}}
												>
													{entries.map(
														([amount, count]) => (
															<li key={amount}>
																${amount}:{" "}
																{count}
															</li>
														)
													)}
												</ul>
												<div
													style={{
														marginLeft: 16,
														fontStyle: "italic",
													}}
												>
													Normal Format (last 7d):{" "}
													{normal.format}
													{normal.firstDigits
														? `, first digits: ${normal.firstDigits}`
														: ""}
												</div>
											</div>
										);
									})
								)
							).filter(Boolean);

							// Push a row to your existing warningReport table
							setWarningReport((prev) => {
								const updated = [
									...prev,
									{
										affiliateId: affiliate_Id,
										affiliateName: affiliate_Name,
										numMerchants: merchants.length,
										totalOrderCount,
										hasDiff: rowHasDiff,
										jsx: (
											<div key={affiliate_Id}>
												{merchantBlocks}
											</div>
										),
									},
								];

								// sort: red first, then most orders first
								return updated.sort((a, b) => {
									if (a.hasDiff !== b.hasDiff)
										return b.hasDiff - a.hasDiff;
									return (
										b.totalOrderCount - a.totalOrderCount
									);
								});
							});
						} else {
							reviewList[affiliate_Id] = {
								totalMerchants: Object.keys(merchantMap).length,
								totalOrders: result.length,
							};
						}
					}
					setLoading("false");

					console.log(warningReport);

					console.log("Review List:", reviewList);
				} catch (err) {
					setError(
						"Error while processing the file. Check format or console for debug info."
					);
					console.error(err);
				}
				setStage("report");
			},
			error: (err) => setError(err.message),
		});
	};

	return (
		<Container className="shadow-sm p-4 bg-white border position-relative card-drop-in  rounded mt-5">
			{stage === "input" && (
				<Row>
					<h3>
						Upload a Performance Summary by Affiliate (CSV) Report
					</h3>
					<p>
						This tool, will filter through the report, remove
						Affiliates with:
					</p>
					<ul>
						<li>-IDs under 300000</li>
						<li>-0 Sales</li>
						<li>-recruited Affiliates</li>
						<li>- assorted whitelisted Affiliates - Verified</li>
					</ul>
					<Form.Group controlId="formFile" className="mb-3">
						<Form.Label>Select report (.csv)</Form.Label>
						<Form.Control
							type="file"
							accept=".csv"
							onChange={handleFileUpload}
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="excludeRecruited">
						<Form.Check
							type="checkbox"
							label="Exclude Recruited Affiliates"
							checked={excludeRecruited}
							onChange={(e) =>
								setExcludeRecruited(e.target.checked)
							}
						/>
					</Form.Group>
					{error && <Alert variant="danger">{error}</Alert>}

					{loading && (
						<LoadingOverlay
							modules={filteredData}
							completedModules={completedModules}
							loadingStage={loadingStage}
							merchantReference={11177}
							tableButton={tableButton}
						/>
					)}
				</Row>
			)}
			{stage === "report" && (
				<Row>
					<ColumnMapTable
						title={"WARNING LIST"}
						tableMap={[
							{ label: "Affiliate ID", type: "string" },
							{ label: "Affiliate Name", type: "string" },
							{ label: "Num Merchants", type: "string" },
							{ label: "Merchant Report Format", type: "string" },
						]}
						table={warningReport.map((r) => [
							r.affiliateId,
							r.affiliateName,
							String(r.numMerchants),
							r.jsx,
						])}
						id={123456}
						hideTools={true}
						classes={["largeFont"]}
					/>
				</Row>
			)}
		</Container>
	);
};

export default FraudReport;
