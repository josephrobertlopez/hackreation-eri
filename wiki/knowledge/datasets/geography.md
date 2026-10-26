---
title: Geography and boundaries data
summary: Census TIGER/Line 2026 shapefiles, ZCTA relationship files, the HUD USPS ZIP crosswalk API (token), Wisconsin municipal boundaries (LTSB) and statewide parcels (SCO V12), and OpenStreetMap ODbL obligations.
tags: [datasets, geography, tiger, zcta, zip, hud-crosswalk, wisconsin, ltsb, parcels, openstreetmap, odbl]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2027-01-31   # HUD Q4 crosswalk publishes by end of January
review_owner: ERI data and IT lead
confidence: medium
sources:
  - title: Census TIGER/Line Shapefiles
    url: https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html
    accessed: 2026-10-23
  - title: Census Relationship Files, 2020
    url: https://www.census.gov/geographies/reference-files/time-series/geo/relationship-files.2020.html
    accessed: 2026-10-23
  - title: HUD USER, USPS ZIP Code Crosswalk Files
    url: https://www.huduser.gov/portal/datasets/usps_crosswalk.html
    accessed: 2026-10-23
  - title: HUD USER, USPS ZIP Crosswalk API
    url: https://www.huduser.gov/portal/dataset/uspszip-api.html
    accessed: 2026-10-23
  - title: Wisconsin State Cartographer's Office, Data
    url: https://www.sco.wisc.edu/data/
    accessed: 2026-10-23
  - title: SCO, Municipal Boundaries
    url: https://www.sco.wisc.edu/data/municipal-boundaries/
    accessed: 2026-10-23
  - title: SCO, Parcels
    url: https://www.sco.wisc.edu/data/parcels/
    accessed: 2026-10-23
  - title: OpenStreetMap Copyright and License
    url: https://www.openstreetmap.org/copyright
    accessed: 2026-10-23
---

# Geography and boundaries data

## TL;DR
- **TIGER/Line 2026** shapefiles (boundaries as of 2026-01-01) were released 2026-10-14. They're at `www2.census.gov/geo/tiger/TIGER2026/`. Use them for counties, tracts, places and ZCTAs.
- **ZIP ≠ ZCTA.** Use the Census **2020 ZCTA-to-county / tract / place relationship files**, or the **HUD USPS crosswalk** (quarterly; API needs a free token sent as `Authorization: Bearer …`).
- **Wisconsin boundaries:** municipal (city, village, town) from **LTSB** (`gis-ltsb.hub.arcgis.com/pages/download-data`). Statewide parcels **V12** from the SCO (shapefile or FGDB, plus a REST service).
- **OpenStreetMap** data is **ODbL**. Credit OpenStreetMap and its contributors. Derived databases you distribute must be share-alike. OSM's own tile servers aren't free for third-party apps.

## Key facts
| Dataset | What | Access / API | License / ToS | Refresh | How ERI uses it |
| --- | --- | --- | --- | --- | --- |
| **Census TIGER/Line** | Shapefiles: states, counties, tracts, block groups, places, ZCTAs, roads | Web picker `census.gov/cgi-bin/geo/shapefiles/index.php`. Bulk at `www2.census.gov/geo/tiger/TIGER2026/` | No license stated on the page. Census products are generally public domain **(verify)** | Annual (2026 vintage released 2026-10-14) | Map layers. Point-in-county or tract lookup |
| **Census 2020 ZCTA relationship files** | ZCTA to county, tract and place, with area overlaps | Linked from the 2020 Relationship Files page (direct URLs not captured) **(verify file URLs)** | Same | Per decennial geography | Turn a seeker's ZIP into county and tract for ACS context |
| **HUD USPS ZIP Crosswalk** | ZIP-Tract, ZIP-County, ZIP-CBSA (and reverse) with residential, business and other address ratios | Files after login at huduser.gov. API: `GET https://www.huduser.gov/hudapi/public/usps?type=2&query=WI` (`type` 1-12, e.g. 1 = zip-tract; `year` and `quarter` optional). Header `Authorization: Bearer $HUD_API_TOKEN` | Dataset page: "No special restrictions." A separate HUD User API ToS applies **(verify text)** | Quarterly, out by the end of the following month. 2023Q1 onward uses 2020 geographies | Assign a ZIP to a county when it crosses county lines (use the residential ratio). Check the `type` code for ZIP-county **(verify: type 2)** |
| **WI municipal boundaries** (LTSB) | City, village and town boundaries, collected each spring for the Census Boundary and Annexation Survey | `https://gis-ltsb.hub.arcgis.com/pages/download-data`. Monthly-dated snapshots (e.g. January 2025, July 2025) | Not stated **(verify)** | Snapshots, frequency not stated | "Is this job in the City of Milwaukee?" filters |
| **WI statewide parcels V12** (SCO) | Statewide parcel polygons and attributes | Shapefile or FGDB at `sco.wisc.edu/parcels/data/`, by county at `/parcels/data-county/`. REST: `services3.arcgis.com/n6uYoouQZW75n5WI/arcgis/rest/services/Wisconsin_Statewide_Parcels_DB/FeatureServer/0` | Not stated **(verify; ask help@sco.wisc.edu)** | Annual versions. Coverage map as of 2026-06-30 | Rarely needed. Possible geocoding of employer addresses |
| **GeoData@Wisconsin** | UW catalog of WI geospatial data | `geodata.wisc.edu`. "Available to download for free" | Varies by dataset | Varies | Find other layers (e.g. bus routes, county GIS) |
| **WI LIO** (county Land Information Offices) | County GIS: addresses, roads, parcels | Per county. Contact list via DOA and WLION (wlion.org) | Varies by county **(verify)** | Varies | Usually not needed for the hackathon |
| **OpenStreetMap** | Streets, footpaths, POIs; the routing base for r5py and OTP | Extracts (e.g. a Geofabrik Wisconsin `.pbf`, whose page blocked our check) **(verify URL)**. Don't use OSM's tile or Nominatim servers in an app without reading their usage policies | **ODbL 1.0.** Attribution to OpenStreetMap and its contributors, and make clear it's ODbL. Derived databases you distribute stay ODbL. Docs are CC BY-SA 2.0 | Continuous (extracts daily) | Walk and transit routing. Base map with attribution |

## How it works
- **Geocoding:** synthetic data already has `lat`/`lon` and `zip`. For real addresses later, the Census Geocoder is an option **(not reviewed; verify)**.
- **ZIP to county:** use the HUD ZIP-County file and pick the county with the highest residential ratio. Keep the ratio so you can show uncertainty.
- **FIPS:** WI = 55. Milwaukee 55079, Dane 55025, Waukesha 55133, Racine 55101, Kenosha 55059, Rock 55105.

## Caveats and gotchas
- ZCTAs are Census approximations of ZIP areas. PO Box-only ZIPs have no ZCTA, and HUD files leave out PO-box-only ZIPs too.
- HUD ratios may not sum to exactly 1.00, and they shift slightly each quarter because of re-geocoding.
- An app that shows an OSM-based map must show the attribution on the map.

## How ERI / a hackathon tool should use this
- Ship a pre-built `zip_county.csv` for the six focus counties instead of calling the HUD API live. If you call it, read `HUD_API_TOKEN` from `.env`.
- Keep maps simple: use Leaflet with an OSM-compatible tile provider whose terms allow your use, plus attribution.
- **Must NOT:** geocode or store real client home addresses (synthetic data only), or hammer the public OSM or Nominatim servers.

## Related pages
- [transit-gtfs.md](transit-gtfs.md)
- [disability-population.md](disability-population.md)
- [README.md](README.md)

## Sources
- [Census TIGER/Line Shapefiles](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html)
- [Census Relationship Files, 2020](https://www.census.gov/geographies/reference-files/time-series/geo/relationship-files.2020.html)
- [HUD USER, USPS ZIP Crosswalk Files](https://www.huduser.gov/portal/datasets/usps_crosswalk.html)
- [HUD USER, USPS ZIP Crosswalk API](https://www.huduser.gov/portal/dataset/uspszip-api.html)
- [SCO, Data](https://www.sco.wisc.edu/data/)
- [SCO, Municipal Boundaries](https://www.sco.wisc.edu/data/municipal-boundaries/)
- [SCO, Parcels](https://www.sco.wisc.edu/data/parcels/)
- [OpenStreetMap Copyright and License](https://www.openstreetmap.org/copyright)
