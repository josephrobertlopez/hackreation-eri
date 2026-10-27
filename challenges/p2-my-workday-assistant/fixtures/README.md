# Making a task guide (for job coaches)

You do not need to be a programmer. A task guide is a text file you edit.
Twenty minutes, a text editor, and this page.

## What a guide is

One file per task. Inside it: the task name, where it happens, and the
steps in order. Each step has three things, and all three are required:

| | why |
| --- | --- |
| **text** | the words the worker reads. Always on the screen |
| **picture** | a simple drawing for the step |
| **audio transcript** | what the audio says, usually the same words |

## Make one

1. Copy `TEMPLATE.task.js` and give the copy a short name, all lower
   case with dashes: `wash-the-dishes.js`
2. Open it. Every line that starts with `//` is a note to you, not part
   of the guide — you can ignore or delete those.
3. Change the words between the quote marks. Keep the quote marks.
4. Open `tasks.js` and add your file. It is two lines, and the file says
   which two.
5. Check your work:

   ```bash
   node scripts/validate-task.mjs fixtures/wash-the-dishes.js
   ```

   It answers in plain words — either "this guide looks good" or a list
   like "Step 3 is missing the words that tell the worker what to do".
   Fix and run it again. There is no limit on tries.

6. Look at it: `npm start`, then open <http://localhost:8002/web/> in a
   browser and open your task.

## The writing rules

The checker enforces these, so you will hear about it if one slips.

- **One idea per sentence.** Twelve words is the hard limit; ten is better.
- **Say what to do.** "Get a cart." not "You will need to obtain a cart."
- **No hurry.** No "quickly", no "within five minutes". Nobody is timed.
- **No scoring.** The tool does not score, rate or rank anybody.
- **Nothing about the person.** Never a word about a disability, a
  diagnosis or medication. A task guide is about the task.
- **Three to seven steps.** More than seven, split it into two tasks.

## Pictures

A picture here is SVG — a drawing made of text, so it lives in the file
and never has to be downloaded. The easiest way to start:

1. Open one of the three example guides.
2. Copy the whole `<svg> … </svg>` block into your step.
3. Change the two lines that matter:
   - `<title>` — a short name for the picture
   - `<desc>` — one sentence saying what it shows

A screen reader reads those two lines out loud, so they are not
decoration. Change the `id="..."` values too, so no two pictures in the
whole folder share an id (the test suite checks this).

No picture ready? Use the placeholder in the template and carry on. The
text is what the worker depends on; the picture helps it land.

## Safety

A guide has to match how the job is really done. If a step could hurt
someone, a qualified person reviews it before any worker follows it. That
is ERI's rule (problem statement section 10), not ours.

## What is in here now

| file | steps | notes |
| --- | --- | --- |
| `stock-the-shelves.js` | 5 | ERI's suggested demo, and the five-step task from ERI's success criteria |
| `wipe-the-break-room.js` | 4 | |
| `sort-the-mail-cart.js` | 3 | |
| `TEMPLATE.task.js` | 1 | copy this one |
| `tasks.js` | — | the day's list; two lines per guide |

All of it is practice data. None of it describes a real workplace or a
real person.
