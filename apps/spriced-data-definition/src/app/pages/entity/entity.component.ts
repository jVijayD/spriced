import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DataGridComponent,
  Header,
  HeaderActionComponent,
  OneColComponent,
  Paginate,
} from "@spriced-frontend/spriced-ui-lib";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";

@Component({
  selector: "sp-defnition-entity",
  standalone: true,
  imports: [
    CommonModule,
    OneColComponent,
    DataGridComponent,
    HeaderActionComponent,
  ],
  templateUrl: "./entity.component.html",
  styleUrls: ["./entity.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityComponent {
  headers: Header[] = [];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  isFullScreen = false;
  totalElements = 10000;
  rows: any[] = [];
  selectedItem: any = null;

  @ViewChild(DataGridComponent)
  dataGrid!: DataGridComponent;

  onAdd() {
    this.dataGrid.clearSelection();
    alert("AddRecord");
  }

  onRefresh() {}

  onEdit() {
    alert("Edit");
  }
  onDelete() {
    alert("Delete");
    this.selectedItem = null;
  }
  onPaginate(e: Paginate) {
    //this.rows = this.getData(e.limit, e.offset);
  }

  onItemSelected(e: any) {
    this.selectedItem = e;
  }

  onSort(e: any) {
    console.log(e);
  }
}
