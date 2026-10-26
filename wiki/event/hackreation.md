# Hackreation: Sat, Oct 31, 2026

**Penrod, 219 N. Milwaukee St., 2nd floor, Milwaukee**, hosted by [Mitobyte](https://www.meetup.com/mitobyte/events/316630269/) with Employment Resources, Inc. (ERI), closing event of Wisconsin Tech Month

**Theme:** Building software that connects people with disabilities to job opportunities.

## Schedule (from the public [Meetup page](https://www.meetup.com/mitobyte/events/316630269/); organizers may adjust)
| Time | What |
| --- | --- |
| 8:00 | Doors open, check-in, breakfast |
| 8:30 | Team formation |
| 9:00 | Kickoff and challenge intro |
| 9:20-12:00 | Hacking, with floating mentors |
| 12:00 | Lunch |
| 12:45-4:00 | Hacking |
| 4:00-5:00 | Presentations and awards |

**Scope to a demo you can show in about 3 minutes.**

## Forming a team (8:30)
- Mix roles. Each team needs one person who can run the hello world and one who owns plain language and accessibility testing (no code needed).
- First hackathon? Join a team with a working developer. Ask anything.
- Don't hand accessibility to a teammate with a disability by default. Ask everyone what they want to work on.
- Teams pick one challenge at the kickoff.

## Challenges
| | Challenge | PRD |
| --- | --- | --- |
| **01** | Funding gap finder (DVR, Ticket, county) | [PRD](../prds/01-funding-gap-finder.md), [code](../../challenges/01-funding-gap-finder) |
| **02** | Is this job right for me? | [PRD](../prds/02-job-fit-checker.md), [code](../../challenges/02-job-fit-checker) |
| **03** | Inclusive job post checker | [PRD](../prds/03-job-post-checker.md), [code](../../challenges/03-job-post-checker) |

## Awards
- **The Golden Byte**: the top prize (organizers explain how it's picked at kickoff)
- People's Choice, Best in Design, Best in Innovation, Best in Teamwork

## Judging rubric (proposed; final rubric set by organizers and ERI)
| Criterion | Weight | Looks like |
| --- | --- | --- |
| Solves ERI's problem | 30% | An ERI staffer says "we'd use that" |
| Accessible | 25% | Keyboard + screen reader pass ([checklist](../domain/accessibility.md)) |
| Works end to end | 20% | A live demo on synthetic data, not slides |
| ERI could adopt it | 15% | Built on the [recommended stack](../company/tech-stack.md), no paid services, a README that runs |
| Presentation | 10% | Clear in 3 minutes |

## Rules
1. Synthetic data only ([privacy](../domain/privacy-and-data.md)).
2. Work in your challenge folder on a team branch, so CI runs. Push early, push often. Open your PR by 3:00.
3. Code is MIT licensed, so ERI and anyone can reuse it.
4. Be kind. Stuck for 15 minutes? Ask a mentor. Ask the ERI liaison about benefits, billing or ERI. (The ERI liaison is also ERI's judge.)

## Demo template (3 minutes)
1. **Who** it's for and their problem (20 sec)
2. **Live demo** on synthetic data (2 min)
3. **What ERI would need** to adopt it (20 sec)
4. Accessibility you tested (20 sec)
