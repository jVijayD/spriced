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
  DialogService,
  Header,
  HeaderActionComponent,
  OneColComponent,
  Paginate,
} from "@spriced-frontend/spriced-ui-lib";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
const DEFAULT_ATTRIBUTE_WIDTH = 100;
export interface PeriodicElement {
  name: string;
  id: number;
  width: number;
  type: string;
  dataType: string;
  attribute: any[];
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
  type = "FREE_FORM";
  dataType = "STRING_VAR";
  entityList: any;
  referencedTable: any;
  @Output() dataChange = new EventEmitter<any>();
  constraintType = false;
  headers: Header[] = [
    {
      column: "name",
      name: "Name",
      canAutoResize: true,
      isSortable: true,
      width: 100,
    },
    {
      column: "displayName",
      name: "Display Name",
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
  ];
  columnMode: ColumnMode = ColumnMode.force;
  selectionType: SelectionType = SelectionType.single;
  sortType = SortType.single;
  isFullScreen = false;
  totalElements = 0;
  selectedItem: any = null;
  systemAtt: any;
  @ViewChild(DataGridComponent)
  dataGrid!: DataGridComponent;
  referencedTableDisplayName: any
  pattern = "^(?=[a-zA-Z0-9])[a-zA-Z0-9 _#\\-]+$"
  constructor(
    public dialogRef: MatDialogRef<EntityAddComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
  ) {
    this.attDetails.dataType = "STRING_VAR";
    this.attDetails.type = "FREE_FORM";
    this.attDetails.width = DEFAULT_ATTRIBUTE_WIDTH;
    this.local_data = { ...data.row };
    this.entityList = data.entities;

    if (this.local_data.id == this.entityList[0]?.id) {
      this.attDetails.referencedTableId = this.entityList[1]?.id;
      this.referencedTable = this.entityList[1]?.name;
      this.referencedTableDisplayName = this.entityList[1]?.displayName;
    } else {
      //this.local_data.enableAuditTrial = false;
      this.attDetails.referencedTableId = this.entityList[0]?.id;
      this.referencedTable = this.entityList[0]?.name;
      this.referencedTableDisplayName = this.entityList[0]?.displayName;
    }

    this.action = data.action;
    this.local_data?.attributes?.forEach((element: any) => {
      element.displayName = element.displayName || element.name;
    });
    if (this.action == "Add") {
      this.local_data.enableAuditTrial = true;
      this.local_data.autoNumberCode = false;
    }
    console.log(this.local_data.attributes)
    // const showInFormAttributes: any = this.local_data?.attributes?.filter((item: any) => item.showInForm === true);
    // this.local_data?.attributes?.forEach((value: any) => {
    //       if(value.name=='id')
    //       {
    //         this.systemAtt=value
    //       }
    //     });

    this.systemAtt = this.local_data?.attributes?.filter(
      (value: any) => {
        return value.systemAttribute;
      }
    );

    this.local_data.attributes = this.local_data?.attributes?.filter(
      (value: any) => {
        return !value.systemAttribute;
      }
    );


    // if (this.local_data?.attributes) {
    //   this.local_data?.attributes.forEach((attribute: any) => {
    //     const existingAttribute = showInFormAttributes.find((a: any) => a.name === attribute.name);
    //     if (!existingAttribute) {
    //       showInFormAttributes.push(attribute);
    //     }
    //     return showInFormAttributes
    //   });
    // }
    // this.local_data.attributes = showInFormAttributes;
    this.rows = this.local_data?.attributes || [];
    this.totalElements = this.rows.length;
  }
  ngOnInit(): void {
    this.initForm();
  }
  doAction() {
    console.log(this.rows)
    this.local_data.attributes = [...this.rows];
    if (this.systemAtt) {
      this.local_data.attributes.push(...this.systemAtt);
    }
    if (this.action == "Add") {
      this.local_data.name = this.entityForm.controls["name"].value;
    }
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
    this.attDetails.width = DEFAULT_ATTRIBUTE_WIDTH;
    this.cdr.detectChanges();
    this.selectedItem=null
    this.dataGrid.clearSelection();
  }
  selectedEntity(event: any) {
    this.referencedTableDisplayName = event.source.triggerValue;
    this.entityList.map((value: any) => {
      if (value.id == event.source.value) {
        this.referencedTable = value.name;
      }
    });
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
      this.rows = [...this.rows];
    }
    if (this.attAction == "Add") {
      if (row_obj.type == "FREE_FORM") {
        this.rows.push({
          id: row_obj.id,
          name: row_obj.name,
          displayName: row_obj.displayName || row_obj.name,
          description: row_obj.description,
          type: row_obj.type,
          dataType: row_obj.dataType,
          formatter: row_obj.formatter,
          size: row_obj.size,
          constraintType: this.constraintType
            ? "UNIQUE_KEY"
            : row_obj.constraintType,
          width: row_obj.width || DEFAULT_ATTRIBUTE_WIDTH,
        });
      } else {
        this.rows.push({
          id: row_obj.id,
          name: row_obj.name,
          displayName: row_obj.displayName || row_obj.name,
          description: row_obj.description,
          type: row_obj.type,
          referencedTableId: row_obj.referencedTableId,
          referencedTable: this.referencedTable,
          referencedTableDisplayName: this.referencedTableDisplayName,
          width: row_obj.width || DEFAULT_ATTRIBUTE_WIDTH,
        });
      }
      this.rows = [...this.rows];
      this.totalElements = this.rows.length;
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
  }
  onDelete() {

    const dialogRef = this.dialogService.openConfirmDialoge({
      message: "Do you want to delete?",
      title: "Delete Attribute",
      icon: "delete",
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true) {
        this.rows = this.rows.filter((value: any) => {
          return value.name != this.selectedItem.name;
        });
        this.clear();
      }
    })
  }

  /**
   * HANDLE THIS FUNCTION FOR CHANGE THE DATA-TYPE DROPDOWN
   * @param value string
   */
  public handleChangeDataType(value: string)
  {
    switch (value) {
      case 'TIME_STAMP':
        this.attDetails.formatter = 'MM/DD/YYYY';
        break;
       
      case 'INTEGER':
        this.attDetails.formatter = '-####';
        this.attDetails.size = 0;
        break;
    }
  }

  onPaginate(e: Paginate) {
    //this.rows = this.getData(e.limit, e.offset);
  }

  onItemSelected(e: any) {
    this.selectedItem = e;
  }

  onSort(e: any) { }
}
