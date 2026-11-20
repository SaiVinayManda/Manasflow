"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Copy, Search, SlidersHorizontal, X } from "lucide-react";
import modelsData from "@/data/manasflow/models.json";
import { SubpageHero } from "./subpage-shared";
import "./model-directory.css";

type CatalogItem = {
  slug: string; name: string; provider: string; context: number | null;
  input: number | null; output: number | null; release: string; open: boolean;
  tasks: string[]; description: string; access: string; limits: string;
  creditCard: boolean | null; commercial: boolean | null; votes: number; snippet: string | null;
};
const paidModels: CatalogItem[] = modelsData.models.map(model => ({ slug: model.slug, name: model.name, provider: model.provider, context: model.contextWindow, input: model.inputPricePerMTok, output: model.outputPricePerMTok, release: model.releaseDate, open: model.openSource, tasks: model.bestFor, description: model.notes || model.pricingNote || `${model.family} model for ${model.bestFor.join(", ")}.`, access: model.openSource ? "Open weights" : "Proprietary", limits: model.pricingNote || "Published standard API pricing", creditCard: null, commercial: null, votes: 0, snippet: null }));
const freeModels: CatalogItem[] = modelsData.freeModels.map(model => ({ slug: model.slug, name: model.name, provider: model.provider, context: null, input: null, output: null, release: "", open: model.access === "open_weight", tasks: model.modality, description: model.howTo || model.freeLimits || "See the provider's terms and setup instructions.", access: model.access.replaceAll("_", " "), limits: model.freeLimits || "Check provider limits", creditCard: model.creditCard, commercial: model.commercial, votes: model.votes, snippet: model.snippet }));
const currency = (value: number | null) => value === null ? "Not published" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: value < 1 ? 3 : 2 }).format(value);
const contextLabel = (value: number | null) => value === null ? "Not published" : value >= 1_000_000 ? `${(value / 1_048_576).toFixed(value % 1_048_576 === 0 ? 0 : 1)}M` : `${Math.round(value / 1024)}K`;
const monthlyCost = (model: CatalogItem, inputM: number, outputM: number) => model.input === null || model.output === null ? null : inputM * model.input + outputM * model.output;
const pageSize = 12;

function UsageInputs({ inputM, outputM, setUsage }: { inputM: number; outputM: number; setUsage: (inputM: number, outputM: number) => void }) {
  const number = (value: string) => Math.max(0, Math.min(1_000_000_000, Number.isFinite(Number(value)) ? Number(value) : 0));
  return <section className="mf-model-usage" aria-labelledby="usage-heading"><div><span className="mf-model-eyebrow">Your workload</span><h2 id="usage-heading">What would it cost each month?</h2><p>Adjust your token volume to compare standard API costs. Prices and catalog entries are an October 2026 snapshot.</p></div>
    <div><div className="mf-model-presets" role="group" aria-label="Monthly usage presets">{modelsData.usagePresets.map(preset => <button type="button" key={preset.label} aria-pressed={inputM === preset.inputM && outputM === preset.outputM} onClick={() => setUsage(preset.inputM, preset.outputM)}><strong>{preset.label}</strong><span>{preset.sub}</span></button>)}</div>
      <div className="mf-model-token-inputs"><label>Input tokens / month<span><input type="number" min="0" max="1000000000" step="0.1" value={inputM} onChange={event => setUsage(number(event.target.value), outputM)} />million</span></label><label>Output tokens / month<span><input type="number" min="0" max="1000000000" step="0.1" value={outputM} onChange={event => setUsage(inputM, number(event.target.value))} />million</span></label></div>
      <p className="mf-model-formula">Monthly estimate = input millions × input price + output millions × output price. Excludes caching, batch discounts, infrastructure, and taxes.</p>
    </div>
  </section>;
}

function ModelComparison({ selected, inputM, outputM, remove }: { selected: CatalogItem[]; inputM: number; outputM: number; remove: (slug: string) => void }) {
  const metrics: { label: string; value: (model: CatalogItem) => string }[] = [
    { label: "Provider", value: model => model.provider },
    { label: "Context window", value: model => contextLabel(model.context) },
    { label: "Input / 1M tokens", value: model => currency(model.input) },
    { label: "Output / 1M tokens", value: model => currency(model.output) },
    { label: "Estimated monthly cost", value: model => currency(monthlyCost(model, inputM, outputM)) },
    { label: "Weights", value: model => model.access },
    { label: "Common workloads", value: model => model.tasks.join(", ") || "Not published" },
  ];
  return <section id="model-comparison" className="mf-model-comparison" aria-labelledby="comparison-heading"><div className="mf-model-section-title"><div><span className="mf-model-eyebrow">Side by side</span><h2 id="comparison-heading">Compare your shortlist</h2></div><p>Select up to 3 models from the directory.</p></div>
    {selected.length ? <div className="mf-model-table-scroll"><table><thead><tr><th scope="col">Specification</th>{selected.map(model => <th scope="col" key={model.slug}><div className="mf-model-comparison-name"><Link href={`/models/${model.slug}`}>{model.name}</Link><button type="button" onClick={() => remove(model.slug)} aria-label={`Remove ${model.name} from comparison`}><X size={16} /></button></div></th>)}</tr></thead><tbody>{metrics.map(metric => <tr key={metric.label}><th scope="row">{metric.label}</th>{selected.map(model => <td key={model.slug} className={metric.label === "Estimated monthly cost" ? "mf-model-cost" : ""}>{metric.value(model)}</td>)}</tr>)}</tbody></table></div> : <div className="mf-model-comparison-empty"><SlidersHorizontal size={26} /><p>Choose models using their Compare checkboxes to see specifications and costs together.</p></div>}
  </section>;
}

function ModelCard({ model, free, selected, limitReached, toggle }: { model: CatalogItem; free: boolean; selected: boolean; limitReached: boolean; toggle: () => void }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  async function copySnippet() {
    if (!model.snippet) return;
    try { await navigator.clipboard.writeText(model.snippet); setCopied(true); setCopyError(false); } catch { setCopyError(true); }
  }
  return <article className={`mf-model-card${selected ? " mf-model-card-selected" : ""}`}>
    <div className="mf-model-card-top"><span>{model.provider}</span><span className="mf-model-open">{free ? model.access : model.open ? "Open weights" : "API"}</span></div>
    <h2><Link href={`${free ? "/free-models" : "/models"}/${model.slug}`}>{model.name}<ArrowUpRight size={16} aria-hidden="true" /></Link></h2>
    <div className="mf-model-task-tags">{model.tasks.slice(0, 4).map(task => <span key={task}>{task}</span>)}</div>
    <p className="mf-model-description">{model.description}</p>
    {free ? <><dl className="mf-model-free-specs"><div><dt>Free access</dt><dd>{model.limits}</dd></div><div><dt>Credit card</dt><dd>{model.creditCard === null ? "Check provider" : model.creditCard ? "Required" : "Not required"}</dd></div><div><dt>Commercial use</dt><dd>{model.commercial === null ? "Check license" : model.commercial ? "Permitted" : "Restricted"}</dd></div></dl><details className="mf-model-how"><summary>How to use <ChevronDown size={15} /></summary><p>{model.description}</p>{model.snippet && <><pre><code>{model.snippet}</code></pre><button type="button" onClick={copySnippet}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy setup"}</button>{copyError && <p role="status">Select the code above to copy it manually.</p>}</>}<Link href={`/free-models/${model.slug}`}>View setup details<ArrowRight size={14} /></Link></details><div className="mf-model-catalog-votes">{model.votes} catalog votes</div></> : <><dl><div><dt>Context</dt><dd>{contextLabel(model.context)}</dd></div><div><dt>Input / 1M</dt><dd>{currency(model.input)}</dd></div><div><dt>Output / 1M</dt><dd>{currency(model.output)}</dd></div></dl><label className="mf-model-compare-control"><input type="checkbox" checked={selected} disabled={!selected && limitReached} onChange={toggle} />Compare<span>{selected ? "Selected" : "Add to shortlist"}</span></label></>}
  </article>;
}

export function ModelDirectory({ free = false, pricing = false, initialPage = 1, basePath = free ? "/directory" : pricing ? "/ai-model-pricing-index" : "/ai-model-comparison" }: { free?: boolean; pricing?: boolean; initialPage?: number; basePath?: string }) {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState("All providers");
  const [task, setTask] = useState("All workloads");
  const [access, setAccess] = useState("All access");
  const [sort, setSort] = useState(free ? "popular" : pricing ? "cost" : "newest");
  const [page, setPage] = useState(initialPage);
  useEffect(() => {
    const restorePage = () => setPage(Math.max(1, Number.parseInt(new URLSearchParams(window.location.search).get("page") || "1", 10) || 1));
    window.addEventListener("popstate", restorePage);
    return () => window.removeEventListener("popstate", restorePage);
  }, []);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [inputM, setInputM] = useState(10);
  const [outputM, setOutputM] = useState(2);
  const models = free ? freeModels : paidModels;
  const providers = [...new Set(models.map(model => model.provider))].sort();
  const tasks = [...new Set(models.flatMap(model => model.tasks))].sort();
  const accessTypes = [...new Set(models.map(model => model.access))].sort();
  const filtered = useMemo(() => models.filter(model => `${model.name} ${model.provider} ${model.tasks.join(" ")}`.toLowerCase().includes(search.trim().toLowerCase()) && (provider === "All providers" || model.provider === provider) && (task === "All workloads" || model.tasks.includes(task)) && (access === "All access" || model.access === access)).sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "provider") return a.provider.localeCompare(b.provider) || a.name.localeCompare(b.name);
    if (sort === "context") return (b.context ?? -1) - (a.context ?? -1);
    if (sort === "input") return (a.input ?? Infinity) - (b.input ?? Infinity);
    if (sort === "output") return (a.output ?? Infinity) - (b.output ?? Infinity);
    if (sort === "cost") return (monthlyCost(a, inputM, outputM) ?? Infinity) - (monthlyCost(b, inputM, outputM) ?? Infinity);
    if (sort === "popular") return b.votes - a.votes;
    return b.release.localeCompare(a.release);
  }), [models, search, provider, task, access, sort, inputM, outputM]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selected = selectedSlugs.flatMap(slug => paidModels.find(model => model.slug === slug) || []);
  function toggle(slug: string) { setSelectedSlugs(previous => previous.includes(slug) ? previous.filter(item => item !== slug) : previous.length < 3 ? [...previous, slug] : previous); }
  function setUsage(input: number, output: number) { setInputM(input); setOutputM(output); }
  function resetFilters() { setSearch(""); setProvider("All providers"); setTask("All workloads"); setAccess("All access"); setPage(1); }
  const faq = free ? modelsData.faqs["free-models"] : pricing ? modelsData.faqs["models--pricing"] : modelsData.faqs.models;
  return <div className="mf-model-page"><SubpageHero badge={free ? "Free Model Directory" : pricing ? "API Pricing Index" : "Model Comparison"} title={free ? "Free AI Models" : pricing ? "AI Model Pricing Index" : "AI Model Comparison"} description={free ? "Explore free API tiers, open-weight models, and no-signup tools. Filter by provider, modality, and access to find the right starting point." : pricing ? "Published input and output pricing in one place. Estimate your monthly token costs and compare providers for your actual workload." : "Compare model context windows, published API prices, and workloads. Shortlist up to three models and review them side by side."}><div className="mf-model-switch"><Link className={!free && !pricing ? "active" : ""} href="/ai-model-comparison">Compare models</Link><Link className={free ? "active" : ""} href="/directory">Free directory</Link><Link className={pricing ? "active" : ""} href="/ai-model-pricing-index">Pricing index</Link></div><p className="mf-model-snapshot">ManasFlow catalog snapshot · October 2026 · Verify provider terms before use</p></SubpageHero>
    <section className="mf-model-content">
      {!free && <UsageInputs inputM={inputM} outputM={outputM} setUsage={setUsage} />}
      <div className="mf-model-filter-panel"><div className="mf-model-search"><Search size={18} aria-hidden="true" /><label htmlFor="model-search" className="sr-only">Search models or providers</label><input id="model-search" type="search" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} placeholder="Search models or providers..." /></div><div className="mf-model-selects"><label><span>Provider</span><select value={provider} onChange={event => { setProvider(event.target.value); setPage(1); }}><option>All providers</option>{providers.map(item => <option key={item}>{item}</option>)}</select></label><label><span>{free ? "Modality" : "Workload"}</span><select value={task} onChange={event => { setTask(event.target.value); setPage(1); }}><option>All workloads</option>{tasks.map(item => <option key={item}>{item}</option>)}</select></label><label><span>Access</span><select value={access} onChange={event => { setAccess(event.target.value); setPage(1); }}><option>All access</option>{accessTypes.map(item => <option key={item}>{item}</option>)}</select></label><label><span>Sort by</span><select value={sort} onChange={event => { setSort(event.target.value); setPage(1); }}><option value="name">Name A–Z</option><option value="provider">Provider</option>{free ? <option value="popular">Catalog votes</option> : <><option value="newest">Newest release</option><option value="context">Largest context</option><option value="input">Lowest input price</option><option value="output">Lowest output price</option><option value="cost">Lowest monthly estimate</option></>}</select></label></div></div>
      <div className="mf-model-results-bar"><p role="status" aria-live="polite"><strong>{filtered.length}</strong> of {models.length} {free ? "free models" : "models"}{search && <> matching “{search}”</>}</p><button type="button" onClick={resetFilters}>Clear filters<X size={13} /></button></div>
      {!visible.length ? <div className="mf-model-no-results"><Search size={30} /><h2>No matching models</h2><p>Try another name, provider, or workload.</p><button type="button" onClick={resetFilters}>Reset filters</button></div> : pricing ? <div className="mf-model-table-scroll"><table className="mf-model-pricing-table"><thead><tr><th scope="col">Model / provider</th><th scope="col">Context</th><th scope="col">Input / 1M</th><th scope="col">Output / 1M</th><th scope="col">Monthly estimate</th><th scope="col">Compare</th></tr></thead><tbody>{visible.map(model => <tr key={model.slug}><th scope="row"><Link href={`/models/${model.slug}`}>{model.name}<ArrowUpRight size={13} /></Link><span>{model.provider}</span></th><td>{contextLabel(model.context)}</td><td>{currency(model.input)}</td><td>{currency(model.output)}</td><td className="mf-model-cost">{currency(monthlyCost(model, inputM, outputM))}</td><td><input type="checkbox" checked={selectedSlugs.includes(model.slug)} disabled={!selectedSlugs.includes(model.slug) && selectedSlugs.length >= 3} onChange={() => toggle(model.slug)} aria-label={`Compare ${model.name}`} /></td></tr>)}</tbody></table></div> : <div className="mf-model-grid">{visible.map(model => <ModelCard key={model.slug} model={model} free={free} selected={selectedSlugs.includes(model.slug)} limitReached={selectedSlugs.length >= 3} toggle={() => toggle(model.slug)} />)}</div>}
      {pages > 1 && <nav className="mf-model-pagination" aria-label="Model pages">{currentPage > 1 ? <Link href={currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`} onClick={() => setPage(currentPage - 1)}><ArrowLeft size={16} />Previous</Link> : <button type="button" disabled><ArrowLeft size={16} />Previous</button>}<span>Page {currentPage} of {pages}</span>{currentPage < pages ? <Link href={`${basePath}?page=${currentPage + 1}`} onClick={() => setPage(currentPage + 1)}>Next<ArrowRight size={16} /></Link> : <button type="button" disabled>Next<ArrowRight size={16} /></button>}</nav>}
      {!free && <><div className="mf-model-shortlist" role="status" aria-live="polite"><span>{selected.length}/3 selected{selected.length === 3 && " · Comparison limit reached"}</span><a href="#model-comparison">Compare selected<ArrowRight size={15} /></a>{selected.length > 0 && <button type="button" onClick={() => setSelectedSlugs([])}>Clear</button>}</div><ModelComparison selected={selected} inputM={inputM} outputM={outputM} remove={toggle} /></>}
      <section className="mf-model-faq"><span className="mf-model-eyebrow">How to read the directory</span><h2>{free ? "Free model questions" : pricing ? "Understanding API pricing" : "Model comparison questions"}</h2>{faq.map((item, index) => <details key={item.question} name="model-faq"><summary>{item.question}<ChevronDown size={16} /></summary><p>{index === 2 && !free && !pricing ? "Select up to three models with the Compare checkboxes, then open the shortlist table. Adjust monthly input and output volumes to calculate the cost of the same workload across all selected models." : item.answer}</p></details>)}</section>
    </section>
  </div>;
}
