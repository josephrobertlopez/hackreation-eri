#!/usr/bin/env bash
# fetch_public_data.sh: download the openly downloadable public "starter kit"
# files for the Hackreation x ERI hackathon into data/public/.
#
# Run this on YOUR OWN machine (not in a sandbox):
#     bash tools/fetch_public_data.sh            # skip files that already exist
#     bash tools/fetch_public_data.sh --force    # re-download and overwrite
#
# Optional environment variables (put them in .env, never commit them):
#     CENSUS_API_KEY   free key from https://www.census.gov/data/developers/api-key.html
#     CONTACT_EMAIL    your email, sent in the User-Agent (BLS asks for contact info)
#
# Every URL below was confirmed on its official page on 2026-10-23.
# See wiki/knowledge/datasets/ for licenses and terms. Summary:
#   - O*NET 31.0: CC BY 4.0. Credit "O*NET 31.0 Database" and USDOL/ETA.
#   - BLS OEWS:   public domain (BLS asks for a citation).
#   - MCTS GTFS:  MCTS Developer Terms. Downloading means you accept them:
#                 https://www.ridemcts.com/policies/developer-terms
#   - Madison Metro GTFS: City of Madison Developer License Agreement:
#                 https://www.cityofmadison.com/metro/business/information-for-developers/developer-license-agreement-and-terms-of-use
#   - Census API: show "This product uses the Census Bureau Data API but is
#                 not endorsed or certified by the Census Bureau."

set -euo pipefail

# ---- locate the repo and the output folder --------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
OUT_DIR="${REPO_ROOT}/data/public"

FORCE=0
if [[ "${1:-}" == "--force" ]]; then
  FORCE=1
elif [[ $# -gt 0 ]]; then
  echo "Usage: $0 [--force]" >&2
  exit 2
fi

# Load .env if present (simple KEY=value lines only), without echoing values.
if [[ -f "${REPO_ROOT}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${REPO_ROOT}/.env"
  set +a
fi

command -v curl >/dev/null 2>&1 || { echo "curl is required." >&2; exit 1; }

CONTACT_EMAIL="${CONTACT_EMAIL:-hackathon-participant@example.org}"
USER_AGENT="ERI-hackathon-data-fetch/1.0 (${CONTACT_EMAIL})"

mkdir -p "${OUT_DIR}"/{onet,bls,gtfs,census}

# Keep downloaded data out of git even though the root .gitignore doesn't list data/public/.
if [[ ! -f "${OUT_DIR}/.gitignore" ]]; then
  printf '*\n!.gitignore\n' > "${OUT_DIR}/.gitignore"
fi

# ---- helper: download one URL to one file, refusing to overwrite ----------
fetch() {
  local url="$1" dest="$2"
  if [[ -e "${dest}" && "${FORCE}" -eq 0 ]]; then
    echo "skip   ${dest#"${REPO_ROOT}/"} (exists; use --force to overwrite)"
    return 0
  fi
  echo "fetch  ${url}"
  local tmp="${dest}.part"
  # -f fail on HTTP errors, -L follow redirects, retry transient failures
  if curl -fL --retry 3 --retry-delay 2 -A "${USER_AGENT}" -o "${tmp}" "${url}"; then
    mv -f "${tmp}" "${dest}"
    echo "saved  ${dest#"${REPO_ROOT}/"}"
  else
    rm -f "${tmp}"
    echo "FAILED ${url} (continuing)" >&2
    return 0
  fi
}

# ---- 1. O*NET 31.0 database (CC BY 4.0) -----------------------------------
# Source page: https://www.onetcenter.org/database.html
# Full database as Excel files (zip), plus two single CSVs handy for matching.
fetch "https://www.onetcenter.org/dl_files/database/db_31_0_excel.zip" \
      "${OUT_DIR}/onet/db_31_0_excel.zip"
fetch "https://www.onetcenter.org/dl_files/database/db_31_0_csv/work_context.csv" \
      "${OUT_DIR}/onet/work_context.csv"
fetch "https://www.onetcenter.org/dl_files/database/db_31_0_csv/abilities.csv" \
      "${OUT_DIR}/onet/abilities.csv"

# ---- 2. BLS OEWS May 2025, metropolitan and nonmetropolitan areas ----------
# Source page: https://www.bls.gov/oes/tables.htm
# XLSX inside. Southern WI area codes: Milwaukee-Waukesha 0033340, Madison 0031540,
# Racine-Mount Pleasant 0039540, Kenosha 0028450, Janesville-Beloit 0027500.
# BLS may refuse requests without a descriptive User-Agent; set CONTACT_EMAIL.
fetch "https://www.bls.gov/oes/special-requests/oesm25ma.zip" \
      "${OUT_DIR}/bls/oesm25ma.zip"

# ---- 3. GTFS static feeds ---------------------------------------------------
# MCTS (Milwaukee County Transit System). Source: https://www.ridemcts.com/policies/developer-terms
fetch "https://kamino.mcts.org/gtfs/google_transit.zip" \
      "${OUT_DIR}/gtfs/mcts_google_transit.zip"
# Madison Metro Transit. Source: https://www.cityofmadison.com/metro/business/information-for-developers
# (listed as http://transitdata.cityofmadison.com/GTFS/; served over https too)
fetch "https://transitdata.cityofmadison.com/GTFS/mmt_gtfs.zip" \
      "${OUT_DIR}/gtfs/madison_mmt_gtfs.zip"

# ---- 4. Census API example (needs CENSUS_API_KEY) --------------------------
# ACS 2020-2024 5-year, detailed table B18140 (median earnings by disability status)
# for Milwaukee (079), Dane (025), Waukesha (133), Racine (101), Kenosha (059), Rock (105).
#   B18140_001E = total, B18140_002E = with a disability, B18140_005E = no disability
# Endpoint metadata: https://api.census.gov/data/2024/acs/acs5/groups/B18140.html
if [[ -n "${CENSUS_API_KEY:-}" ]]; then
  CENSUS_URL="https://api.census.gov/data/2024/acs/acs5?get=NAME,B18140_001E,B18140_002E,B18140_005E&for=county:079,025,133,101,059,105&in=state:55"
  dest="${OUT_DIR}/census/acs5_2024_B18140_southern_wi.json"
  if [[ -e "${dest}" && "${FORCE}" -eq 0 ]]; then
    echo "skip   ${dest#"${REPO_ROOT}/"} (exists; use --force to overwrite)"
  else
    echo "fetch  ${CENSUS_URL}&key=***"
    # The key goes in the query string as the API requires. It is not printed.
    if curl -fsS --retry 3 -A "${USER_AGENT}" -o "${dest}.part" "${CENSUS_URL}&key=${CENSUS_API_KEY}"; then
      mv -f "${dest}.part" "${dest}"
      echo "saved  ${dest#"${REPO_ROOT}/"}"
    else
      rm -f "${dest}.part"
      echo "FAILED Census API request (check your key)" >&2
    fi
  fi
else
  echo "note   CENSUS_API_KEY not set; skipping the Census API example."
  echo "       Get a free key at https://www.census.gov/data/developers/api-key.html"
fi

echo
echo "Done. Files are in data/public/ (git-ignored). Remember the attributions:"
echo "  O*NET 31.0 Database by USDOL/ETA, CC BY 4.0; MCTS/Madison Metro data dates;"
echo "  Census API disclaimer. See wiki/knowledge/datasets/README.md."
