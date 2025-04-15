import React from "react";

const SecondaryFeedReference = () => {
	return (
		<table className="table table-borderless">
			<tbody>
				<tr>
					<td align="right" valign="top">
						<b>Secondary Feed File Url:</b>
					</td>
					<td align="left" valign="top">
						https://steals.com/feeds/google-products-feed.xml
					</td>
				</tr>
				<tr>
					<td align="right" valign="top">
						<b>Secondary Feed Delimiter:</b>
					</td>
					<td align="left" valign="top">
						comma
					</td>
				</tr>
				<tr>
					<td align="right" valign="top">
						<b>Secondary Feed Column Layout:</b>
					</td>
					<td align="left" valign="top">
						variant-sku|strProductSKU||variant-detail_url|variant-image_url|variant-retail_price|variant-sale_price|variant-vendor_sku||||variant-color|variant-size|variant-style|||||variant-upc||||variant-available|||variant-vendor_sku||||||||
					</td>
				</tr>
				<tr>
					<td align="right" valign="top">
						<b>Secondary Feed Skip Rows:</b>
					</td>
					<td align="left" valign="top">
						1
					</td>
				</tr>
				<tr>
					<td
						style={{
							whiteSpace: "nowrap",
							backgroundColor: "#CCCCCC",
						}}
						colSpan={2}
					></td>
				</tr>
				<tr>
					<td align="right" valign="top">
						<b>Key Field(s):</b>
					</td>
					<td align="left" valign="top">
						variant-sku
					</td>
				</tr>
				<tr>
					<td></td>
					<td align="left" valign="top">
						(Enter pipe-delimited list of fields from secondary feed
						file.)
					</td>
				</tr>
				<tr>
					<td align="right" valign="top">
						<b>Join Field(s):</b>
					</td>
					<td align="left" valign="top">
						strAttribute1
					</td>
				</tr>
				<tr>
					<td></td>
					<td align="left" valign="top">
						(Enter pipe-delimited list of fields from primary feed
						file.)
					</td>
				</tr>
				<tr>
					<td
						style={{
							whiteSpace: "nowrap",
							backgroundColor: "#CCCCCC",
						}}
						colSpan={2}
					>
						<b>Variants XML Construction From Secondary Feed</b>
					</td>
				</tr>
				<tr>
					<td align="right" valign="top">
						<b>Group Variants?</b>
					</td>
					<td align="left" valign="top">
						Yes
					</td>
				</tr>
				<tr>
					<td align="right" valign="top">
						<b>Group By Field(s):</b>
					</td>
					<td align="left" valign="top">
						strProductSKU
					</td>
				</tr>
				<tr>
					<td></td>
					<td align="left" valign="top">
						(Enter pipe-delimited list of fields from secondary feed
						file.)
					</td>
				</tr>
				<tr>
					<td
						style={{
							whiteSpace: "nowrap",
							backgroundColor: "#CCCCCC",
						}}
						colSpan={2}
					></td>
				</tr>
			</tbody>
		</table>
	);
};

export default SecondaryFeedReference;
