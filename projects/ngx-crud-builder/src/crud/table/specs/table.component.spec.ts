import { ComponentFixture } from "@angular/core/testing";
import { TableComponent } from "../table.component";
import {
  setupTableTest,
  TestEntity,
  TestWrapperComponent,
  waitForDebounce,
} from "./table.component.spec-helpers";

describe("TableComponent", () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: TableComponent<TestEntity>;

  beforeEach(async () => {
    ({ fixture, component } = await setupTableTest());
  });

  it("should create", async () => {
    fixture.detectChanges();
    await waitForDebounce();
    expect(component).toBeTruthy();
  });

  it("should fetch data through httpCalls.get on init when lazy", async () => {
    fixture.detectChanges();
    await waitForDebounce();

    expect(fixture.componentInstance.httpCalls.get).toHaveBeenCalled();
  });

  it("should not fetch lazily when lazy is false", async () => {
    fixture.componentInstance.lazy = false;
    fixture.detectChanges();
    await waitForDebounce();

    // non-lazy mode calls loader.load() directly instead of through the debounced subject
    expect(fixture.componentInstance.httpCalls.get).toHaveBeenCalledTimes(1);
  });
});
