import { Component, NgModule, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatFormField } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import {
  ModelService,
  EntityService,
  Model,
} from "@spriced-frontend/spriced-common-lib";
import { Subscription } from "rxjs";
@Component({
  selector: "sp-entity-select",
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: "./entity-select.component.html",
  styleUrls: ["./entity-select.component.scss"],
})
export class EntitySelectComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  models: Model[] = [];
  entities: any[] = [];

  selectedModelValue: string = "";
  selectedEntity: any;
  constructor(
    private modelService: ModelService,
    private entityService: EntityService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => item.unsubscribe);
  }

  ngOnInit(): void {
    debugger;
    this.subscriptions.push(
      this.modelService.loadAllModels().subscribe({
        next: (items: Model[]) => {
          this.models = items;
        },
        error: () => {
          this.models = [];
        },
        complete: () => {},
      })
    );
  }

  loadEntity(modelId: number) {
    this.subscriptions.push(
      this.entityService.load(modelId).subscribe({
        next: (items) => {
          if (items) {
            this.entities = items as [];
          }
        },
        error: (err) => {
          this.entities = [];
        },
        complete: () => {
          console.log("Completed");
        },
      })
    );
  }

  onTouched() {}

  onModelSelectionChange(e: MatSelectChange) {
    if (e.value != "") {
      this.loadEntity(Number(e.value));
    } else {
      this.entities = [];
    }
  }

  onEntitySelectionChange(e: MatSelectChange) {
    if (e.value != "") {
    } else {
    }
  }
}
