import React from "react";

const DateRangePicker = ({
	startDate,
	endDate,
	onStartChange,
	onEndChange,
}) => {
	return (
		<div className="mb-4">
			<div className="mb-2">
				<label className="block mb-1 font-medium">Start Date</label>
				<input
					type="date"
					value={startDate}
					onChange={(e) => onStartChange(e.target.value)}
					className="border p-2 w-full"
				/>
			</div>
			<div>
				<label className="block mb-1 font-medium">End Date</label>
				<input
					type="date"
					value={endDate}
					onChange={(e) => onEndChange(e.target.value)}
					className="border p-2 w-full"
				/>
			</div>
		</div>
	);
};

export default DateRangePicker;
