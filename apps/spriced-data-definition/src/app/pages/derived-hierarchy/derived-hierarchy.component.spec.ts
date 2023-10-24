import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DerivedHierarchyComponent } from "./derived-hierarchy.component";

describe("DerivedHierarchyComponent", () => {
  let component: DerivedHierarchyComponent;
  let fixture: ComponentFixture<DerivedHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DerivedHierarchyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DerivedHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
