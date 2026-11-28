# ManasFlow — Automated Lead Nurturing & Follow-Up Templates (DRAFT / TEST MODE)

> **IMPORTANT:** All automated marketing emails and follow-up sequences below are **DRAFT TEMPLATES ONLY**. Do **not** activate live automated sequences without explicit business-owner approval, verified sender domain DKIM/SPF (`RESEND_FROM_EMAIL`), suppression/unsubscribe integration (`/api/newsletter/unsubscribe`), and GDPR/CAN-SPAM legal sign-off.

---

## 1. Consent & Separation Rules

1. **Strict Separation:** Submitting `/contact`, `/roi-calculator`, or `/industries` enquiries does **not** subscribe prospects to weekly marketing emails. Transactional confirmations cover only the requested deliverable or call.
2. **Suppression Triggers:** Every sequence must halt immediately inside n8n/ESP when ANY of the following occur:
   - Prospect replies directly to any message
   - Prospect books a call (`booking_completed` / `Discovery scheduled` stage)
   - Stage changes to `Contacted`, `Discovery completed`, `Proposal sent`, `Won`, or `Lost`
   - Prospect clicks unsubscribe (`/api/newsletter/unsubscribe`) or joins suppression list
3. **Frequency Cap:** Maximum 5 messages across 14 days for opt-in roadmap requests; minimum 48h cooldown between any automated touchpoints.

---

## 2. Draft Sequence (Opt-In Resource / ROI Assessment Flow)

### Immediate — Deliverable Confirmation (Transactional Only)
- **Subject:** `Your ManasFlow {{resource_name}} notes & next steps`
- **Body:**
  > Hi {{first_name}},
  >
  > Thanks for running the {{resource_name}} on ManasFlow. Here is your requested summary:
  > {{summary_block}}
  >
  > If you want a senior engineer to review your stack constraints and timeline live, you can pick a 30-minute slot here: https://cal.com/manasflow/30min
  >
  > Best,  
  > ManasFlow Engineering  
  > *Unsubscribe or update preferences: {{unsubscribe_url}}*

### Day 2 — Verified Reference Pattern (Opt-In Only)
- **Subject:** `How teams automate {{industry_or_goal}} without adding headcount`
- **Body:** Relevant verified case study link (`/case-studies`) matching the user's selected service/pattern (e.g., *Just Russel* for marketing ops, *Ordrix* / *AmbryHill* for document workflows, *Sage* / *Unmuted* for embedded engineers). Includes one-click unsubscribe footer.

### Day 5 — ROI & Implementation Reality Check (Opt-In Only)
- **Subject:** `3 bottlenecks that stall first AI workflows (and how to scope past them)`
- **Body:** Practical checklist covering credential isolation, human approval thresholds, and open-source vs SaaS cost separation — linking to `/security` and `/workflow-audit`.

### Day 9 — Interactive Workflow Sandbox Invite (Opt-In Only)
- **Subject:** `Test the {{service_focus}} approval queue live in 60 seconds`
- **Body:** Direct link to `/automation-demo` so technical stakeholders can inspect extraction fields and confidence thresholds before committing to a call.

### Day 14 — Final Low-Pressure Scoping Offer (Opt-In Only, Sequence Ends)
- **Subject:** `Still exploring {{workflow_topic}}?`
- **Body:** Final offer of a no-obligation 30-minute engineering review (`/consultation`) or pause until next quarter, followed by automatic exit from sequence.
