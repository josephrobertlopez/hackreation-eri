# PRDs: three, on purpose

We cut every idea down with one razor: **does ERI walk away with something real?** ERI asked for two things: connect job seekers to jobs, and DVR billing. Their web team is the group most likely to adopt something, and a volunteer can give about two evenings of follow-up.

| # | PRD | User | Why it survived | Ships how |
| --- | --- | --- | --- | --- |
| 01 | [Funding gap finder](01-funding-gap-finder.md) | ERI finance and program staff | ERI named DVR billing; real money; one pattern across DVR, Ticket and county | **Prototype + recommendation** (internal data means ERI decides later) |
| 02 | [Is this job right for me?](02-job-fit-checker.md) | Job seekers on ERI's website | The event theme, made concrete; addresses the #1 fear (benefits) | **WordPress plugin** ERI can review for its site; no data stored |
| 03 | [Inclusive job post checker](03-job-post-checker.md) | Employers | Visibility + leads for ERI Business Services; small to host | **WordPress plugin** ERI can review for its site; no data stored |

Everything else is in the [cut list](cut-list.md), with the reason it was cut.

**Each PRD has:** an *assumptions box* (ERI: keep / kill / change), a working hello world in `challenges/`, mock data, personas, an adversarial debate, and a "who owns it Monday" line.

**Decoupled by design:** each PRD has its own folder, its own copy of the data, its own tests and its own CI workflow. A team never depends on another team. If teams are few, run 02 first (the theme), then 01, then 03.
