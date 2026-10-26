---
title: Transit data (GTFS) and commute time
summary: GTFS and GTFS-realtime feeds for MCTS, Madison Metro, Racine RYDE, Janesville and other southern Wisconsin transit, their license terms, and how to compute bus commute times with OpenTripPlanner or r5py.
tags: [datasets, transit, gtfs, gtfs-realtime, mcts, madison-metro, commute, opentripplanner, r5]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2026-12-05   # Madison Metro feed is valid through 2026-12-05; Janesville through 2026-12-10
review_owner: ERI employment services manager
confidence: medium
sources:
  - title: MCTS Developer Terms and GTFS Feed
    url: https://www.ridemcts.com/policies/developer-terms
    accessed: 2026-10-23
  - title: Transitland Atlas, MCTS feed record (mcts.org.dmfr.json)
    url: https://github.com/transitland/transitland-atlas/blob/main/feeds/mcts.org.dmfr.json
    accessed: 2026-10-23
  - title: Mobility Database, MCTS GTFS (mdb-2127)
    url: https://mobilitydatabase.org/feeds/gtfs/mdb-2127
    accessed: 2026-10-23
  - title: City of Madison Metro Transit, Information for Developers
    url: https://www.cityofmadison.com/metro/business/information-for-developers
    accessed: 2026-10-23
  - title: Madison Metro Developer License Agreement and Terms of Use
    url: https://www.cityofmadison.com/metro/business/information-for-developers/developer-license-agreement-and-terms-of-use
    accessed: 2026-10-23
  - title: Madison Metro GTFS directory
    url: http://transitdata.cityofmadison.com/GTFS/
    accessed: 2026-10-23
  - title: Mobility Database, Metro Transit City of Madison (mdb-394)
    url: https://mobilitydatabase.org/feeds/gtfs/mdb-394
    accessed: 2026-10-23
  - title: Mobility Database, Ryde Racine (mdb-2246)
    url: https://mobilitydatabase.org/feeds/gtfs/mdb-2246
    accessed: 2026-10-23
  - title: Mobility Database, Janesville Transit System (mdb-393)
    url: https://mobilitydatabase.org/feeds/gtfs/mdb-393
    accessed: 2026-10-23
  - title: Transitland, Wisconsin places
    url: https://www.transit.land/explore/places/United+States+of+America/Wisconsin
    accessed: 2026-10-23
  - title: GTFS Realtime overview (gtfs.org)
    url: https://gtfs.org/realtime/
    accessed: 2026-10-23
  - title: OpenTripPlanner 2 documentation (v2.8.0)
    url: https://docs.opentripplanner.org/en/v2.8.0/
    accessed: 2026-10-23
  - title: r5py data requirements
    url: https://r5py.readthedocs.io/stable/_sources/user-guide/user-manual/data-requirements.md
    accessed: 2026-10-23
  - title: r5py quickstart
    url: https://r5py.readthedocs.io/stable/_sources/user-guide/user-manual/quickstart.md
    accessed: 2026-10-23
---

# Transit data (GTFS) and commute time

## TL;DR
- **Confirmed static GTFS zips:** MCTS `https://kamino.mcts.org/gtfs/google_transit.zip` and Madison Metro `http://transitdata.cityofmadison.com/GTFS/mmt_gtfs.zip` (7.3 MB, modified 2026-08-24). Racine RYDE and Janesville are confirmed only through the Mobility Database.
- **GTFS-realtime:** MCTS (`realtime.ridemcts.com/gtfsrt/…`, per Transitland) and Madison (`metromap.cityofmadison.com/gtfsrt/…`) both publish trip updates, vehicle positions and alerts.
- **Licenses aren't open-data licenses.** Both MCTS and Madison grant revocable licenses. MCTS requires a "not sponsored by MCTS" notice plus the data date and valid-through date. Madison limits use to helping transit riders.
- **Commute time:** feed GTFS + an OpenStreetMap `.pbf` into **r5py** (`TravelTimeMatrix`) or **OpenTripPlanner 2**. Precompute it before the demo. Don't route live.

## Key facts
| Dataset | What | Access / API | License / ToS | Refresh | How ERI uses it |
| --- | --- | --- | --- | --- | --- |
| **MCTS** (Milwaukee County) GTFS | Routes, stops, schedules | `https://kamino.mcts.org/gtfs/google_transit.zip`. No key | MCTS Developer Terms: non-exclusive, revocable license. Must say the product isn't sponsored or operated by MTS/MCTS, show the data's last-updated date and valid-through date. No MCTS logos. Downloading means you accept | "In a time and manner decided solely by MTS." Mobility Database's latest copy is dated 2025-05-08, so check `feed_info` or `calendar` dates yourself **(verify current validity)** | Bus commute times for Milwaukee seekers. Powers `near_bus_line` |
| **MCTS GTFS-realtime** | Vehicle positions, trip updates, alerts | `https://realtime.ridemcts.com/gtfsrt/vehicles`, `/trips`, `/alerts` (from the Transitland Atlas record). Key requirement not stated **(verify)** | Same MCTS terms | Live | Optional "next bus" demo. Not needed for matching |
| **Madison Metro** GTFS | Routes, stops, schedules | `http://transitdata.cityofmadison.com/GTFS/mmt_gtfs.zip` (plain http). Service 2026-08-16 to 2026-12-05 | Madison Metro Developer License: revocable, non-transferable, limited to uses "assisting mass transit riders" or promoting transit. City owns the data and derivatives. Optional credit: "Data provided under license granted by City of Madison, WI, Metro Transit." Indemnity clause | Per service change (roughly each semester) **(verify)** | Dane County commute times |
| **Madison Metro GTFS-realtime** and Developer API | Trip updates, alerts, vehicle positions; Bus Tracker API | `https://metromap.cityofmadison.com/gtfsrt/trips`, `/alerts`, `/vehicles`. The Developer (Bus Tracker) API needs a key from metromap.cityofmadison.com/dev-account. Whether GTFS-rt needs a key isn't stated **(verify)** | Same Madison license | Live | Optional |
| **Racine RYDE** GTFS | Racine city bus | Producer URL (via Mobility Database): `https://racine.connexionz.net/rtt/public/utility/gtfs.aspx`. Service 2026-09-06 to 2027-12-31 | License not stated **(verify with City of Racine Transit)** | Mobility Database fetched 2026-09-08 | Racine commute times |
| **Janesville Transit System** GTFS | Janesville bus | `http://data.trilliumtransit.com/gtfs/jts-wi-us/jts-wi-us.zip` (via Mobility Database). Service to 2026-12-10 | License not stated **(verify)** | Fetched 2026-10-16 | Rock County commute times |
| **Kenosha Area Transit** GTFS | Kenosha city bus | Listed on Transitland as operator "City of Kenosha", with a realtime feed mentioned in a Transitland PR. Feed URL not confirmed **(verify)** | **(verify)** | **(verify)** | Kenosha commute times |
| **Waukesha Metro / Waukesha County Transit** GTFS | Waukesha city and county routes | Transitland lists "Waukesha County Transit" (feed `f-dp9k-waukeshacounty~wi~us`), but Transitland blocked our automated read. Feed URL and whether Waukesha Metro is included **(verify)** | **(verify)** | **(verify)** | Waukesha commute times |
| **Beloit Transit System** | Beloit bus | Transitland operator listed. Feed not confirmed **(verify)** | **(verify)** | **(verify)** | Rock County |
| **Mobility Database** (mobilitydatabase.org) and **Transitland** | Catalogs of GTFS and GTFS-rt feeds with history and validation reports | Web. Mobility Database has an API **(verify key needs)**. Transitland pages block bots. The Transitland Atlas is on GitHub | Catalog terms vary. Each feed keeps its agency's license | Mobility Database re-fetches regularly | Find feed URLs and validity dates |

## How it works
- **GTFS static** is a zip of CSVs (`stops.txt`, `routes.txt`, `trips.txt`, `stop_times.txt`, `calendar.txt`…). **GTFS-realtime** is Protocol Buffers with three entity types: trip updates, service alerts and vehicle positions.
- **Simplest "near a bus line" check:** load `stops.txt` and flag a job if a stop is within about 400 m (a quarter mile) of it **(choose and document your threshold)**.
- **Real commute time (r5py):** build `r5py.TransportNetwork(osm_pbf, [gtfs_zip])`, then run `r5py.TravelTimeMatrix(network, origins, destinations, departure=datetime(...), transport_modes=[TRANSIT, WALK])`. The result is a pandas DataFrame with `from_id`, `to_id` and `travel_time` (minutes). r5py needs Java (the R5 engine) **(verify JDK version in the r5py install docs)**.
- **OpenTripPlanner 2** (LGPL-3.0, latest 2.8) builds a graph from GTFS + OSM, serves a trip-planning API and supports GTFS-rt updaters. It's heavier, so use it if you want turn-by-turn itineraries.
- Pick a departure time on a **weekday inside the feed's service dates** (e.g. Tue 2026-11-03 07:30). Feeds expire, and a date outside the calendar returns no transit.

## Caveats and gotchas
- Madison's feed **expires around 2026-12-05**. Re-download after that date.
- Madison's license is limited to rider-assistance purposes and keeps City ownership of derived data. A job matcher that shows commute times to riders fits, but confirm with Metro (mymetrobus@cityofmadison.com) before any commercial reuse.
- The MCTS terms require showing **when the data was last updated and when it's valid through**. Put both in the UI.
- Paratransit (e.g. MCTS Transit Plus) and on-demand services are usually not in GTFS. Don't tell a rider "no transit" when paratransit may serve the trip.
- OSM data is ODbL. See [geography.md](geography.md).

## How ERI / a hackathon tool should use this
- **For the demo:** precompute a `commute_minutes.csv` (seeker ZIP centroid × posting) offline with r5py, and load it in PHP or MySQL. Show "about 35 min by bus (MCTS schedule valid through …)".
- Respect `max_commute_minutes` from `data/job_seekers.csv`, and show the walk distance to the first stop. That matters for mobility disabilities.
- **Must NOT:** promise a trip is accessible (stop-level `wheelchair_boarding` is often blank), use MCTS or Metro logos, or cache realtime data as if it were a schedule.

## Related pages
- [geography.md](geography.md): OSM, ZIP centroids
- [jobs-and-postings.md](jobs-and-postings.md)
- [README.md](README.md)
- [../../prds/02-job-fit-checker.md](../../prds/02-job-fit-checker.md)

## Sources
- [MCTS Developer Terms and GTFS Feed](https://www.ridemcts.com/policies/developer-terms)
- [Transitland Atlas, MCTS feed record](https://github.com/transitland/transitland-atlas/blob/main/feeds/mcts.org.dmfr.json)
- [Mobility Database, MCTS (mdb-2127)](https://mobilitydatabase.org/feeds/gtfs/mdb-2127)
- [Madison Metro, Information for Developers](https://www.cityofmadison.com/metro/business/information-for-developers)
- [Madison Metro Developer License Agreement and Terms of Use](https://www.cityofmadison.com/metro/business/information-for-developers/developer-license-agreement-and-terms-of-use)
- [Madison Metro GTFS directory](http://transitdata.cityofmadison.com/GTFS/)
- [Mobility Database, Madison Metro (mdb-394)](https://mobilitydatabase.org/feeds/gtfs/mdb-394)
- [Mobility Database, Ryde Racine (mdb-2246)](https://mobilitydatabase.org/feeds/gtfs/mdb-2246)
- [Mobility Database, Janesville Transit (mdb-393)](https://mobilitydatabase.org/feeds/gtfs/mdb-393)
- [Transitland, Wisconsin places](https://www.transit.land/explore/places/United+States+of+America/Wisconsin)
- [GTFS Realtime overview](https://gtfs.org/realtime/)
- [OpenTripPlanner 2 docs (v2.8.0)](https://docs.opentripplanner.org/en/v2.8.0/)
- [r5py data requirements](https://r5py.readthedocs.io/stable/_sources/user-guide/user-manual/data-requirements.md)
- [r5py quickstart](https://r5py.readthedocs.io/stable/_sources/user-guide/user-manual/quickstart.md)
