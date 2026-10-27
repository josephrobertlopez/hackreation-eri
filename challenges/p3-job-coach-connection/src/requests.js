/*
 * The request state machine. Pure: no DOM, no clock, no storage, no timers.
 * Runs identically in the browser and under `node --test`.
 *
 * ================= THE ONE RULE THIS FILE EXISTS TO ENFORCE =================
 *
 * ERI section 4 asks the product to "display whether the request has been
 * sent, seen, or answered".
 *
 * The cheap way to build that is a timer: flip to "seen" two seconds after
 * sending, because it demos beautifully. It also teaches a disabled employee
 * that their job coach read a message nobody read, and then teaches them that
 * the coach read it and ignored them. That is worse than no status at all.
 *
 * So: a status only moves when a coach really did something.
 *   sent     -> created by the employee pressing Send
 *   seen     -> ONLY by a 'coach-opened' event from an actor whose role is
 *               'coach' (the coach pressed "Open this request")
 *   answered -> ONLY by a 'coach-replied' event with a non-empty reply body
 *
 * There is no exported way to set a status directly, no event that advances a
 * status without a coach actor, and no clock in this module - the only
 * timestamps recorded are the ones handed in by the caller that observed the
 * real action. test/state-machine.test.mjs drives the whole clock forward and
 * fails if anything moves, and scans the source of src/ and web/ for timer
 * APIs.
 * ===========================================================================
 */

export const STATUSES = ['sent', 'seen', 'answered'];

const RANK = { sent: 0, seen: 1, answered: 2 };

/** A transition that is not part of the machine (unknown event, bad data). */
export class InvalidTransition extends Error {}

/** A status move attempted by somebody who is not the coach. This is the
 *  error a faked "seen" would raise. */
export class NotCoachAction extends Error {}

function requireCoachActor(event) {
  const actor = event && event.actor;
  if (!actor || actor.role !== 'coach' || typeof actor.id !== 'string' || !actor.id) {
    throw new NotCoachAction(
      'Event "' + (event && event.type) + '" moves a request status, so it needs ' +
      'an actor of role "coach" with an id. A status must never advance ' +
      'without a real coach action.'
    );
  }
  return actor;
}

function requireAt(event) {
  const at = event && event.at;
  if (typeof at !== 'number' || !Number.isFinite(at)) {
    throw new InvalidTransition(
      'Event "' + (event && event.type) + '" needs an `at` timestamp supplied by ' +
      'the caller that observed the action. This module never reads the clock.'
    );
  }
  return at;
}

/**
 * Build a new request in status 'sent'. Called from the employee's Send press.
 * `at` is supplied by the caller; this module does not read the clock.
 */
export function createRequest(input) {
  const { id, needId, employeeId, employeeName, coachId, at } = input || {};
  for (const [key, value] of Object.entries({ id, needId, employeeId, coachId })) {
    if (typeof value !== 'string' || !value) {
      throw new InvalidTransition('createRequest needs a non-empty ' + key + '.');
    }
  }
  const text = typeof input.text === 'string' ? input.text.trim() : '';
  return Object.freeze({
    id,
    needId,
    employeeId,
    employeeName: employeeName || '',
    coachId,
    messageId: input.messageId || null,
    text,
    messageSource: input.messageId ? 'predefined' : (text ? 'typed' : 'none'),
    status: 'sent',
    sentAt: requireAt({ type: 'createRequest', at }),
    seenAt: null,
    seenBy: null,
    replies: Object.freeze([])
  });
}

/**
 * The whole machine. Returns a new frozen request; never mutates.
 * Throws NotCoachAction / InvalidTransition rather than silently ignoring,
 * so a wrong call is loud in the tests instead of quiet in the UI.
 */
export function applyEvent(request, event) {
  if (!request || typeof request.status !== 'string') {
    throw new InvalidTransition('applyEvent needs a request.');
  }
  const type = event && event.type;

  switch (type) {
    case 'coach-opened': {
      const actor = requireCoachActor(event);
      const at = requireAt(event);
      if (RANK[request.status] >= RANK.seen) return request; // idempotent re-open
      return Object.freeze({ ...request, status: 'seen', seenAt: at, seenBy: actor.id });
    }

    case 'coach-replied': {
      const actor = requireCoachActor(event);
      const at = requireAt(event);
      const body = typeof event.body === 'string' ? event.body.trim() : '';
      if (!body) {
        throw new InvalidTransition('A reply needs words in it. An empty reply is not an answer.');
      }
      const reply = Object.freeze({
        body,
        at,
        by: actor.id,
        source: event.replyId ? 'predefined' : 'typed',
        replyId: event.replyId || null
      });
      return Object.freeze({
        ...request,
        status: 'answered',
        // Replying proves the coach read it, so 'seen' is backfilled from the
        // same real action rather than invented.
        seenAt: request.seenAt === null ? at : request.seenAt,
        seenBy: request.seenBy === null ? actor.id : request.seenBy,
        replies: Object.freeze(request.replies.concat([reply]))
      });
    }

    default:
      throw new InvalidTransition(
        'Unknown event "' + String(type) + '". The only events that exist are ' +
        'coach-opened and coach-replied, and both need a coach actor.'
      );
  }
}

/**
 * What the coach dashboard is allowed to render. ERI section 9 rules out
 * "automated monitoring of employees" and section 10 says the tool must not
 * become a way to watch people, so the dashboard renders from this projection
 * and from nothing else. The key list is asserted exactly in the tests: adding
 * a location, an activity log or a diagnosis field here breaks the suite.
 */
export function coachView(request) {
  return {
    id: request.id,
    employeeName: request.employeeName,
    needId: request.needId,
    message: request.text,
    messageSource: request.messageSource,
    sentAt: request.sentAt,
    status: request.status,
    seenAt: request.seenAt,
    replies: request.replies
  };
}

export const COACH_VIEW_KEYS = Object.freeze([
  'id', 'employeeName', 'needId', 'message', 'messageSource',
  'sentAt', 'status', 'seenAt', 'replies'
]);

export default { STATUSES, createRequest, applyEvent, coachView, COACH_VIEW_KEYS };
