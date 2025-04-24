export function getDefaultStartDate() {
	const date = new Date();
	date.setDate(date.getDate() - 7);
	return date.toISOString().split("T")[0];
}

export function getDefaultEndDate() {
	const date = new Date();
	date.setDate(date.getDate() - 1);
	return date.toISOString().split("T")[0];
}

export function getLastYearSameWeek(start, end) {
	const s = new Date(start);
	const e = new Date(end);
	const daysDiff = (e - s) / (1000 * 60 * 60 * 24);
	s.setFullYear(s.getFullYear() - 1);
	e.setTime(s.getTime() + daysDiff * 24 * 60 * 60 * 1000);
	return {
		start: s.toISOString().split("T")[0],
		end: e.toISOString().split("T")[0],
	};
}
