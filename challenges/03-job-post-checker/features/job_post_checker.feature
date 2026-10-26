# Spec: wiki/prds/03-job-post-checker.md (tags = acceptance criteria IDs)
Feature: Make a job post more inclusive
  As a busy hiring manager
  I want my job post checked for needless barriers
  So that more qualified people with disabilities apply

  @AC-03.1 @AC-03.2
  Scenario: A warehouse post with common barriers
    Given my job post says "Must be able to lift 50 lbs. Valid driver's license required."
    When I check my post
    Then "lift 50 lbs" is flagged with a reason and a suggested rewrite
    And "driver's license" is flagged with a reason and a suggested rewrite
    And I am offered an accommodation statement

  @AC-03.3
  Scenario: An inclusive post
    Given my job post says "Training provided. Reasonable accommodations available on request."
    When I check my post
    Then nothing is flagged
