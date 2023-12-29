import { Injectable } from "@angular/core";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { map } from "rxjs";
import { currentStorage } from "./generic-storage.service";

@Injectable({
  providedIn: 'root'
})
export class GlobalSettingService {
  api_url: string;
  constructor(private dbService: NgxIndexedDBService) {
    this.api_url = process.env["NX_API_DATA_URL"] as string;
  }

  getGlobalSettings() {
    let ent: any = localStorage.getItem("all_entity");
    return ent
      ? JSON.parse(ent)
      : { displayFormat: "namecode", showSystem: false };
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

  getCurrentStorage(key: string): currentStorage
  {
    let item: any = localStorage.getItem(key);
    return JSON.parse(item);
  }

  setCurrentStorage(key: string, currentObject: any)
  {
    localStorage.setItem(key, JSON.stringify(currentObject));
  }
}
