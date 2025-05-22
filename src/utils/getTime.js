import { format, isSameMonth, isSameYear, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";

export function getDefaultStartDate(option = "last7days") {
	const date = new Date();

	switch (option) {
		case "first-of-last-month":
			date.setMonth(date.getMonth() - 0);
			date.setDate(1);
			break;
		case "last7days":
		default:
			date.setDate(date.getDate() - 7);
			break;
	}

	return date.toISOString().split("T")[0];
}

export function getDefaultEndDate() {
	const date = new Date();
	date.setDate(date.getDate() - 1);
	return date.toISOString().split("T")[0];
}
export function extractMonthYear(dateStr) {
	const [year, month, day] = dateStr.split("-");
	return { month, year };
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

export function getReportTexts(startInput, endInput) {
	const parse = (input) => {
		if (typeof input === "string") {
			const [y, m, d] = input.split("-").map(Number);
			return new Date(y, m - 1, d); // local time
		}
		return new Date(input);
	};

	const start = parse(startInput);
	const end = parse(endInput);

	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
		throw new RangeError("Invalid date(s) passed to getReportTexts");
	}

	const sameYear = isSameYear(start, end);
	const sameMonth = isSameMonth(start, end);

	const startDay = format(start, "EEEE, MMMM do", { locale: enUS });

	let endDay;
	if (sameMonth && sameYear) {
		endDay = format(end, "do yyyy", { locale: enUS });
	} else {
		endDay = format(end, "MMMM do yyyy", { locale: enUS });
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
export function getMonthRange(dateStr) {
	const inputDate = new Date(dateStr);
	if (isNaN(inputDate)) {
		throw new Error("Invalid date format. Expected yyyy-mm-dd.");
	}

	const year = inputDate.getFullYear();
	const month = inputDate.getMonth(); // 0-indexed

	// Start of the month
	const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;

	// End of the month
	const endDate = new Date(year, month + 1, 0); // 0th day of next month = last day of this month
	const end = `${year}-${String(month + 1).padStart(2, "0")}-${String(
		endDate.getDate()
	).padStart(2, "0")}`;

	return { start, end };
}
export function formatDateShort(dateStr) {
	console.log(dateStr);
	const [year, month, day] = dateStr.split("-");
	return `${parseInt(month)}/${parseInt(day)}`;
}
