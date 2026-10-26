# Spec: wiki/prds/02-job-fit-checker.md (tags = acceptance criteria IDs)
Feature: "Is this job right for me?"
  As a job seeker who gets SSI or SSDI
  I want a plain-language heads-up about a job offer
  So that I know what to ask before I say yes

  @AC-02.1 @AC-02.2 @AC-02.5
  Scenario: Marcus checks a 20-hour job on SSI
    Given I get "SSI"
    And the job is 20 hours a week at $15 an hour near a bus
    When I check the job
    Then I see monthly pay of $1299
    And I see an SSI estimate of about $387
    And I am told this is an estimate and to call WIPA

  @AC-02.3
  Scenario: A full-time job above SGA on SSDI
    Given I get "SSDI"
    And the job is 40 hours a week at $16 an hour near a bus
    When I check the job
    Then I get a heads-up to talk to a benefits specialist

  @AC-02.6
  Scenario: A job that's hard to get to
    Given I get "none"
    And the job is 20 hours a week at $15 an hour with no bus and a 70 minute commute
    When I check the job
    Then I am warned that getting there may be hard
