import requests
import logging
from datetime import datetime
import polyline

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

# Your credentials
CLIENT_ID = "94661"
CLIENT_SECRET = "f5c453ed72a6deffb7454678a5651d27c7159a23"
ACCESS_TOKEN = "2f0ae07a4e5694f981e028a74e0ae8540086e008"
REFRESH_TOKEN = "0a045a1eab8244c3a450a71d66d9c6d60663afc6"

# Segment ID for Wingate track
SEGMENT_ID = 7831001

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

def get_segment_details(segment_id, access_token):
    """Get detailed information about a segment."""
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        response = requests.get(
            f"https://www.strava.com/api/v3/segments/{segment_id}",
            headers=headers
        )

        # Check for token expiration
        if response.status_code == 401:
            logger.info("Token expired. Refreshing...")
            new_token, new_refresh = refresh_access_token()
            headers["Authorization"] = f"Bearer {new_token}"
            response = requests.get(
                f"https://www.strava.com/api/v3/segments/{segment_id}",
                headers=headers
            )

        if response.status_code != 200:
            logger.error(f"Error {response.status_code}: {response.text}")
            return None

        return response.json()

    except Exception as e:
        logger.error(f"Error fetching segment details: {str(e)}")
        return None

def decode_polyline(segment):
    """Decode the polyline to get all coordinates along the segment."""
    if not segment or 'map' not in segment or 'polyline' not in segment['map']:
        logger.error("No polyline data available")
        return None
    
    try:
        encoded = segment['map']['polyline']
        coords = polyline.decode(encoded)
        return coords
    except Exception as e:
        logger.error(f"Error decoding polyline: {str(e)}")
        return None

def print_segment_details(segment):
    """Print detailed information about the segment."""
    if not segment:
        logger.error("No segment data available")
        return

    logger.info("\n=== WINGO SEGMENT DETAILS ===")
    logger.info(f"Name: {segment['name']}")
    logger.info(f"ID: {segment['id']}")
    logger.info(f"Activity Type: {segment['activity_type']}")
    logger.info(f"Distance: {segment['distance']:.1f} meters")
    logger.info(f"Average Grade: {segment['average_grade']:.1f}%")
    logger.info(f"Maximum Grade: {segment['maximum_grade']:.1f}%")
    logger.info(f"Elevation High: {segment['elevation_high']:.1f} meters")
    logger.info(f"Elevation Low: {segment['elevation_low']:.1f} meters")
    logger.info(f"Total Elevation Gain: {segment['total_elevation_gain']:.1f} meters")
    
    # GPS Coordinates
    start_lat, start_lng = segment['start_latlng']
    end_lat, end_lng = segment['end_latlng']
    logger.info("\nGPS Coordinates:")
    logger.info(f"Start: {start_lat:.6f}, {start_lng:.6f}")
    logger.info(f"End: {end_lat:.6f}, {end_lng:.6f}")
    
    # Decode and print polyline coordinates
    coords = decode_polyline(segment)
    if coords:
        logger.info(f"\nPolyline contains {len(coords)} points")
        logger.info("\nAll points:")
        for i, (lat, lng) in enumerate(coords):
            logger.info(f"Point {i+1}: {lat:.6f}, {lng:.6f}")
    
    # Location
    logger.info("\nLocation:")
    logger.info(f"City: {segment.get('city', 'N/A')}")
    logger.info(f"State: {segment.get('state', 'N/A')}")
    logger.info(f"Country: {segment.get('country', 'N/A')}")
    
    # Statistics
    logger.info("\nStatistics:")
    logger.info(f"Effort Count: {segment['effort_count']}")
    logger.info(f"Athlete Count: {segment['athlete_count']}")
    logger.info(f"Star Count: {segment['star_count']}")
    
    # Dates
    created_at = datetime.strptime(segment['created_at'], "%Y-%m-%dT%H:%M:%SZ")
    updated_at = datetime.strptime(segment['updated_at'], "%Y-%m-%dT%H:%M:%SZ")
    logger.info("\nDates:")
    logger.info(f"Created: {created_at.strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info(f"Last Updated: {updated_at.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Additional Info
    logger.info("\nAdditional Info:")
    logger.info(f"Private: {'Yes' if segment['private'] else 'No'}")
    logger.info(f"Hazardous: {'Yes' if segment['hazardous'] else 'No'}")
    logger.info(f"Climb Category: {segment['climb_category']}")

def main():
    """Main function to run the segment details retrieval."""
    try:
        logger.info("Fetching WINGO segment details...")
        segment = get_segment_details(SEGMENT_ID, ACCESS_TOKEN)
        print_segment_details(segment)
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")

if __name__ == "__main__":
    main() 