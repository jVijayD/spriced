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
import { MatTable, MatTableModule } from "@angular/material/table";
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
import { MatInputModule } from '@angular/material/input';

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
    MatTableModule,
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
    MatSelectModule,MatInputModule
  ],
  templateUrl: "./entity-add.component.html",
  styleUrls: ["./entity-add.component.scss"],
})
export class EntityAddComponent implements OnInit {
  action: string;
  attAction = "Add";
  local_data: any;
  attSource: any = {};
  attDetails: any = {};
  entityForm!: FormGroup;
  displayedColumns: string[] = ["name", "displayName", "action"];
  type = "FREE_FORM";
  dataType = "STRING_VAR";
  @ViewChild("attrtable")
  table!: MatTable<any>;
  entityList: any;
  referencedTable: any;
  @Output() dataChange = new EventEmitter<any>();
  constraintType = false;

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
    this.attSource = this.local_data?.attributes || [];
  }
  ngOnInit(): void {
    this.initForm();
  }
  doAction() {
    this.local_data.attributes = this.attSource;
    if (this.action == "Add") {
      this.local_data.name = this.entityForm.controls["name"].value;
    }
    // this.dialogRef.close({ event: this.action, data: this.local_data });
    this.dataChange.emit({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: "Cancel" });
  }

  radioButtonChanged(event: any) {
    this.type = event.value;
  }
  viewAtt(element: any) {
    if (element.dataType == "DECIMAL" && element.size > 0) {
      element.dataType = "INTEGER";
    }
    this.attDetails = {};
    this.attAction = "Update";
    this.type = element.type;
    this.constraintType = element.constraintType == "UNIQUE_KEY" ? true : false;
    this.attDetails = { ...element };
    this.attDetails.displayName = element.displayName || element.name;
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
      this.attSource.map((value: any, index: number) => {
        if (value.name == row_obj.name) {
          this.attSource[index] = row_obj;
          this.table.renderRows();
        }
        return true;
      });
    }
    if (this.attAction == "Add") {
      if (row_obj.dataType == "INTEGER" && row_obj.size > 0) {
        row_obj.dataType = "DECIMAL";
      }
      if (row_obj.type == "FREE_FORM") {
        this.attSource.push({
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
        this.attSource.push({
          id: row_obj.id,
          name: row_obj.name,
          displayName: row_obj.displayName || row_obj.name,
          type: row_obj.type,
          referencedTableId: row_obj.referencedTableId,
          referencedTable: this.referencedTable,
        });
      }
      this.table.renderRows();
    }
    this.clear();
  }
  deleteAtt(row_obj: any) {
    this.attSource = this.attSource.filter((value: any) => {
      return value.name != row_obj.name;
    });
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
}
