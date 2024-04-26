import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderActionComponent } from "@spriced-frontend/spriced-ui-lib";
import { MatDialogRef } from "@angular/material/dialog";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule } from "@angular/material/icon";
import { Subscription, switchMap, take, takeUntil, timer } from "rxjs";
import { EntityExportDataService } from "../../services/entity-export.service";

const pollingInterval = 3000;
@Component({
  selector: "sp-downloads-dialogue",
  standalone: true,
  imports: [
    CommonModule,
    HeaderActionComponent,
    MatProgressBarModule,
    MatIconModule,
  ],
  templateUrl: "./downloads-dialogue.component.html",
  styleUrls: ["./downloads-dialogue.component.scss"],
})
export class DownloadsDialogueComponent implements OnInit, OnDestroy {
  private subscriptionList: Subscription[] = [];
  private timerSubscriptionMap: Map<any, Subscription> = new Map();
  private downloadItemMap: Map<
    string,
    {
      entityName: string;
      progressPercentage: number;
      processCompleted: boolean;
      fileCompleted: boolean;
      subscriberId: string;
      id: number | string;
      name: string;
      fileName: string;
      cancelled: boolean;
    }
  > = new Map();
  data: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DownloadsDialogueComponent>,
    private entityExportService: EntityExportDataService
  ) {
    this.initDownload();
  }

  ngOnInit(): void {
    // this.downloadItemMap.forEach((value) => {
    //   this.data.push(value);
    //   let observable = this.entityExportService.getDownloadObservable(
    //     value.entityName
    //   );
    //   let subscription = observable?.subscribe((item) => {
    //     const downloadItem = this.downloadItemMap.get(value.subscriberId);
    //     if (downloadItem) {
    //       const data = item.data;
    //       console.log(data);
    //       downloadItem.fileCompleted =
    //         data.Stage == "excel_file_creation_completed";
    //       downloadItem.processCompleted =
    //         data.Stage == "excel_data_processing_completed" ||
    //         data.Stage == "excel_file_creation_completed";
    //       downloadItem.progressPercentage = Number.parseInt(data.Percentage);
    //       // this.entityExportService.setDownloadFileData(
    //       //   value.name,
    //       //   downloadItem
    //       // );
    //     }
    //   });
    //   if (subscription) {
    //     this.subscriptionList.push(subscription);
    //   }
    // });
    this.reload();
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((item) => item.unsubscribe());
    this.timerSubscriptionMap.forEach((item) => item?.unsubscribe());
  }

  private initDownload() {
    this.entityExportService
      .getAllDownloadsWithStatus()
      .forEach((item: any, value) => {
        this.downloadItemMap.set(value, {
          entityName: item.name,
          progressPercentage: item.progressPercentage,
          processCompleted: item.processCompleted,
          fileCompleted: item.processCompleted,
          subscriberId: value,
          id: item.id,
          name: item.name,
          fileName: item.fileName,
          cancelled: false,
        });
      });
  }

  private reload() {
    this.downloadItemMap.forEach((mapItem: any, value) => {
      console.log("*******");
      console.log(mapItem);
      console.log("********");
      this.data.push(mapItem);
      this.timerSubscriptionMap.set(
        mapItem.id,
        timer(0, pollingInterval).subscribe(() => {
          if (mapItem.stage != "excel_file_creation_completed") {
            var downloadProgressSubscription = this.entityExportService
              .getExcelCreationStatus(
                mapItem.id,
                mapItem.name,
                mapItem.fileName
              )
              .pipe(take(1))
              .subscribe((item: any) => {
                let downloadFileData = this.data.find(
                  (download) => download.id == item.id
                );
                if (downloadFileData) {
                  downloadFileData.progressPercentage = item.percentage;
                  downloadFileData.fileCompleted =
                    item.percentage == 100 &&
                    item.stage == "excel_file_creation_completed";
                  downloadFileData.processCompleted =
                    item.stage == "excel_file_creation_completed";
                  downloadFileData.stage = item.stage;
                  console.log(item);
                  console.log(downloadFileData);
                }
                downloadProgressSubscription.unsubscribe();
              });
          }
        })
      );

      // intervalSource.subscribe(() => {
      //   if (item.progressPercentage !== 100) {
      //     let downloadSubscription = this.recursiveSubscriptionListMap.get(
      //       item.id
      //     );
      //     if (downloadSubscription) {
      //       downloadSubscription.unsubscribe();
      //     }

      //     this.recursiveSubscriptionListMap.set(
      //       item.id,
      //       this.entityExportService
      //         .getExcelCreationStatus(item.id, item.name, item.fileName)
      //         .pipe(take(1))
      //         .subscribe((item: any) => {
      //           let downloadFileData = this.data.find(
      //             (download) => download.id == item.id
      //           );
      //           if (downloadFileData) {
      //             downloadFileData.progressPercentage = item.percentage;
      //             downloadFileData.fileCompleted = item.percentage == 100;
      //             downloadFileData.processCompleted = item.percentage == 100;
      //             console.log(item);
      //             console.log(downloadFileData);
      //           }
      //         })
      //     );
      //   }
      // });
      // //setInterval(, 3000);
    });
  }
  onCancel(name: string, subscriberId: string, id: number) {
    // this.entityExportService.cancelDownload(name);
    // this.entityExportService.removeFromDownloadList(name);
    // const item = this.downloadItemMap.get(subscriberId);
    // if (item) {
    //   item.cancelled = true;
    // }
    this.removeItem(id, name, false);
  }

  removeItem(id: string | number, name: string, isDownload: boolean) {
    this.timerSubscriptionMap.get(id)?.unsubscribe();
    this.timerSubscriptionMap.delete(id);
    this.entityExportService.removeFromDownloadList(name, id, isDownload);
    this.data = this.data.filter((item) => item.id != id);
  }

  onDownload(id: string | number, filename: string, name: string) {
    this.entityExportService.downloadFile(id, filename, name);

    //this.entityExportService.clearSseDataSubject(name);
    this.removeItem(id, name, true);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
