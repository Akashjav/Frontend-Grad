import { useState } from "react";
import { labelFor, secondary } from "./Fields";
const hidden = new Set(["password_hash", "access_token", "refresh_token", "token_hash", "storage_name"]);
export function RecordView({ value, onSelect, depth = 0 }: { value: any; onSelect?: (row: any) => void; depth?: number }) {
  const [page, setPage] = useState(0);
  if (value == null) return <span className="text-slate-400">Not set</span>;
  if (typeof value === "boolean") return <span>{value ? "Yes" : "No"}</span>;
  if (typeof value !== "object") {
    const text = String(value);
    if (/^https?:\/\//i.test(text)) return <a className="text-blue-700 underline break-all" href={text} target="_blank" rel="noreferrer">{text}</a>;
    return <span className="whitespace-pre-wrap break-words">{text}</span>;
  }
  if (Array.isArray(value)) {
    if (!value.length) return <p className="text-slate-500 py-3">No records found.</p>;
    const start = Math.min(page * 20, Math.max(0, Math.floor((value.length - 1) / 20) * 20));
    return <div className="space-y-3">{value.slice(start, start + 20).map((row, index) => <article className="rounded-xl border border-slate-200 bg-white p-4" key={row?.id ?? start + index}>
      {typeof row === "object" && row !== null && <h3 className="font-semibold mb-3">{row.title || row.name || row.display_name || row.email || row.topic || `Record ${row.id ?? start + index + 1}`}</h3>}
      <RecordView value={row} depth={depth + 1} />
      {onSelect && typeof row === "object" && row !== null && <button className={`${secondary} mt-3`} onClick={() => onSelect(row)}>Use this record</button>}
    </article>)}{value.length > 20 && <div className="flex items-center gap-3"><button className={secondary} disabled={start === 0} onClick={() => setPage(Math.max(0, page - 1))}>Previous</button><span className="text-sm">{start + 1}–{Math.min(start + 20, value.length)} of {value.length} loaded</span><button className={secondary} disabled={start + 20 >= value.length} onClick={() => setPage(page + 1)}>Next</button></div>}</div>;
  }
  return <dl className="grid gap-3 text-sm min-w-0">{Object.entries(value).filter(([key]) => !hidden.has(key)).map(([key, entry]) => <div key={key} className="min-w-0">
    {entry !== null && typeof entry === "object" ? <details open={depth === 0}><summary className="font-medium text-slate-600 cursor-pointer">{labelFor(key)}</summary><div className="pl-3 mt-2 border-l border-slate-200"><RecordView value={entry} depth={depth + 1} onSelect={onSelect} /></div></details> : <><dt className="text-slate-500 text-xs mb-0.5">{labelFor(key)}</dt><dd><RecordView value={entry} depth={depth + 1} /></dd></>}
  </div>)}</dl>;
}
