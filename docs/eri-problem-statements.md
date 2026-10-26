# ERI's problem statements (source of truth)

**This file is ERI's ask, not ours.** Where anything else in this repo
disagrees with this page, this page wins and the other page is a bug.

| | |
| --- | --- |
| Source | `eri-hackathon-problem-statements.pdf`, supplied by ERI |
| Google Drive file ID | `1-kUPi9tBAIXdxxtjhNHVgqxNgzvpWtLe` |
| Last modified | 2026-10-26T20:02:33Z |
| Converted to Markdown | 2026-10-26, for diffability and so AI tools can read it |

**Fidelity note.** The wording below is ERI's, carried over verbatim. The only
change is formatting: the PDF's feature tables extract as one run-on line
(`Feature Requirement Create a profile Enter a name…`), so they are
reconstructed here as two-column tables. No requirement was added, dropped or
reworded. Check the PDF if a line looks wrong.

**There are four projects, and six teams.** How they are allocated is an
organizer decision, not a repo decision.

---

## Project 1: Show Your Skills

**Product type:** Accessible digital skills portfolio

### 1. Project overview

Show Your Skills is a tool that helps people with disabilities demonstrate
their abilities to potential employers without relying entirely on traditional
resumes or interviews. Job seekers can create a simple portfolio using photos,
videos, written descriptions, audio recordings, and examples of work they have
completed.

**Product goal:** Help employers recognize what a person can do by providing
alternative ways to demonstrate skills and experience.

### 2. Problem statement

Traditional resumes may not accurately represent a person's abilities,
particularly when they have limited work experience, communication
disabilities, or difficulty describing their strengths in writing. Job seekers
need accessible ways to show their skills, while employers need straightforward
ways to understand how those skills relate to job responsibilities.

### 3. Target users

- **Primary:** Job seekers with disabilities, including people with
  intellectual, developmental, communication, or learning disabilities.
- **Secondary:** Job coaches, employment specialists, and other supporters who
  help job seekers prepare for employment.
- **Additional:** Employers and hiring managers reviewing portfolios.

### 4. Core features

| Feature | Requirement |
| --- | --- |
| Create a profile | Enter a name or display name, interests, and preferred work activities. |
| Add skills | Select skills from a list or enter custom skills. |
| Show examples | Add photos, short videos, audio, or written examples demonstrating a skill. |
| Describe abilities | Use simple prompts such as "I am good at…" and "Here is something I can do…" |
| Preview portfolio | View a simple, employer-friendly presentation. |
| Share portfolio | Generate a view-only link or downloadable portfolio. |

### 5. User stories

- As a job seeker, I want to show a video of myself completing a work task so
  employers can see my skills.
- As a person who has difficulty writing, I want to use pictures or audio to
  explain my abilities.
- As a job coach, I want to help someone organize their work examples.
- As an employer, I want to quickly understand an applicant's skills without
  navigating a complicated website.

### 6. Minimum viable product

For the hackathon, build a working prototype that:

1. Allows a user to enter basic profile information.
2. Allows the user to select or enter three skills.
3. Allows at least one example of a skill to be added.
4. Displays the information as a simple portfolio.
5. Provides a way to share or export the portfolio.

**Suggested demo:** A job seeker creates a portfolio showing that they can
organize supplies, greet customers, and follow a checklist. An employer opens
the portfolio and reviews those skills.

### 7. Accessibility requirements

- Support keyboard navigation and screen readers.
- Use plain-language instructions.
- Support alternatives to typed input.
- Provide labels or text alternatives for images and captions or transcripts
  for audio/video.
- Avoid time limits and unnecessary steps.
- Allow users to choose which information is shared.

### 8. Success criteria

- A user can create a basic portfolio without technical assistance.
- A portfolio can be completed in approximately 5–10 minutes using prepared
  examples.
- An employer can identify at least three skills from the resulting portfolio.
- The prototype supports at least one non-text method of demonstrating a skill.

### 9. Out of scope for the hackathon

- Integration with commercial job boards.
- Automated hiring or applicant scoring.
- Employer account management.
- AI-generated assessments of applicant suitability.
- Full identity verification or production-grade hosting.

### 10. Privacy and design considerations

Users must control what information they share. The product should not require
disclosure of a disability or diagnosis. Demonstration content should be used
only with consent, and sample media should be used for the hackathon.

**Key design question:** How can we help employers recognize people's abilities
rather than focus primarily on traditional qualifications?

---

## Project 2: My Workday Assistant

**Product type:** Accessible workplace task and routine support tool

### 1. Project overview

My Workday Assistant helps employees learn, remember, and complete workplace
tasks using personalized, step-by-step instructions. The tool can use pictures,
text, audio, and reminders to help workers navigate their responsibilities with
greater independence. Job coaches or supervisors can create task guides, while
employees can choose the supports that work best for them.

**Product goal:** Reduce reliance on repeated verbal instructions and help
employees complete workplace tasks with confidence.

### 2. Problem statement

Some employees need additional support to remember task sequences, understand
instructions, transition between activities, or manage changes in their workday.
Printed checklists or verbal instructions may not always meet individual needs.
Employers and job coaches need simple ways to create accessible instructions
that employees can use independently.

### 3. Target users

- **Primary:** Employees with disabilities who benefit from visual, audio, or
  step-by-step workplace instructions.
- **Secondary:** Job coaches and employment specialists.
- **Additional:** Supervisors and workplace trainers.

### 4. Core features

| Feature | Requirement |
| --- | --- |
| Create a task | Add a workplace task and describe its steps. |
| Visual instructions | Include an image or icon for each step. |
| Audio support | Allow users to hear task instructions. |
| Step-by-step navigation | Show one step at a time with Back and Next controls. |
| Task completion | Allow workers to mark individual steps or tasks complete. |
| Daily routine | Display a simple list of assigned tasks for the day. |
| Reminders | Provide optional reminders or prompts for scheduled activities. |
| Request help | Provide an easy way to indicate when assistance is needed. |

### 5. User stories

- As an employee, I want to see pictures showing each step of a task so I can
  complete it without asking my supervisor repeatedly.
- As an employee, I want to listen to instructions rather than read them.
- As a job coach, I want to quickly create a task checklist for someone I
  support.
- As a supervisor, I want to update instructions when a process changes.
- As an employee, I want to indicate that I need help without feeling
  embarrassed.

### 6. Minimum viable product

Build a prototype that:

1. Displays a list of three sample workplace tasks.
2. Allows the user to select a task.
3. Shows that task in manageable steps with pictures and text.
4. Allows each step to be marked complete.
5. Shows task completion progress.
6. Includes a simple "I Need Help" option.

**Suggested demo:** An employee working in a retail store opens a task called
"Stock the Shelves." The tool walks them through gathering supplies, checking
product labels, placing products, and cleaning up. The employee follows the
steps, marks them complete, and finishes the task.

### 7. Accessibility requirements

- Provide large, clearly labeled controls.
- Support images, text, video, and optional audio instructions.
- Use plain language and short sentences.
- Support keyboard and screen-reader navigation.
- Avoid requiring fast responses or completing steps within a set time.
- Allow workers to repeat instructions.
- Minimize unnecessary distractions and complicated navigation.
- Support use on a smartphone or tablet.

### 8. Success criteria

- A job coach can create a basic task guide using a simple interface or
  template.
- An employee can follow and complete a sample five-step task.
- The tool provides at least two instruction formats, such as text and
  pictures.
- The employee can repeat steps or request help.
- The employee can easily identify their current step and what comes next.

### 9. Out of scope for the hackathon

- Full employee scheduling or time tracking.
- Payroll integration.
- Automated employee performance evaluation.
- Location tracking.
- Extensive employer management features.
- Advanced AI-generated task analysis.

### 10. Privacy and design considerations

The tool should be designed as a support for employees, not as a way for
employers to monitor or measure workers without their knowledge. Task progress
should remain private unless the employee understands and agrees to share it.
Task instructions must reflect actual workplace requirements, and potentially
unsafe work processes should be reviewed by qualified staff.

**Key design question:** How can we make workplace instructions easier to
understand and use so employees can work more independently?

---

## Project 3: Job Coach Connection

**Product type:** Accessible employee and job coach communication tool

### 1. Product overview

Job Coach Connection is a simple communication tool that helps employees request
workplace assistance from their job coach or employment support professional.
Employees can describe what they need using text, pictures, or predefined
messages. Job coaches can review requests and respond with guidance or arrange
additional support.

**Product goal:** Help employees get timely assistance while supporting their
independence and reducing unnecessary barriers to communication.

### 2. Problem statement

Employees with disabilities sometimes need assistance with workplace tasks,
communication, changing routines, or unexpected situations. However, requesting
help may be difficult because of communication disabilities, uncertainty about
whom to contact, or discomfort interrupting a supervisor. Job coaches also may
support several employees across different worksites, making it difficult to
provide immediate in-person assistance. A simple, accessible communication tool
could help employees request support and job coaches respond more efficiently.

### 3. Target users

- **Primary:** Employees with disabilities receiving job coaching or employment
  support.
- **Secondary:** Job coaches and employment specialists.
- **Additional:** Authorized workplace support staff when appropriate.

### 4. Core features

| Feature | Requirement |
| --- | --- |
| Request help | Provide a clearly labeled "I Need Help" option. |
| Select support need | Offer choices such as "I have a question," "I don't understand a task," or "My schedule changed." |
| Multiple communication options | Allow text, predefined messages, and picture-based selections. |
| Send request | Deliver the request to a designated job coach or simulated coach inbox. |
| View request status | Display whether the request has been sent, seen, or answered. |
| Job coach response | Allow the coach to send a short written or predefined response. |
| Communication history | Allow the employee to review messages within the current session. |

### 5. User stories

- As an employee, I want to ask for help using pictures because typing messages
  can be difficult.
- As an employee, I want to know when my job coach has received my request.
- As a job coach, I want to see what type of help someone needs before
  contacting them.
- As an employee, I want a simple way to explain that I am confused or that
  something unexpected happened.
- As a job coach, I want to respond with a short, clear message that is easy to
  understand.

### 6. Minimum viable product

Build a prototype that:

1. Displays a clearly labeled "I Need Help" option.
2. Allows an employee to select from four common support needs.
3. Allows an optional short text message.
4. Sends the request to a demonstration job coach dashboard.
5. Allows the job coach to acknowledge and respond.
6. Displays the response on the employee's screen.

**Suggested demo:** An employee is assigned a new task but doesn't understand
the instructions. They select "I Need Help," followed by "I don't understand my
task." The job coach receives the request and responds with instructions or an
offer to connect directly. The employee sees the response and continues working.

### 7. Accessibility requirements

- Use large buttons and clear icons with text labels.
- Provide short, plain-language message options.
- Support screen readers and keyboard navigation.
- Allow alternatives to typing.
- Provide clear confirmation when a message is sent.
- Make it easy to review previous messages.
- Avoid complicated menus or unnecessary steps.

### 8. Success criteria

- An employee can submit a request for assistance in three interactions or
  fewer using predefined options.
- The request appears in the coach dashboard.
- A coach can acknowledge and respond.
- The employee can clearly identify whether the request was received.
- At least one alternative to typed communication is available.

### 9. Out of scope for the hackathon

- Integration with employer personnel systems.
- Medical or emergency response services.
- Video calling or advanced messaging systems.
- Automated monitoring of employees.
- Production-grade confidential case management.
- Multi-agency coordination systems.

### 10. Privacy and design considerations

The system must clearly identify who can receive messages. Employees should
understand what information is shared and with whom. A production version would
require secure authentication, protected communications, appropriate record
retention policies, and defined response expectations. The product should not
imply that a job coach is always immediately available. It should also
distinguish routine coaching requests from emergencies and direct users to
established emergency procedures when needed.

**Key design question:** How can technology make it easier for employees to ask
for and receive support without creating unnecessary dependence on a job coach?

---

## Project 4: Employer Opportunity & Support Hub

**Product type:** Employer decision-support and workplace accessibility tool

### 1. Product overview

The Employer Opportunity & Support Hub is a digital tool that helps employers
identify opportunities for people with disabilities, understand workplace
accommodation needs, and support employees after hiring. The tool translates
candidates' skills and interests into possible workplace tasks and provides
practical guidance for accessible hiring, disability disclosure, accommodations,
and onboarding.

**Product goal:** Make it easier for employers to recognize talent, create
meaningful job opportunities, and support employees with disabilities.

### 2. Problem statement

Employers may be interested in hiring people with disabilities but lack
experience or confidence in doing so. They may not know how to:

- Connect an individual's skills and interests to their business needs.
- Identify or customize meaningful job responsibilities.
- Respond appropriately when an applicant or employee discloses a disability.
- Understand and respond to accommodation requests.
- Develop effective onboarding and workplace support strategies.

Existing resources offer valuable information but may not connect these
activities into a simple, personalized workflow.

### 3. Target users

**Primary users:** Small and midsize employers, hiring managers, supervisors,
and HR professionals.

**Secondary users:** Job developers, employment specialists, job coaches, and
employer engagement professionals.

### 4. Core product features

| Feature | Requirement |
| --- | --- |
| Employer needs assessment | Allow employers to describe their business, staffing needs, and job tasks. |
| Skills-to-tasks matching | Identify potential connections between candidate strengths and workplace responsibilities. |
| Job task development | Help employers explore combinations of tasks that could create meaningful employment opportunities. |
| Disclosure guidance | Offer examples and explanations of appropriate employer responses to disability disclosures. |
| Accommodation explorer | Suggest possible accommodations and connect users to authoritative resources. |
| Onboarding planner | Create a simple checklist for training, communication, and workplace supports. |
| Resource connections | Provide links to JAN, EEOC, DVR, and other trusted resources. |

### 5. User stories

- As an employer, I want to understand how a candidate's skills could meet my
  business needs.
- As a hiring manager, I want to know how to respond when an applicant
  discloses a disability.
- As a supervisor, I want practical ideas for adapting how work tasks are
  taught or completed.
- As an employer, I want help understanding accommodation requests without
  making assumptions about a person's disability.
- As a job developer, I want a tool that helps facilitate conversations with
  employers about potential job opportunities.

### 6. Minimum viable product

For a one-day hackathon, focus primarily on the skills-to-tasks matching
feature. The prototype should:

1. Allow an employer to select an industry or business type.
2. Allow the employer to describe three to five workplace needs or recurring
   tasks.
3. Allow entry of a fictional candidate's skills, interests, and work
   preferences.
4. Suggest possible matches between those skills and workplace tasks.
5. Explain why each task might be a good match.
6. Display a simple employer action plan with suggested next steps.

**Optional enhancements:** Add a disclosure scenario guide, accommodation
resource links, or a basic onboarding checklist if time permits.

### 7. Suggested demonstration

A retail business needs help with inventory, organizing merchandise, and
maintaining product displays. A fictional job seeker has strong organizational
skills, enjoys routine tasks, and prefers working with merchandise. The employer
enters its staffing needs and the candidate's strengths. The tool suggests
several relevant job responsibilities and provides questions the employer and
candidate can discuss with an employment specialist. The demonstration
concludes with a draft task plan that could be used as a starting point for
exploring an employment opportunity.

### 8. Accessibility requirements

- Keyboard and screen-reader accessibility.
- Plain-language explanations.
- Clear navigation and readable layouts.
- Mobile-friendly design.
- Accessible forms and controls.
- No unnecessary time limits.
- Avoid disability-based assumptions or stereotypes.

### 9. Success criteria

- An employer can complete a sample business needs assessment.
- The tool identifies at least three plausible workplace tasks connected to the
  fictional candidate's skills.
- Suggested tasks reflect actual employer needs, not assumptions about
  disability.
- The tool explains the reasoning behind each suggestion.
- The employer can generate a simple next-steps plan.
- The product directs users to trusted accommodation and disability employment
  resources.

### 10. Privacy and ethical requirements

- Do not require a candidate to disclose a disability or diagnosis.
- Obtain permission before sharing candidate portfolio information.
- Do not automatically rank candidates based on disability.
- Do not make automated hiring or accommodation decisions.
- Protect confidential employee information.
- Do not suggest an accommodation based solely on a disability label.
- Refer complex legal questions to qualified professionals and authoritative
  resources.

### 11. Out of scope for the hackathon

- Full applicant tracking systems.
- Automatic employment decisions.
- Comprehensive ADA compliance management.
- Integration with payroll or HR platforms.
- Production storage of medical or disability information.
- Full employer–candidate matchmaking across multiple organizations.

### 12. Future development opportunities

A more developed version could connect directly with the Show Your Skills
portfolio, allowing job seekers to selectively share information with
interested employers. Future versions could also include individualized
onboarding plans, job coach collaboration, employer training resources, and
structured follow-up support.

**Key design question:** How can technology help employers move from
recognizing a person's skills to creating meaningful employment opportunities
and supporting success at work?
