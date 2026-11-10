import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CrdModalComponent } from "./crd-modal.component";

describe("CrdModalComponent", () => {
  let fixture: ComponentFixture<CrdModalComponent>;
  let documentClickCount: number;
  let closedCount: number;
  let documentClickListener: EventListener;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CrdModalComponent],
    });
    fixture = TestBed.createComponent(CrdModalComponent);
    fixture.componentRef.setInput("open", true);
    documentClickCount = 0;
    closedCount = 0;
    documentClickListener = () => {
      documentClickCount += 1;
    };
    document.addEventListener("click", documentClickListener);
    fixture.componentInstance.closed.subscribe(() => {
      closedCount += 1;
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    document.removeEventListener("click", documentClickListener);
  });

  it("allows panel clicks to reach document listeners without closing the modal", () => {
    fixture.nativeElement
      .querySelector(".crd-modal-panel")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(documentClickCount).toBe(1);
    expect(closedCount).toBe(0);
  });

  it("closes when the backdrop itself is clicked", () => {
    fixture.nativeElement
      .querySelector(".crd-modal-backdrop")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(closedCount).toBe(1);
  });
});
