import { format, isSameMonth, isSameYear, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";

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
///TESTING
export function getReportTexts(startInput, endInput) {
	const start =
		typeof startInput === "string"
			? parseISO(startInput)
			: new Date(startInput);
	const end =
		typeof endInput === "string" ? parseISO(endInput) : new Date(endInput);

	if (isNaN(start) || isNaN(end)) {
		throw new RangeError("Invalid date(s) passed to getReportTexts");
	}

	const sameYear = isSameYear(start, end);
	const sameMonth = isSameMonth(start, end);

	const startDay = format(start, "EEEE, MMMM do", { locale: enUS });
	let endDay;

	if (sameMonth && sameYear) {
		endDay = format(end, "do yyyy", { locale: enUS }); // e.g. "5th 2024"
	} else if (!sameMonth && sameYear) {
		endDay = format(end, "MMMM do yyyy", { locale: enUS }); // e.g. "May 2nd 2024"
	} else {
		endDay = format(end, "MMMM do yyyy", { locale: enUS }); // e.g. "January 3rd 2025"
	}

	const dateRange = `${startDay} - ${endDay}`;

	const year = sameYear
		? `${start.getFullYear()}`
		: `${start.getFullYear()}-${end.getFullYear()}`;

	const startMonth = format(start, "MMMM", { locale: enUS });
	const endMonth = format(end, "MMMM", { locale: enUS });
	const month = sameMonth
		? startMonth
		: sameYear
		? `${startMonth} - ${endMonth} ${start.getFullYear()}`
		: `${startMonth} ${start.getFullYear()} - ${endMonth} ${end.getFullYear()}`;

	return {
		dateRange,
		year,
		month,
	};
}
