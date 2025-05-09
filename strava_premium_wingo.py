import requests
import csv
from datetime import datetime, timedelta
import logging
import time
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

# Your credentials
CLIENT_ID = "94661"
CLIENT_SECRET = "f5c453ed72a6deffb7454678a5651d27c7159a23"
ACCESS_TOKEN = "b133b2a69abd61ed799195af3cbfa92aed2c204a"
REFRESH_TOKEN = "0e7c181edb0df01fe6f9ac5db56da39c107feb32"

# Segment ID for Wingate track
SEGMENT_ID = 7831001
PER_PAGE = 30  # Reduced from 200 to avoid rate limits
CACHE_FILE = "wingo_efforts_cache.csv"

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
    """Get all efforts for a segment after March 19, 2025."""
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # First verify the token and get segment details
    try:
        # Check token validity
        logger.info("Verifying token...")
        athlete_response = requests.get(
            "https://www.strava.com/api/v3/athlete",
            headers=headers
        )
        logger.info(f"Athlete API Response Status: {athlete_response.status_code}")
        if athlete_response.status_code == 200:
            athlete_data = athlete_response.json()
            logger.info(f"Token valid. Connected as: {athlete_data.get('firstname')} {athlete_data.get('lastname')}")
        
        # Get segment details
        logger.info(f"\nFetching segment {segment_id} details...")
        segment_response = requests.get(
            f"https://www.strava.com/api/v3/segments/{segment_id}",
            headers=headers
        )
        logger.info(f"Segment API Response Status: {segment_response.status_code}")
        if segment_response.status_code == 200:
            segment_data = segment_response.json()
            logger.info(f"Segment found: {segment_data.get('name')}")
            logger.info(f"Distance: {segment_data.get('distance')}m")
            logger.info(f"Activity Type: {segment_data.get('activity_type')}")
        else:
            logger.error(f"Error getting segment details: {segment_response.text}")
            return []
            
    except Exception as e:
        logger.error(f"Error during verification: {str(e)}")
        return []

    # Check cache first
    if os.path.exists(CACHE_FILE):
        logger.info("Loading efforts from cache...")
        efforts = []
        with open(CACHE_FILE, 'r', newline='') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if "2023-09-01T00:00:00Z" <= row['date'] <= "2023-09-07T23:59:59Z":
                    efforts.append({
                        'start_date_local': row['date'],
                        'elapsed_time': int(row['elapsed_time']),
                        'activity': {'id': row['activity_id']}
                    })
        if efforts:
            logger.info(f"Found {len(efforts)} cached efforts between September 1-7, 2023")
            return efforts
        else:
            logger.info("No cached efforts found between September 1-7, 2023")

    page = 1
    all_efforts = []
    
    # First try without date filter
    logger.info("\nTrying to get efforts without date filter...")
    try:
        response = requests.get(
            f"https://www.strava.com/api/v3/segments/{segment_id}/all_efforts",
            headers=headers,
            params={
                "per_page": PER_PAGE,
                "page": page
            }
        )
        logger.info(f"API Response Status (no date filter): {response.status_code}")
        logger.info(f"API Response Body (no date filter): {response.text[:500]}")
        
        if response.status_code == 200 and response.json():
            logger.info(f"Found {len(response.json())} efforts without date filter")
    except Exception as e:
        logger.error(f"Error fetching efforts without date filter: {str(e)}")

    # Now try with date filter
    logger.info("\nTrying to get efforts with date filter...")
    start_date_local = "2023-09-01T00:00:00Z"
    end_date_local = "2023-09-07T23:59:59Z"

    while True:
        try:
            # Using the exact endpoint from the sample
            response = requests.get(
                f"https://www.strava.com/api/v3/segments/{segment_id}/all_efforts",
                headers=headers,
                params={
                    "per_page": PER_PAGE,
                    "page": page,
                    "start_date_local": start_date_local,
                    "end_date_local": end_date_local
                }
            )

            # Add detailed logging
            logger.info(f"API Response Status: {response.status_code}")
            logger.info(f"API Response Headers: {dict(response.headers)}")
            logger.info(f"API Response Body: {response.text[:500]}")  # First 500 chars of response

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

            # Check for permission issues
            if response.status_code == 403:
                logger.error("Permission denied. This could be because:")
                logger.error("1. The activities are set to 'Followers Only' or 'Private'")
                logger.error("2. The segment efforts are restricted to followers")
                logger.error("3. The API token doesn't have sufficient permissions")
                logger.error("Please check your Strava privacy settings and API permissions.")
                break

            if response.status_code != 200:
                logger.error(f"Error {response.status_code}: {response.text}")
                logger.error("Full response headers:")
                for header, value in response.headers.items():
                    logger.error(f"{header}: {value}")
                break

            data = response.json()
            if not data or len(data) < PER_PAGE:  # Stop if we get empty results or less than per_page
                logger.info(f"Reached end of results on page {page}")
                if data:
                    all_efforts.extend(data)
                    logger.info(f"Added final {len(data)} efforts")
                break

            all_efforts.extend(data)
            logger.info(f"Loaded page {page} with {len(data)} efforts...")
            page += 1

        except Exception as e:
            logger.error(f"Error fetching efforts: {str(e)}")
            break

    # Save to cache
    if all_efforts:
        logger.info("Saving efforts to cache...")
        with open(CACHE_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(["date", "elapsed_time", "activity_id"])
            for effort in all_efforts:
                writer.writerow([
                    effort["start_date_local"],
                    effort["elapsed_time"],
                    effort["activity"]["id"]
                ])
        logger.info(f"Saved {len(all_efforts)} efforts to {CACHE_FILE}")

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

    # Show 5 most recent
    logger.info("\nMost recent WINGOs:")
    for e in efforts[:5]:
        date = e["start_date_local"]
        time_str = str(timedelta(seconds=e["elapsed_time"]))
        act_id = e["activity"]["id"]
        logger.info(f"- {date[:10]} – {time_str} – https://www.strava.com/activities/{act_id}")

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