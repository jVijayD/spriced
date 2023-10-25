import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EntitySelectionComponent } from "./entity-selection.component";

describe("EntitySelectionComponent", () => {
  let component: EntitySelectionComponent;
  let fixture: ComponentFixture<EntitySelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntitySelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EntitySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
