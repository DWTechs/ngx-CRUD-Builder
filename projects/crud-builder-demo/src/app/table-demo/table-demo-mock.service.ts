import { Injectable } from "@angular/core";
import { CrudItemBase } from "@crud/core/models/crud-item-base.class";
import { HistorizedData } from "@crud/core/ui/history/history.model";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

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
      archived: false,
      archivedAt: null,
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
      archived: false,
      archivedAt: null,
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
      archived: false,
      archivedAt: null,
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
      archived: false,
      archivedAt: null,
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
      archived: false,
      archivedAt: null,
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
    archived: false,
    archivedAt: null,
  });

  /**
   * HTTP calls implementation with mocked data
   */
  public readonly httpCalls: Calls<DemoUser> = {
    get: () => {
      return of({
        rows: this.mockUsers,
        total: this.mockUsers.length,
      }).pipe(delay(500));
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
      // Note: Array should be ordered from newest to oldest (descending timestamp)
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      const oneWeek = 7 * oneDay;
      const oneMonth = 30 * oneDay;

      const mockedHistory: HistorizedData<DemoUser>[] = [
        // Current version (most recent)
        {
          old_val: { ...user },
          tstamp: now,
          who: "admin@example.com",
        },
        // Previous version - salary and subscription changed
        {
          old_val: {
            ...user,
            salary: (user.salary || 50000) - 5000,
            subscription: user.subscription === "premium" ? "basic" : "premium",
          },
          tstamp: now - oneWeek,
          who: "hr.manager@example.com",
        },
        // Older version - email and city changed
        {
          old_val: {
            ...user,
            salary: (user.salary || 50000) - 5000,
            subscription: user.subscription === "premium" ? "basic" : "premium",
            email: user.email.replace("@example.com", ".old@example.com"),
            city: user.city === "paris" ? "lyon" : "paris",
          },
          tstamp: now - oneMonth,
          who: user.name.toLowerCase().replace(" ", ".") + "@example.com",
        },
        // Even older - active status and languages changed
        {
          old_val: {
            ...user,
            salary: (user.salary || 50000) - 10000,
            subscription: "basic",
            email: user.email.replace("@example.com", ".old@example.com"),
            city: user.city === "paris" ? "lyon" : "paris",
            active: !user.active,
            languages: user.languages?.slice(0, 1) || ["en"],
          },
          tstamp: now - 2 * oneMonth,
          who: "system@example.com",
        },
        // Initial creation
        {
          old_val: {
            ...user,
            salary: (user.salary || 50000) - 15000,
            subscription: "basic",
            email: user.email.replace("@example.com", ".old@example.com"),
            city: user.city === "paris" ? "lyon" : "paris",
            active: false,
            languages: ["en"],
            description: "",
          },
          tstamp: now - 3 * oneMonth,
          who: "admin@example.com",
        },
      ];

      console.log({ mockedHistory });

      return of({ rows: mockedHistory, total: mockedHistory.length }).pipe(
        delay(300),
      );
    },
  };
}
