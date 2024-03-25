import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  OneColComponent,
  DataGridComponent,
  Header,
} from "@spriced-frontend/spriced-ui-lib";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { Criteria } from "@spriced-frontend/spriced-common-lib";
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: "sp-notifications",
  standalone: true,
  imports: [CommonModule, OneColComponent, DataGridComponent],
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
})
export class NotificationsComponent {
  constructor(private notificationService:NotificationService){

  }
  headers: Header[] = [
    {
      column: "type",
      name: "Notification",
      canAutoResize: true,
      isSortable: true,
      width: 100,
    },
    {
      column: "description",
      name: "Description",
      canAutoResize: true,
      isSortable: true,
      width: 100,
    },
    {
      column: "status",
      name: "Status",
      canAutoResize: true,
      isSortable: true,
      width: 100,
    },
    // {
    //   column: "action",
    //   name: "Action",
    //   canAutoResize: true,
    //   isSortable: true,
    //   width: 100,
    //   isLink:true
    // },
  ]
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  isFullScreen = false;
  totalElements = 10000;
  rows: any[] = [{notification:"shd",description:"sgadhgasd",action:"link"}];
  selectedItem: any = null;
  currentCriteria!: Criteria;
  limit: number=50;
  onItemSelected(event: any)
  {
    
  }
  onSort(event: any){}
  onPaginate(e:any){
    const criteria: Criteria = {
      ...this.currentCriteria,
      pager: {
        pageNumber: e.offset,
        pageSize: this.limit,
      },
    };
    this.loadNotification(criteria);
  }
  private loadNotification(criteria:Criteria)
  {
 this.notificationService.loadNotification(criteria).subscribe({
          next: (page) => {
            this.rows = page.content;
            this.totalElements = page.totalElements;
          },
          error: (err) => {
            this.rows = [];
          },
        })
  }
}
