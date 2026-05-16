// Seed role definitions with full daily/weekly/monthly activities.
const a = (key, title, desc, category, evidence = false) => ({ key, title, desc, category, evidence });

export const ROLES = {
  Supervisor: {
    title: "Team Lead / Supervisor", short: "Supervisor", icon: "S",
    purpose: "Owns daily delivery for a process pod, drives SLA, quality, control adherence, and team engagement.",
    daily: [
      a("huddle", "Pre-shift huddle / DOR", "Align team on goals, risks and priorities before shift.", "People"),
      a("rt_monitor", "Real-time queue / volume / SLA monitoring", "Watch live queues to defend SLA throughout the shift.", "Operations"),
      a("sampling", "Side-by-side / case sampling", "Sample live work to coach in the moment.", "Quality"),
      a("coaching", "1:1 coaching", "At least one focused coaching conversation.", "People"),
      a("escalations", "Escalation handling", "Resolve or route open escalations.", "Operations"),
      a("approvals", "Approvals & exceptions per DOA", "Approve within delegation of authority.", "Compliance"),
      a("eod_pack", "EOD reporting & scorecard", "Publish end-of-day pack with scorecard.", "Reporting", true),
      a("wellness", "Wellness / engagement check-in", "Quick pulse on team wellbeing.", "People"),
    ],
    weekly: [
      a("perf_review", "Performance review (1:1 each agent)", "Document weekly 1:1 with each agent.", "People", true),
      a("pip", "Bottom-quartile PIP / action plan", "Action plan for bottom quartile performers.", "People", true),
      a("calibration", "QA calibration session", "Calibrate with QA on a sample set.", "Quality"),
      a("refresh_quiz", "Knowledge refresh / SOP quiz", "Run a knowledge refresh or quiz.", "Training"),
      a("roster", "Roster & leave plan with WFM", "Align next-week roster and leaves.", "WFM"),
      a("rr", "R&R nominations", "Nominate stand-out performers.", "People"),
      a("shrinkage", "Shrinkage / attrition signals", "Surface attrition / shrinkage risk.", "People"),
    ],
    monthly: [
      a("mbr_input", "Monthly Business Review input", "Provide MBR inputs and narrative.", "Reporting", true),
      a("skip_level", "Skip-level / engagement pulse", "Run skip-level engagement pulse.", "People"),
      a("appraisals", "Appraisals / scorecards", "Close monthly appraisals with evidence.", "People", true),
      a("pip_close", "PIP closure / extension", "Close or extend PIPs with documentation.", "People", true),
      a("compliance_train", "Compliance & mandatory training assurance", "Confirm 100% mandatory training completion.", "Compliance", true),
      a("capacity_ask", "Capacity / hiring ask", "Submit capacity / hiring requirements.", "WFM"),
    ],
  },

  Manager: {
    title: "Operations Manager", short: "Manager", icon: "M",
    purpose: "Owns end-to-end delivery for an LOB, accountable for SLA, P&L, governance, attrition, and CI.",
    daily: [
      a("dor", "Daily Operations Review (DOR)", "Lead the DOR across pods.", "Operations"),
      a("client_check", "Client / stakeholder check-in", "Touch base with client / stakeholder.", "Client"),
      a("rt_sla_risk", "Real-time SLA risk", "Triage live SLA risks across pods.", "Operations"),
      a("floor_walk", "Walk-the-floor / virtual rounds", "Be visible on the floor / on calls.", "People"),
      a("approvals_doa", "Approvals (high-value, write-offs, exceptions)", "Approve high-value items per DOA.", "Compliance"),
      a("risk_log", "Risk & incident log", "Update the risk and incident log.", "Compliance"),
      a("eod_signoff", "EOD performance review sign-off", "Sign off the EOD performance pack.", "Reporting", true),
    ],
    weekly: [
      a("wbr", "Weekly Business Review (WBR)", "Run the WBR with leadership.", "Governance", true),
      a("client_gov", "Client governance call", "Lead client governance call.", "Client", true),
      a("hiring", "Hiring & attrition review", "Review pipeline and attrition.", "People"),
      a("calibration_co", "QA calibration & defect deep-dive", "Deep-dive defect patterns with QA.", "Quality"),
      a("coaching_audit", "Coaching audits", "Audit supervisor coaching quality.", "Quality"),
      a("cost_util", "Cost / utilization review", "Review utilization and cost levers.", "Finance"),
      a("ci_pipeline", "CI / Kaizen pipeline review", "Review CI / Kaizen pipeline.", "CI"),
    ],
    monthly: [
      a("client_mbr", "Monthly Business Review with client", "Run the client MBR.", "Client", true),
      a("internal_mbr", "Internal MBR / Ops review", "Run internal MBR.", "Governance", true),
      a("headcount", "Headcount & roster plan lock", "Lock monthly headcount and roster plan.", "WFM"),
      a("perf_cycle", "Performance management cycle", "Close monthly performance cycle.", "People", true),
      a("compliance_attest", "Risk & compliance attestation", "Submit risk and compliance attestation.", "Compliance", true),
      a("fin_forecast", "Financial forecast & invoice readiness", "Confirm forecast and invoice readiness.", "Finance"),
      a("ci_showcase", "CI / Black Belt savings showcase", "Showcase CI savings to stakeholders.", "CI"),
    ],
  },

  QA: {
    title: "Quality Analyst (QA)", short: "QA", icon: "Q",
    purpose: "Audits transactions and contacts, partners on controls, and drives defect reduction and calibration.",
    daily: [
      a("audits", "Audit sampling & evaluation", "Complete the day's audit sample.", "Quality"),
      a("tag_rca", "Defect tagging & RCA", "Tag defects and capture RCA.", "Quality"),
      a("feedback", "Real-time feedback (24-hr SLA)", "Provide feedback within SLA.", "Quality", true),
      a("coach_support", "Coaching support", "Support supervisor coaching with evidence.", "People"),
      a("esc_audit", "Escalation / high-risk audit (100%)", "100% audit of escalations / high risk.", "Compliance"),
      a("sox_audit", "SOX / control test audits", "Execute scheduled SOX / control tests.", "Compliance", true),
      a("qa_pack", "EOD QA pack publish", "Publish EOD QA pack.", "Reporting", true),
    ],
    weekly: [
      a("calibration_run", "Calibration session", "Run weekly calibration.", "Quality", true),
      a("pareto_rca", "Defect Pareto & RCA partnership", "Partner with Ops on top defect Pareto.", "Quality"),
      a("refresher_need", "Refresher need analysis", "Identify refresher needs.", "Training"),
      a("nht_audit", "New-hire audits", "Audit nesting / new-hire cohort.", "Quality"),
      a("sample_plan", "Sample plan review", "Refresh sample plan as needed.", "Quality"),
    ],
    monthly: [
      a("mqr", "Monthly Quality Review (MQR)", "Run the MQR.", "Reporting", true),
      a("form_review", "Form / rubric review", "Review and refine QA rubric.", "Quality"),
      a("calib_variance", "Calibration variance trend", "Track calibration variance.", "Quality"),
      a("aaa", "Audit-the-Auditor (AAA)", "Run AAA to validate QA quality.", "Quality", true),
      a("compliance_audits", "Compliance / privacy / control audits", "Run monthly compliance audits.", "Compliance", true),
    ],
  },

  Trainer: {
    title: "Trainer / L&D", short: "Trainer", icon: "T",
    purpose: "Owns NHT, nesting, refresher, and upskilling. Builds learning content and partners with QA on defect-led training.",
    daily: [
      a("nht_delivery", "NHT / batch delivery", "Deliver scheduled NHT session.", "Training", true),
      a("floor_support", "Floor support / nesting", "Support nesting cohort on the floor.", "Training"),
      a("quiz", "Daily quiz / knowledge check", "Run a daily knowledge check.", "Training", true),
      a("kb_update", "Knowledge base updates", "Update KB articles.", "Content"),
      a("trainee_coach", "Trainee coaching", "1:1 coaching for trainees.", "People"),
      a("lms_track", "LMS / training tracker update", "Keep LMS tracker current.", "Reporting"),
    ],
    weekly: [
      a("refresher", "Refresher delivery (QA-Pareto driven)", "Deliver refresher based on QA Pareto.", "Training", true),
      a("throughput", "Throughput review", "Review trainee throughput.", "Reporting"),
      a("ttt", "TTT / mock processing", "Run TTT or mock processing.", "Training"),
      a("stake_sync", "Stakeholder sync (QA, Ops, WFM)", "Sync with QA, Ops, and WFM.", "Governance"),
      a("content_gap", "Content gap review", "Review content gaps from quizzes / QA.", "Content"),
    ],
    monthly: [
      a("tei", "Training Effectiveness Index (TEI)", "Compute and share TEI.", "Reporting", true),
      a("content_audit", "Content audit & version control", "Audit content and versions.", "Content"),
      a("calendar", "Annual training calendar refresh", "Refresh rolling training calendar.", "Training"),
      a("compliance_train_assure", "Compliance training assurance", "Confirm compliance training completion.", "Compliance", true),
      a("cert_renew", "Trainer certification currency", "Renew trainer certifications.", "People"),
    ],
  },

  WFM: {
    title: "Workforce Management Analyst", short: "WFM", icon: "W",
    purpose: "Forecasts volume, schedules capacity, manages real-time adherence and shrinkage.",
    daily: [
      a("rt_volume", "Volume & SLA tracking", "Track live volume and SLA.", "Operations"),
      a("adherence", "Schedule & aux adherence monitoring", "Monitor schedule and aux adherence.", "WFM"),
      a("shrinkage_mgmt", "Shrinkage management", "Manage shrinkage versus budget.", "WFM"),
      a("reforecast", "Intraday reforecast", "Reforecast intraday as needed.", "WFM"),
      a("outage", "Outage / incident response", "Respond to outages / incidents.", "Operations"),
      a("backlog", "Backlog & aging tracking", "Track backlog and aging.", "Operations", true),
      a("scorecard", "Daily scorecard publish", "Publish daily WFM scorecard.", "Reporting", true),
    ],
    weekly: [
      a("weekly_forecast", "Next-week forecast", "Lock next-week forecast.", "WFM", true),
      a("roster_publish", "Roster generation & publish", "Generate and publish roster.", "WFM", true),
      a("capacity_plan", "Capacity & hiring plan refresh", "Refresh capacity / hiring plan.", "WFM"),
      a("perf_review_ops", "Performance review with Ops", "Review performance with Ops.", "Governance"),
      a("leave_lock", "Leave management within shrinkage budget", "Manage leave to shrinkage budget.", "WFM"),
    ],
    monthly: [
      a("monthly_forecast", "30/60/90 forecast & FTE plan", "Lock 30/60/90 plan.", "WFM", true),
      a("fa_mbr", "Forecast accuracy MBR", "Run forecast accuracy MBR.", "Reporting", true),
      a("shrink_attrition", "Shrinkage & attrition trend", "Trend shrinkage and attrition.", "WFM"),
      a("bcp", "BCP / peak / month-end plan", "Refresh BCP and peak plan.", "Compliance"),
      a("tooling", "Tooling & automation review", "Review tooling and automation.", "CI"),
    ],
  },

  BA: {
    title: "Business Analyst / MIS", short: "BA", icon: "B",
    purpose: "Turns operational data into insight for Ops, QA, controllers, and clients.",
    daily: [
      a("reports_refresh", "Daily reports refresh & QA", "Refresh dailies and QA the numbers.", "Reporting", true),
      a("data_hygiene", "Data hygiene checks", "Run data hygiene checks.", "Reporting"),
      a("ad_hoc", "Ad-hoc analysis", "Handle ad-hoc analysis requests.", "Reporting"),
      a("dashboard_mon", "Dashboard monitoring", "Monitor dashboards for anomalies.", "Reporting"),
      a("dor_pack", "DOR / WBR pack support", "Support DOR / WBR packs.", "Governance"),
    ],
    weekly: [
      a("wbr_pack", "WBR pack (insights, not just numbers)", "Build insight-led WBR pack.", "Governance", true),
      a("trend_var", "Trend & variance analysis", "Run weekly trend / variance.", "Reporting"),
      a("dash_enhance", "Dashboard enhancement", "Enhance a dashboard.", "Reporting"),
      a("data_audit", "Data audit / lineage review", "Review data lineage.", "Compliance"),
      a("fcst_actual", "Forecast vs actual publish", "Publish forecast vs actual.", "Reporting"),
    ],
    monthly: [
      a("mbr_pack", "MBR / QBR analytics pack", "Build MBR / QBR analytics pack.", "Governance", true),
      a("kpi_catalog", "KPI definitions catalog refresh", "Refresh KPI catalog.", "Compliance"),
      a("self_serve", "Self-serve enablement training", "Train users on self-serve.", "Training"),
      a("access_review", "Audit-trail & access review", "Review access and audit trails.", "Compliance", true),
      a("insight_backlog", "Insight backlog grooming", "Groom the insight backlog.", "CI"),
    ],
  },

  BlackBelt: {
    title: "Black Belt / CI Lead", short: "Black Belt", icon: "BB",
    purpose: "Leads Lean Six Sigma and CI projects and drives measurable savings and simplification.",
    daily: [
      a("project_exec", "Project execution (DMAIC)", "Drive DMAIC project execution.", "CI"),
      a("mentor_gb_yb", "Mentor Green / Yellow Belts", "Mentor GB / YB candidates.", "People"),
      a("data_analysis", "Data analysis & validation", "Run data analysis and validation.", "CI"),
      a("stake_followup", "Stakeholder follow-ups", "Follow up with stakeholders.", "Governance"),
      a("ci_tracker", "CI tracker updates", "Keep CI tracker current.", "CI"),
    ],
    weekly: [
      a("tollgate", "Project toll-gate reviews", "Run project toll-gate reviews.", "CI", true),
      a("kaizen", "Kaizen / GEMBA / idea harvesting", "Run Kaizen / GEMBA / idea harvesting.", "CI"),
      a("benefit", "Benefit validation with Finance", "Validate benefits with Finance.", "Finance", true),
      a("gov_forum", "Governance forum", "Lead CI governance forum.", "Governance"),
      a("yb_gb_train", "YB / GB training delivery", "Deliver YB / GB training.", "Training"),
    ],
    monthly: [
      a("ci_mbr", "CI MBR (pipeline, savings, certs)", "Run the CI MBR.", "Reporting", true),
      a("replication", "Replication across LOBs", "Replicate proven CI across LOBs.", "CI"),
      a("cert_gov", "Certification governance", "Govern certification pipeline.", "Capability"),
      a("innovation", "Innovation / digital pipeline refresh", "Refresh innovation pipeline.", "CI"),
      a("client_show", "Client showcase", "Showcase CI outcomes to client.", "Client", true),
    ],
  },
};

export function activitiesFor(role, period) {
  return ROLES[role]?.[period] ?? [];
}
