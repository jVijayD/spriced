import {
  Component,
  NgModule,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { ActivatedRoute } from "@angular/router";
import {
  ModelService,
  EntityService,
  Model,
  Entity,
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
  entities: Entity[] = [];

  selectedModelValue: string | number = "";
  selectedEntity: string | Entity = "";

  @Output()
  entitySelectionEvent: EventEmitter<Entity | string> = new EventEmitter();

  constructor(
    private modelService: ModelService,
    private entityService: EntityService,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => item.unsubscribe);
  }

  ngOnInit(): void {
    const modelId = Number(this.route.snapshot.paramMap.get("modelId"));
    const entityId = Number(this.route.snapshot.paramMap.get("entityId"));

    this.subscriptions.push(
      this.modelService.loadAllModels().subscribe({
        next: (items: Model[]) => {
          this.models = items;
          if (items.length) {
            this.selectedModelValue = modelId || items[0].id;
            this.loadEntity(this.selectedModelValue, entityId);
          }
        },
        error: () => {
          this.models = [];
        },
      })
    );
  }

  //onTouched() {}
  loadEntity(modelId: number, entityId?: number) {
    this.subscriptions.push(
      this.entityService.loadEntityByModel(modelId).subscribe({
        next: (items) => {
          if (items) {
            this.entities = items;
            if (this.entities.length) {
              this.selectedEntity =
                this.entities.find((item) => item.id === entityId) ||
                this.entities[0];

              this.entitySelectionEvent.emit(this.selectedEntity);
            }
          }
        },
        error: (err) => {
          this.entities = [];
        },
      })
    );
  }

  onModelSelectionChange(e: MatSelectChange) {
    this.entities = [];
    if (e.value != "") {
      this.loadEntity(Number(e.value));
    }
  }

  onEntitySelectionChange(e: MatSelectChange) {
    debugger;
    this.entitySelectionEvent.emit(e.value);
  }
}
