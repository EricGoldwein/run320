import gpxpy
from geopy.distance import geodesic
from typing import List, Tuple, Dict
from datetime import datetime, timedelta
import logging
import math

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

class StravaSegment:
    """Class to represent a Strava segment."""
    
    def __init__(self, 
                 name: str,
                 segment_id: int,
                 start_latlng: Tuple[float, float],
                 end_latlng: Tuple[float, float],
                 distance: float,
                 polyline: str = None):
        """
        Initialize a Strava segment.
        
        Args:
            name: Segment name
            segment_id: Strava segment ID
            start_latlng: (latitude, longitude) of start point
            end_latlng: (latitude, longitude) of end point
            distance: Segment distance in meters
            polyline: Encoded polyline of the segment path
        """
        self.name = name
        self.segment_id = segment_id
        self.start_latlng = start_latlng
        self.end_latlng = end_latlng
        self.distance = distance
        self.polyline = polyline
        
    def is_point_near_start(self, point: Tuple[float, float], threshold: float = 25) -> bool:
        """Check if a point is near the segment start."""
        return geodesic(point, self.start_latlng).meters <= threshold
        
    def is_point_near_end(self, point: Tuple[float, float], threshold: float = 25) -> bool:
        """Check if a point is near the segment end."""
        return geodesic(point, self.end_latlng).meters <= threshold

def check_segment_attempt(gpx_file: str, segment: StravaSegment) -> Dict:
    """
    Check a GPX file for attempts at a Strava segment.
    
    Args:
        gpx_file: Path to GPX file
        segment: StravaSegment object
        
    Returns:
        Dictionary with attempt results
    """
    with open(gpx_file, 'r') as f:
        gpx = gpxpy.parse(f)
        
    # Extract track points
    track_points = []
    timestamps = []
    for track in gpx.tracks:
        for segment in track.segments:
            for point in segment.points:
                track_points.append((point.latitude, point.longitude))
                timestamps.append(point.time)
                
    if not track_points:
        raise ValueError("No track points found in GPX file")
        
    # Find segment attempts
    attempts = []
    current_attempt = None
    
    for i, point in enumerate(track_points):
        # Check for segment start
        if segment.is_point_near_start(point):
            if current_attempt is None:
                current_attempt = {
                    'start_idx': i,
                    'start_time': timestamps[i]
                }
        
        # Check for segment end if we're in an attempt
        elif current_attempt is not None and segment.is_point_near_end(point):
            current_attempt['end_idx'] = i
            current_attempt['end_time'] = timestamps[i]
            current_attempt['elapsed_time'] = timestamps[i] - current_attempt['start_time']
            
            # Calculate attempt distance
            attempt_distance = 0
            for j in range(current_attempt['start_idx'], current_attempt['end_idx']):
                attempt_distance += geodesic(track_points[j], track_points[j+1]).meters
                
            current_attempt['distance'] = attempt_distance
            attempts.append(current_attempt)
            current_attempt = None
            
    return {
        'segment_name': segment.name,
        'segment_id': segment.segment_id,
        'attempts': attempts
    }

# Example usage (once we have the actual coordinates)
WINGATE_TRACK = StravaSegment(
    name="Wingate track",
    segment_id=7831001,
    start_latlng=(0, 0),  # Need actual coordinates
    end_latlng=(0, 0),    # Need actual coordinates
    distance=320.0,       # 320 meters
    polyline=None         # Need actual polyline
)

if __name__ == "__main__":
    # Example usage
    gpx_file = "activity.gpx"  # Replace with actual GPX file
    results = check_segment_attempt(gpx_file, WINGATE_TRACK)
    
    print("\n" + "="*50)
    print(f"SEGMENT ATTEMPT RESULTS: {results['segment_name']}")
    print("="*50)
    
    if not results['attempts']:
        print("No attempts found")
    else:
        for i, attempt in enumerate(results['attempts'], 1):
            print(f"\nAttempt {i}:")
            print(f"Start time: {attempt['start_time']}")
            print(f"Distance: {attempt['distance']:.1f}m")
            print(f"Duration: {attempt['elapsed_time']}") 