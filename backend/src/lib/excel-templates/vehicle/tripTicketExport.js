import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function tripTicketExcelExport(tripData) {
  const workbook = new ExcelJS.Workbook();
  const tripTicketPath = path.join(__dirname, "tripTicketTemplate.xlsx");
  await workbook.xlsx.readFile(tripTicketPath);
  const sheet = workbook.getWorksheet("TRIP TICKET");
  sheet.getCell("C7").value = tripData.tripTicketNo;
  sheet.getCell("I7").value = tripData.tripDepartureDate;
  sheet.getCell("H13").value = tripData.driverName;
  sheet.getCell("H14").value = tripData.plateNumber;
  sheet.getCell("H15").value = tripData.authorizedPassengers;
  sheet.getCell("H16").value = tripData.placesToVisit;
  sheet.getCell("D19").value = tripData.purpose;

  return workbook;
}
