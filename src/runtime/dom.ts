export const $ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T | null =>
  root.querySelector<T>(selector);

export const $$ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] => [
  ...root.querySelectorAll<T>(selector),
];

/** localStorage that never throws (private mode, blocked storage, previews…). */
export const store = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage unavailable: preference just won't persist */
    }
  },
};

/** Run a DOM update inside a View Transition when supported and motion is allowed. */
export function withViewTransition(update: () => void, allowMotion: boolean): void {
  if (allowMotion && "startViewTransition" in document) document.startViewTransition(update);
  else update();
}
