import rawCatalog from "./generated/apiCatalog.json";
import { API_URL, getToken, removeToken, formatApiError } from "./api";

export type Schema = { type?: string; title?: string; format?: string; enum?: any[]; default?: any; anyOf?: Schema[]; properties?: Record<string, Schema>; additionalProperties?: Schema | boolean; items?: Schema; required?: string[]; minimum?: number; maximum?: number; exclusiveMinimum?: number; minLength?: number; maxLength?: number; minItems?: number; maxItems?: number };
export type Operation = { key: string; path: string; method: string; title: string; module: string; roles: string[]; parameters: { name: string; in: string; required?: boolean; schema: Schema }[]; body: Schema | null; media: string; handler: string; alias?: string | null; disabled?: string | null };
export const catalog = rawCatalog as Operation[];
export const operation = (key: string) => {
  const found = catalog.find(o => o.key === key);
  if (!found) throw new Error("This action is not available in the current application.");
  return found;
};
export const normalized = (s: Schema): Schema => s.anyOf ? { ...s, ...s.anyOf.find(x => x.type !== "null"), anyOf: undefined } : s;
export function initialValue(raw: Schema): any {
  const s = normalized(raw);
  if (s.default != null) return structuredClone(s.default);
  if (s.type === "object" || s.properties) return Object.fromEntries(Object.entries(s.properties || {}).filter(([k, v]) => s.required?.includes(k) || v.default != null).map(([k, v]) => [k, initialValue(v)]));
  if (s.type === "array") return Array.from({ length: s.minItems || 0 }, () => initialValue(s.items || {}));
  return "";
}
export function coerce(raw: Schema, value: any, required = false, label = "Value"): any {
  const s = normalized(raw);
  if (value === null && raw.anyOf?.some(option => option.type === "null")) return null;
  if (value === "" || value === undefined || value === null) {
    if (required) throw new Error(`${label} is required.`);
    return undefined;
  }
  if (s.format === "binary") {
    if (!(value instanceof File)) throw new Error(`${label}: choose a file.`);
    return value;
  }
  if (s.type === "object" || s.properties) {
    const out: Record<string, any> = {};
    for (const key of new Set([...Object.keys(value), ...(s.required || [])])) {
      if (["__proto__", "prototype", "constructor"].includes(key)) throw new Error("Invalid field name.");
      const child = s.properties?.[key] ?? (typeof s.additionalProperties === "object" ? s.additionalProperties : {});
      const converted = coerce(child, value[key], Boolean(s.required?.includes(key)), key.replaceAll("_", " "));
      if (converted !== undefined) out[key] = converted;
    }
    return out;
  }
  if (s.type === "array") {
    if (!Array.isArray(value)) throw new Error(`${label} must be a list.`);
    if (value.length < (s.minItems || 0) || value.length > (s.maxItems ?? Infinity)) throw new Error(`${label}: check the number of entries.`);
    return value.map((v, i) => coerce(s.items || {}, v, true, `${label} ${i + 1}`));
  }
  if (s.type === "integer" || s.type === "number") {
    const number = Number(value);
    if (!Number.isFinite(number) || (s.type === "integer" && !Number.isInteger(number))) throw new Error(`${label} must be a valid ${s.type}.`);
    if (number < (s.minimum ?? -Infinity) || number > (s.maximum ?? Infinity) || (s.exclusiveMinimum != null && number <= s.exclusiveMinimum)) throw new Error(`${label} is outside the allowed range.`);
    return number;
  }
  if (s.type === "boolean") return value === true || value === "true";
  let text = String(value);
  if (text.length < (s.minLength || 0) || text.length > (s.maxLength ?? Infinity)) throw new Error(`${label}: check the text length.`);
  if (s.enum && !s.enum.includes(value)) throw new Error(`${label}: choose one of the available values.`);
  if (s.format === "date-time") { const date = new Date(text); if (Number.isNaN(date.getTime())) throw new Error(`${label}: choose a valid date and time.`); text = date.toISOString(); }
  return text;
}
export function prepare(op: Operation, values: Record<string, any>, payload?: any) {
  let path = op.path;
  const query = new URLSearchParams();
  for (const p of op.parameters) {
    const value = coerce(p.schema, values[p.name], Boolean(p.required), p.name.replaceAll("_", " "));
    if (value === undefined) continue;
    if (p.in === "path") path = path.replace(`{${p.name}}`, encodeURIComponent(String(value)));
    if (p.in === "query") query.set(p.name, String(value));
  }
  if (/\{[^}]+\}/.test(path)) throw new Error("Select the required record first.");
  if (query.size) path += `?${query}`;
  const data = op.body ? coerce(op.body, payload, true) : undefined;
  let body: BodyInit | undefined;
  if (data !== undefined) {
    if (op.media.includes("multipart")) { const form = new FormData(); for (const [key, value] of Object.entries(data)) form.append(key, value as any); body = form; }
    else if (op.media.includes("x-www-form-urlencoded")) body = new URLSearchParams(data);
    else body = JSON.stringify(data);
  }
  return { path, body };
}
export async function execute(op: Operation, values: Record<string, any> = {}, payload?: any, signal?: AbortSignal): Promise<any> {
  if (op.disabled) throw new Error(op.disabled);
  const { path, body } = prepare(op, values, payload);
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !(body instanceof FormData)) headers["Content-Type"] = op.media;
  const response = await fetch(`${API_URL}${path}`, { method: op.method, headers, body, signal });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    if (response.status === 401 && token && token === getToken()) { removeToken(); window.dispatchEvent(new Event("auth:expired")); }
    throw new Error(formatApiError(data, response.status));
  }
  if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
  if (/application\/(pdf|octet-stream)|image\//.test(response.headers.get("content-type") || "")) return await response.blob();
  return response.status === 204 ? { message: "Saved successfully." } : response.json();
}
export const perform = (key: string, values: Record<string, any> = {}, payload?: any, signal?: AbortSignal) => execute(operation(key), values, payload, signal);
export function download(blob: Blob) {
  const extension = blob.type.includes("pdf") ? "pdf" : blob.type.includes("png") ? "png" : blob.type.includes("jpeg") ? "jpg" : "bin";
  const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `document.${extension}`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
