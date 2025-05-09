import requests
import logging
import re
from urllib.parse import urlparse, parse_qs

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

def extract_activity_id(url):
    """Extract activity ID from various Strava URL formats."""
    # Handle web URLs
    if 'strava.com/activities/' in url:
        match = re.search(r'strava\.com/activities/(\d+)', url)
        if match:
            return match.group(1)
    
    # Handle app links
    if 'strava.app.link' in url:
        try:
            response = requests.head(url, allow_redirects=True)
            final_url = response.url
            match = re.search(r'strava\.com/activities/(\d+)', final_url)
            if match:
                return match.group(1)
        except Exception as e:
            logger.error(f"Error following app link: {str(e)}")
    
    return None

def get_wingo_effort_from_activity(activity_id, access_token):
    """Get WINGO effort from a specific activity."""
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        # First get the activity details
        activity_response = requests.get(
            f"https://www.strava.com/api/v3/activities/{activity_id}",
            headers=headers
        )
        
        if activity_response.status_code != 200:
            logger.error(f"Error getting activity: {activity_response.text}")
            return None
            
        activity_data = activity_response.json()
        
        # Get all segment efforts for this activity
        efforts_response = requests.get(
            f"https://www.strava.com/api/v3/activities/{activity_id}/segment_efforts",
            headers=headers
        )
        
        if efforts_response.status_code != 200:
            logger.error(f"Error getting segment efforts: {efforts_response.text}")
            return None
            
        efforts = efforts_response.json()
        
        # Find the WINGO effort (segment ID: 7831001)
        wingo_effort = next(
            (effort for effort in efforts if effort.get('segment', {}).get('id') == 7831001),
            None
        )
        
        if wingo_effort:
            logger.info(f"Found WINGO effort in activity {activity_id}")
            logger.info(f"Time: {wingo_effort['elapsed_time']} seconds")
            logger.info(f"Date: {wingo_effort['start_date_local']}")
            return wingo_effort
        else:
            logger.info(f"No WINGO effort found in activity {activity_id}")
            return None
            
    except Exception as e:
        logger.error(f"Error processing activity: {str(e)}")
        return None

def process_strava_link(url, access_token):
    """Process a Strava activity link and extract WINGO effort if present."""
    activity_id = extract_activity_id(url)
    
    if not activity_id:
        logger.error("Could not extract activity ID from URL")
        return None
        
    logger.info(f"Found activity ID: {activity_id}")
    return get_wingo_effort_from_activity(activity_id, access_token)

def main():
    """Example usage."""
    # Your Strava API token
    ACCESS_TOKEN = "YOUR_ACCESS_TOKEN"
    
    # Example URLs
    web_url = "https://www.strava.com/activities/9784986117/overview"
    app_url = "https://strava.app.link/uKU0er0VaTb"
    
    # Process web URL
    logger.info("Processing web URL...")
    effort = process_strava_link(web_url, ACCESS_TOKEN)
    
    if effort:
        logger.info("WINGO effort details:")
        logger.info(f"Time: {effort['elapsed_time']} seconds")
        logger.info(f"Date: {effort['start_date_local']}")
        logger.info(f"Activity: https://www.strava.com/activities/{effort['activity']['id']}")

if __name__ == "__main__":
    main() 