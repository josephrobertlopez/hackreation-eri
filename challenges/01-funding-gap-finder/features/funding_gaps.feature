# Spec: wiki/prds/01-funding-gap-finder.md (tags = acceptance criteria IDs)
Feature: Find money ERI earned but did not claim
  As ERI's finance director
  I want one list of claim gaps across funders
  So that I can review them and bill only what was delivered

  Background:
    Given the synthetic exports for DVR, Ticket to Work and the county contract
    When I build the ledger and run the gap check

  @AC-01.1
  Scenario: Every funder lands in one ledger
    Then the ledger contains rows for "DVR", "Ticket" and "County"

  @AC-01.2
  Scenario: Missed DVR monthly invoices are flagged
    Then there are 3 under-claimed flags for "DVR"

  @AC-01.3
  Scenario: Months when the client was not employed are not flagged
    Then client "C002" has no flags
    And client "C021" has no flags

  @AC-01.4
  Scenario: Unrequested Ticket to Work payments are flagged
    Then there are 5 under-claimed flags for "Ticket"

  @AC-01.5
  Scenario: Under-claimed county units are flagged
    Then there are 10 under-claimed flags for "County"

  @AC-01.6
  Scenario: Over-claims are risks, not money to collect
    Then there are 4 over-claimed flags for "County"
    And every over-claimed flag has a negative amount at stake

  @AC-01.7
  Scenario: Every flag shows its evidence
    Then every flag has evidence
