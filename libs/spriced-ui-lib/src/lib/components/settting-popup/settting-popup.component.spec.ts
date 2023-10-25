import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SetttingPopupComponent } from "./settting-popup.component";

describe("SetttingPopupComponent", () => {
  let component: SetttingPopupComponent;
  let fixture: ComponentFixture<SetttingPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetttingPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SetttingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
