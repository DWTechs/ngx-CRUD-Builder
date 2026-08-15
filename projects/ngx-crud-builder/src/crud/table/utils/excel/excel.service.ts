import { Injectable, inject } from "@angular/core";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { catchError, from, map, of, tap } from "rxjs";
import { ExcelParams } from "../../../core/models/excel.model";
import {
  formatDate,
  isValidDateString,
} from "../../../core/utils/dates/dates.utils";
import { CRUD_LABELS } from "../../../core/utils/i18n/crud-labels.token";
import { CellTextContent } from "../../../core/utils/table/cell-text-content.class";

@Injectable({
  providedIn: "root",
})
export class ExcelService<T> {
  private readonly labels = inject(CRUD_LABELS);

  public generateExcel(data: (T & object)[], excelParams: ExcelParams) {
    const workbook = new ExcelJS.Workbook();

    const { fileName, sheetName, columns } = excelParams;
    const worksheet = workbook.addWorksheet(sheetName);
    // Add headers
    const headers: string[] = [];
    for (const col in columns) {
      headers.push(columns[col].label);
    }
    worksheet.addRow(headers);
    // Add data
    for (const item of data) {
      const row = [];
      for (const col in columns) {
        const cellValue = item[col as keyof T];
        let renderedValue = new CellTextContent({
          cellValue,
          options: columns[col],
          checkboxLabels: this.labels.checkbox,
        }).value;

        if (isValidDateString(cellValue)) {
          renderedValue = formatDate(renderedValue as string);
        }

        row.push(renderedValue);
      }
      worksheet.addRow(row);
    }
    return from(workbook.xlsx.writeBuffer()).pipe(
      tap((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${fileName}.xlsx`);
      }),
      map(() => true),
      catchError(() => of(false)),
    );
  }
}
