"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck } from "lucide-react";
import type { ToolQuestion } from "@/lib/interactive-tool-data";
import { scoreQuestions } from "@/lib/tool-calculations";
import { BarRows, ResetButton, ResultActions, ToolCard } from "./tool-ui";

function Radar({ dimensions }: { dimensions: { name: string; score: number }[] }) {
  const count = dimensions.length;
  const point = (index: number, radius: number) => `${160 + Math.cos(index / count * Math.PI * 2 - Math.PI / 2) * radius},${160 + Math.sin(index / count * Math.PI * 2 - Math.PI / 2) * radius}`;
  return <svg className="it-radar" viewBox="0 0 320 320" role="img" aria-label={dimensions.map(dimension => `${dimension.name}: ${dimension.score} percent`).join(", ")}>
    {[25, 50, 75, 100].map(level => <polygon key={level} points={dimensions.map((_, index) => point(index, level * 1.15)).join(" ")} className="it-radar-grid" />)}
    {dimensions.map((dimension, index) => <line key={dimension.name} x1="160" y1="160" x2={point(index, 115).split(",")[0]} y2={point(index, 115).split(",")[1]} className="it-radar-grid" />)}
    <polygon points={dimensions.map((dimension, index) => point(index, dimension.score * 1.15)).join(" ")} className="it-radar-value" />
    {dimensions.map((dimension, index) => <text key={dimension.name} x={point(index, 140).split(",")[0]} y={point(index, 140).split(",")[1]} textAnchor="middle" dominantBaseline="middle">{dimension.name.split(" & ")[0].slice(0, 14)}</text>)}
  </svg>;
}

function PlatformResults({ questions, answers }: { questions: ToolQuestion[]; answers: Record<string, number[]> }) {
  const index = (id: string) => answers[id]?.[0] ?? 0;
  const scores = [
    { name: "Zapier", score: 50 + (3 - index("technical")) * 7 + (3 - index("complexity")) * 4 + (3 - index("timeline")) * 3 - index("volume") * 6, reason: "Best for a non-technical team that needs familiar app integrations and a quick launch.", route: "/workflow-automation" },
    { name: "Make", score: 65 + (3 - index("budget")) * 4 + Math.min(2, index("complexity")) * 5 - index("custom-dev") * 3, reason: "A visual option for multi-step scenarios, branching, and keeping a modest automation budget.", route: "/workflow-automation-agency" },
    { name: "n8n", score: 45 + index("technical") * 9 + index("volume") * 6 + index("complexity") * 5 + index("custom-dev") * 3, reason: "A strong fit for technical teams that want code, extensible workflows, and control over hosting.", route: "/n8n-agency" },
    { name: "Custom development", score: 20 + index("budget") * 5 + index("technical") * 4 + index("complexity") * 8 + index("custom-dev") * 8 + index("timeline") * 4, reason: "Consider a custom service when domain-specific logic, security requirements, or product integration justify the build.", route: "/custom-automation" },
  ].sort((a, b) => b.score - a.score);
  const top = scores[0];
  const text = `ManasFlow tool recommendation: ${top.name}\n${top.reason}\n\n${questions.map(question => `${question.text}\n${(answers[question.id] || []).map(answer => question.options[answer].label).join(", ")}`).join("\n\n")}`;
  return <><div className="it-result-heading"><CheckCircle2 /><p>Your best fit</p><h2>{top.name}</h2><p>{top.reason}</p></div><div className="it-recommendations">{scores.map((platform, index) => <div key={platform.name}><span>{index === 0 ? "Recommended" : "Also consider"}</span><h3>{platform.name}</h3><p>{platform.reason}</p><a href={platform.route}>Explore implementation <ArrowRight size={14} /></a></div>)}</div><p className="it-note">Recommendations use your answers about budget, technical skills, volume, complexity, development comfort, and timeline. This is a fit assessment, not a vendor endorsement or live pricing quote.</p><ResultActions text={text} /></>;
}

export function ToolAssessment({ slug, questions }: { slug: string; questions: ToolQuestion[] }) {
  const selector = slug === "ai-tool-selector";
  const grouped = !selector && slug !== "ai-maturity-quiz";
  const groups = grouped ? [...new Set(questions.map(question => question.pillar))] : questions.map(question => question.id);
  const [stage, setStage] = useState<"intro" | "questions" | "result">(selector ? "questions" : "intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const current = grouped ? questions.filter(question => question.pillar === groups[step]) : [questions[step]];
  const completed = current.every(question => answers[question.id]?.length);
  const reset = () => { setStage(selector ? "questions" : "intro"); setStep(0); setAnswers({}); };
  const choose = (question: ToolQuestion, optionIndex: number) => {
    setAnswers(previous => {
      const selected = previous[question.id] || [];
      return { ...previous, [question.id]: question.multiple ? selected.includes(optionIndex) ? selected.filter(index => index !== optionIndex) : [...selected, optionIndex] : [optionIndex] };
    });
  };
  if (stage === "intro") return <ToolCard className="it-assessment-intro"><ClipboardCheck size={46} /><h2>{slug === "ai-readiness-assessment" ? "Discover Your AI Readiness Score" : slug === "digital-transformation-scorecard" ? "How It Works" : slug === "ai-maturity-quiz" ? "Assess Your AI Maturity Level in 5 Minutes" : "How mature is your AI governance?"}</h2><p>Answer {questions.length} questions about your organization. Get a scored breakdown, see the areas that need attention, and build a practical action plan.</p><div className="it-pillar-chips">{[...new Set(questions.map(question => question.pillar))].map(pillar => <span key={pillar}>{pillar.replaceAll("-", " ")}</span>)}</div><p className="it-note">{questions.length} questions · Free · Instant results · Your answers stay in this browser tab</p><button className="it-primary" type="button" onClick={() => setStage("questions")}>Start Assessment<ArrowRight size={16} /></button></ToolCard>;
  if (stage === "result") {
    const scored = scoreQuestions(questions, Object.fromEntries(Object.entries(answers).map(([id, selected]) => [id, selected[0]])));
    const levels = slug === "ai-maturity-quiz" ? ["Aware", "Exploring", "Implementing", "Scaling", "Transforming"] : slug === "digital-transformation-scorecard" ? ["Traditional", "Emerging", "Developing", "Maturing", "Digital-First"] : slug === "ai-governance-maturity-assessment" ? ["Ad Hoc", "Emerging", "Defined", "Managed", "Adaptive"] : ["Beginner", "Developing", "Competent", "Advanced", "Leader"];
    const level = levels[Math.min(4, Math.max(0, Math.ceil(scored.score / 20) - 1))];
    const ranked = [...scored.dimensions].sort((a, b) => a.score - b.score);
    const text = `ManasFlow assessment\n${level}: ${scored.score}/100\n${scored.dimensions.map(dimension => `${dimension.name}: ${dimension.score}/100`).join("\n")}\n\nPriorities\n${ranked.slice(0, 3).map((dimension, index) => `${index + 1}. Strengthen ${dimension.name}: document a baseline, assign an owner, and run a measured pilot.`).join("\n")}`;
    return <ToolCard>{selector ? <PlatformResults questions={questions} answers={answers} /> : <><div className="it-result-heading"><CheckCircle2 /><p>Your assessment results</p><h2>{level}</h2><strong className="it-score">{scored.score}<small>/100</small></strong><p>{scored.score >= 80 ? "Your foundations are strong. Focus on measured scaling, ongoing evaluation, and responsible adoption." : "Your score shows where to focus next. Start with your lowest-scoring pillar and measure progress over the next 90 days."}</p></div><div className="it-score-details"><Radar dimensions={scored.dimensions} /><BarRows currency={false} rows={scored.dimensions.map(dimension => ({ label: dimension.name.replaceAll("-", " "), value: dimension.score }))} /></div><h3>Your 90-day action plan</h3><div className="it-recommendations">{ranked.slice(0, 3).map((dimension, index) => <div key={dimension.name}><span>Days {index * 30 + 1}–{(index + 1) * 30}</span><h3>Strengthen {dimension.name}</h3><p>{index === 0 ? "Establish a baseline, document the current process and data, and assign a business owner." : index === 1 ? "Run one contained pilot with clear success criteria, human review, and a defined budget." : "Evaluate the pilot, close gaps, train the team, and fund the next measurable step."}</p></div>)}</div><p className="it-note">This is a self-assessment based on your answers. It is a planning aid and does not certify readiness, compliance, or business outcomes.</p><ResultActions text={text} /></>}<ResetButton onClick={reset} label="Retake assessment" /></ToolCard>;
  }
  return <ToolCard><div className="it-step-label"><span>{grouped ? groups[step].replaceAll("-", " ") : `Question ${step + 1} of ${questions.length}`}</span><span>{Math.round(step / groups.length * 100)}% complete</span></div><progress className="it-progress" max={groups.length} value={step} aria-label="Assessment progress" /><form onSubmit={event => { event.preventDefault(); if (completed) { if (step === groups.length - 1) setStage("result"); else setStep(value => value + 1); } }}>{current.map(question => <fieldset className="it-question" key={question.id}><legend>{question.text}</legend>{question.subtitle && <p>{question.subtitle}</p>}<div className="it-answer-options">{question.options.map((option, index) => <label className={answers[question.id]?.includes(index) ? "it-answer selected" : "it-answer"} key={option.value}><input type={question.multiple ? "checkbox" : "radio"} name={question.id} checked={answers[question.id]?.includes(index) || false} onChange={() => choose(question, index)} /><span><strong>{option.label}</strong>{option.description && <small>{option.description}</small>}</span></label>)}</div></fieldset>)}<div className="it-step-actions"><button type="button" className="it-secondary" disabled={step === 0} onClick={() => setStep(value => value - 1)}><ArrowLeft size={15} />Back</button><button type="submit" className="it-primary" disabled={!completed}>{step === groups.length - 1 ? selector ? "Get recommendation" : "View results" : "Next"}<ArrowRight size={15} /></button></div></form></ToolCard>;
}
