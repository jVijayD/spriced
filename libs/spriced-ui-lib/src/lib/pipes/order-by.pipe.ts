import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "orderBy",
  standalone: true,
})
export class OrderByPipe implements PipeTransform {
  transform(value: any[], ...args: any[]): any[] {
    let field = args[0];
    let order = args.length > 1 ? args[1].toLowerCase() : "asc";
    value.sort((a: any, b: any) => {
      if (order === "asc") {
        return a[field] > b[field] ? 1 : b[field] > a[field] ? -1 : 0;
      } else {
        return b[field] > a[field] ? 1 : a[field] > b[field] ? -1 : 0;
      }
    });
    return value;
  }
}
