import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  Criteria,
  RequestUtilityService,
} from "@spriced-frontend/spriced-common-lib";
import { KeycloakService } from "keycloak-angular";
import { Observable, Subject } from "rxjs";
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
      subject: Subject<any>;
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
    private keycloakService: KeycloakService
  ) {
    this.api_url = process.env["NX_API_DATA_URL"] as string;
  }

  private connectToSSE(
    url: string,
    token: string,
    name: string,
    controller: AbortController
  ) {
    let retryCount = 0;
    const self = this;

    fetchEventSource(url, {
      method: "GET",
      headers: {
        Accept: EventStreamContentType,
        Authorization: `Bearer ` + token,
      },
      signal: controller.signal,
      async onopen(response) {
        if (
          response.ok &&
          response.headers.get("content-type") === EventStreamContentType
        ) {
          console.log("Connection -opend-", Date.now());
          return;
        } else if (response.status == 401) {
          throw new RetryError();
        } else if (response.status >= 400 && response.status < 500) {
          throw new Error();
        }
      },
      onmessage(msg) {
        const user = self.keycloakService.getUsername();
        const subscriberId = name + "_" + user;
        const subjectMapValue = self.sseDataSubjectMap.get(subscriberId);
        subjectMapValue?.subject?.next(msg);
      },
      onclose() {
        //self.clearSseDataSubject(name);
        console.log("Connection -closed-", Date.now());
      },
      onerror(err) {
        self.clearSseDataSubject(name);
        console.log("Log Error-", err);
        throw err;
      },
    }).catch((err) => {
      if (
        err instanceof RetryError &&
        retryCount < EntityExportDataService.MAX_RETRIES
      ) {
        console.log("retry");
        this.keycloakService
          .updateToken()
          .then(() => {
            return this.keycloakService.getToken();
          })
          .then((newToken) => {
            self.connectToSSE(url, newToken, name, controller);
            retryCount++;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }

  public getDownloadObservable(name: string): Observable<any> | null {
    const user = this.keycloakService.getUsername();
    const subscriberId = name + "_" + user;
    const subjectMapValue = this.sseDataSubjectMap.get(subscriberId);
    return subjectMapValue ? subjectMapValue.subject.asObservable() : null;
  }

  public getAllDownloads() {
    this.sseDataSubjectMap.forEach((value, key) => {
      this.downloadsMap.set(key, {
        name: value.name,
        fileName: value.fileName,
        progressPercentage: 0,
        processCompleted: false,
        fileCompleted: false,
        id: value.id,
      });
    });
    this.downloadsMap.forEach((value: any, key) => {
      if (!this.sseDataSubjectMap.get(key)) {
        value.progressPercentage = 100;
        value.processCompleted = true;
        value.fileCompleted = true;
      }
    });
    return this.downloadsMap;
  }

  public removeFromDownloadList(name: string) {
    const user = this.keycloakService.getUsername();
    const subscriberId = name + "_" + user;
    this.downloadsMap.delete(subscriberId);
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
    const url = this.requestUtility.addCriteria(
      `${this.api_url}/entity/${id}/export/excel/event?displayFormat=${displayFormat}&subscriberId=${subscriberId}`,
      criteria,
      false
    );
    debugger;
    let subjectMapValue = this.sseDataSubjectMap.get(subscriberId);
    if (!subjectMapValue) {
      const subject = new Subject();
      const controller = new AbortController();
      this.sseDataSubjectMap.set(subscriberId, {
        subject: subject,
        controller: controller,
        id: id,
        name: name,
        fileName: fileName,
      });
      this.connectToSSE(url, token, name, controller);
    }
  }

  public exportToExcel(
    id: string | number,
    filename: string,
    displayFormat: string,
    criteria: Criteria,
    selectedColumns:any
  ) {
    const url =
      `${this.api_url}/entity/${id}/export/excel?displayFormat=${displayFormat}&filterAttributes=${selectedColumns}`

    return this.http
      .post(url,criteria,{
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
    selectedColumns:any
  ) {
    if (isAsync) {
      await this.exportToExcelAsync(
        id,
        name,
        fileName,
        displayFormat,
        criteria
      );
    } else {
      this.exportToExcel(id, fileName, displayFormat, criteria,selectedColumns);
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
