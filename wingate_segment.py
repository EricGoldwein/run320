import requests
import csv
import os
import time
import logging
from datetime import datetime, timedelta
from dateutil import parser

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

# Your credentials
CLIENT_ID = "94661"
CLIENT_SECRET = "f5c453ed72a6deffb7454678a5651d27c7159a23"
ACCESS_TOKEN = "4f33afd8ec856d79c9ca43e05bbd5609de2ae69a"
REFRESH_TOKEN = "8c6bddfc0dc6155e813bc648772ec5d734283872"

# Constants
SEGMENT_ID = 7831001
PER_PAGE = 200
CACHE_FILE = "wingo_efforts_cache.csv"
START_DATE = "2025-03-15T00:00:00"
END_DATE = "2025-03-25T23:59:59"


# Parse once
start_cutoff = parser.isoparse(START_DATE)
end_cutoff = parser.isoparse(END_DATE)

def refresh_access_token():
    """Refresh the access token using the refresh token."""
    global ACCESS_TOKEN, REFRESH_TOKEN
    try:
        response = requests.post(
            "https://www.strava.com/oauth/token",
            data={
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "refresh_token": REFRESH_TOKEN,
                "grant_type": "refresh_token"
            }
        )
        response.raise_for_status()
        data = response.json()
        ACCESS_TOKEN = data["access_token"]
        REFRESH_TOKEN = data["refresh_token"]
        logger.info("Access token refreshed.")
    except Exception as e:
        logger.error(f"Error refreshing token: {str(e)}")
        raise

def load_efforts_from_cache():
    """Load cached efforts if available and filter by date."""
    if not os.path.exists(CACHE_FILE):
        return []

    logger.info("Loading efforts from cache...")
    efforts = []
    try:
        with open(CACHE_FILE, 'r', newline='') as f:
            reader = csv.DictReader(f)
            for row in reader:
                effort_date = parser.isoparse(row['date'])
                if start_cutoff <= effort_date <= end_cutoff:
                    efforts.append({
                        'start_date_local': row['date'],
                        'elapsed_time': int(row['elapsed_time']),
                        'activity': {'id': row['activity_id']}
                    })
    except Exception as e:
        logger.error(f"Error reading cache file: {str(e)}")
        return []

    logger.info(f"Found {len(efforts)} cached efforts between March 15-25, 2025.")
    return efforts

def get_all_segment_efforts(segment_id):
    """Get all efforts for a segment after March 15, 2025."""
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
    page = 1
    all_efforts = []

    while True:
        try:
            response = requests.get(
                "https://www.strava.com/api/v3/segment_efforts",
                headers=headers,
                params={
                    "segment_id": segment_id,
                    "per_page": PER_PAGE,
                    "page": page,
                    "start_date_local": START_DATE,
                    "end_date_local": END_DATE
                }
            )

            if response.status_code == 429:
                logger.warning("Rate limit reached. Waiting 15 minutes...")
                time.sleep(900)
                continue
            if response.status_code == 401:
                logger.info("Token expired. Refreshing...")
                refresh_access_token()
                headers["Authorization"] = f"Bearer {ACCESS_TOKEN}"
                continue
            if response.status_code == 403:
                logger.error("Permission denied. Check Strava privacy settings or API scope.")
                break
            if response.status_code != 200:
                logger.error(f"Error {response.status_code}: {response.text}")
                break

            data = response.json()
            if not data:
                break  # No more pages

            all_efforts.extend(data)
            logger.info(f"Loaded page {page} with {len(data)} efforts...")
            page += 1

        except Exception as e:
            logger.error(f"Error fetching efforts: {str(e)}")
            break

    # Filter after download (Strava sometimes gives extra results)
    filtered_efforts = []
    for effort in all_efforts:
        effort_date = parser.isoparse(effort['start_date_local'])
        if start_cutoff <= effort_date <= end_cutoff:
            filtered_efforts.append(effort)

    if filtered_efforts:
        logger.info("Saving filtered efforts to cache...")
        with open(CACHE_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(["date", "elapsed_time", "activity_id"])
            for effort in filtered_efforts:
                writer.writerow([
                    effort["start_date_local"],
                    effort["elapsed_time"],
                    effort["activity"]["id"]
                ])
        logger.info(f"Saved {len(filtered_efforts)} efforts to {CACHE_FILE}")

    return filtered_efforts

def analyze_efforts(efforts):
    """Analyze and print information about the efforts."""
    if not efforts:
        logger.info("No efforts found between March 15–25, 2025.")
        return

    # Sort by date
    efforts.sort(key=lambda x: x['start_date_local'], reverse=True)

    logger.info(f"\nFound {len(efforts)} WINGO efforts")
    logger.info(f"Date range: {efforts[-1]['start_date_local']} to {efforts[0]['start_date_local']}")

    # Fastest effort
    fastest = min(efforts, key=lambda x: x['elapsed_time'])
    logger.info(f"\nFastest time: {timedelta(seconds=fastest['elapsed_time'])}")
    logger.info(f"Fastest attempt: {fastest['start_date_local']}")
    logger.info(f"Activity: https://www.strava.com/activities/{fastest['activity']['id']}")

    # Show 5 most recent
    logger.info("\nMost recent WINGOs:")
    for e in efforts:
        date = e["start_date_local"]
        time_str = str(timedelta(seconds=e["elapsed_time"]))
        act_id = e["activity"]["id"]
        logger.info(f"- {date[:10]} – {time_str} – https://www.strava.com/activities/{act_id}")

def main():
    """Main function to run the analysis."""
    try:
        logger.info("Starting WINGO analysis...")

        # Try to load from cache
        efforts = load_efforts_from_cache()

        if not efforts:
            efforts = get_all_segment_efforts(SEGMENT_ID)

        analyze_efforts(efforts)

    except Exception as e:
        logger.error(f"Error: {str(e)}")

if __name__ == "__main__":
    main()
