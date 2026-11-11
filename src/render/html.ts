/**
 * A tiny, dependency-free `html` tagged template.
 * Interpolated strings are HTML-escaped; nested `html` results are inserted as-is.
 */
export class SafeHtml {
  constructor(readonly value: string) {}
  toString(): string {
    return this.value;
  }
}

export type HtmlValue = string | number | SafeHtml | readonly HtmlValue[] | false | null | undefined;

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export const escape = (text: string): string => text.replace(/[&<>"']/g, (ch) => ESCAPES[ch] ?? ch);

function stringify(value: HtmlValue): string {
  if (value === null || value === undefined || value === false) return "";
  if (Array.isArray(value)) return value.map(stringify).join("");
  if (value instanceof SafeHtml) return value.value;
  return escape(String(value));
}

export function html(strings: TemplateStringsArray, ...values: HtmlValue[]): SafeHtml {
  let out = strings[0] ?? "";
  values.forEach((value, i) => {
    out += stringify(value) + (strings[i + 1] ?? "");
  });
  return new SafeHtml(out);
}

/** Mark a trusted string as HTML. */
export const raw = (value: string): SafeHtml => new SafeHtml(value);
