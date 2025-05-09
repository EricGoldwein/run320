from flask import Flask, render_template
import requests
from datetime import datetime, timedelta
import logging
import time
from strava_premium_wingo import get_all_segment_efforts, analyze_efforts

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Your credentials
CLIENT_ID = "94661"
CLIENT_SECRET = "f5c453ed72a6deffb7454678a5651d27c7159a23"
ACCESS_TOKEN = "2f0ae07a4e5694f981e028a74e0ae8540086e008"
REFRESH_TOKEN = "0a045a1eab8244c3a450a71d66d9c6d60663afc6"

# Segment ID for Wingate track
SEGMENT_ID = 7831001

def format_time(seconds):
    """Format seconds into a readable time string."""
    return str(timedelta(seconds=seconds))

def get_wingo_data():
    """Get and process WINGO data."""
    efforts = get_all_segment_efforts(SEGMENT_ID, ACCESS_TOKEN)
    
    if not efforts:
        return None
    
    # Sort by date
    efforts.sort(key=lambda x: x['start_date'], reverse=True)
    
    # Group by athlete
    athlete_efforts = {}
    for effort in efforts:
        athlete_id = effort['athlete']['id']
        if athlete_id not in athlete_efforts:
            athlete_efforts[athlete_id] = {
                'name': f"{effort['athlete']['firstname']} {effort['athlete']['lastname']}",
                'count': 0,
                'efforts': [],
                'profile_pic': effort['athlete'].get('profile_medium', '')
            }
        athlete_efforts[athlete_id]['count'] += 1
        athlete_efforts[athlete_id]['efforts'].append(effort)
    
    # Process each athlete's data
    for athlete_id, stats in athlete_efforts.items():
        # Get fastest time
        fastest = min(stats['efforts'], key=lambda x: x['elapsed_time'])
        stats['fastest_time'] = format_time(fastest['elapsed_time'])
        stats['fastest_date'] = datetime.fromisoformat(fastest['start_date'].replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M')
        stats['fastest_activity'] = f"https://www.strava.com/activities/{fastest['activity']['id']}"
        
        # Get most recent effort
        recent = max(stats['efforts'], key=lambda x: x['start_date'])
        stats['recent_date'] = datetime.fromisoformat(recent['start_date'].replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M')
        stats['recent_time'] = format_time(recent['elapsed_time'])
        stats['recent_activity'] = f"https://www.strava.com/activities/{recent['activity']['id']}"
    
    # Sort athletes by number of attempts
    sorted_athletes = sorted(athlete_efforts.items(), key=lambda x: x[1]['count'], reverse=True)
    
    return {
        'total_efforts': len(efforts),
        'date_range': {
            'start': datetime.fromisoformat(efforts[-1]['start_date'].replace('Z', '+00:00')).strftime('%Y-%m-%d'),
            'end': datetime.fromisoformat(efforts[0]['start_date'].replace('Z', '+00:00')).strftime('%Y-%m-%d')
        },
        'athletes': [stats for _, stats in sorted_athletes]
    }

@app.route('/')
def index():
    """Main page showing WINGO statistics."""
    data = get_wingo_data()
    return render_template('index.html', data=data)

if __name__ == '__main__':
    app.run(debug=True) 