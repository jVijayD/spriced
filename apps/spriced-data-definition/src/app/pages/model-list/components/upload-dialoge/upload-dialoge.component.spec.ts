import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UploadDialogeComponent } from "./upload-dialoge.component";

describe("UploadDialogeComponent", () => {
  let component: UploadDialogeComponent;
  let fixture: ComponentFixture<UploadDialogeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDialogeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadDialogeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
