// =====================================================================
// TEMPLATE — copy this file to make a new task guide
// =====================================================================
// FOR JOB COACHES. You do not need to write code to use this file.
//
// 1. Copy this file. Give the copy a short name, like wash-the-dishes.js
// 2. Change the words between the quote marks. Keep the quote marks.
// 3. Add your file to the list in tasks.js (two lines, explained there).
// 4. Check your file:
//        node scripts/validate-task.mjs fixtures/wash-the-dishes.js
//    It prints plain-language problems, or says the guide looks good.
//
// WRITING RULES (the checker enforces these)
//   - One idea per sentence. Ten words or fewer is best, twelve is the limit.
//   - Say what to do, not why. "Get a cart." not "You will need a cart."
//   - No times, no speed, no "quickly". Nobody is being timed.
//   - Every step needs: text, a picture, and an audio transcript.
//   - Three to seven steps per task. More than that, split the task.
//
// SAFETY
//   A guide must match how the job is really done. If a step could hurt
//   someone, a qualified person reviews it before a worker uses it.
//
// PICTURES
//   The picture is drawn with SVG, which is a picture made of text.
//   The easiest way to start is to copy the <svg> block from one of the
//   three example files and change the shapes. Two lines are required:
//     <title>  a short name for the picture
//     <desc>   one sentence saying what the picture shows
//   A screen reader reads those two lines out, so they are not optional.
//   No picture ready yet? Use the placeholder below and keep going. The
//   text is what the worker depends on; the picture helps it.
// =====================================================================

export const task = {
  // Short id. Lower case, dashes instead of spaces. No two tasks alike.
  id: 'change-me',

  // The name on the task list. Keep it short and concrete.
  title: 'Change Me',

  // Where the task happens.
  where: 'Where the work happens',

  // One sentence: what this task is.
  summary: 'Say in one short sentence what this task is.',

  steps: [
    {
      // Short id for this step. Lower case, dashes.
      id: 'first-step',

      // A short label for the step. Three or four words.
      title: 'Do the first thing',

      // What the worker does. Short sentences. This is ALWAYS shown.
      text: 'Say the first thing to do. Use short sentences.',

      image: {
        // Short name for the picture.
        title: 'Say what the picture shows',
        // One sentence describing the picture, for a screen reader.
        desc: 'One sentence that describes the picture for a screen reader.',
        // The picture itself. Copy an <svg> block from an example file,
        // or leave this placeholder until you have one.
        svg: `<svg viewBox="0 0 120 90" role="img" aria-labelledby="tmpl1t tmpl1d" focusable="false">
  <title id="tmpl1t">Say what the picture shows</title>
  <desc id="tmpl1d">One sentence that describes the picture for a screen reader.</desc>
  <rect x="2" y="2" width="116" height="86" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="60" y="50" font-size="12" text-anchor="middle" fill="currentColor">picture here</text>
</svg>`
      },

      // What the audio says. Usually the same words as the text above.
      audioTranscript: 'Say the first thing to do. Use short sentences.'
    }

    // Copy the block above to add another step. Put a comma after the
    // closing brace of the step before it.
  ]
};
