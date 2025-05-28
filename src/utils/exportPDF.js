import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function waitForRender(ms = 300) {
	return new Promise((res) => setTimeout(res, ms));
}

export async function generatePDF(fileName) {
	const element = document.getElementById("report_pdf");
	if (!element) return console.error("Missing #report_pdf element");

	// Temporarily hide elements that shouldn't appear in the PDF
	const hiddenEls = element.querySelectorAll(".d-print-none");
	hiddenEls.forEach((el) => (el.hidden = true));

	await new Promise((res) => setTimeout(res, 50));
	await waitForRender(800);
	// Capture the canvas
	const canvas = await html2canvas(element, {
		scale: 1,
		useCORS: true,
	});

	// Restore hidden elements
	hiddenEls.forEach((el) => (el.hidden = false));

	const pdf = new jsPDF("landscape", "pt", "a4");
	const pageHeight = pdf.internal.pageSize.getHeight();
	const pageWidth = pdf.internal.pageSize.getWidth();

	const imgHeight = canvas.height;
	const imgWidth = canvas.width;
	const scale = pageWidth / imgWidth;

	const ctx = canvas.getContext("2d");

	// Step 1: Gather break points
	const breakEls = element.querySelectorAll(".force-page-break");
	const breakPoints = Array.from(breakEls).map((el) => {
		const rect = el.getBoundingClientRect();
		const offsetY = rect.top + window.scrollY - element.offsetTop;
		return Math.round(offsetY);
	});

	// Add start and end of canvas
	breakPoints.unshift(0);
	breakPoints.push(canvas.height);

	// Step 2: Slice canvas at break points
	for (let i = 0; i < breakPoints.length - 1; i++) {
		const startY = breakPoints[i];
		const endY = breakPoints[i + 1];
		const sliceHeight = endY - startY;
		console.log(startY, "startY", endY, "endY", sliceHeight, "sliceHeight");
		const sliceCanvas = document.createElement("canvas");
		sliceCanvas.width = canvas.width;
		sliceCanvas.height = sliceHeight;

		const sliceCtx = sliceCanvas.getContext("2d");
		sliceCtx.drawImage(
			canvas,
			0,
			startY,
			canvas.width,
			sliceHeight,
			0,
			0,
			canvas.width,
			sliceHeight
		);

		const imgData = sliceCanvas.toDataURL("image/png");
		const scaledHeight = sliceHeight * scale;

		if (i > 0) pdf.addPage();
		pdf.addImage(imgData, "PNG", 0, 0, pageWidth, scaledHeight);
	}

	pdf.save(fileName);
}
