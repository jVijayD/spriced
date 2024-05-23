import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  Criteria,
  RequestUtilityService,
  SseUtilityService,
} from "@spriced-frontend/spriced-common-lib";
import { KeycloakService } from "keycloak-angular";
import { BehaviorSubject, Observable, Subject, map, take } from "rxjs";
import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";
import { saveAs } from "file-saver";

@Injectable({ providedIn: "root" })
export class EntityExportDataService {
  private sseDataSubjectMap: Map<
    string,
    {
      subject: BehaviorSubject<any>;
      controller: AbortController;
      id: string | number;
      name: string;
      fileName: string;
    }
  > = new Map();

  private downloadsMap: Map<string, object> = new Map();

  private static readonly MAX_RETRIES = 5;

  api_url = "";
  constructor(
    private http: HttpClient,
    private requestUtility: RequestUtilityService,
    private sseUtilityService: SseUtilityService,
    private keycloakService: KeycloakService
  ) {
    this.api_url = process.env["NX_API_DATA_URL"] as string;
  }

  // private connectToSSE(
  //   url: string,
  //   token: string,
  //   name: string,
  //   controller: AbortController
  // ) {
  //   let retryCount = 0;
  //   const self = this;

  //   fetchEventSource(url, {
  //     method: "GET",
  //     headers: {
  //       Accept: EventStreamContentType,
  //       Authorization: `Bearer ` + token,
  //     },
  //     signal: controller.signal,
  //     async onopen(response) {
  //       if (
  //         response.ok &&
  //         response.headers.get("content-type") === EventStreamContentType
  //       ) {
  //         console.log("Connection -opend-", Date.now());
  //         return;
  //       } else if (response.status == 401) {
  //         throw new RetryError();
  //       } else if (response.status >= 400 && response.status < 500) {
  //         throw new Error();
  //       }
  //     },
  //     onmessage(msg) {
  //       debugger;
  //       const user = self.keycloakService.getUsername();
  //       const subscriberId = name + "_" + user;
  //       const subjectMapValue = self.sseDataSubjectMap.get(subscriberId);
  //       subjectMapValue?.subject?.next(msg);
  //     },
  //     onclose() {
  //       //self.clearSseDataSubject(name);
  //       console.log("Connection -closed-", Date.now());
  //     },
  //     onerror(err) {
  //       self.clearSseDataSubject(name);
  //       console.log("Log Error-", err);
  //       throw err;
  //     },
  //   }).catch((err) => {
  //     if (
  //       err instanceof RetryError &&
  //       retryCount < EntityExportDataService.MAX_RETRIES
  //     ) {
  //       console.log("retry");
  //       this.keycloakService
  //         .updateToken()
  //         .then(() => {
  //           return this.keycloakService.getToken();
  //         })
  //         .then((newToken) => {
  //           self.connectToSSE(url, newToken, name, controller);
  //           retryCount++;
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }
  //   });
  // }

  private connectToSSE(
    url: string,
    token: string,
    name: string,
    criteria: Criteria,
    controller: AbortController
  ) {
    //let retryCount = 0;
    const self = this;
    return this.sseUtilityService.postSseEvent(
      url,
      { criteria: criteria },
      token,
      controller,
      this.onOpen.bind(self),
      (value: any, response: any) => {
        console.log("SSE Close-" + name);
        //this.clearSseDataSubject.apply(self, [name]);
      },
      (value: any, response: any) => {
        this.onMessage.apply(self, [value, response, name]);
      },
      (err: any) => {
        this.onError.apply(self, [err, name]);
      }
    );
  }

  private onOpen(value: any, response: Response) {
    if (
      response.ok &&
      response.headers.get("content-type") === EventStreamContentType
    ) {
      console.log("SSE Connection Opend");
    } else if (response.status == 401) {
      console.log("Auth Error");
    } else if (response.status >= 400 && response.status < 500) {
      console.log("Un-Known Error");
    }
  }

  private onMessage(value: any, response: any, name: string) {
    const user = this.keycloakService.getUsername();
    const subscriberId = name + "_" + user;
    const subjectMapValue = this.sseDataSubjectMap.get(subscriberId);
    debugger;
    this.setDownloadFileData(name, value);
    subjectMapValue?.subject?.next(value);
  }

  private onError(err: any, name: string) {
    this.clearSseDataSubject(name);
    console.log(err);
  }

  public getDownloadObservable(name: string): Observable<any> | null {
    const user = this.keycloakService.getUsername();
    const subscriberId = name + "_" + user;
    const subjectMapValue = this.sseDataSubjectMap.get(subscriberId);
    return subjectMapValue ? subjectMapValue.subject.asObservable() : null;
  }

  public setDownloadFileData(name: string, value: any) {
    const user = this.keycloakService.getUsername();
    const subscriberId = name + "_" + user;
    var downloadFile = this.downloadsMap.get(subscriberId);
    if (downloadFile) {
      this.downloadsMap.set(subscriberId, {
        ...downloadFile,
        ...{
          progressPercentage: value.progressPercentage,
          processCompleted: value.processCompleted,
        },
      });
    } else {
      debugger;
      this.downloadsMap.set(subscriberId, {
        ...this.sseDataSubjectMap.get(subscriberId),
        ...{
          fileCompleted: value.Stage == "excel_file_creation_completed",
          progressPercentage: Number.parseInt(value.Percentage),
          processCompleted:
            value.Stage == "excel_data_processing_completed" ||
            value.Stage == "excel_file_creation_completed",
        },
      });
    }
  }

  public getAllDownloads() {
    this.sseDataSubjectMap.forEach((value, key) => {
      if (this.downloadsMap.get(key) != null) {
        //Set logic for already present items
      } else {
        this.downloadsMap.set(key, {
          name: value.name,
          fileName: value.fileName,
          progressPercentage: 0,
          processCompleted: false,
          fileCompleted: false,
          id: value.id,
        });
      }
    });

    // this.downloadsMap.forEach((value: any, key) => {
    //   debugger;
    //   if (!this.sseDataSubjectMap.get(key)) {
    //     value.progressPercentage = 100;
    //     value.processCompleted = true;
    //     value.fileCompleted = true;
    //   }
    // });
    return this.downloadsMap;
  }

  public getAllDownloadsWithStatus() {
    // this.sseDataSubjectMap.forEach((value, key) => {
    //   if (this.downloadsMap.get(key) != null) {
    //     //Set logic for already present items
    //   } else {
    //     this.downloadsMap.set(key, {
    //       name: value.name,
    //       fileName: value.fileName,
    //       progressPercentage: 0,
    //       processCompleted: false,
    //       fileCompleted: false,
    //       id: value.id,
    //     });
    //   }
    // });

    return this.downloadsMap;
  }

  public removeFromDownloadList(
    name: string,
    id: string | number,
    isDownload: boolean
  ) {
    const user = this.keycloakService.getUsername();
    const subscriberId = name + "_" + user;
    this.downloadsMap.delete(subscriberId);
    if (!isDownload) {
      const url = `${this.api_url}/entity/${id}/export/excel/create/${subscriberId}`;
      this.http
        .delete(url)
        .pipe(take(1))
        .subscribe(() => {
          console.log("cancelled");
        });
    }
  }

  public cancelDownload(name: string) {
    const user = this.keycloakService.getUsername();
    const subscriberId = name + "_" + user;
    const subjectMapValue = this.sseDataSubjectMap.get(subscriberId);
    if (subjectMapValue) {
      subjectMapValue.controller.abort();
      this.clearSseDataSubject(name);
    }
  }

  public async exportToExcelWithStatusAsync(
    id: number,
    name: string,
    fileName: string,
    displayFormat: any,
    criteria: Criteria
  ) {
    const token = await this.keycloakService.getToken();
    const user = this.keycloakService.getUsername();
    const subscriberId = name + "_" + user;

    const url = `${this.api_url}/entity/${id}/export/excel/create?displayFormat=${displayFormat}&subscriberId=${subscriberId}`;
    return this.http.post(url, criteria).subscribe(() => {
      this.downloadsMap.set(subscriberId, {
        name: name,
        fileName: fileName,
        progressPercentage: 0,
        processCompleted: false,
        fileCompleted: false,
        id: id,
      });
      console.log("download initiated");
    });
  }

  public getExcelCreationStatus(id: number, name: string, fileName: string) {
    const user = this.keycloakService.getUsername();
    const subscriberId = name + "_" + user;
    const url = `${this.api_url}/entity/${id}/export/excel/create/${subscriberId}`;
    let headers = new HttpHeaders({
      "no-loader": "true",
    });
    return this.http
      .get(url, {
        headers: headers,
      })
      .pipe(
        map((response: any) => ({
          id: id,
          subscriberId: subscriberId,
          fileName: fileName,
          percentage: Number(response.Percentage),
          stage: response.Stage,
        }))
      );
  }

  public async exportToExcelAsync(
    id: number,
    name: string,
    fileName: string,
    displayFormat: any,
    criteria: Criteria
  ) {
    const token = await this.keycloakService.getToken();
    const user = this.keycloakService.getUsername();
    const subscriberId = name + "_" + user;
    // const url = this.requestUtility.addCriteria(
    //   `${this.api_url}/entity/${id}/export/excel/event?displayFormat=${displayFormat}&subscriberId=${subscriberId}`,
    //   criteria,
    //   false
    // );

    let subjectMapValue = this.sseDataSubjectMap.get(subscriberId);
    if (!subjectMapValue) {
      const subject = new BehaviorSubject(null);
      const controller = new AbortController();
      this.sseDataSubjectMap.set(subscriberId, {
        subject: subject,
        controller: controller,
        id: id,
        name: name,
        fileName: fileName,
      });

      //this.connectToSSE(url, token, name, controller);
      this.connectToSSE(
        `${this.api_url}/entity/${id}/export/excel/event?displayFormat=${displayFormat}&subscriberId=${subscriberId}`,
        //url,
        token,
        name,
        criteria,
        controller
      ).catch((err) => {
        this.clearSseDataSubject(name);
        console.log(err);
      });
    }
  }

  public exportToCSV(
    id: string | number,
    filename: string,
    displayFormat: string,
    criteria: Criteria,
    selectedColumns: any
  ) {
    let url;
    if (selectedColumns.length == 0) {
      url = `${this.api_url}/entity/${id}/data/generateCsv?displayFormat=${displayFormat}`;
    } else {
      url = `${this.api_url}/entity/${id}/data/generateCsv?displayFormat=${displayFormat}&filterAttributes=${selectedColumns}`;
    }
    return this.http
      .post(url, criteria, {
        responseType: "blob",
      })
      .subscribe((blob) => {
        let data = new Blob([blob], {
          type: "text/csv",
        });
        saveAs(data, filename);
      });
  }
  public exportToExcel(
    id: string | number,
    filename: string,
    displayFormat: string,
    criteria: Criteria,
    selectedColumns: any
  ) {
    let url;
    if (selectedColumns.length == 0) {
      url = `${this.api_url}/entity/${id}/export/excel?displayFormat=${displayFormat}`;
    } else {
      url = `${this.api_url}/entity/${id}/export/excel?displayFormat=${displayFormat}&filterAttributes=${selectedColumns}`;
    }
    return this.http
      .post(url, criteria, {
        responseType: "blob",
      })
      .subscribe((blob) => {
        let data = new Blob([blob], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(data, filename);
      });
  }

  public async export(
    id: number,
    name: string,
    fileName: string,
    displayFormat: any,
    criteria: Criteria,
    isAsync: boolean,
    selectedColumns: any
  ) {
    if (isAsync) {
      // await this.exportToExcelAsync(
      //   id,
      //   name,
      //   fileName,
      //   displayFormat,
      //   criteria
      // );
      await this.exportToExcelWithStatusAsync(
        id,
        name,
        fileName,
        displayFormat,
        criteria
      );
    } else {
      this.exportToExcel(
        id,
        fileName,
        displayFormat,
        criteria,
        selectedColumns
      );
    }
  }
  public async exportCSV(
    id: number,
    name: string,
    fileName: string,
    displayFormat: any,
    criteria: Criteria,
    isAsync: boolean,
    selectedColumns: any
  ) {
    if (isAsync) {
      // await this.exportToExcelAsync(
      //   id,
      //   name,
      //   fileName,
      //   displayFormat,
      //   criteria
      // );
      await this.exportToExcelWithStatusAsync(
        id,
        name,
        fileName,
        displayFormat,
        criteria
      );
    } else {
      this.exportToCSV(
        id,
        fileName,
        displayFormat,
        criteria,
        selectedColumns
      );
    }
  }

  public clearSseDataSubject(name: string) {
    const user = this.keycloakService.getUsername();
    const subscriberId = name + "_" + user;
    const subjectMapValue = this.sseDataSubjectMap.get(subscriberId);
    if (subjectMapValue) {
      subjectMapValue.subject.unsubscribe();
      this.sseDataSubjectMap.delete(subscriberId);
    }
  }

  public downloadFile(
    entityId: number | string,
    filename: string,
    name: string
  ) {
    const user = this.keycloakService.getUsername();
    const subscriberId = name + "_" + user;
    const url = `${this.api_url}/entity/${entityId}/export/excel/download?subscriberId=${subscriberId}`;

    return this.http
      .get(url, {
        responseType: "blob",
      })
      .subscribe((blob) => {
        let data = new Blob([blob], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(data, filename);
      });
  }
}

class RetryError {}
