import requests
import csv
from datetime import datetime, timedelta
import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

# Your credentials
CLIENT_ID = "94661"
CLIENT_SECRET = "f5c453ed72a6deffb7454678a5651d27c7159a23"
ACCESS_TOKEN = "230c01223688789f411882406cb39ee4e8274a8e"  # Your current access token
REFRESH_TOKEN = "0e7c181edb0df01fe6f9ac5db56da39c107feb32"  # Your current refresh token

# Segment ID for Wingate track
SEGMENT_ID = 11646742
PER_PAGE = 200

def refresh_access_token():
    """Refresh the access token using the refresh token."""
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
        return data["access_token"], data["refresh_token"]
    except Exception as e:
        logger.error(f"Error refreshing token: {str(e)}")
        raise

def get_all_segment_efforts(segment_id, access_token):
    """Get all efforts for a segment."""
    page = 1
    all_efforts = []
    headers = {"Authorization": f"Bearer {access_token}"}

    while True:
        try:
            response = requests.get(
                "https://www.strava.com/api/v3/segment_efforts",
                headers=headers,
                params={
                    "segment_id": segment_id,
                    "per_page": PER_PAGE,
                    "page": page
                }
            )

            # Check for rate limiting
            if response.status_code == 429:
                logger.warning("Rate limit reached. Waiting 15 minutes...")
                time.sleep(900)  # Wait 15 minutes
                continue

            # Check for token expiration
            if response.status_code == 401:
                logger.info("Token expired. Refreshing...")
                new_token, new_refresh = refresh_access_token()
                headers["Authorization"] = f"Bearer {new_token}"
                continue

            if response.status_code != 200:
                logger.error(f"Error {response.status_code}: {response.text}")
                break

            data = response.json()
            if not data:
                break  # no more pages

            all_efforts.extend(data)
            logger.info(f"Loaded page {page} with {len(data)} efforts...")
            page += 1

        except Exception as e:
            logger.error(f"Error fetching efforts: {str(e)}")
            break

    return all_efforts

def analyze_efforts(efforts):
    """Analyze and print information about the efforts."""
    if not efforts:
        logger.info("No efforts found.")
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

    # Optional: show 5 most recent
    logger.info("\nMost recent WINGOs:")
    for e in efforts[:5]:
        date = e["start_date_local"]
        time_str = str(timedelta(seconds=e["elapsed_time"]))
        act_id = e["activity"]["id"]
        logger.info(f"- {date[:10]} – {time_str} – https://www.strava.com/activities/{act_id}")

    """Analyze and print information about the efforts."""
    if not efforts:
        logger.info("No efforts found.")
        return

    # Sort by date
    efforts.sort(key=lambda x: x['start_date'], reverse=True)

    # Print summary
    logger.info(f"\nFound {len(efforts)} WINGO efforts")
    logger.info(f"Date range: {efforts[-1]['start_date']} to {efforts[0]['start_date']}")

    # Group by athlete
    athlete_efforts = {}
    for effort in efforts:
        athlete_id = effort['athlete']['id']
        if athlete_id not in athlete_efforts:
            athlete_efforts[athlete_id] = {
                'name': f"{effort['athlete']['firstname']} {effort['athlete']['lastname']}",
                'count': 0,
                'efforts': []
            }
        athlete_efforts[athlete_id]['count'] += 1
        athlete_efforts[athlete_id]['efforts'].append(effort)

    # Print athlete stats
    logger.info("\nAthlete Statistics:")
    for athlete_id, stats in sorted(athlete_efforts.items(), key=lambda x: x[1]['count'], reverse=True):
        logger.info(f"\n{stats['name']}:")
        logger.info(f"Total attempts: {stats['count']}")
        
        # Get fastest time
        fastest = min(stats['efforts'], key=lambda x: x['elapsed_time'])
        logger.info(f"Fastest time: {timedelta(seconds=fastest['elapsed_time'])}")
        logger.info(f"Fastest attempt: {fastest['start_date']}")
        logger.info(f"Activity: https://www.strava.com/activities/{fastest['activity']['id']}")

def main():
    """Main function to run the analysis."""
    try:
        logger.info("Starting WINGO analysis...")
        efforts = get_all_segment_efforts(SEGMENT_ID, ACCESS_TOKEN)
        analyze_efforts(efforts)
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")

if __name__ == "__main__":
    main() 