#!/usr/bin/env python3
"""
Generate SYNTHETIC data for Hackreation x ERI.

Every person, employer, PO number and note here is FAKE. Nothing comes from
ERI's real systems. Re-run any time; the seed keeps output identical.

    pip install faker
    python3 tools/generate_synthetic_data.py

Writes CSVs to data/ and an answer key of planted billing anomalies to
data/dvr/_answer_key.md (judges only - teams should not peek).
"""
import csv
import os
import random
from datetime import date, timedelta

from faker import Faker

SEED = 20261031
random.seed(SEED)
fake = Faker("en_US")
Faker.seed(SEED)

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")

# Milwaukee-area neighborhoods with rough lat/lon (public geography, not people)
NEIGHBORHOODS = [
    ("Downtown", "53202", 43.0389, -87.9065),
    ("Bay View", "53207", 42.9945, -87.8970),
    ("Walker's Point", "53204", 43.0236, -87.9134),
    ("Riverwest", "53212", 43.0710, -87.8990),
    ("Sherman Park", "53210", 43.0705, -87.9690),
    ("Harambee", "53212", 43.0680, -87.9120),
    ("Clarke Square", "53204", 43.0180, -87.9390),
    ("Layton Park", "53215", 43.0020, -87.9450),
    ("Washington Heights", "53208", 43.0560, -87.9730),
    ("Menomonee Valley", "53233", 43.0300, -87.9400),
    ("West Allis", "53214", 43.0167, -88.0070),
    ("Wauwatosa", "53213", 43.0495, -88.0076),
    ("Glendale", "53209", 43.1350, -87.9350),
    ("Oak Creek", "53154", 42.8850, -87.8630),
    ("Brown Deer", "53223", 43.1630, -87.9640),
]

INTERESTS = ["animals", "art", "cooking", "computers", "customer service", "data entry",
             "driving", "fixing things", "gardening", "health care", "helping people",
             "music", "organizing", "retail", "sports", "warehouse", "writing", "cleaning"]
SKILLS = ["typing", "cash handling", "food safety", "forklift", "Microsoft Office",
          "attention to detail", "bilingual Spanish", "bilingual Hmong", "ASL",
          "inventory", "phone etiquette", "social media", "basic tools", "sorting",
          "following checklists", "teamwork"]
ACCOMMODATIONS = ["flexible schedule", "written instructions", "quiet workspace",
                  "screen reader", "job coach on site", "seated work", "frequent breaks",
                  "extra training time", "noise-cancelling headphones", "ramp/elevator access",
                  "ASL interpreter for meetings", "large-print materials"]
DISABILITY_CATS = ["intellectual/developmental", "autism", "mental health", "physical",
                   "blind/low vision", "Deaf/hard of hearing", "brain injury", "multiple"]
BENEFITS = ["SSI", "SSDI", "SSI+SSDI", "none"]
PROGRAMS = ["DVR", "DVR+IRIS", "DVR+Family Care", "Ticket to Work", "WIPA only"]

CATEGORIES = {
    "Food service": ["Dishwasher", "Prep Cook", "Barista", "Busser", "Line Cook"],
    "Retail": ["Stocker", "Cashier", "Sales Associate", "Cart Attendant"],
    "Warehouse": ["Picker/Packer", "Shipping Clerk", "Sorter", "Inventory Associate"],
    "Office": ["Data Entry Clerk", "Receptionist", "Mail Clerk", "Office Assistant"],
    "Health care": ["Patient Transporter", "Dietary Aide", "Environmental Services Tech"],
    "Custodial": ["Custodian", "Housekeeper", "Groundskeeper"],
    "Tech": ["IT Help Desk Tech", "QA Tester", "Digital Accessibility Tester"],
    "Customer service": ["Call Center Rep", "Front Desk Associate", "Greeter"],
    "Animal care": ["Kennel Attendant", "Pet Groomer Assistant"],
}
# Clearly fictional employers
EMPLOYER_PREFIX = ["Lakefront", "Cream City", "Brewtown", "Kinnickinnic", "Third Ward",
                   "Menomonee", "Riverbend", "Northpoint", "Juneau", "Harbor", "Bluff",
                   "Lincoln Ave", "Fondy", "Story Hill", "Sixth Street"]
EMPLOYER_SUFFIX = ["Bakery Co.", "Logistics", "Market", "Health Partners", "Hotel",
                   "Print Shop", "Grocers", "Animal Hospital", "Tech Labs", "Distribution",
                   "Cafe", "Credit Union", "Facilities Group", "Senior Living"]

# Phrases for the inclusive-job-post checker (brief 3). Some are needless barriers.
BARRIER_PHRASES = [
    "Must be able to lift 50 lbs.",
    "Valid driver's license required.",
    "Must be able to stand for 8 hours.",
    "Excellent verbal communication skills required.",
    "Must pass a personality assessment.",
    "Must have reliable personal transportation.",
    "High school diploma required.",
    "Fast-paced environment; must multitask under pressure.",
    "Must be able to hear alarms and phone calls.",
    "Clear background check with no exceptions.",
]
NEUTRAL_PHRASES = [
    "Training provided.",
    "Reasonable accommodations available on request.",
    "Bus line within one block.",
    "Flexible scheduling available.",
    "We welcome applicants of all abilities.",
    "Paid time off after 90 days.",
    "Uniform provided.",
    "Team-oriented workplace.",
]


def write_csv(path, rows, fields):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)
    print(f"wrote {len(rows):4d} rows -> {os.path.relpath(path, ROOT + '/..')}")


def job_seekers(n=40):
    rows = []
    for i in range(1, n + 1):
        hood = random.choice(NEIGHBORHOODS)
        age = random.choice(list(range(16, 26)) * 2 + list(range(26, 64)))
        rows.append({
            "seeker_id": f"JS{i:03d}",
            "first_name": fake.first_name(),
            "last_initial": fake.random_uppercase_letter() + ".",
            "age": age,
            "neighborhood": hood[0],
            "zip": hood[1],
            "lat": round(hood[2] + random.uniform(-0.008, 0.008), 5),
            "lon": round(hood[3] + random.uniform(-0.008, 0.008), 5),
            "disability_category": random.choice(DISABILITY_CATS),
            "benefits": random.choices(BENEFITS, weights=[35, 30, 15, 20])[0],
            "program": random.choice(PROGRAMS),
            "interests": ";".join(random.sample(INTERESTS, 3)),
            "skills": ";".join(random.sample(SKILLS, random.randint(2, 4))),
            "accommodations": ";".join(random.sample(ACCOMMODATIONS, random.randint(1, 3))),
            "desired_hours_per_week": random.choice([10, 15, 20, 20, 25, 30, 35, 40]),
            "available_days": random.choice(["Mon-Fri", "Weekdays mornings", "Weekends",
                                              "Any", "Mon/Wed/Fri", "Evenings"]),
            "transportation": random.choice(["bus", "bus", "bus", "ride from family",
                                              "paratransit (Transit Plus)", "walk", "own car"]),
            "max_commute_minutes": random.choice([20, 30, 30, 45, 60]),
            "ipe_goal": random.choice(sum(CATEGORIES.values(), [])),
            "synthetic": "TRUE",
        })
    return rows


def job_postings(n=60):
    rows = []
    for i in range(1, n + 1):
        cat = random.choice(list(CATEGORIES))
        title = random.choice(CATEGORIES[cat])
        hood = random.choice(NEIGHBORHOODS)
        hours = random.choice([12, 16, 20, 20, 24, 25, 30, 32, 35, 40, 40])
        wage = round(random.uniform(11.0, 24.0) * 4) / 4
        reqs = random.sample(BARRIER_PHRASES, random.randint(0, 3)) + \
            random.sample(NEUTRAL_PHRASES, random.randint(1, 3))
        random.shuffle(reqs)
        rows.append({
            "posting_id": f"JP{i:03d}",
            "employer": f"{random.choice(EMPLOYER_PREFIX)} {random.choice(EMPLOYER_SUFFIX)}",
            "title": title,
            "category": cat,
            "neighborhood": hood[0],
            "zip": hood[1],
            "lat": round(hood[2] + random.uniform(-0.01, 0.01), 5),
            "lon": round(hood[3] + random.uniform(-0.01, 0.01), 5),
            "hours_per_week": hours,
            "wage_per_hour": f"{wage:.2f}",
            "health_insurance": random.choice(["TRUE", "FALSE", "FALSE"]) if hours >= 20 else "FALSE",
            "shift": random.choice(["Day", "Evening", "Overnight", "Weekend", "Flexible"]),
            "remote": "TRUE" if cat == "Tech" and random.random() < 0.5 else "FALSE",
            "near_bus_line": random.choice(["TRUE", "TRUE", "TRUE", "FALSE"]),
            "description": f"{title} at a {cat.lower()} employer in {hood[0]}. " + " ".join(reqs),
            "posted_date": (date(2026, 10, 1) + timedelta(days=random.randint(0, 28))).isoformat(),
            "synthetic": "TRUE",
        })
    return rows


# ---------- DVR billing (Challenge B) ----------
# Rates: Wisconsin DVR Statewide Service Fee Structure, effective 2026-07-01 to 2028-06-30.
RATES = {
    "SE-CP": ("Career Profile", 1000),
    "SE-JPDP": ("Job Preparation and Development Plan", 350),
    "SE-JDH": ("Job Development and Hire", 1600),        # 2000 / 2200 if preferred
    "SE-JTA": ("Job and Task Analysis", 275),
    "SE-MSI": ("Monthly Systematic Instruction", 1600),  # per month employed
    "SE-RET": ("Retention Services (no SI)", 500),       # per month employed
    "SE-TLTS": ("Transition to Long-Term Support (<=6 mo)", 1300),
}


def jdh_rate(hours, wage, insurance):
    if hours >= 35 and (insurance or wage >= 16.00):
        return 2200
    if hours >= 20 and (insurance or wage >= 12.00):
        return 2000
    return 1600


def add_business_days(d, n):
    while n > 0:
        d += timedelta(days=1)
        if d.weekday() < 5:
            n -= 1
    return d


def dvr(n_clients=30):
    auths, notes, invoices, key = [], [], [], []
    po_seq, inv_seq, note_seq = 41000, 9000, 1
    anomaly_clients = random.sample(range(1, n_clients + 1), 12)
    plan = {
        "missing_month": anomaly_clients[0:3],
        "hire_not_billed": anomaly_clients[3:5],
        "preferred_underbilled": anomaly_clients[5:8],
        "late_report": anomaly_clients[8:10],
        "not_employed_month": anomaly_clients[10:12],   # a gap that is CORRECT (not billable)
    }

    for c in range(1, n_clients + 1):
        cid = f"C{c:03d}"
        specialist = random.choice(["ES-Alpha", "ES-Bravo", "ES-Charlie", "ES-Delta"])
        start = date(2026, 1, 5) + timedelta(days=random.randint(0, 90))
        d = start

        def note(day, svc, text, **extra):
            nonlocal note_seq
            row = {"note_id": f"N{note_seq:05d}", "client_id": cid, "date": day.isoformat(),
                   "service_code": svc, "author": specialist, "note_text": text,
                   "hire_date": "", "hours_per_week": "", "wage_per_hour": "",
                   "health_insurance": "", "report_submitted_date": "", "synthetic": "TRUE"}
            row.update(extra)
            notes.append(row)
            note_seq += 1

        def auth(svc, day, units=1):
            nonlocal po_seq
            po = f"PO{po_seq}"
            po_seq += 1
            auths.append({"po_number": po, "client_id": cid, "service_code": svc,
                          "service_name": RATES[svc][0], "authorized_date": day.isoformat(),
                          "authorized_units": units, "synthetic": "TRUE"})
            return po

        def invoice(po, svc, day, amount, month_n=""):
            nonlocal inv_seq
            invoices.append({"invoice_id": f"INV{inv_seq}", "po_number": po, "client_id": cid,
                             "service_code": svc, "service_month": month_n,
                             "invoice_date": day.isoformat(), "amount": amount, "synthetic": "TRUE"})
            inv_seq += 1

        # 1) Career Profile
        po = auth("SE-CP", d)
        d += timedelta(days=random.randint(20, 60))
        rep = add_business_days(d, random.randint(1, 4))
        note(d, "SE-CP", "Completed career profile meeting with client and family. Discussed interests, "
             "strengths and support needs. Coordinated with long-term care manager.",
             report_submitted_date=rep.isoformat())
        invoice(po, "SE-CP", rep, 1000)

        # 2) Job Prep & Development Plan
        po = auth("SE-JPDP", d + timedelta(days=3))
        d += timedelta(days=random.randint(10, 40))
        rep = add_business_days(d, random.randint(1, 4))
        note(d, "SE-JPDP", "Held job development planning meeting. Agreed target jobs, employer list "
             "and accommodations. Plan signed by team.", report_submitted_date=rep.isoformat())
        invoice(po, "SE-JPDP", rep, 350)

        # 3) Job Development & Hire (most clients get hired)
        if random.random() < 0.85 or c in sum(plan.values(), []):
            po = auth("SE-JDH", d + timedelta(days=2))
            for _ in range(random.randint(1, 3)):
                d += timedelta(days=30)
                note(d, "SE-JDH", "Monthly job development report: contacted employers, "
                     "practiced interviews, submitted applications.",
                     report_submitted_date=add_business_days(d, 3).isoformat())
            d += timedelta(days=random.randint(5, 25))
            hire = d
            hours = random.choice([15, 20, 24, 30, 35, 38, 40])
            wage = round(random.uniform(11.0, 19.0) * 4) / 4
            ins = random.random() < 0.3
            if c in plan["preferred_underbilled"]:
                hours, wage, ins = random.choice([(36, 16.50, False), (22, 13.00, False), (38, 14.00, True)])
            due_days = random.randint(1, 4)
            if c in plan["late_report"]:
                due_days = random.randint(8, 14)
            rep = add_business_days(hire, due_days)
            note(hire, "SE-JDH", f"Client hired as {random.choice(sum(CATEGORIES.values(), []))} at a "
                 f"local employer. Start date confirmed. {hours} hrs/week at ${wage:.2f}/hr."
                 + (" Employer offers health insurance." if ins else ""),
                 hire_date=hire.isoformat(), hours_per_week=hours, wage_per_hour=f"{wage:.2f}",
                 health_insurance="TRUE" if ins else "FALSE", report_submitted_date=rep.isoformat())
            correct = jdh_rate(hours, wage, ins)
            if c in plan["hire_not_billed"]:
                key.append(("hire_not_billed", cid, po, f"Hire on {hire} documented; no SE-JDH invoice. "
                            f"Expected ${correct}."))
            elif c in plan["preferred_underbilled"]:
                invoice(po, "SE-JDH", rep, 1600)
                key.append(("preferred_underbilled", cid, po, f"{hours} h/wk, ${wage:.2f}/h, insurance={ins}; "
                            f"billed $1600, criteria support ${correct}. Verify with DVR before rebilling."))
            else:
                invoice(po, "SE-JDH", rep, correct)
            if c in plan["late_report"]:
                key.append(("late_report", cid, po, f"Hire {hire}, report submitted {rep} "
                            f"({due_days} business days; limit is 5)."))

            # 4) Monthly SI or Retention
            svc = random.choice(["SE-MSI", "SE-RET"])
            months = random.randint(4, 7)
            po = auth(svc, hire, units=months)
            skip = random.randint(2, months - 1)
            for m in range(1, months + 1):
                mday = hire + timedelta(days=30 * m)
                if c in plan["not_employed_month"] and m == skip:
                    note(mday, svc, f"Month {m}: client not employed this month (job ended); "
                         "job search resumed. No support delivered under this PO.",
                         report_submitted_date=add_business_days(mday, 2).isoformat())
                    key.append(("not_employed_month (NOT an error)", cid, po,
                                f"Month {m} has no invoice because client was not employed. "
                                "A good tool should NOT flag this as missed revenue."))
                    continue
                note(mday, svc, f"Month {m} support: on-site check-in with client and supervisor. "
                     + ("Long-term care coordination documented." if m == 2 else "Client meeting expectations."),
                     report_submitted_date=add_business_days(mday, random.randint(1, 4)).isoformat())
                if c in plan["missing_month"] and m == skip:
                    key.append(("missing_month", cid, po, f"{svc} month {m} delivered and documented "
                                f"but not invoiced (${RATES[svc][1]})."))
                    continue
                invoice(po, svc, add_business_days(mday, 4), RATES[svc][1], month_n=m)

    write_csv(os.path.join(ROOT, "dvr", "authorizations.csv"), auths,
              ["po_number", "client_id", "service_code", "service_name", "authorized_date",
               "authorized_units", "synthetic"])
    write_csv(os.path.join(ROOT, "dvr", "service_notes.csv"), notes,
              ["note_id", "client_id", "date", "service_code", "author", "note_text", "hire_date",
               "hours_per_week", "wage_per_hour", "health_insurance", "report_submitted_date", "synthetic"])
    write_csv(os.path.join(ROOT, "dvr", "invoices.csv"), invoices,
              ["invoice_id", "po_number", "client_id", "service_code", "service_month",
               "invoice_date", "amount", "synthetic"])
    write_csv(os.path.join(ROOT, "dvr", "fee_schedule.csv"),
              [{"service_code": k, "service_name": v[0], "rate": v[1],
                "unit": "per month employed" if k in ("SE-MSI", "SE-RET") else "per authorization",
                "notes": {"SE-JDH": "2000 if 20+ h/wk AND (insurance OR >=$12/h); 2200 if 35+ h/wk AND (insurance OR >=$16/h)"}.get(k, "")}
               for k, v in RATES.items()],
              ["service_code", "service_name", "rate", "unit", "notes"])

    with open(os.path.join(ROOT, "dvr", "_answer_key.md"), "w") as f:
        f.write("# Answer key: planted anomalies (JUDGES ONLY)\n\n")
        f.write("Synthetic data. Generated by tools/generate_synthetic_data.py, seed %d.\n\n" % SEED)
        f.write("| Type | Client | PO | Detail |\n| --- | --- | --- | --- |\n")
        for t, cid, po, det in sorted(key):
            f.write(f"| {t} | {cid} | {po} | {det} |\n")
    print(f"wrote {len(key):4d} planted anomalies -> data/dvr/_answer_key.md")


# ---------- Ticket to Work (ERI PLUS) - SIMPLIFIED 2026 rules ----------
# Real rules: wiki/knowledge/benefits/ticket-to-work.md (2026 Payments at a Glance).
# Simplified for the hackathon: SSDI beneficiaries only, milestone-outcome method.
#   Phase 1 M1: first month with gross earnings >= $1,210 (TWP level) -> $1,904
#   Phase 1 M2: 3 months >= $1,210 within a 6-month window            -> $1,904
#   Phase 2:    each month with earnings > $1,690 (SGA) after Phase 1 -> $571
TWP_2026, SGA_2026 = 1210, 1690


def ticket(n=15):
    tickets, earnings, claims, key = [], [], [], []
    for i in range(1, n + 1):
        bid = f"T{i:03d}"
        tickets.append({"beneficiary_id": bid, "benefit": "SSDI", "ticket_assigned": "2025-11-01",
                        "payment_method": "milestone-outcome", "synthetic": "TRUE"})
        base = random.choice([900, 1300, 1500, 1800, 2100])
        months = [date(2026, m, 1) for m in range(1, 10)]
        stub_missing = random.random() < 0.2
        above_twp = 0
        m1 = m2 = False
        for k, mo in enumerate(months):
            gross = max(0, int(random.gauss(base, 250)))
            has_stub = not (stub_missing and k == 4)
            earnings.append({"beneficiary_id": bid, "month": mo.strftime("%Y-%m"), "gross_earnings": gross,
                             "pay_stub_on_file": "TRUE" if has_stub else "FALSE", "synthetic": "TRUE"})
            if not has_stub:
                key.append(("ticket_missing_evidence", bid, mo.strftime("%Y-%m"),
                            f"Earnings reported but no pay stub on file; collect evidence before claiming (gross ${gross})."))
                continue
            claimed = True
            if gross >= TWP_2026:
                above_twp += 1
            if not m1 and gross >= TWP_2026:
                m1, kind, amt = True, "P1-M1", 1904
            elif m1 and not m2 and above_twp >= 3:
                m2, kind, amt = True, "P1-M2", 1904
            elif m2 and gross > SGA_2026:
                kind, amt = "P2", 571
            else:
                continue
            if random.random() < 0.15:
                key.append(("ticket_unclaimed", bid, mo.strftime("%Y-%m"),
                            f"{kind} earned (gross ${gross}) but no payment request filed (${amt})."))
                claimed = False
            if claimed:
                claims.append({"beneficiary_id": bid, "month": mo.strftime("%Y-%m"), "payment_type": kind,
                               "amount_claimed": amt, "synthetic": "TRUE"})
    write_csv(os.path.join(ROOT, "ticket", "tickets.csv"), tickets, list(tickets[0]))
    write_csv(os.path.join(ROOT, "ticket", "monthly_earnings.csv"), earnings, list(earnings[0]))
    write_csv(os.path.join(ROOT, "ticket", "payment_requests.csv"), claims,
              ["beneficiary_id", "month", "payment_type", "amount_claimed", "synthetic"])
    return key


# ---------- County contract (e.g. a CCS-like program) - SIMPLIFIED ----------
# Units are 15-minute units authorized per month; rate is FAKE ($25/unit).
def county(n=12):
    auths, delivered, claims, key = [], [], [], []
    for i in range(1, n + 1):
        cid = f"K{i:03d}"
        for m in range(1, 10):
            mo = f"2026-{m:02d}"
            units_auth = random.choice([16, 24, 32])
            units_del = min(units_auth, max(0, int(random.gauss(units_auth * 0.8, 5))))
            units_claim = units_del
            if random.random() < 0.08 and units_del > 0:
                units_claim = units_del - random.randint(4, min(12, units_del))
                key.append(("county_underclaimed", cid, mo,
                            f"Delivered {units_del} units, claimed {units_claim} (${(units_del-units_claim)*25} at fake $25/unit)."))
            elif random.random() < 0.03:
                units_claim = units_auth + 4
                key.append(("county_overclaimed (RISK)", cid, mo,
                            f"Claimed {units_claim} units > {units_auth} authorized and {units_del} delivered. Must NOT be billed."))
            auths.append({"client_id": cid, "month": mo, "service": "CCS-like psychosocial support",
                          "units_authorized": units_auth, "synthetic": "TRUE"})
            delivered.append({"client_id": cid, "month": mo, "units_delivered": units_del, "synthetic": "TRUE"})
            claims.append({"client_id": cid, "month": mo, "units_claimed": units_claim, "rate_per_unit": 25,
                           "synthetic": "TRUE"})
    write_csv(os.path.join(ROOT, "county", "authorizations.csv"), auths, list(auths[0]))
    write_csv(os.path.join(ROOT, "county", "units_delivered.csv"), delivered, list(delivered[0]))
    write_csv(os.path.join(ROOT, "county", "claims.csv"), claims, list(claims[0]))
    return key


def sync_challenges():
    """Each challenge gets its OWN copy of the data it needs, so the challenges stay decoupled."""
    import shutil
    base = os.path.join(ROOT, "..", "challenges")
    plan = {
        "01-funding-gap-finder": ["dvr/fee_schedule.csv", "dvr/authorizations.csv", "dvr/service_notes.csv",
                                  "dvr/invoices.csv", "ticket/tickets.csv", "ticket/monthly_earnings.csv",
                                  "ticket/payment_requests.csv", "county/authorizations.csv",
                                  "county/units_delivered.csv", "county/claims.csv"],
        "02-job-fit-checker": ["job_postings.csv", "job_seekers.csv"],
        "03-job-post-checker": ["job_postings.csv"],
    }
    for ch, files in plan.items():
        if not os.path.isdir(os.path.join(base, ch)):
            continue
        for rel in files:
            dst = os.path.join(base, ch, "data", rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copyfile(os.path.join(ROOT, rel), dst)
        print(f"synced {len(files):2d} files -> challenges/{ch}/data/")


if __name__ == "__main__":
    seekers = job_seekers()
    write_csv(os.path.join(ROOT, "job_seekers.csv"), seekers, list(seekers[0].keys()))
    posts = job_postings()
    write_csv(os.path.join(ROOT, "job_postings.csv"), posts, list(posts[0].keys()))
    dvr()
    extra = ticket() + county()
    with open(os.path.join(ROOT, "dvr", "_answer_key.md"), "a") as f:
        f.write("\n## Ticket to Work and county (simplified rules)\n\n| Type | ID | Month | Detail |\n| --- | --- | --- | --- |\n")
        for t, i, m, d in sorted(extra):
            f.write(f"| {t} | {i} | {m} | {d} |\n")
    print(f"wrote {len(extra):4d} more planted items (ticket + county)")
    sync_challenges()
