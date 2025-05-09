import gpxpy
from geopy.distance import geodesic
import numpy as np
from typing import List, Tuple

def analyze_wingo_track(gpx_file_path: str):
    """
    Analyze the WINGO track to determine the loop coordinates.
    """
    try:
        with open(gpx_file_path, 'r') as gpx_file:
            gpx = gpxpy.parse(gpx_file)
            
        # Extract all track points
        track_points = []
        for track in gpx.tracks:
            for segment in track.segments:
                for point in segment.points:
                    track_points.append((point.latitude, point.longitude))
        
        print(f"Total track points: {len(track_points)}")
        
        # Calculate total distance
        total_distance = 0.0
        for i in range(len(track_points) - 1):
            total_distance += geodesic(track_points[i], track_points[i + 1]).meters
        
        # Calculate expected lap length (total distance / 15.7 laps)
        lap_length = total_distance / 15.7
        print(f"\nTotal distance: {total_distance:.1f}m")
        print(f"Expected lap length: {lap_length:.1f}m")
        
        # Find repeating patterns (potential laps)
        current_distance = 0.0
        lap_start = 0
        potential_laps = []
        
        for i in range(len(track_points) - 1):
            current_distance += geodesic(track_points[i], track_points[i + 1]).meters
            
            # If we've gone approximately one lap length
            if abs(current_distance - lap_length) < 20:  # 20m tolerance
                potential_laps.append((lap_start, i + 1))
                print(f"\nPotential lap found:")
                print(f"  Start: {track_points[lap_start]}")
                print(f"  End: {track_points[i + 1]}")
                print(f"  Distance: {current_distance:.1f}m")
                print(f"  Points: {i + 1 - lap_start}")
                
                # Reset for next lap
                lap_start = i + 1
                current_distance = 0.0
            elif current_distance > lap_length + 20:
                # We've gone too far, reset
                lap_start = i
                current_distance = geodesic(track_points[i], track_points[i + 1]).meters
        
        # Analyze the first few laps to get consistent coordinates
        if len(potential_laps) >= 3:
            # Take the first three laps
            lap_points = []
            for start, end in potential_laps[:3]:
                lap_points.extend(track_points[start:end + 1])
            
            # Convert to numpy array for easier manipulation
            points = np.array([(p[0], p[1]) for p in lap_points])
            
            # Find the corners using clustering of extreme points
            corners = []
            
            # Find extreme points
            min_lat_idx = np.argmin(points[:, 0])
            max_lat_idx = np.argmax(points[:, 0])
            min_lon_idx = np.argmin(points[:, 1])
            max_lon_idx = np.argmax(points[:, 1])
            
            # Get the corner points
            corner_indices = [min_lat_idx, max_lat_idx, min_lon_idx, max_lon_idx]
            corner_points = points[corner_indices]
            
            # Remove duplicates and sort
            corner_points = np.unique(corner_points, axis=0)
            
            # Sort corners in a logical order (clockwise from bottom-left)
            center = np.mean(corner_points, axis=0)
            angles = np.arctan2(corner_points[:, 0] - center[0],
                              corner_points[:, 1] - center[1])
            sorted_indices = np.argsort(angles)
            corner_points = corner_points[sorted_indices]
            
            # Convert back to list of tuples and close the loop
            loop_coordinates = [(float(lat), float(lon)) for lat, lon in corner_points]
            loop_coordinates.append(loop_coordinates[0])  # Close the loop
            
            print("\nWINGO Loop Coordinates:")
            for coord in loop_coordinates:
                print(f"    ({coord[0]}, {coord[1]}),")
            
            return loop_coordinates
        
    except Exception as e:
        print(f"Error processing GPX file: {e}")
        return None

if __name__ == "__main__":
    gpx_file = r"C:\Users\egold\PycharmProjects\wingo\Wingate_320_5K.gpx"
    loop_coordinates = analyze_wingo_track(gpx_file) 