import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SavedFilterlistComponent } from "./saved-filterlist.component";

describe("SavedFilterlistComponent", () => {
  let component: SavedFilterlistComponent;
  let fixture: ComponentFixture<SavedFilterlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedFilterlistComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SavedFilterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
