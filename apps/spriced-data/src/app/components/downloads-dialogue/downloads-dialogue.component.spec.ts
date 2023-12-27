import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DownloadsDialogueComponent } from "./downloads-dialogue.component";

describe("DownloadsDialogueComponent", () => {
  let component: DownloadsDialogueComponent;
  let fixture: ComponentFixture<DownloadsDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadsDialogueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadsDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
