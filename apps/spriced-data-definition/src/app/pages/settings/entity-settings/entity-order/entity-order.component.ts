import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import {
  EntityService,
  ModelService,
} from "@spriced-frontend/spriced-common-lib";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";
import { MatButtonModule } from "@angular/material/button";
import {
  DialogService,
  SnackBarService,
  SnackbarModule,
} from "@spriced-frontend/spriced-ui-lib";

@Component({
  selector: "sp-entity-order",
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    MatButtonModule,
    SnackbarModule,
  ],
  templateUrl: "./entity-order.component.html",
  providers: [DialogService, SnackBarService],
  styleUrls: ["./entity-order.component.scss"],
})
export class EntityOrderComponent {
  entityList: any;
  filteredModelList: any;
  modelList: any;
  groupId: any;
  sortOrder = "asc";
  initialList: any;
  selectedModel: any;
  constructor(
    private entityService: EntityService,
    private modelService: ModelService,
    private dialogService: DialogService,
    private snackbarService: SnackBarService
  ) {}
  load(event: any) {
    this.selectedModel = event.value;
    this.sortOrder =
      this.selectedModel.orderType == null
        ? "asc"
        : this.selectedModel.orderType;
    this.entityService
      .loadEntityByModelWithOutAttributes(this.selectedModel.id)
      .subscribe((results: any) => {
        this.initialList = results;
        if (this.selectedModel.orderType == "custom") {
          this.entityList = results.sort((a: any, b: any) =>
            a.displayName.localeCompare(b.displayName)
          );
        } else {
          this.entityList = results.sort((a: any, b: any) => a.order - b.order);
        }
      });
  }
  ngOnInit(): void {
    this.modelService.loadAllModels().subscribe((result: any) => {
      this.modelList = result;
      this.filteredModelList = this.modelList;
      this.selectedModel = result[0];
      this.load({ value: this.selectedModel });
    });
  }
  filterModelsSelection(text: any) {
    this.filteredModelList = this.modelList.filter((item: any) => {
      return (
        item.displayName
          .trim()
          .toLowerCase()
          .indexOf(text.trim().toLowerCase()) != -1
      );
    });
  }
  drop(event: any) {
    moveItemInArray(this.entityList, event.previousIndex, event.currentIndex);
  }
  sortOrderChange(event: any) {
    this.sortOrder = event.value;
    if (this.sortOrder == "asc") {
      this.entityList = this.entityList.sort((a: any, b: any) =>
        a.displayName.localeCompare(b.displayName)
      );
    } else if (this.sortOrder == "desc") {
      this.entityList = this.entityList
        .sort((a: any, b: any) => a.displayName.localeCompare(b.displayName))
        .reverse();
    } else if (this.sortOrder == "custom") {
      this.entityList = [...this.initialList];
    }
  }
  onSave() {
    if (this.sortOrder == "custom") {
      this.entityList.forEach((element: any, index: number) => {
        element.order = index + 1;
      });
    }
    this.selectedModel.orderType = this.sortOrder;
    this.entityService
      .addEntityOrder(this.entityList, this.sortOrder)
      .subscribe({
        next: (result) => {
          this.snackbarService.success("Succesfully Created");
        },
        error: (err) => {
          this.snackbarService.error("Order Creation Failed");
        },
      });
  }
  onCancel() {
    const dialogRef = this.dialogService.openConfirmDialoge({
      message: "Are you sure you want to discard the changes?",
      title: "Cancel",
      icon: "cancel",
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true) {
        this.entityList = [...this.initialList];
        this.sortOrder = this.selectedModel.sortOrder;
      }
    });
  }
}
