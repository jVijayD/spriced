import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ModelAccessService {
  constructor() {}

  getRoles() {
    return [
      { name: "Admin" },
      { name: "Manager" },
      { name: "Data" },
      { name: "Report" },
    ];
  }
}
