import React from "react";
import { Card, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";

const TypeBadge = ({ type, title, description, fieldBuildFix }) => {
	const variant = type;
	const tooltip = <div></div>;
	if (fieldBuildFix) {
		tooltip = (
			<Tooltip>
				<div dangerouslySetInnerHTML={{ __html: fieldBuildFix }} />
			</Tooltip>
		);
	}

	return (
		<OverlayTrigger placement="top" overlay={tooltip}>
			<div className="mb-2">
				<Badge bg={variant} className="me-2">
					{type}
				</Badge>
				<strong>{title}</strong>: {description}
			</div>
		</OverlayTrigger>
	);
};

const InfoCard = ({ title, items, showVariantMap, button }) => {
	let variantElement = null;
	if (showVariantMap) {
		variantElement = <h6>TEST</h6>;
	}

	return (
		<Card className="mb-4 shadow">
			<Card.Body>
				<Card.Title>{title}</Card.Title>
				{button && <div>{button}</div>}
				{items.map((item, index) => (
					<TypeBadge key={index} {...item} />
				))}
			</Card.Body>
		</Card>
	);
};

export default InfoCard;
