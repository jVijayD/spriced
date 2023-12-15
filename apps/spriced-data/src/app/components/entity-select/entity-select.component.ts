import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { ActivatedRoute } from "@angular/router";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import {
  ModelService,
  EntityService,
  Model,
  Entity,
} from "@spriced-frontend/spriced-common-lib";
import { Subscription } from "rxjs";
import { OrderByPipe } from "@spriced-frontend/spriced-ui-lib";

@Component({
  selector: "sp-entity-select",
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    OrderByPipe,
  ],
  templateUrl: "./entity-select.component.html",
  styleUrls: ["./entity-select.component.scss"],
  //encapsulation: ViewEncapsulation.None,
})
export class EntitySelectComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  models: Model[] = [];
  filteredModels: Model[] = [];
  entities: Entity[] = [];
  filteredEntities: Entity[] = [];

  selectedModelValue: string | number = "";
  selectedEntity: string | Entity = "";

  @Output()
  entitySelectionEvent: EventEmitter<Entity | string> = new EventEmitter();

  @Output()
  modelSelectionEvent: EventEmitter<Entity | string> = new EventEmitter();

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
          this.filteredModels = items;
          if (items.length) {
            this.selectedModelValue = modelId || items[0].id;
            this.loadEntities(this.selectedModelValue, entityId);
          }
        },
        error: () => {
          this.models = [];
          this.filteredModels = [];
        },
      })
    );
  }

  //onTouched() {}
  loadEntities(modelId: number, entityId?: number) {
    this.subscriptions.push(
      this.entityService.loadEntityByModelWithOutAttributes(modelId).subscribe({
        next: (items) => {
          if (items) {
            this.entities = items;
            this.filteredEntities = items;
            if (this.entities.length) {
              // this.selectedEntity =
              //   this.entities.find((item) => item.id === entityId) ||
              //   this.entities[0];

              this.entities.sort((a,b) => a.displayName.localeCompare(b.displayName));
              this.filteredEntities.sort((a,b) => a.displayName.localeCompare(b.displayName));
              
              const curSelectedEntity =
                this.entities.find((item) => item.id === entityId) ||
                this.entities[0];
              this.loadEntityWithId(curSelectedEntity);
            }
          }
        },
        error: (err) => {
          this.entities = [];
          this.filteredEntities = [];
        },
      })
    );
  }

  filterModelSelection(text: string) {
    this.filteredModels = this.models.filter((item) => {
      return (
        item.displayName
          .trim()
          .toLowerCase()
          .indexOf(text.trim().toLowerCase()) != -1
      );
    });
  }

  filterEntitySelection(text: string) {
    this.filteredEntities = this.entities.filter((item) => {
      return (
        item.displayName
          .trim()
          .toLowerCase()
          .indexOf(text.trim().toLowerCase()) != -1
      );
    });
  }

  onModelSelectionChange(e: MatSelectChange) {
    this.entities = [];
    this.modelSelectionEvent.emit();
    if (e.value != "") {
      this.loadEntities(Number(e.value));
    }
  }

  onEntitySelectionChange(e: MatSelectChange) {
    //this.entitySelectionEvent.emit(e.value);
    this.loadEntityWithId(e.value);
  }

  private loadEntityWithId(curSelectedEntity: Entity) {
    this.entityService.load(curSelectedEntity.id).subscribe((item: any) => {
      curSelectedEntity.attributes = item.attributes;
      this.selectedEntity = curSelectedEntity;
      this.entitySelectionEvent.emit(this.selectedEntity);
    });
  }
}
