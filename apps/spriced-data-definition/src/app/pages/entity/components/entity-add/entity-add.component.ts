import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Optional,
  Output,
  ViewChild,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { MatRadioGroup, MatRadioModule } from "@angular/material/radio";
import { MatDividerModule } from "@angular/material/divider";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import {
  DataGridComponent,
  Header,
  HeaderActionComponent,
  OneColComponent,
  Paginate,
} from "@spriced-frontend/spriced-ui-lib";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";

export interface PeriodicElement {
  name: string;
  id: number;
  width: number;
  type: string;
  dataType: string;
  attribute: any[];
}
export interface UsersData {
  name: string;
  id: number;
  displayName: string;
  updatedon: any;
  updatedby: string;
}

@Component({
  selector: "sp-entity-add",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatRadioModule,
    MatDividerModule,
    MatToolbarModule,
    MatFormFieldModule,
    // MatRadioGroup,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    HeaderActionComponent,
    OneColComponent,
    DataGridComponent,
  ],
  templateUrl: "./entity-add.component.html",
  styleUrls: ["./entity-add.component.scss"],
})
export class EntityAddComponent implements OnInit {
  action: string;
  attAction = "Add";
  local_data: any;
  rows: any = {};
  attDetails: any = {};
  entityForm!: FormGroup;
  displayedColumns: string[] = ["name", "displayName", "action"];
  type = "FREE_FORM";
  dataType = "STRING_VAR";
  entityList: any;
  referencedTable: any;
  @Output() dataChange = new EventEmitter<any>();
  constraintType = false;
  headers: Header[] = [
    { column: "name", name: "Name", canAutoResize: true, isSortable: true },
    {
      column: "displayName" || 'name',
      name: "Display Name",
      canAutoResize: true,
      isSortable: true,
    },
  ];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  isFullScreen = false;
  totalElements = 10000;
  selectedItem: any = null;

  @ViewChild(DataGridComponent)
  dataGrid!: DataGridComponent;
  constructor(
    public dialogRef: MatDialogRef<EntityAddComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.attDetails.dataType = "STRING_VAR";
    this.attDetails.type = "FREE_FORM";
    this.local_data = { ...data.row };
    this.entityList = data.entities;
    if (this.local_data.id == this.entityList[0]?.id) {
      this.attDetails.referencedTableId = this.entityList[1]?.id;
    } else {
      this.attDetails.referencedTableId = this.entityList[0]?.id;
    }

    this.action = data.action;
    this.rows = this.local_data?.attributes || [];
  }
  ngOnInit(): void {
    this.initForm();
  }
  doAction() {
    console.log("action");
    this.local_data.attributes = this.rows;
    if (this.action == "Add") {
      this.local_data.name = this.entityForm.controls["name"].value;
    }
    console.log(this.local_data);
    this.dataChange.emit(this.local_data);
  }

  closeDialog() {
    this.dialogRef.close({ event: "Cancel" });
  }

  radioButtonChanged(event: any) {
    this.type = event.value;
  }

  clear() {
    this.attAction = "Add";
    this.attDetails = {};
    this.attDetails.dataType = "STRING_VAR";
    this.attDetails.type = "FREE_FORM";
    this.cdr.detectChanges();
  }
  selectedEntity(event: any) {
    this.referencedTable = event.source.triggerValue;
  }
  updateRowData(row_obj: any) {
    if (row_obj.dataType == "INTEGER" && row_obj.size > 0) {
      row_obj.dataType = "DECIMAL";
    }
    if (this.attAction == "Update") {
      this.rows.map((value: any, index: number) => {
        if (value.name == row_obj.name) {
          this.rows[index] = row_obj;
        }
        return true;
      });
      this.rows=[...this.rows]
    }
    if (this.attAction == "Add") {
      if (row_obj.type == "FREE_FORM") {
        this.rows.push({
          id: row_obj.id,
          name: row_obj.name,
          displayName: row_obj.displayName || row_obj.name,
          type: row_obj.type,
          dataType: row_obj.dataType,
          formatter: row_obj.formatter,
          size: row_obj.size,
          constraintType: this.constraintType
            ? "UNIQUE_KEY"
            : row_obj.constraintType,
        });
      } else {
        this.rows.push({
          id: row_obj.id,
          name: row_obj.name,
          displayName: row_obj.displayName || row_obj.name,
          type: row_obj.type,
          referencedTableId: row_obj.referencedTableId,
          referencedTable: this.referencedTable,
        });
      }
      this.rows=[...this.rows]
    }
    this.clear();
  }

  initForm() {
    if (this.action == "Edit") {
      this.entityForm = this.fb.group({
        name: [{ value: this.local_data.name, disabled: true }],
      });
    } else {
      this.entityForm = this.fb.group({
        name: ["", Validators.required],
      });
    }
  }

  onRefresh() {}

  onEdit() {
    if (this.selectedItem.dataType == "DECIMAL" && this.selectedItem.size > 0) {
      this.selectedItem.dataType = "INTEGER";
    }
    this.attDetails = {};
    this.attAction = "Update";
    this.type = this.selectedItem.type;
    this.constraintType =
      this.selectedItem.constraintType == "UNIQUE_KEY" ? true : false;
    this.attDetails = { ...this.selectedItem };
    this.attDetails.displayName =
      this.selectedItem.displayName || this.selectedItem.name;
  }
  onAdd() {}
  onDelete() {
    this.rows = this.rows.filter((value: any) => {
      return value.name != this.selectedItem.name;
    });
  }
  onPaginate(e: Paginate) {
    //this.rows = this.getData(e.limit, e.offset);
  }

  onItemSelected(e: any) {
    console.log(e);
    this.selectedItem = e;
  }

  onSort(e: any) {}
}
