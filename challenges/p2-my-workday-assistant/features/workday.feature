# Behaviour scenarios, one per acceptance id from spec/acceptance.md.
# Run them with:  npm run bdd
#
# Plain Gherkin, run by scripts/run-features.mjs (90 lines, no npm
# packages). Every step drives the real modules the browser uses.

Feature: My Workday Assistant

  An employee opens the task they were given, is walked through it one
  step at a time with a picture and a few short words, marks each step
  done, sees how far along they are, and can ask for help at any point.
  Nothing times them, nothing scores them, and nothing leaves the device.

  @P2-M1 @P2-F6
  Scenario: The day starts with three tasks
    Given the worker opens the app
    Then they see 3 tasks
    And one of the tasks is called "Stock the Shelves"
    And every task says how many steps it has

  @P2-M2 @P2-M3 @P2-F2 @P2-S3 @P2-S5
  Scenario: Opening a task shows one step, with a picture and words
    Given the worker opens the app
    When they open the task "Stock the Shelves"
    Then they are on step 1 of 5
    And the step shows the words "Walk to aisle 3. The sign hangs above the shelf."
    And the step shows a picture described as "An aisle sign with the number 3"
    And they are told what comes next: "Next: Get your supplies."

  @P2-F4 @P2-A5
  Scenario: Back on the first step goes nowhere, and nothing is lost
    Given the worker opens the app
    When they open the task "Stock the Shelves"
    And they press Back
    Then they are on step 1 of 5
    And the step shows the words "Walk to aisle 3. The sign hangs above the shelf."

  @P2-M4 @P2-M5 @P2-F5
  Scenario: Marking a step done shows progress and moves on
    Given the worker opens the app
    When they open the task "Stock the Shelves"
    And they mark the step done
    Then the progress says "1 of 5 steps done"
    And they are on step 2 of 5
    And the announcement is "Step marked done. 1 of 5 steps done. Now Step 2 of 5: Get your supplies."

  @P2-M4
  Scenario: A mistake costs nothing
    Given the worker opens the app
    When they open the task "Stock the Shelves"
    And they mark the step done
    And they press Back
    And they undo the step
    Then the progress says "0 of 5 steps done"
    And they are on step 1 of 5

  @P2-S2 @P2-M5
  Scenario: The five-step task can be finished
    Given the worker opens the app
    When they open the task "Stock the Shelves"
    And they mark 5 steps done
    Then the progress says "5 of 5 steps done"
    And they are told "You finished all 5 steps of Stock the Shelves."
    And nothing expires and no step is timed

  @P2-S5
  Scenario: On the last step, the tool says so instead of inventing one
    Given the worker opens the app
    When they open the task "Sort the Mail Cart"
    And they press Next
    And they press Next
    Then they are on step 3 of 3
    And they are told what comes next: "This is the last step."

  @P2-F3 @P2-A6 @P2-S4
  Scenario: A step can be repeated out loud as often as the worker likes
    Given the worker opens the app
    When they open the task "Stock the Shelves"
    And they ask to hear the step 3 times
    Then speech was invoked 3 times
    And no test claims the audio was heard
    And the step words are still on the screen

  @P2-M6 @P2-F8
  Scenario: Help is available on every step, of every task
    Given the worker opens the app
    Then "I Need Help" is available on every step of every task
    And help offers a way to repeat the step and a way to ask a person

  @P2-X1 @P2-X3 @P2-X4
  Scenario: What is kept is about the task, never about the person
    Given the worker opens the app
    When they open the task "Stock the Shelves"
    And they mark the step done
    Then what is stored is only "completedIds, stepIndex, taskId"
    And no stored value is a time or a score
    And the worker can erase it

  @P2-S1 @P2-F1 @P2-A3
  Scenario: A coach's first draft gets plain-language feedback, not a stack trace
    Given a coach writes a guide with a 15-word sentence
    Then the checker says "Keep sentences to 12 words or fewer"
    And the checker does not pass the guide
    And the three shipped guides pass the same checker
