"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowRight, Check, Copy, Download, RotateCcw } from "lucide-react";
import type { Metric } from "@/lib/tool-calculations";
import type { NumberField } from "@/lib/calculator-config";

export function money(value: number, decimals = 0) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: decimals }).format(value);
}

export function ToolCard({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return <section className={`it-card ${className}`}>{title && <h2>{title}</h2>}{children}</section>;
}

export function NumberControl({ field, value, onChange }: { field: NumberField; value: number; onChange: (value: number) => void }) {
  return <label className="it-field" htmlFor={`it-${field.id}`}><span>{field.label}</span><input id={`it-${field.id}`} name={field.id} type="number" min={field.min ?? 0} max={field.max} step={field.step ?? 1} required value={value} onChange={event => onChange(Number(event.target.value))} />{field.help && <small>{field.help}</small>}</label>;
}

export function SelectControl({ id, label, value, options, onChange }: { id: string; label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="it-field" htmlFor={`it-${id}`}><span>{label}</span><select id={`it-${id}`} value={value} onChange={event => onChange(event.target.value)}>{options.map(option => <option key={option}>{option}</option>)}</select></label>;
}

export function TextControl({ id, label, value, onChange, placeholder, required = false }: { id: string; label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean }) {
  return <label className="it-field" htmlFor={`it-${id}`}><span>{label}</span><input id={`it-${id}`} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} required={required} maxLength={200} /></label>;
}

export function ToolSubmit({ children = "Calculate results" }: { children?: ReactNode }) {
  return <button type="submit" className="it-primary">{children}<ArrowRight size={16} /></button>;
}

export function ResetButton({ onClick, label = "Start again" }: { onClick: () => void; label?: string }) {
  return <button type="button" className="it-secondary" onClick={onClick}><RotateCcw size={15} />{label}</button>;
}

export function Metrics({ metrics }: { metrics: Metric[] }) {
  return <div className="it-metrics">{metrics.map((metric, index) => <div className={index === 0 ? "it-metric it-metric-highlight" : "it-metric"} key={metric.label}><span>{metric.label}</span><strong>{typeof metric.value === "number" ? metric.format === "currency" ? money(metric.value, Math.abs(metric.value) < 10 ? 2 : 0) : metric.format === "percent" ? `${Math.round(metric.value)}%` : Math.round(metric.value).toLocaleString("en-US") : metric.value}</strong>{metric.detail && <small>{metric.detail}</small>}</div>)}</div>;
}

export function BarRows({ rows, currency = true }: { rows: { label: string; value: number }[]; currency?: boolean }) {
  const max = Math.max(1, ...rows.map(row => Math.abs(row.value)));
  return <div className="it-bars">{rows.map(row => <div key={row.label}><div><span>{row.label}</span><strong>{currency ? money(row.value) : `${row.value}%`}</strong></div><div className="it-bar-track"><div className={row.value < 0 ? "it-bar-negative" : ""} style={{ width: `${Math.min(100, Math.abs(row.value) / max * 100)}%` }} /></div></div>)}</div>;
}

export function ResultActions({ text, filename = "manasflow-results" }: { text: string; filename?: string }) {
  const [message, setMessage] = useState("");
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setMessage("Copied"); }
    catch { setMessage("Clipboard unavailable. Use Download results to save a copy."); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = `${filename}.txt`; link.click();
    URL.revokeObjectURL(url);
  };
  return <div className="it-result-actions"><button type="button" className="it-secondary" onClick={copy}>{message === "Copied" ? <Check size={15} /> : <Copy size={15} />}Copy results</button><button type="button" className="it-secondary" onClick={download}><Download size={15} />Download results</button><span role="status">{message}</span></div>;
}
