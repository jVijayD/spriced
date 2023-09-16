import { Injectable } from "@angular/core";
import { Workbook } from "exceljs";
import * as fs from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Header } from "./data-grid.component";

@Injectable()
export class ExportFileService {
  public exportToCsv(data: any[], headers: Header[], title: string) {
    let workbook = this.createWorkBook(data, headers, title);
    workbook.csv.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      fs.saveAs(blob, title + ".csv");
    });
  }

  public exportToExcel(data: any[], headers: Header[], title: string) {
    let workbook = this.createWorkBook(data, headers, title);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      fs.saveAs(blob, title + ".xlsx");
    });
  }

  private createWorkBook(data: any[], headers: Header[], title: string) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title, {
      properties: { tabColor: { argb: "#a8211a" } },
    });

    worksheet.columns = headers.map((item) => {
      return {
        header: item.name,
        key: item.column,
      };
    });

    worksheet.addRows(data);
    worksheet.getRow(0).font = { bold: true };
    return workbook;
  }
  public exportToPdf(data: any[], headers: Header[], title: string) {
    const doc = new jsPDF();
    const tabHeaders: string[] = headers.map((item) => item.name);
    const tabData = data.map((item) => {
      if (Array.isArray(item)) {
        return item;
      } else {
        return Object.keys(item).map((dataItem) => item[dataItem]);
      }
    });
    autoTable(doc, {
      head: [tabHeaders],
      body: tabData,
    });
    doc.save(title + ".pdf");
  }
}
