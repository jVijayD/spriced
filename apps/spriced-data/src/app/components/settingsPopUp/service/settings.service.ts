import { Injectable } from "@angular/core";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { map } from "rxjs";

@Injectable({ providedIn: "root" })
export class SettingsService {
  api_url: string;
  constructor(private dbService: NgxIndexedDBService) {
    this.api_url = process.env["NX_API_DATA_URL"] as string;
  }

  getGlobalSettings() {
    return this.dbService.getAll("all_entity").pipe(
      map((result: any) => {
        let res = {
          displayFormat: "code",
          showSystem: true,
        };
        res = result.length ? result[0] : res;
        return res;
      })
    );
  }

  getCurrentSettings(entity: string) {
    let ent: any = localStorage.getItem(entity);
    return JSON.parse(ent);
    // return this.dbService.getAll("this_entity").pipe(
    //   map((res: any) => {
    //     let resp;
    //     res.map((value: any) => {
    //       if (value.entity == entity) {
    //         resp = value;
    //       }
    //     });
    //     return resp;
    //   })
    // );
  }
}
