import { Injectable } from "@angular/core";
import { CrudItemBase } from "@crud/core/models/crud-item-base.class";
import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

/**
 * Raw shape returned by the mock API — intentionally different from HistorizedData
 * to demonstrate the HISTORY_MAPPER token.
 */
export interface RawHistoryRow<T> {
  id: number;
  tstamp: string;
  operation: string;
  updaterId: number;
  updaterName: string;
  record: T;
}

export interface DemoUser extends CrudItemBase {
  id: number;
  name: string;
  email: string;
  age: number;
  salary?: number;
  description?: string;
  birthDate?: Date;
  country?: string;
  languages?: string[];
  city?: string;
  gender?: string;
  subscription?: string;
  active?: boolean;
}

interface FilterMeta {
  value: unknown;
  matchMode?: string;
}

/** Lazy-load payload as it reaches the API layer (`rows` is renamed to `limit` upstream). */
interface LazyParams {
  first?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: number;
  filters?: Record<string, FilterMeta | FilterMeta[]>;
}

/**
 * Service providing mock data and HTTP calls for the table demo
 */
@Injectable({
  providedIn: "root",
})
export class TableDemoMockService {
  private mockUsers: DemoUser[] = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      age: 28,
      salary: 65000,
      description: "Senior developer with expertise in Angular",
      birthDate: new Date("1996-03-15"),
      country: "FR",
      languages: ["en", "fr"],
      city: "paris",
      gender: "F",
      subscription: "premium",
      active: true,
      ...new ArchiveInfo(),
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      age: 34,
      salary: 75000,
      description: "Full-stack developer and team lead",
      birthDate: new Date("1990-07-22"),
      country: "UK",
      languages: ["en"],
      city: "london",
      gender: "M",
      subscription: "premium",
      active: true,
      ...new ArchiveInfo(),
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      age: 25,
      salary: 50000,
      description: "Junior developer learning Angular",
      birthDate: new Date("1999-11-08"),
      country: "DE",
      languages: ["en", "de"],
      city: "berlin",
      gender: "M",
      subscription: "basic",
      active: false,
      ...new ArchiveInfo(),
    },
    {
      id: 4,
      name: "Diana Prince",
      email: "diana@example.com",
      age: 31,
      salary: 80000,
      description: "UI/UX designer with frontend skills",
      birthDate: new Date("1993-02-14"),
      country: "ES",
      languages: ["en", "es"],
      city: "madrid",
      gender: "F",
      subscription: "premium",
      active: true,
      ...new ArchiveInfo(),
    },
    {
      id: 5,
      name: "Ethan Hunt",
      email: "ethan@example.com",
      age: 29,
      salary: 70000,
      description: "Backend specialist focusing on APIs",
      birthDate: new Date("1995-09-30"),
      country: "IT",
      languages: ["en", "it"],
      city: "rome",
      gender: "M",
      subscription: "basic",
      active: true,
      ...new ArchiveInfo(),
    },
  ];

  /**
   * Entity factory for creating new demo users
   */
  public readonly entityFactory = (): DemoUser => ({
    id: 0,
    name: "",
    email: "",
    age: 18,
    active: true,
    ...new ArchiveInfo(),
  });

  /**
   * HTTP calls implementation with mocked data
   */
  public readonly httpCalls: Calls<DemoUser> = {
    get: (params) => {
      const { rows, total } = this.query(params as LazyParams);
      return of({ rows, total }).pipe(delay(500));
    },
    create: (item: DemoUser) => {
      const newItem = {
        ...item,
        id: Math.max(...this.mockUsers.map((u) => u.id)) + 1,
      };
      this.mockUsers.push(newItem);
      return of({ rows: [newItem] }).pipe(delay(300));
    },
    update: (item: DemoUser) => {
      const index = this.mockUsers.findIndex((u) => u.id === item.id);
      if (index !== -1) {
        this.mockUsers[index] = item;
      }
      return of({ rows: [item] }).pipe(delay(300));
    },
    archive: (indexes: number[]) => {
      for (const index of indexes) {
        this.mockUsers[index].archived = true;
        this.mockUsers[index].archivedAt = new Date();
      }

      return of(null).pipe(delay(300));
    },
    getHistory: (_id: number) => {
      const user = this.mockUsers.find((u) => u.id === _id);
      if (!user) {
        return of({ rows: [], total: 0 }).pipe(delay(300));
      }

      // Create a realistic history with multiple versions showing changes over time
      // Note: Array should be ordered from newest to oldest (descending tstamp)
      const now = Date.now();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const oneMonth = 30 * 24 * 60 * 60 * 1000;

      // Raw shape from the mock API — field names differ from HistorizedData
      // (mapped via the HISTORY_MAPPER token provided in app.config.ts)
      const mockedHistory: RawHistoryRow<DemoUser>[] = [
        // Current version (most recent)
        {
          id: 1,
          record: { ...user },
          tstamp: new Date(now).toISOString(),
          operation: "UPDATE",
          updaterId: 1,
          updaterName: "admin@example.com",
        },
        // Previous version - salary and subscription changed
        {
          id: 2,
          record: {
            ...user,
            salary: (user.salary || 50000) - 5000,
            subscription: user.subscription === "premium" ? "basic" : "premium",
          },
          tstamp: new Date(now - oneWeek).toISOString(),
          operation: "UPDATE",
          updaterId: 2,
          updaterName: "hr.manager@example.com",
        },
        // Older version - email and city changed
        {
          id: 3,
          record: {
            ...user,
            salary: (user.salary || 50000) - 5000,
            subscription: user.subscription === "premium" ? "basic" : "premium",
            email: user.email.replace("@example.com", ".old@example.com"),
            city: user.city === "paris" ? "lyon" : "paris",
          },
          tstamp: new Date(now - oneMonth).toISOString(),
          operation: "UPDATE",
          updaterId: user.id,
          updaterName: `${user.name.toLowerCase().replace(" ", ".")}@example.com`,
        },
        // Even older - active status and languages changed
        {
          id: 4,
          record: {
            ...user,
            salary: (user.salary || 50000) - 10000,
            subscription: "basic",
            email: user.email.replace("@example.com", ".old@example.com"),
            city: user.city === "paris" ? "lyon" : "paris",
            active: !user.active,
            languages: user.languages?.slice(0, 1) || ["en"],
          },
          tstamp: new Date(now - 2 * oneMonth).toISOString(),
          operation: "UPDATE",
          updaterId: 0,
          updaterName: "system@example.com",
        },
        // Initial creation
        {
          id: 5,
          record: {
            ...user,
            salary: (user.salary || 50000) - 15000,
            subscription: "basic",
            email: user.email.replace("@example.com", ".old@example.com"),
            city: user.city === "paris" ? "lyon" : "paris",
            active: false,
            languages: ["en"],
            description: "",
          },
          tstamp: new Date(now - 3 * oneMonth).toISOString(),
          operation: "CREATE",
          updaterId: 1,
          updaterName: "admin@example.com",
        },
      ];

      return of({ rows: mockedHistory, total: mockedHistory.length }).pipe(
        delay(300),
      );
    },
  };

  /** Mimics a server honouring the lazy-load payload: filter, then sort, then paginate. */
  private query(params: LazyParams | undefined): {
    rows: DemoUser[];
    total: number;
  } {
    const {
      first = 0,
      limit,
      sortField,
      sortOrder = 1,
      filters,
    } = params ?? {};

    let rows = this.mockUsers.filter((row) =>
      this.matchesFilters(row, filters),
    );

    if (sortField) {
      rows = [...rows].sort(
        (a, b) =>
          this.compare(this.cellOf(a, sortField), this.cellOf(b, sortField)) *
          (sortOrder < 0 ? -1 : 1),
      );
    }

    const total = rows.length;
    if (typeof limit === "number") {
      rows = rows.slice(first, first + limit);
    }
    return { rows, total };
  }

  private matchesFilters(
    row: DemoUser,
    filters: LazyParams["filters"],
  ): boolean {
    return Object.entries(filters ?? {}).every(([key, meta]) => {
      const filter = Array.isArray(meta) ? meta[0] : meta;
      const value = filter?.value;
      if (value === null || value === undefined || value === "") return true;
      if (Array.isArray(value) && !value.length) return true;

      const cell = this.cellOf(row, key);
      switch (filter?.matchMode) {
        case "in":
          return (value as unknown[]).some((item) =>
            Array.isArray(cell) ? cell.includes(item) : cell === item,
          );
        case "equals":
          return String(cell) === String(value);
        case "dateRange":
          return this.inDateRange(cell, value as unknown[]);
        default:
          return String(cell ?? "")
            .toLowerCase()
            .includes(String(value).toLowerCase());
      }
    });
  }

  private inDateRange(cell: unknown, range: unknown[]): boolean {
    const from = this.midnight(range?.[0]);
    if (from === null) return true;
    const value = this.midnight(cell);
    if (value === null) return false;
    const to = this.midnight(range?.[1]);
    return to === null ? value >= from : value >= from && value <= to;
  }

  private midnight(value: unknown): number | null {
    if (value === null || value === undefined || value === "") return null;
    const date = new Date(value as string | number | Date);
    if (Number.isNaN(date.getTime())) return null;
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }

  private cellOf(row: DemoUser, key: string): unknown {
    return (row as unknown as Record<string, unknown>)[key];
  }

  private compare(a: unknown, b: unknown): number {
    if (a === b) return 0;
    if (a === null || a === undefined) return -1;
    if (b === null || b === undefined) return 1;
    if (typeof a === "number" && typeof b === "number") return a - b;
    return String(a).localeCompare(String(b));
  }
}
