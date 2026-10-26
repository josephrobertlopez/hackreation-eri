# ADR 0001: Each challenge is fully decoupled

- **Status:** accepted
- **Date:** 2026-10-23

## Context
Three PRDs, about 18 attendees, and one day. If challenges share code or data, one team's change can break another team's demo, and ERI can't adopt one project without the others.

## Decision
Each challenge has its own folder, its own copy of the synthetic data (`challenges/<nn>/data/`, synced by `tools/generate_synthetic_data.py`), its own tests and its own CI workflow. No imports across challenges.

## Consequences
Some duplication (data files, a small CSS file). In exchange, any one project can be handed to ERI alone, and CI only runs what a PR touches.
