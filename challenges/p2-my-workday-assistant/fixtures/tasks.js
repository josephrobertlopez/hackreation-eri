// =====================================================================
// THE TASK LIST — the worker's tasks for the day
// =====================================================================
// To ADD a task guide:
//   1. Copy TEMPLATE.task.js to a new file, e.g. my-new-task.js
//   2. Fill it in. Follow the comments inside it.
//   3. Add TWO lines below: one import line, one line in the list.
//   4. Check it:  node scripts/validate-task.mjs fixtures/my-new-task.js
//
// To REMOVE a task guide, delete its line from the list below. You can
// leave the file in the folder; it just stops being shown.
//
// Order matters: the worker sees the tasks in the order of this list.
// =====================================================================

import { task as stockTheShelves } from './stock-the-shelves.js';
import { task as wipeTheBreakRoom } from './wipe-the-break-room.js';
import { task as sortTheMailCart } from './sort-the-mail-cart.js';

export const tasks = [
  stockTheShelves,
  wipeTheBreakRoom,
  sortTheMailCart
];
