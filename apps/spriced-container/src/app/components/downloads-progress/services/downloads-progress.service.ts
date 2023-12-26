import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class DownloadsProgressService {

private downloadProgress: BehaviorSubject<any>;
data=[
    {
        entityName:"entit1",
        progressPercentage:40,
        processCompleted: false,
        fileCompleted: false
    },
    {
      entityName:"entit1",
      progressPercentage:80,
      processCompleted: false,
      fileCompleted: false
    },
    {
      entityName:"entit2",
      progressPercentage:100,
      processCompleted: true,
      fileCompleted: true
    },
    {
      entityName:"entxxxxxxxxxxxxit3",
      progressPercentage:90,
      processCompleted: false,
      fileCompleted: false
    },
    {
      entityName:"entit4",
      progressPercentage:20,
      processCompleted: false,
      fileCompleted: false
    },
    {
      entityName:"entit5",
      progressPercentage:30,
      processCompleted: false,
      fileCompleted: false
    },
  ]
constructor() {
    this.downloadProgress = new BehaviorSubject<any>(null);
  }

  setProgress() {
    this.downloadProgress.next(this.data);
  }

  getProgress() {
    return this.downloadProgress.value;
  }
}
