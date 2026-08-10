/**
 * Global test setup for the ngx-crud-builder library.
 * Polyfills APIs that jsdom does not implement but are required by
 * Optimus UI components and some specs.
 */

// ── ResizeObserver ────────────────────────────────────────────────────────────
// Optimus UI's FrozenColumn (and other components) call ResizeObserver in
// ngAfterViewInit. jsdom does not implement it.
if (typeof ResizeObserver === "undefined") {
  (globalThis as unknown as Record<string, unknown>).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// ── DragEvent ─────────────────────────────────────────────────────────────────
// jsdom does not implement DragEvent. We extend MouseEvent which IS available.
if (typeof DragEvent === "undefined") {
  (globalThis as unknown as Record<string, unknown>).DragEvent =
    class DragEvent extends MouseEvent {
      dataTransfer: DataTransfer | null;
      constructor(type: string, init?: DragEventInit) {
        super(type, init);
        this.dataTransfer = init?.dataTransfer ?? null;
      }
    };
}

// ── DataTransfer ──────────────────────────────────────────────────────────────
// jsdom does not implement DataTransfer (needed by file-upload specs).
if (typeof DataTransfer === "undefined") {
  (globalThis as unknown as Record<string, unknown>).DataTransfer =
    class DataTransfer {
      private _files: File[] = [];

      readonly items: {
        add: (file: File) => void;
        remove: (index: number) => void;
        clear: () => void;
      };

      constructor() {
        const files = this._files;
        this.items = {
          add: (file: File) => files.push(file),
          remove: (index: number) => files.splice(index, 1),
          clear: () => files.splice(0, files.length),
        };
      }

      get files(): FileList {
        const files = this._files;
        const fileList = {
          length: files.length,
          item: (i: number) => files[i] ?? null,
          [Symbol.iterator]: function* () {
            yield* files;
          },
        } as unknown as FileList;
        files.forEach((f, i) => {
          (fileList as never as Record<number, File>)[i] = f;
        });
        return fileList;
      }
    };
}

// ── matchMedia ────────────────────────────────────────────────────────────────
// jsdom does not implement window.matchMedia. Optimus UI PickList (and others) call
// it during component initialization.
if (typeof window !== "undefined" && typeof window.matchMedia === "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  });
}

// ── HTMLInputElement.files setter patch ───────────────────────────────────────// jsdom validates that the assigned value is its own internal FileList instance.
// When using our DataTransfer polyfill the value is a plain object, so jsdom
// throws. We intercept the setter and fall back to Object.defineProperty, which
// shadows the prototype getter/setter on the specific element and bypasses the
// type check entirely.
{
  const inputDescriptor = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "files",
  );
  if (inputDescriptor?.set) {
    const originalSetter = inputDescriptor.set;
    Object.defineProperty(HTMLInputElement.prototype, "files", {
      get: inputDescriptor.get,
      set(value: unknown) {
        try {
          originalSetter.call(this, value);
        } catch {
          // jsdom rejected the value (not a real FileList); bypass via own property.
          Object.defineProperty(this, "files", {
            value,
            configurable: true,
            writable: true,
          });
        }
      },
      configurable: true,
    });
  }
}
