import { provideHttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ActivatedRoute, convertToParamMap, Router } from "@angular/router";
import { of } from "rxjs";
import { vi } from "vitest";
import { CrudItemBase } from "../../core/models/crud-item-base.class";
import { CrudItemFactory } from "../../core/models/crud-item-factory.model";
import { CrudItemOptions } from "../../core/models/crud-item-options.model";
import { Calls } from "../../core/utils/crud-service/crud.model";
import { NO_ROWS_AND_COUNT } from "../../core/utils/crud-service/no-rows";
import { TableComponent } from "../table.component";
import { provideTableRenderer } from "../ui/table-renderer/provide-table-renderer";

/** Minimal entity used across table.component specs */
export class TestEntity extends CrudItemBase {
  name = "";
}

export function createTestEntity(
  overrides: Partial<TestEntity> = {},
): TestEntity {
  const entity = new TestEntity();
  entity.id = overrides.id ?? 1;
  entity.name = overrides.name ?? "Entity 1";
  return { ...entity, ...overrides };
}

/** Builds a `Calls<TestEntity>` object where every operation resolves successfully by default */
export function createHttpCallsMock(
  overrides: Partial<Calls<TestEntity>> = {},
): Calls<TestEntity> {
  return {
    get: vi.fn().mockReturnValue(of({ rows: [], total: 0 })),
    create: vi.fn().mockReturnValue(of({ rows: [createTestEntity()] })),
    update: vi.fn().mockReturnValue(of({ rows: [createTestEntity()] })),
    archive: vi.fn().mockReturnValue(of(null)),
    restore: vi.fn().mockReturnValue(of(null)),
    updateFiles: vi.fn().mockReturnValue(of({ rows: [] })),
    getHistory: vi.fn().mockReturnValue(of(NO_ROWS_AND_COUNT)),
    ...overrides,
  };
}

@Component({
  template: `<tbl-table
    [config]="config"
    [entityFactory]="entityFactory"
    [entityId]="entityId"
    [httpCalls]="httpCalls"
    [tableTitle]="tableTitle"
    [lazy]="lazy"
    [paginator]="paginator"
    [selectable]="selectable"
    [isDefaultEditionDisabled]="isDefaultEditionDisabled"
    [isPreferencesModeEnabled]="isPreferencesModeEnabled"
    [shouldSyncPageWithUrl]="shouldSyncPageWithUrl"
    [shouldSyncIdWithUrl]="shouldSyncIdWithUrl"
    [forceReload]="forceReload"
    (editionDialogClosed)="editionDialogClosed($event)"
    (newClicked)="newClicked()"
    (rowClicked)="rowClicked($event)"
    (formChanged)="formChanged($event)"
    (validityChanged)="validityChanged($event)"
  />`,
  standalone: true,
  imports: [TableComponent],
})
export class TestWrapperComponent {
  config: CrudItemOptions[] = [];
  entityFactory: CrudItemFactory<TestEntity> = () => createTestEntity();
  entityId = "test-entity";
  httpCalls: Calls<TestEntity> = createHttpCallsMock();
  tableTitle = "Test Table";
  lazy = true;
  paginator = true;
  selectable = false;
  isDefaultEditionDisabled = false;
  isPreferencesModeEnabled = false;
  shouldSyncPageWithUrl = false;
  shouldSyncIdWithUrl = false;
  forceReload: number | undefined = undefined;

  editionDialogClosed = vi.fn();
  newClicked = vi.fn();
  rowClicked = vi.fn();
  formChanged = vi.fn();
  validityChanged = vi.fn();
}

export interface RouterMock {
  navigate: ReturnType<typeof vi.fn>;
}

/**
 * Sets up `TestWrapperComponent` with a real `TableComponent` (optimus-ui shell).
 * `queryParams` seeds the `ActivatedRoute` snapshot read by `ngOnInit` for URL sync.
 */
export async function setupTableTest(options?: {
  queryParams?: Record<string, string>;
}): Promise<{
  fixture: ComponentFixture<TestWrapperComponent>;
  component: TableComponent<TestEntity>;
  router: RouterMock;
}> {
  const router: RouterMock = {
    navigate: vi.fn().mockReturnValue(Promise.resolve(true)),
  };
  const queryParams = options?.queryParams ?? {};

  await TestBed.configureTestingModule({
    imports: [TestWrapperComponent],
    providers: [
      provideHttpClient(),
      provideAnimations(),
      ...provideTableRenderer("optimus-ui"),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            queryParamMap: convertToParamMap(queryParams),
            queryParams,
          },
        },
      },
      { provide: Router, useValue: router },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(TestWrapperComponent);
  const component = fixture.debugElement.children[0]
    .componentInstance as TableComponent<TestEntity>;

  return { fixture, component, router };
}

/** Waits past the 300ms lazy-load debounce used internally by TableComponent */
export function waitForDebounce(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
