# Demo guide: Ally, a supervised AI helper for a job coach channel

About 3 minutes. Synthetic data only. Say "prototype", never "compliant" or "safe".

## The story in one line
An employee gets stuck at work. Ally, an AI helper, answers from the coach's own task guide. The coach is in the same chat and stays in charge. The employer can see the shared channel but not the client's private help.

## Who plays whom
| Role | Where they sit | Logs in on |
| --- | --- | --- |
| Client | iPhone, Safari (or the Mattermost app) | "Client and coach only" |
| Coach | Laptop, projected | "Client and coach only" |
| Employer | Second laptop or browser profile | "Everyone: client, coach, employer" |
| Ally | The AI helper (bot `@ally`) | Both channels |

Usernames and passwords are in `.env` (git-ignored). Do not put them on a slide.

## Before you go on (15 minutes, do all of it)
- [ ] `docker compose up -d`, then `curl localhost:8065/api/v4/system/ping` says OK.
- [ ] Find the laptop's address with `hostname -I`. Check `MM_SITEURL` and `MM_ALLOWED_ORIGINS` in `.env` match it, then `docker compose up -d` again. If the page only updates after a refresh, this is the cause.
- [ ] iPhone on the same Wi-Fi opens `http://<laptop address>:8065` in Safari and logs in as the client. **Test this at the venue first.** If the network blocks it, use the fallback below.
- [ ] Three separate logins at once: three browser profiles, or two profiles plus the iPhone.
- [ ] Ally has a valid API key (System Console, Plugins, Agents). Send `@ally what is step 2 of stock the shelves?` once and check it answers.
- [ ] A **printed fake schedule** on the table, and a photo of it on the iPhone. Never use a real schedule.
- [ ] Clear old test messages, or use fresh channels.
- [ ] iPhone: Do Not Disturb on, text size one or two steps larger, Speak Screen and Dictation on, Guided Access if handing the phone to a judge.
- [ ] Rehearse the photo step three times. Vision can misread, so the script below always has the coach confirm.

## The script
| Time | Who does what | What to say | What the audience sees |
| --- | --- | --- | --- |
| 0:00 | Presenter | "Employees with disabilities often cannot easily ask for help. Job coaches cover several worksites and cannot always be there. We built a supervised AI helper so the first answer is fast and a human is always in the loop." | Title or the empty channel |
| 0:20 | **Client** types: `@ally what is step 2 of stock the shelves?` | "Ally answers from the coach's own task guide, one step at a time, in plain sentences." | Ally replies with step 2 only, then "Did that help?" |
| 0:45 | **Client** uses dictation (mic key) to say: `@ally what time do I work on Wednesday?` while attaching the photo of the fake schedule | "The client can type, dictate, or send a photo, using the phone's own accessibility tools." | Ally reads Wednesday's time and says "Please check with the coach to be sure." |
| 1:15 | **Client**: `@ally the machine I use is not working` | "Ally does not try to fix it. It tells the client to stop and tell the person in charge." | Stop using it, tell the person in charge |
| 1:30 | **Coach** replies in the channel, for example "Thank you for telling me. I will call the store." | "The coach sees everything live and can add to or correct Ally at any time." | The coach reply appears on the iPhone |
| 1:55 | **Client**: `@ally I feel sick` | "Safety and health go to a person. Ally gives the 911 line and gives no medical advice." | The safety message |
| 2:10 | **Employer**, in "Everyone": `@ally How is the client doing?` | "The employer shares a channel with us, but Ally will not discuss the client's progress. Support stays between the client and the coach." | "I cannot share that. The client can choose to share it." |
| 2:30 | **Employer**: `@ally What are the steps for sorting the mail cart?` | "The employer can still use Ally for the work itself." | The mail cart steps |
| 2:45 | Presenter | Close: see "What is real and what is not" below. | |

## What is real and what is not (say this out loud)
- This is a **prototype with fictional people and a fictional workplace**. All data is synthetic.
- The AI can be switched off. In real use DVR requires the client's consent before any AI tool sees their information, so consent would be recorded first.
- A production version needs real logins, protected transport, a retention policy and stated response expectations. The demo uses shared demo accounts on one laptop.
- Ally never claims the coach is online and never promises a reply time.
- We tested with the iPhone's own accessibility tools. We did not run a formal accessibility audit.

## If something breaks
| Problem | What to do |
| --- | --- |
| iPhone cannot reach the laptop | Run the client on a second laptop browser, and say the iPhone is the next step |
| Ally does not answer | Check the API key and wifi. Have the coach answer by hand: "this is exactly why the coach stays in the loop" |
| Photo is misread or ignored | Say "Ally says to check with the coach", and have the coach confirm. Do not argue with the screen |
| Page needs a refresh to show replies | The browser address is missing from `MM_ALLOWED_ORIGINS` |
| Push notifications | They only work in the Mattermost iPhone app, not Safari. Skip them in the demo unless you have tested the app |
| Time is short | Skip the machine and mail cart steps, keep the schedule photo, the safety message, and the employer privacy moment |

## Likely questions from judges
- **"Why not a general chatbot?"** The people we serve find a blank box hard. Ally only answers from the coach's guide and says "I am not sure" otherwise.
- **"What if it is wrong?"** Every answer is visible to the coach, safety and benefits questions are handed to a person, and photo readings always end with "check with the coach".
- **"Who sees the data?"** Client and coach only. The employer cannot see the private channel, and Ally will not discuss the client where the employer can read.
- **"Does the employer see how the client is doing?"** No. That would turn a support tool into a monitoring tool.
- **"What would it take to ship?"** Real logins, recorded consent, a retention policy, an ERI-owned AI policy, and a review by the coach team.
- **"Why Mattermost?"** It gave us channels, live updates, a mobile app and a bot plugin in an afternoon. A real version would likely sit inside whatever tool ERI already uses.

---

## Summary
Ally is an AI helper in a chat with a client and a job coach. It answers from the coach's task guides, one plain step at a time, and hands off to the coach for safety, health, pay, benefits, or anything it does not know. The employer shares one channel with everyone but cannot see the client's private help, and Ally will not discuss the client's progress there. The demo takes about 3 minutes, runs on fictional data, and shows an AI that is useful and supervised.

## Seed questions to kick things off
Type `@ally` first. Use the private channel "Client and coach only" unless noted.

**Task steps (Ally answers from the guide)**
- What is step 1 of stock the shelves?
- What do I do after I get my supplies?
- How do I sort the mail cart?
- What do I do with the cloths when I am done wiping the tables?
- Can you say step 3 again?

**Not sure what to do (Ally gives the next step or asks which task)**
- I am not sure what to do first.
- I do not understand the words on the paper.
- Can you show me this task again?
- Where do I find my task card?

**Schedule (Ally points to the board, or reads a photo, then says to check with the coach)**
- My hours changed and I am not sure when to come in.
- Where is the schedule?
- What time do I work on Wednesday? (attach the fake schedule photo)

**Something unexpected (Ally says it is okay to stop and wait, and tells the client to tell the person in charge)**
- The machine I use is not working.
- Something changed and I do not know what to do.
- I am confused.

**Things Ally should hand off, to show the safety design**
- I feel sick. (safety message)
- How much will I get paid? (coach and WIPA)
- Can I keep my SSI if I work more hours? (WIPA, no benefits advice)
- Where do they keep the box cutters? (not in the guide, so "I am not sure")

**For the employer, in "Everyone: client, coach, employer"**
- What are the steps for wiping the break room tables? (Ally answers)
- How is the client doing on the tasks? (Ally declines)
- What does this photo say? (attach a photo; Ally says it cannot look at photos here)
