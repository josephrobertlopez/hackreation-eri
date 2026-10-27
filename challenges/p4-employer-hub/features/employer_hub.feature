# Behaviour scenarios, tagged with the acceptance IDs from spec/acceptance.md.
#
# Run with: npm run bdd
#
# NOT Cucumber. `tools/run_project_suite.sh` suggests `cucumber-js`, but this
# challenge is specified as zero-dependency, so the runner is
# test/features.test.js - about sixty lines over a Gherkin subset
# (Feature / Scenario / tags / Given / When / Then / And). An unmatched step is
# a FAILURE, never a skip: a runner that skips what it cannot parse reports
# green for scenarios it never ran, which is the exact fake-green this repo
# keeps warning about.

Feature: An employer connects their own recurring work to skills a candidate shared

  @P4-M1 @P4-M2 @P4-S1
  Scenario: An employer completes a needs assessment
    Given an employer in the "retail" industry
    When they describe the 5 recurring needs from ERI's retail example
    Then the needs assessment is accepted

  @P4-M2
  Scenario: Two needs is not enough
    Given an employer in the "retail" industry
    When they describe 2 recurring needs
    Then the needs assessment is refused with a message saying "at least three"

  @P4-M2
  Scenario: Six needs is too many
    Given an employer in the "retail" industry
    When they describe 6 recurring needs
    Then the needs assessment is refused with a message saying "five needs"

  @P4-M3 @P4-M4 @P4-S2
  Scenario: Matches come from the profile the candidate shared
    Given an employer in the "retail" industry
    And the shared profile "cand-avery"
    When they describe the 5 recurring needs from ERI's retail example
    And matches are suggested
    Then at least 3 suggestions are produced
    And at least 3 distinct workplace tasks are named
    And every suggestion uses a skill the candidate shared

  @P4-M5 @P4-S3 @P4-S4
  Scenario: Every suggestion can name both sides of its own reasoning
    Given an employer in the "retail" industry
    And the shared profile "cand-avery"
    When they describe the 5 recurring needs from ERI's retail example
    And matches are suggested
    Then every suggestion quotes the employer's own words
    And every suggestion quotes the candidate's own skill
    And every suggestion's explanation contains both quotes

  @P4-S3
  Scenario: A need the tool does not understand is reported, not guessed at
    Given an employer in the "retail" industry
    And the shared profile "cand-avery"
    When they describe a need the vocabulary does not recognise
    And matches are suggested
    Then that need is reported as a gap
    And no suggestion is invented for it

  @P4-V3 @P4-X2
  Scenario: Nothing is scored, ranked or decided
    Given an employer in the "retail" industry
    And the shared profile "cand-avery"
    When they describe the 5 recurring needs from ERI's retail example
    And matches are suggested
    Then no part of the output is a score or a rank
    And the output order is the employer's own entry order
    And no part of the output reads as a decision

  @P4-V1 @P4-V6
  Scenario: Nobody is asked to disclose a disability
    Given an employer in the "retail" industry
    And the shared profile "cand-avery"
    When they describe the 5 recurring needs from ERI's retail example
    And matches are suggested
    Then no part of the output names a disability or a diagnosis
    And the page has no field asking for one

  @P4-V2
  Scenario: A profile with no recorded permission is refused
    Given a shared profile with no recorded permission
    Then loading it is refused

  @P4-M6 @P4-S5 @P4-S6 @P4-V7
  Scenario: The session ends with a plan a human acts on
    Given an employer in the "retail" industry
    And the shared profile "cand-avery"
    When they describe the 5 recurring needs from ERI's retail example
    And matches are suggested
    And an action plan is built
    Then the plan has at least 4 next steps
    And the plan names questions for an employment specialist
    And the plan names a trusted resource with a link or a phone number
    And the plan refers legal questions to a qualified professional
