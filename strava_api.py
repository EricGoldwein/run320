import requests
from datetime import datetime, timedelta
import logging
from typing import Dict, List, Optional
import webbrowser
import sys
import time

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

# Segment ID for Wingate track
WINGATE_SEGMENT_ID = 7831001

class StravaAPI:
    def __init__(self, client_id: str, client_secret: str, access_token: str = None, refresh_token: str = None):
        """
        Initialize Strava API client.
        
        Args:
            client_id: Strava API client ID
            client_secret: Strava API client secret
            access_token: Current access token (optional)
            refresh_token: Refresh token (optional)
        """
        self.client_id = client_id
        self.client_secret = client_secret
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.base_url = "https://www.strava.com/api/v3"
        if self.access_token:
            self.headers = {"Authorization": f"Bearer {self.access_token}"}
        else:
            self.headers = None
            
    def get_new_tokens(self) -> Dict:
        """
        Get new access and refresh tokens.
        
        Returns:
            Dictionary containing access_token and refresh_token
        """
        # Generate authorization URL
        auth_url = f"https://www.strava.com/oauth/authorize?client_id={self.client_id}&response_type=code&redirect_uri=http://localhost&approval_prompt=force&scope=read,activity:read"
        
        print("\nPlease follow these steps:")
        print("1. Copy this URL and open it in your browser:")
        print(f"\n{auth_url}\n")
        print("2. Authorize the application")
        print("3. After authorizing, you'll be redirected to a localhost URL")
        print("4. Copy the ENTIRE URL from your browser's address bar")
        print("5. Paste it here when prompted")
        
        # Get the full redirect URL from user
        redirect_url = input("\nPaste the redirect URL here: ").strip()
        
        # Extract the code from the URL
        try:
            from urllib.parse import urlparse, parse_qs
            parsed_url = urlparse(redirect_url)
            code = parse_qs(parsed_url.query)['code'][0]
        except Exception as e:
            logger.error(f"Error extracting code from URL: {str(e)}")
            print("\nCould not extract the authorization code from the URL.")
            print("Please make sure you copied the entire URL from your browser.")
            raise
        
        # Exchange code for tokens
        try:
            response = requests.post(
                "https://www.strava.com/oauth/token",
                data={
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "code": code,
                    "grant_type": "authorization_code"
                }
            )
            response.raise_for_status()
            data = response.json()
            
            # Update instance variables
            self.access_token = data["access_token"]
            self.refresh_token = data["refresh_token"]
            self.headers = {"Authorization": f"Bearer {self.access_token}"}
            
            print("\nSuccessfully obtained new tokens!")
            print(f"Access Token: {self.access_token}")
            print(f"Refresh Token: {self.refresh_token}")
            print(f"Expires at: {datetime.fromtimestamp(data['expires_at'])}")
            
            return data
            
        except Exception as e:
            logger.error(f"Error getting new tokens: {str(e)}")
            raise
            
    def refresh_access_token(self) -> None:
        """Refresh the access token using the refresh token."""
        try:
            response = requests.post(
                "https://www.strava.com/oauth/token",
                data={
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "refresh_token": self.refresh_token,
                    "grant_type": "refresh_token"
                }
            )
            response.raise_for_status()
            data = response.json()
            self.access_token = data["access_token"]
            self.refresh_token = data["refresh_token"]
            self.headers = {"Authorization": f"Bearer {self.access_token}"}
            logger.info("Successfully refreshed access token")
        except Exception as e:
            logger.error(f"Error refreshing access token: {str(e)}")
            raise
            
    def get_segment_details(self, segment_id: int = WINGATE_SEGMENT_ID) -> Dict:
        """
        Get details about a Strava segment.
        
        Args:
            segment_id: Strava segment ID (defaults to Wingate track)
            
        Returns:
            Dictionary containing segment details
        """
        try:
            response = requests.get(
                f"{self.base_url}/segments/{segment_id}",
                headers=self.headers
            )
            
            # Check for rate limiting
            if response.status_code == 429:
                logger.warning("Rate limit reached. Waiting 15 minutes...")
                time.sleep(900)  # Wait 15 minutes
                response = requests.get(
                    f"{self.base_url}/segments/{segment_id}",
                    headers=self.headers
                )
                
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching segment details: {str(e)}")
            raise

    def get_athlete_profile(self) -> Dict:
        """Get the authenticated athlete's profile."""
        try:
            response = requests.get(
                f"{self.base_url}/athlete",
                headers=self.headers
            )
            
            # Check for rate limiting
            if response.status_code == 429:
                logger.warning("Rate limit reached. Waiting 15 minutes...")
                time.sleep(900)  # Wait 15 minutes
                response = requests.get(
                    f"{self.base_url}/athlete",
                    headers=self.headers
                )
                
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching athlete profile: {str(e)}")
            raise

    def get_my_activities(self, before: Optional[datetime] = None, 
                         after: Optional[datetime] = None,
                         per_page: int = 200) -> List[Dict]:
        """
        Get activities for the authenticated athlete.
        
        Args:
            before: Get activities before this date
            after: Get activities after this date
            per_page: Number of activities per page (max 200)
            
        Returns:
            List of activity dictionaries
        """
        try:
            params = {"per_page": per_page}
            if before:
                params["before"] = int(before.timestamp())
            if after:
                params["after"] = int(after.timestamp())
                
            response = requests.get(
                f"{self.base_url}/athlete/activities",
                headers=self.headers,
                params=params
            )
            
            # Check for rate limiting
            if response.status_code == 429:
                logger.warning("Rate limit reached. Waiting 15 minutes...")
                time.sleep(900)  # Wait 15 minutes
                response = requests.get(
                    f"{self.base_url}/athlete/activities",
                    headers=self.headers,
                    params=params
                )
                
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching activities: {str(e)}")
            raise

    def count_my_wingo_attempts(self, days_back: int = 365) -> Dict:
        """
        Count how many times you have run the Wingate track segment.
        
        Args:
            days_back: Number of days to look back (default 1 year)
            
        Returns:
            Dictionary with count and details of WINGO attempts
        """
        try:
            # Get athlete info
            logger.info("Fetching athlete profile...")
            athlete = self.get_athlete_profile()
            logger.info(f"Found athlete: {athlete.get('firstname', '')} {athlete.get('lastname', '')}")
            
            # Calculate date range
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days_back)
            logger.info(f"Looking for activities between {start_date.date()} and {end_date.date()}")
            
            # Get all activities in the date range
            logger.info("Fetching activities...")
            activities = self.get_my_activities(after=start_date)
            logger.info(f"Found {len(activities)} activities")
            
            # Track WINGO attempts
            wingo_attempts = []
            
            for i, activity in enumerate(activities, 1):
                # Skip if not a run
                if activity.get('type') != 'Run':
                    logger.debug(f"Skipping activity {i} - not a run")
                    continue
                    
                logger.info(f"Checking activity {i}/{len(activities)}: {activity.get('name', 'Unnamed')}")
                
                # Get detailed activity data
                try:
                    response = requests.get(
                        f"{self.base_url}/activities/{activity['id']}",
                        headers=self.headers
                    )
                    
                    # Check for rate limiting
                    if response.status_code == 429:
                        logger.warning("Rate limit reached. Waiting 15 minutes...")
                        time.sleep(900)  # Wait 15 minutes
                        response = requests.get(
                            f"{self.base_url}/activities/{activity['id']}",
                            headers=self.headers
                        )
                    
                    response.raise_for_status()
                    activity_details = response.json()
                    
                    # Check segment efforts
                    segment_efforts = activity_details.get('segment_efforts', [])
                    logger.debug(f"Found {len(segment_efforts)} segment efforts")
                    
                    for effort in segment_efforts:
                        if effort.get('segment', {}).get('id') == WINGATE_SEGMENT_ID:
                            logger.info(f"Found WINGO attempt in activity {activity['id']}")
                            wingo_attempts.append({
                                'date': activity['start_date'],
                                'activity_name': activity['name'],
                                'elapsed_time': effort['elapsed_time'],
                                'activity_id': activity['id']
                            })
                            break
                            
                except requests.exceptions.HTTPError as e:
                    logger.error(f"HTTP error for activity {activity['id']}: {str(e)}")
                    if e.response.status_code == 401:
                        logger.error("Token might be expired. Try refreshing your token.")
                        raise
                    continue
                except Exception as e:
                    logger.error(f"Error processing activity {activity['id']}: {str(e)}")
                    continue
            
            logger.info(f"Found {len(wingo_attempts)} WINGO attempts")
            
            return {
                'athlete_name': athlete.get('firstname', '') + ' ' + athlete.get('lastname', ''),
                'athlete_id': athlete['id'],
                'total_attempts': len(wingo_attempts),
                'attempts': sorted(wingo_attempts, key=lambda x: x['date'], reverse=True)
            }
            
        except Exception as e:
            logger.error(f"Error counting WINGO attempts: {str(e)}")
            raise

    def get_segment_efforts(self, segment_id: int = WINGATE_SEGMENT_ID, 
                           start_date: Optional[datetime] = None,
                           end_date: Optional[datetime] = None,
                           per_page: int = 100) -> List[Dict]:
        """
        Get segment efforts for a specific date range.
        
        Args:
            segment_id: Strava segment ID (defaults to Wingate track)
            start_date: Start date for the search
            end_date: End date for the search
            per_page: Number of efforts per page (max 100)
            
        Returns:
            List of segment effort dictionaries
        """
        try:
            params = {
                "segment_id": segment_id,
                "per_page": per_page
            }
            
            if start_date:
                params["start_date_local"] = start_date.strftime("%Y-%m-%dT%H:%M:%S")
            if end_date:
                params["end_date_local"] = end_date.strftime("%Y-%m-%dT%H:%M:%S")
                
            response = requests.get(
                f"{self.base_url}/segment_efforts",
                headers=self.headers,
                params=params
            )
            
            # Check for rate limiting
            if response.status_code == 429:
                logger.warning("Rate limit reached. Waiting 15 minutes...")
                time.sleep(900)  # Wait 15 minutes
                response = requests.get(
                    f"{self.base_url}/segment_efforts",
                    headers=self.headers,
                    params=params
                )
                
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching segment efforts: {str(e)}")
            raise

# Example usage
if __name__ == "__main__":
    # Initialize the API client
    strava = StravaAPI(
        client_id="94661",
        client_secret="f5c453ed72a6deffb7454678a5651d27c7159a23"
    )
    
    # Get new tokens if needed
    if not strava.access_token:
        strava.get_new_tokens()
    
    try:
        print("\n" + "="*50)
        print("WINGO TRACK VERIFICATION")
        print("="*50)
        
        # Set date range for May 10-20, 2025
        start_date = datetime(2025, 5, 10)
        end_date = datetime(2025, 5, 20, 23, 59, 59)
        
        # Get segment efforts directly
        efforts = strava.get_segment_efforts(
            segment_id=WINGATE_SEGMENT_ID,
            start_date=start_date,
            end_date=end_date,
            per_page=100
        )
        
        # If no efforts found, check activities
        if not efforts:
            activities = strava.get_my_activities(after=start_date, before=end_date)
            all_efforts = []
            for activity in activities:
                if activity.get('type') != 'Run':
                    continue
                    
                try:
                    response = requests.get(
                        f"{strava.base_url}/activities/{activity['id']}",
                        headers=strava.headers
                    )
                    
                    if response.status_code == 429:
                        time.sleep(900)
                        response = requests.get(
                            f"{strava.base_url}/activities/{activity['id']}",
                            headers=strava.headers
                        )
                    
                    response.raise_for_status()
                    activity_details = response.json()
                    
                    segment_efforts = activity_details.get('segment_efforts', [])
                    wingo_efforts = [effort for effort in segment_efforts if effort.get('segment', {}).get('id') == WINGATE_SEGMENT_ID]
                    all_efforts.extend(wingo_efforts)
                        
                except Exception as e:
                    continue
            
            efforts = all_efforts
        
        # Group efforts by date
        efforts_by_date = {}
        for effort in efforts:
            date = datetime.fromisoformat(effort.get('start_date_local', '')).strftime('%Y-%m-%d')
            if date not in efforts_by_date:
                efforts_by_date[date] = []
            efforts_by_date[date].append(effort)
        
        # Print results
        print(f"\nWINGO Attempts Summary:")
        print(f"Total attempts found: {len(efforts)}")
        
        if efforts:
            print("\nAttempts by date:")
            for date, date_efforts in sorted(efforts_by_date.items()):
                print(f"\n{date}:")
                for effort in date_efforts:
                    athlete = effort.get('athlete', {})
                    print(f"- Athlete: {athlete.get('firstname', '')} {athlete.get('lastname', '')}")
                    print(f"  Time: {timedelta(seconds=effort.get('elapsed_time', 0))}")
                    print(f"  Activity: https://www.strava.com/activities/{effort.get('activity_id')}")
        else:
            print("\nNo WINGO attempts found in this period.")
            
        print("\n" + "="*50)
            
    except Exception as e:
        print(f"\nError: {str(e)}")
        if "429" in str(e):
            print("\nYou've hit Strava's rate limit. Please wait 15 minutes and try again.")
        elif "401" in str(e):
            print("\nYour access token might be expired. Try running the script again to get a new token.")