import { format, isSameMonth, isSameYear, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";

export function getDefaultStartDate(option = "last7days") {
	const date = new Date();
	switch (option) {
		case "first-of-last-month":
			date.setMonth(date.getMonth() - 0);
			date.setDate(1);
			break;
		case "30days":
			date.setDate(date.getDate() - 30);
			break;
		case "14days":
			date.setDate(date.getDate() - 14);
			break;
		case "60days":
			date.setDate(date.getDate() - 60);
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
export function get30DaysPrior(dateStr) {
	// Parse the input date (yyyy-mm-dd)
	const inputDate = new Date(dateStr);
	// Subtract 30 days
	inputDate.setDate(inputDate.getDate() - 30);
	// Format back to yyyy-mm-dd
	const yyyy = inputDate.getFullYear();
	const mm = String(inputDate.getMonth() + 1).padStart(2, "0");
	const dd = String(inputDate.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
}
export function getBaselineRange(dateStr, days) {
	const inputDate = new Date(`${dateStr}T00:00:00`);
	const startDate = new Date(inputDate);
	startDate.setDate(startDate.getDate() - days - 1);
	const endDate = new Date(inputDate);
	endDate.setDate(endDate.getDate() - 1);

	// Format helper
	const formatDate = (date) => {
		const yyyy = date.getFullYear();
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}`;
	};

	return {
		start: formatDate(startDate),
		end: formatDate(endDate),
	};
}
export function getPreviousYearMonthRange(currentStartDateStr) {
	const currentDate = new Date(currentStartDateStr);
	const startDate = new Date(
		currentDate.getFullYear() - 1,
		currentDate.getMonth() + 1
	);
	console.log(startDate);
	const endDate = new Date(
		currentDate.getFullYear() - 1,
		currentDate.getMonth() + 1,
		0
	); // last day of the month

	const format = (date) => date.toISOString().split("T")[0]; // format YYYY-MM-DD
	const start = format(startDate);
	const end = format(endDate);
	return {
		start,
		end,
	};
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
export function getMonthRange(x) {
	const firstDay = x.year + "-" + x.month + "-01";
	// End of the month
	const endDay = getLastDayOfMonth(x.year, x.month);
	return { firstDay, endDay };
}
export function formatDateShort(dateStr) {
	console.log(dateStr);
	const [year, month, day] = dateStr.split("-");
	return `${parseInt(month)}/${parseInt(day)}`;
}

function getLastDayOfMonth(year, month) {
	// JavaScript months are 0-based, so month needs to be passed as 1-based
	// but we calculate the 0th day of the next month to get the last day of the given month
	const date = new Date(year, month, 0);
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0"); // getMonth is 0-based
	const dd = String(date.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
}
