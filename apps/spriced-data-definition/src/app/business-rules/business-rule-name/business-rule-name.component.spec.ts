import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BusinessRuleNameComponent } from "./business-rule-name.component";

describe("BusinessRuleNameComponent", () => {
  let component: BusinessRuleNameComponent;
  let fixture: ComponentFixture<BusinessRuleNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusinessRuleNameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessRuleNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
