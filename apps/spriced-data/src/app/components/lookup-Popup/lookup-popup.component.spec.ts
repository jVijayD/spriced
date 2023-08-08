import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LookupPopupComponent } from "./lookup-popup.component";

describe("LookupPopupComponent", () => {
  let component: LookupPopupComponent;
  let fixture: ComponentFixture<LookupPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookupPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LookupPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
