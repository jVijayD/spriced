import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DownloadsProgressComponent } from "./downloads-progress.component";

describe("DownloadsProgressComponent", () => {
  let component: DownloadsProgressComponent;
  let fixture: ComponentFixture<DownloadsProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadsProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadsProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
