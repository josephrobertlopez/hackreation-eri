/*
 * Every pixel of copy both screens render, as pure functions from state to an
 * HTML string. No DOM, no clock, no storage - so `node --test` can assert what
 * an employee would actually see rather than grepping the source for the shape
 * of it. web/employee.js and web/coach.js do nothing but mount these and wire
 * up events.
 *
 * Rules that live here and are tested in test/views.test.mjs:
 *   - every button carries a data-action from src/flow.js
 *   - an icon beside a text label is wrapped aria-hidden, because the label is
 *     already the accessible name and a screen reader must not read it twice
 *   - anything an employee typed goes through esc() before it is interpolated
 *   - the status words come from fixtures/copy.js and from nowhere else
 */

import { ICONS } from '../fixtures/icons.js';
import { COACH } from '../fixtures/people.js';
import { SUPPORT_NEEDS, needById } from '../fixtures/support-needs.js';
import { messagesFor } from '../fixtures/employee-messages.js';
import { COACH_REPLIES } from '../fixtures/coach-replies.js';
import { EMERGENCY } from '../fixtures/emergency.js';
import { APP, DISCLOSURE, STATUS, EMPLOYEE_UI, COACH_UI } from '../fixtures/copy.js';

export function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** An icon next to a text label is decoration. aria-hidden on the wrapper
 *  hides the whole subtree, so the <title> inside is not announced twice. */
export function deco(svg) {
  return '<span aria-hidden="true">' + svg + '</span>';
}

export function clock(ms) {
  return new Date(ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/* ----------------------------------------------------------- the employee */

export function statusBlock(request) {
  const s = STATUS[request.status];
  return '<p class="status status-' + request.status + '">' + deco(ICONS[s.iconName]) +
    '<span>' + esc(s.label) + '</span></p>' +
    '<p class="small">' + esc(s.detail) + '</p>' +
    request.replies.map((r) =>
      '<div class="reply"><p><strong>' + esc(COACH.name) + ' answered at ' +
      esc(clock(r.at)) + '</strong></p><p>' + esc(r.body) + '</p></div>').join('');
}

export function requestCard(request, headingTag = 'h3') {
  const need = needById(request.needId);
  return '<div class="card"><' + headingTag + '>' + esc(need ? need.label : request.needId) +
    '</' + headingTag + '>' +
    '<p class="small muted">Sent to ' + esc(COACH.name) + ' at ' + esc(clock(request.sentAt)) + '</p>' +
    (request.text
      ? '<p>&ldquo;' + esc(request.text) + '&rdquo;</p>'
      : '<p class="small muted">No message added.</p>') +
    statusBlock(request) + '</div>';
}

export function disclosure() {
  return '<h2>' + esc(DISCLOSURE.whoHeading) + '</h2><p>' + esc(DISCLOSURE.who) + '</p>' +
    '<dl class="facts small">' +
    '<dt>' + esc(DISCLOSURE.sharedHeading) + '</dt><dd>' + esc(DISCLOSURE.shared) + '</dd>' +
    '<dd>' + esc(DISCLOSURE.notShared) + '</dd>' +
    '<dt>' + esc(DISCLOSURE.availabilityHeading) + '</dt><dd>' + esc(DISCLOSURE.availability) + '</dd>' +
    '</dl><p class="small muted">' + esc(DISCLOSURE.production) + '</p>';
}

export function homeScreen() {
  return '<h1 tabindex="-1">' + esc(APP.employeeTitle) + '</h1>' +
    '<p class="lede">Send a message to ' + esc(COACH.name) + ', your ' + esc(COACH.title.toLowerCase()) + '.</p>' +
    '<button type="button" class="big primary-help" data-action="need-help">' +
    deco(ICONS.help) + '<span class="stack">' + esc(EMPLOYEE_UI.helpButton) +
    '<span class="sub">' + esc(EMPLOYEE_UI.helpButtonHint) + '</span></span></button>' +
    '<button type="button" class="big secondary" data-action="open-history">' +
    deco(ICONS.history) + '<span class="stack">' + esc(EMPLOYEE_UI.historyButton) + '</span></button>' +
    disclosure();
}

export function chooseNeedScreen() {
  return '<h1 tabindex="-1">' + esc(EMPLOYEE_UI.chooseHeading) + '</h1>' +
    '<p class="lede">' + esc(EMPLOYEE_UI.chooseHint) + '</p>' +
    '<ul class="choice-list">' + SUPPORT_NEEDS.map((need) =>
      '<li><button type="button" class="big" data-action="pick-need" data-need="' + esc(need.id) + '">' +
      deco(need.icon) + '<span class="stack">' + esc(need.label) + '</span></button></li>').join('') +
    '</ul><div class="row"><button type="button" class="secondary" data-action="back">' +
    esc(EMPLOYEE_UI.backButton) + '</button></div>';
}

export function composeScreen(draft) {
  const need = needById(draft.needId);
  if (!need) return chooseNeedScreen();
  const options = messagesFor(draft.needId);
  return '<h1 tabindex="-1">' + esc(EMPLOYEE_UI.composeHeading) + '</h1>' +
    '<div class="card"><h2 class="flush">' + deco(need.icon) + ' ' + esc(need.label) + '</h2>' +
    '<p class="small muted">Going to ' + esc(COACH.name) + ', ' + esc(COACH.title.toLowerCase()) + ', ' +
    esc(COACH.org) + '.</p></div>' +
    '<h2>' + esc(EMPLOYEE_UI.pickMessageHeading) + '</h2>' +
    '<ul class="choice-list">' + options.map((m) =>
      '<li><button type="button" class="big' + (draft.messageId === m.id ? ' chosen' : '') +
      '" data-action="pick-message" data-message="' + esc(m.id) + '"' +
      ' aria-pressed="' + (draft.messageId === m.id ? 'true' : 'false') + '">' +
      '<span class="stack">' + esc(m.text) + '</span></button></li>').join('') +
    '</ul>' +
    '<label for="own-text">' + esc(EMPLOYEE_UI.typeLabel) + '</label>' +
    '<textarea id="own-text" maxlength="300" aria-describedby="type-hint">' + esc(draft.text || '') + '</textarea>' +
    '<p class="small muted" id="type-hint">' + esc(EMPLOYEE_UI.typeHint) + '</p>' +
    '<div class="card"><h3>' + esc(EMPLOYEE_UI.tryFirstHeading) + '</h3><p>' + esc(need.tryFirst) + '</p></div>' +
    '<div class="row"><button type="button" data-action="send" class="big">' +
    deco(ICONS.sent) + '<span class="stack">' + esc(EMPLOYEE_UI.sendButton) + '</span></button></div>' +
    '<div class="row"><button type="button" class="secondary" data-action="back">' +
    esc(EMPLOYEE_UI.backButton) + '</button>' +
    (draft.messageId
      ? '<button type="button" class="secondary" data-action="clear-message">Remove the message</button>'
      : '') +
    '</div>';
}

export function sentScreen(request) {
  if (!request) return homeScreen();
  return '<div class="confirm"><h1 tabindex="-1">' + deco(ICONS.sent) + ' ' +
    esc(EMPLOYEE_UI.sentHeading) + '</h1>' +
    '<p class="lede"><strong>' + esc(EMPLOYEE_UI.sentConfirm) + '</strong></p>' +
    requestCard(request, 'h2') +
    '<p class="small">' + esc(DISCLOSURE.availability) + '</p></div>' +
    '<div class="row"><button type="button" class="secondary" data-action="open-history">' +
    esc(EMPLOYEE_UI.historyButton) + '</button>' +
    '<button type="button" class="secondary" data-action="home">' +
    esc(EMPLOYEE_UI.homeButton) + '</button></div>';
}

export function historyScreen(requests) {
  return '<h1 tabindex="-1">' + esc(EMPLOYEE_UI.historyHeading) + '</h1>' +
    (requests.length === 0
      ? '<p class="lede">' + esc(EMPLOYEE_UI.historyEmpty) + '</p>'
      : requests.map((r) => requestCard(r)).join('')) +
    '<div class="row"><button type="button" class="big" data-action="need-help">' +
    deco(ICONS.help) + '<span class="stack">' + esc(EMPLOYEE_UI.helpButton) + '</span></button></div>' +
    '<div class="row"><button type="button" class="secondary" data-action="home">' +
    esc(EMPLOYEE_UI.homeButton) + '</button></div>';
}

/* The other path. It sends nothing, and it says so. */
export function emergencyScreen() {
  return '<div class="emergency-screen">' +
    '<h1 tabindex="-1">' + deco(ICONS.emergency) + ' ' + esc(EMERGENCY.heading) + '</h1>' +
    '<p class="lede">' + esc(EMERGENCY.lead) + '</p>' +
    '<ol class="emergency-steps">' + EMERGENCY.steps.map((step) =>
      '<li><strong>' + esc(step.label) + '</strong><br>' + esc(step.detail) + '</li>').join('') +
    '</ol>' +
    '<p>' + esc(EMERGENCY.afterward) + '</p>' +
    '<p class="small"><strong>' + esc(EMERGENCY.sendsNothing) + '</strong></p>' +
    '<div class="row"><button type="button" class="secondary" data-action="home">' +
    esc(EMPLOYEE_UI.homeButton) + '</button></div>';
}

/** state: { draft, request, requests } - only the fields a screen needs. */
export function employeeScreen(screen, state = {}) {
  switch (screen) {
    case 'home': return homeScreen();
    case 'choose-need': return chooseNeedScreen();
    case 'compose': return composeScreen(state.draft || {});
    case 'sent': return sentScreen(state.request);
    case 'history': return historyScreen(state.requests || []);
    case 'emergency': return emergencyScreen();
    default: throw new Error('No screen called "' + screen + '".');
  }
}

export const EMPLOYEE_SCREEN_NAMES = Object.freeze(['home', 'choose-need', 'compose', 'sent', 'history', 'emergency']);

/* -------------------------------------------------------------- the coach */

/** One closed card. The kind of help is above the Open button on purpose:
 *  ERI's user story is "I want to see what type of help someone needs before
 *  contacting them". */
export function coachCard(view, openId) {
  const need = needById(view.needId);
  const isOpen = openId === view.id;
  return '<li class="card"><h2>' + deco(need ? need.icon : ICONS.question) + ' ' +
    esc(need ? need.coachSummary : view.needId) + '</h2>' +
    '<p><span class="pill">' + esc(need ? need.label : view.needId) + '</span></p>' +
    '<p>' + esc(view.employeeName) + ' &middot; sent ' + esc(clock(view.sentAt)) + '</p>' +
    '<p class="status status-' + view.status + '">' + deco(ICONS[STATUS[view.status].iconName]) +
    '<span>' + esc(STATUS[view.status].label) + '</span></p>' +
    (isOpen
      ? coachDetail(view)
      : '<button type="button" data-open="' + esc(view.id) + '">' + esc(COACH_UI.openButton) + '</button>') +
    '</li>';
}

export function coachDetail(view) {
  return (view.message
    ? '<blockquote><p>&ldquo;' + esc(view.message) + '&rdquo;</p><p class="small muted">' +
      (view.messageSource === 'predefined' ? 'Chosen from the message list.' : 'Typed.') + '</p></blockquote>'
    : '<p class="small muted">No message was added. Only the kind of help was sent.</p>') +
    view.replies.map((r) => '<div class="reply"><p><strong>You answered at ' +
      esc(clock(r.at)) + '</strong></p><p>' + esc(r.body) + '</p></div>').join('') +
    '<h3>' + esc(COACH_UI.replyHeading) + '</h3>' +
    '<label for="pick-' + esc(view.id) + '">' + esc(COACH_UI.pickReplyLabel) + '</label>' +
    '<select id="pick-' + esc(view.id) + '" data-pick="' + esc(view.id) + '">' +
    '<option value="">- choose a reply -</option>' +
    COACH_REPLIES.map((r) => '<option value="' + esc(r.id) + '">' + esc(r.text) + '</option>').join('') +
    '</select>' +
    '<label for="text-' + esc(view.id) + '">' + esc(COACH_UI.typeReplyLabel) + '</label>' +
    '<textarea id="text-' + esc(view.id) + '" maxlength="400"></textarea>' +
    '<div class="row"><button type="button" data-reply="' + esc(view.id) + '">' +
    esc(COACH_UI.sendReplyButton) + '</button></div>' +
    '<p class="small muted">' + esc(COACH_UI.noDiagnosis) + '</p>';
}

export function coachInboxScreen(views, openId) {
  return views.length === 0
    ? '<p class="lede">' + esc(COACH_UI.empty) + '</p>'
    : '<ul class="inbox">' + views.map((v) => coachCard(v, openId)).join('') + '</ul>';
}

export default { employeeScreen, coachInboxScreen };
