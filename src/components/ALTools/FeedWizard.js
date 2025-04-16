import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import PrimaryFileTab from "./tabs/PrimaryFileTab";
import SecondaryFileTab from "./tabs/SecondaryFileTab";
import AttributeMappingTab from "./tabs/AttributeMappingTab";
import AdvancedOptionsTab from "./tabs/AdvancedOptionsTab";
import FieldBuilderTab from "./tabs/FieldBuilderTab";
import WarningHandlingTab from "./tabs/WarningHandlingTab";

const FeedWizardTabs = () => {
	return (
		<div
			className="mt-3 border rounded shadow-sm p-3 bg-light-subtle"
			style={{ fontSize: "0.8rem" }}
		>
			<Tabs
				defaultActiveKey="primary"
				id="feed-config-tabs"
				className="mb-3 nav-pills"
			>
				<Tab eventKey="primary" title="Primary File">
					<PrimaryFileTab />
				</Tab>
				<Tab eventKey="secondary" title="Secondary File">
					<SecondaryFileTab />
				</Tab>
				<Tab eventKey="mapping" title="Attribute Mapping">
					<AttributeMappingTab />
				</Tab>
				<Tab eventKey="advanced" title="Adv. Options">
					<AdvancedOptionsTab />
				</Tab>
				<Tab eventKey="fieldbuilder" title="Field Builder">
					<FieldBuilderTab />
				</Tab>
				<Tab eventKey="warnings" title="Warning Handling">
					<WarningHandlingTab />
				</Tab>
			</Tabs>
		</div>
	);
};

export default FeedWizardTabs;
