# ADR 0002: Synthetic data only; tools inform, people decide

- **Status:** accepted
- **Date:** 2026-10-23

## Context
ERI's real data includes benefits, health and DVR case information, protected by HIPAA, 42 CFR Part 2, DVR confidentiality rules, and the DVR provider agreement (which requires consumer consent for any AI tool). See `wiki/knowledge/compliance/`.

## Decision
All hackathon data is generated (`synthetic=TRUE` on every row, enforced in CI). Benefits outputs are labeled estimates and route to WIPA. Billing outputs are flags for human review, never automatic claims. AI features are optional and off by default.

## Consequences
Demos are safe to show publicly. Moving any tool to real data is a separate ERI decision: hosting, access control, audit logs, consent.
