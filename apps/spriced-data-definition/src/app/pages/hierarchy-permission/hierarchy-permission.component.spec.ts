import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HierarchyPermissionComponent } from "./hierarchy-permission.component";

describe("HierarchyPermissionComponent", () => {
  let component: HierarchyPermissionComponent;
  let fixture: ComponentFixture<HierarchyPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HierarchyPermissionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HierarchyPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
