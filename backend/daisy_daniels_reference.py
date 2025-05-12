"""Reference utilities from Jack Daniels' Running Formula (2021).
Includes VDOT estimation, stress point system, and placeholders for future features.
"""

import math
import csv
import os
from pathlib import Path

# Load VDOT paces from CSV
def load_vdot_paces():
    """Load VDOT paces from CSV file"""
    try:
        csv_path = Path(__file__).parent / 'vdot_paces.csv'
        vdot_data = {}
        
        with open(csv_path, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                vdot = int(row['vdot'])
                vdot_data[vdot] = {
                    "E": row['e_mile'],
                    "M": row['m_mile'],
                    "T": row['t_mile'],
                    "I": row['i_400m'],
                    "R": row['r_400m']
                }
        return vdot_data
    except Exception as e:
        print(f"Error loading VDOT paces from CSV: {e}")
        return {}

# Try to load VDOT paces from CSV, fall back to formula if file not found
try:
    VDOT_PACES = load_vdot_paces()
    if not VDOT_PACES:
        raise Exception("No VDOT paces loaded from CSV")
except Exception as e:
    print(f"Falling back to formula-based calculation: {e}")
    # Keep the old lookup table as fallback
    VDOT_PACES = {
        30: {"E": "12:00-13:16", "M": "11:21", "T": "10:18", "I": "9:45", "R": "1:41-1:45"},
        31: {"E": "11:41-12:57", "M": "11:02", "T": "10:02", "I": "9:30", "R": "1:38-1:42"},
        # ... [rest of the original dictionary]
    }

# Archive the original formula-based calculation
def calculate_paces_from_vdot_formula(vdot):
    """Calculate training paces from VDOT using Daniels' formulas (archived version)"""
    vdot = float(vdot)
    
    easy_min = vdot * 0.66
    easy_max = vdot * 0.74
    marathon = vdot * 0.795
    threshold = vdot * 0.875
    interval = vdot * 0.92
    repetition_min = vdot * 0.88
    repetition_max = vdot * 0.92
    
    return {
        "E": f"{format_seconds_to_pace(easy_min)}-{format_seconds_to_pace(easy_max)}",
        "M": format_seconds_to_pace(marathon),
        "T": format_seconds_to_pace(threshold),
        "I": format_seconds_to_pace(interval),
        "R": f"{format_seconds_to_pace(repetition_min)}-{format_seconds_to_pace(repetition_max)}"
    }

def get_paces(vdot):
    """Get training paces for a given VDOT, using table values or interpolation"""
    vdot_rounded = round(vdot)
    
    # If exact VDOT is in the table, use those values
    if vdot_rounded in VDOT_PACES:
        return VDOT_PACES[vdot_rounded]
    
    # If VDOT is outside table range, use formula
    if vdot_rounded < min(VDOT_PACES.keys()) or vdot_rounded > max(VDOT_PACES.keys()):
        return calculate_paces_from_vdot_formula(vdot)
    
    # Otherwise interpolate between nearest values
    lower_vdot = max(k for k in VDOT_PACES.keys() if k < vdot_rounded)
    upper_vdot = min(k for k in VDOT_PACES.keys() if k > vdot_rounded)
    
    # Get paces for both VDOT levels
    lower_paces = VDOT_PACES[lower_vdot]
    upper_paces = VDOT_PACES[upper_vdot]
    
    # Calculate interpolation factor
    factor = (vdot - lower_vdot) / (upper_vdot - lower_vdot)
    
    # Interpolate each pace type
    result = {}
    for pace_type in ["E", "M", "T", "I", "R"]:
        if "-" in lower_paces[pace_type] and "-" in upper_paces[pace_type]:
            # Handle range values (like Easy pace)
            lower_min, lower_max = map(parse_pace_to_seconds, lower_paces[pace_type].split("-"))
            upper_min, upper_max = map(parse_pace_to_seconds, upper_paces[pace_type].split("-"))
            
            interp_min = lower_min + (upper_min - lower_min) * factor
            interp_max = lower_max + (upper_max - lower_max) * factor
            
            result[pace_type] = f"{format_seconds_to_pace(interp_min)}-{format_seconds_to_pace(interp_max)}"
        else:
            # Handle single values
            lower_seconds = parse_pace_to_seconds(lower_paces[pace_type])
            upper_seconds = parse_pace_to_seconds(upper_paces[pace_type])
            
            interp_seconds = lower_seconds + (upper_seconds - lower_seconds) * factor
            result[pace_type] = format_seconds_to_pace(interp_seconds)
    
    return result

# ---- VDOT Estimation from race time (basic version using a lookup + interpolation placeholder) ----

# Race times for different distances at each VDOT level
RACE_TIMES = {
    # Format: VDOT: {"distance_km": minutes}
    30: {"1.5": 8.5, "1.6093": 9.18, "3": 17.93, "3.2187": 19.32, "5": 30.67, "10": 63.77, "15": 98.23, "21.0975": 141.07, "42.195": 289.28},
    31: {"1.5": 8.25, "1.6093": 8.92, "3": 17.45, "3.2187": 18.8, "5": 29.85, "10": 62.05, "15": 95.6, "21.0975": 137.35, "42.195": 281.95},
    32: {"1.5": 8.03, "1.6093": 8.68, "3": 16.98, "3.2187": 18.3, "5": 29.08, "10": 60.43, "15": 93.12, "21.0975": 133.82, "42.195": 274.98},
    33: {"1.5": 7.82, "1.6093": 8.45, "3": 16.55, "3.2187": 17.83, "5": 28.35, "10": 58.9, "15": 90.75, "21.0975": 130.45, "42.195": 268.37},
    34: {"1.5": 7.62, "1.6093": 8.23, "3": 16.15, "3.2187": 17.4, "5": 27.65, "10": 57.43, "15": 88.5, "21.0975": 127.27, "42.195": 262.05},
    35: {"1.5": 7.42, "1.6093": 8.02, "3": 15.75, "3.2187": 16.97, "5": 27.0, "10": 56.05, "15": 86.37, "21.0975": 124.22, "42.195": 256.05},
    36: {"1.5": 7.23, "1.6093": 7.82, "3": 15.38, "3.2187": 16.57, "5": 26.37, "10": 54.73, "15": 84.33, "21.0975": 121.32, "42.195": 250.32},
    37: {"1.5": 7.07, "1.6093": 7.63, "3": 15.02, "3.2187": 16.18, "5": 25.77, "10": 53.48, "15": 82.4, "21.0975": 118.57, "42.195": 244.83},
    38: {"1.5": 6.9, "1.6093": 7.45, "3": 14.68, "3.2187": 15.82, "5": 25.2, "10": 52.28, "15": 80.55, "21.0975": 115.92, "42.195": 239.58},
    39: {"1.5": 6.73, "1.6093": 7.28, "3": 14.35, "3.2187": 15.48, "5": 24.65, "10": 51.15, "15": 78.78, "21.0975": 113.4, "42.195": 234.57},
    40: {"1.5": 6.58, "1.6093": 7.12, "3": 14.05, "3.2187": 15.13, "5": 24.13, "10": 50.05, "15": 77.1, "21.0975": 110.98, "42.195": 229.75},
    41: {"1.5": 6.45, "1.6093": 6.97, "3": 13.75, "3.2187": 14.82, "5": 23.63, "10": 49.02, "15": 75.48, "21.0975": 108.67, "42.195": 225.15},
    42: {"1.5": 6.32, "1.6093": 6.82, "3": 13.47, "3.2187": 14.52, "5": 23.15, "10": 48.02, "15": 73.93, "21.0975": 106.45, "42.195": 220.72},
    43: {"1.5": 6.18, "1.6093": 6.68, "3": 13.18, "3.2187": 14.22, "5": 22.68, "10": 47.07, "15": 72.45, "21.0975": 104.33, "42.195": 216.47},
    44: {"1.5": 6.05, "1.6093": 6.55, "3": 12.92, "3.2187": 13.93, "5": 22.25, "10": 46.15, "15": 71.03, "21.0975": 102.28, "42.195": 212.38},
    45: {"1.5": 5.93, "1.6093": 6.42, "3": 12.67, "3.2187": 13.67, "5": 21.83, "10": 45.27, "15": 69.67, "21.0975": 100.33, "42.195": 208.43},
    46: {"1.5": 5.82, "1.6093": 6.28, "3": 12.43, "3.2187": 13.42, "5": 21.42, "10": 44.42, "15": 68.37, "21.0975": 98.45, "42.195": 204.65},
    47: {"1.5": 5.7, "1.6093": 6.17, "3": 12.2, "3.2187": 13.17, "5": 21.03, "10": 43.6, "15": 67.1, "21.0975": 96.63, "42.195": 201.0},
    48: {"1.5": 5.6, "1.6093": 6.05, "3": 11.97, "3.2187": 12.92, "5": 20.65, "10": 42.83, "15": 65.55, "21.0975": 94.88, "42.195": 197.48},
    49: {"1.5": 5.5, "1.6093": 5.93, "3": 11.75, "3.2187": 12.68, "5": 20.3, "10": 42.07, "15": 64.73, "21.0975": 93.2, "42.195": 194.1},
    50: {"1.5": 5.4, "1.6093": 5.83, "3": 11.55, "3.2187": 12.47, "5": 19.95, "10": 41.35, "15": 63.6, "21.0975": 91.58, "42.195": 190.82},
    51: {"1.5": 5.3, "1.6093": 5.73, "3": 11.35, "3.2187": 12.25, "5": 19.6, "10": 40.65, "15": 62.52, "21.0975": 90.03, "42.195": 187.65},
    52: {"1.5": 5.22, "1.6093": 5.63, "3": 11.15, "3.2187": 12.03, "5": 19.28, "10": 39.98, "15": 61.48, "21.0975": 88.52, "42.195": 184.6},
    53: {"1.5": 5.12, "1.6093": 5.53, "3": 10.97, "3.2187": 11.83, "5": 18.97, "10": 39.33, "15": 60.47, "21.0975": 87.07, "42.195": 181.65},
    54: {"1.5": 5.03, "1.6093": 5.45, "3": 10.78, "3.2187": 11.65, "5": 18.67, "10": 38.7, "15": 59.5, "21.0975": 85.67, "42.195": 178.78},
    55: {"1.5": 4.95, "1.6093": 5.35, "3": 10.62, "3.2187": 11.47, "5": 18.37, "10": 38.1, "15": 58.55, "21.0975": 84.3, "42.195": 176.02},
    56: {"1.5": 4.88, "1.6093": 5.27, "3": 10.45, "3.2187": 11.28, "5": 18.08, "10": 37.52, "15": 57.65, "21.0975": 83.0, "42.195": 173.33},
    57: {"1.5": 4.8, "1.6093": 5.18, "3": 10.28, "3.2187": 11.1, "5": 17.82, "10": 36.95, "15": 56.77, "21.0975": 81.72, "42.195": 170.75},
    58: {"1.5": 4.73, "1.6093": 5.1, "3": 10.13, "3.2187": 10.93, "5": 17.55, "10": 36.4, "15": 55.92, "21.0975": 80.5, "42.195": 168.23},
    59: {"1.5": 4.65, "1.6093": 5.03, "3": 9.97, "3.2187": 10.77, "5": 17.28, "10": 35.87, "15": 55.1, "21.0975": 79.3, "42.195": 165.78},
    60: {"1.5": 4.58, "1.6093": 4.95, "3": 9.83, "3.2187": 10.62, "5": 17.05, "10": 35.37, "15": 54.3, "21.0975": 78.15, "42.195": 163.42},
    61: {"1.5": 4.52, "1.6093": 4.88, "3": 9.68, "3.2187": 10.45, "5": 16.8, "10": 34.87, "15": 53.53, "21.0975": 77.03, "42.195": 161.13},
    62: {"1.5": 4.45, "1.6093": 4.82, "3": 9.55, "3.2187": 10.3, "5": 16.57, "10": 34.38, "15": 52.78, "21.0975": 75.95, "42.195": 158.9},
    63: {"1.5": 4.4, "1.6093": 4.75, "3": 9.42, "3.2187": 10.17, "5": 16.33, "10": 33.92, "15": 52.05, "21.0975": 74.9, "42.195": 156.73},
    64: {"1.5": 4.33, "1.6093": 4.68, "3": 9.28, "3.2187": 10.02, "5": 16.12, "10": 33.47, "15": 51.35, "21.0975": 73.88, "42.195": 154.63},
    65: {"1.5": 4.27, "1.6093": 4.62, "3": 9.15, "3.2187": 9.88, "5": 15.9, "10": 33.02, "15": 50.67, "21.0975": 72.88, "42.195": 152.58},
    66: {"1.5": 4.22, "1.6093": 4.55, "3": 9.03, "3.2187": 9.75, "5": 15.7, "10": 32.58, "15": 50.0, "21.0975": 71.93, "42.195": 150.6},
    67: {"1.5": 4.17, "1.6093": 4.5, "3": 8.92, "3.2187": 9.62, "5": 15.48, "10": 32.18, "15": 49.37, "21.0975": 71.0, "42.195": 148.67},
    68: {"1.5": 4.1, "1.6093": 4.43, "3": 8.8, "3.2187": 9.5, "5": 15.3, "10": 31.77, "15": 48.73, "21.0975": 70.08, "42.195": 146.78},
    69: {"1.5": 4.05, "1.6093": 4.38, "3": 8.68, "3.2187": 9.38, "5": 15.1, "10": 31.38, "15": 48.13, "21.0975": 69.2, "42.195": 144.95},
    70: {"1.5": 4.0, "1.6093": 4.32, "3": 8.57, "3.2187": 9.27, "5": 14.92, "10": 31.0, "15": 47.53, "21.0975": 68.35, "42.195": 143.17},
    71: {"1.5": 3.95, "1.6093": 4.27, "3": 8.47, "3.2187": 9.15, "5": 14.73, "10": 30.63, "15": 46.97, "21.0975": 67.52, "42.195": 141.43},
    72: {"1.5": 3.9, "1.6093": 4.22, "3": 8.37, "3.2187": 9.03, "5": 14.55, "10": 30.27, "15": 46.4, "21.0975": 66.7, "42.195": 139.73},
    73: {"1.5": 3.87, "1.6093": 4.17, "3": 8.27, "3.2187": 8.92, "5": 14.38, "10": 29.92, "15": 45.85, "21.0975": 65.9, "42.195": 138.08},
    74: {"1.5": 3.82, "1.6093": 4.12, "3": 8.17, "3.2187": 8.82, "5": 14.22, "10": 29.57, "15": 45.32, "21.0975": 65.13, "42.195": 136.48},
    75: {"1.5": 3.77, "1.6093": 4.07, "3": 8.07, "3.2187": 8.72, "5": 14.05, "10": 29.23, "15": 44.8, "21.0975": 64.38, "42.195": 134.92},
    76: {"1.5": 3.73, "1.6093": 4.03, "3": 7.97, "3.2187": 8.62, "5": 13.9, "10": 28.92, "15": 44.3, "21.0975": 63.65, "42.195": 133.38},
    77: {"1.5": 3.68, "1.6093": 3.97, "3": 7.88, "3.2187": 8.52, "5": 13.73, "10": 28.6, "15": 43.82, "21.0975": 62.93, "42.195": 131.9},
    78: {"1.5": 3.63, "1.6093": 3.93, "3": 7.8, "3.2187": 8.42, "5": 13.58, "10": 28.28, "15": 43.33, "21.0975": 62.25, "42.195": 130.45},
    79: {"1.5": 3.6, "1.6093": 3.88, "3": 7.72, "3.2187": 8.33, "5": 13.43, "10": 27.98, "15": 42.87, "21.0975": 61.57, "42.195": 129.03},
    80: {"1.5": 3.57, "1.6093": 3.85, "3": 7.62, "3.2187": 8.23, "5": 13.28, "10": 27.68, "15": 42.42, "21.0975": 60.9, "42.195": 127.63},
    81: {"1.5": 3.52, "1.6093": 3.8, "3": 7.53, "3.2187": 8.15, "5": 13.15, "10": 27.4, "15": 41.97, "21.0975": 60.25, "42.195": 126.28},
    82: {"1.5": 3.48, "1.6093": 3.77, "3": 7.45, "3.2187": 8.05, "5": 13.02, "10": 27.12, "15": 41.53, "21.0975": 59.63, "42.195": 124.95},
    83: {"1.5": 3.45, "1.6093": 3.73, "3": 7.38, "3.2187": 7.97, "5": 12.88, "10": 26.85, "15": 41.1, "21.0975": 59.02, "42.195": 123.67},
    84: {"1.5": 3.42, "1.6093": 3.68, "3": 7.3, "3.2187": 7.88, "5": 12.75, "10": 26.57, "15": 40.7, "21.0975": 58.42, "42.195": 122.4},
    85: {"1.5": 3.38, "1.6093": 3.65, "3": 7.23, "3.2187": 7.8, "5": 12.62, "10": 26.32, "15": 40.28, "21.0975": 57.83, "42.195": 121.17}
}

def estimate_vdot(time_minutes: float, distance_km: float) -> float:
    """Estimate VDOT from race time using lookup table and interpolation."""
    # Round distance to nearest standard distance
    standard_distances = [1.6093, 5, 10, 21.0975, 42.195]
    closest_distance = min(standard_distances, key=lambda x: abs(x - distance_km))
    
    # Find the two VDOT levels that bracket this time
    vdot_levels = sorted(RACE_TIMES.keys())
    runner_time = time_minutes
    
    # If faster than fastest time in table, return highest VDOT
    if runner_time <= RACE_TIMES[vdot_levels[-1]][str(closest_distance)]:
        return vdot_levels[-1]
    
    # If slower than slowest time in table, return lowest VDOT
    if runner_time >= RACE_TIMES[vdot_levels[0]][str(closest_distance)]:
        return vdot_levels[0]
    
    # Find bracketing VDOT levels
    for i in range(len(vdot_levels) - 1):
        vdot_low = vdot_levels[i]
        vdot_high = vdot_levels[i + 1]
        time_low = RACE_TIMES[vdot_low][str(closest_distance)]
        time_high = RACE_TIMES[vdot_high][str(closest_distance)]
        
        if time_low >= runner_time >= time_high:
            # Linear interpolation
            vdot_range = vdot_high - vdot_low
            time_range = time_low - time_high
            time_ratio = (time_low - runner_time) / time_range
            return round(vdot_low + (vdot_range * time_ratio), 1)
    
    # If we get here, something went wrong - return conservative estimate
    return 30.0

# ---- Training Stress Points (p. 58 in Daniels' Running Formula 3rd Ed) ----

STRESS_POINTS_PER_MINUTE = {
    'E': 0.2,
    'M': 0.3,
    'T': 0.4,
    'I': 1.0,
    'R': 1.5,
    'Rep': 1.5,  # alias
    'Long': 0.3,
}

def calculate_stress(duration_minutes: float, pace_type: str) -> float:
    """Return total stress points for a session"""
    coeff = STRESS_POINTS_PER_MINUTE.get(pace_type.upper(), 0)
    return round(duration_minutes * coeff, 1)

# ---- Altitude adjustment stub (p. 190-191 in Daniels) ----

ALTITUDE_ADJUSTMENT = {
    # Elevation in feet: % slow-down for E pace (placeholder)
    3000: 0.01,
    5000: 0.03,
    7000: 0.05,
    8500: 0.07,
}

def adjusted_pace(sea_level_pace_sec_per_mile: float, elevation_ft: int) -> float:
    """Return pace adjusted for altitude."""
    adj = ALTITUDE_ADJUSTMENT.get(elevation_ft, 0)
    return round(sea_level_pace_sec_per_mile * (1 + adj), 1)

# ---- Placeholder: % VO2 max utilization curve from Fig. 5.2 ----
# This could be built out with scipy or numpy for curve fitting/interpolation.

VO2_UTILIZATION_NOTES = """
In Daniels, %VO2max utilized is a function of race time.
Equation used:
% VO2max = 0.8 + 0.1894393 * e^(-0.012778 * t) + 0.2989558 * e^(-0.1932605 * t)
This can be reversed (non-trivially) to solve for time given a target VDOT.
"""

def format_pace_range(min_pace, max_pace):
    """Format a pace range from two pace strings"""
    return f"{min_pace}-{max_pace}"

def parse_pace_to_seconds(pace_str):
    """Convert a pace string (MM:SS) to total seconds"""
    if ':' not in pace_str:
        return int(pace_str)  # For R paces that are just seconds
    mins, secs = map(int, pace_str.split(':'))
    return mins * 60 + secs

def format_seconds_to_pace(seconds):
    """Convert total seconds to a pace string (MM:SS)"""
    mins = seconds // 60
    secs = seconds % 60
    return f"{mins}:{str(secs).zfill(2)}"

def calculate_training_stress(workout_type, duration_minutes, intensity_percent):
    """
    Calculate training stress points based on workout type, duration, and intensity
    
    Args:
        workout_type: Type of workout (easy, threshold, interval, repetition)
        duration_minutes: Duration in minutes
        intensity_percent: Intensity as percentage of VO2 max
        
    Returns:
        Training stress points
    """
    # Base stress points by workout type
    base_stress = {
        "easy": 1,
        "threshold": 2,
        "interval": 3,
        "repetition": 4
    }
    
    # Get base stress for workout type
    stress = base_stress.get(workout_type.lower(), 1)
    
    # Adjust for duration (longer workouts = more stress)
    duration_factor = duration_minutes / 60.0  # Normalize to hours
    
    # Adjust for intensity (higher intensity = more stress)
    intensity_factor = intensity_percent / 100.0
    
    # Calculate total stress points
    total_stress = stress * duration_factor * intensity_factor
    
    return round(total_stress, 1)

def adjust_for_altitude(pace, altitude_meters):
    """
    Adjust pace for altitude
    
    Args:
        pace: Base pace in minutes per mile
        altitude_meters: Altitude in meters
        
    Returns:
        Adjusted pace in minutes per mile
    """
    # Altitude adjustment factors (simplified)
    # For every 1000m above sea level, pace is slowed by approximately 6%
    altitude_factor = 1.0 + (altitude_meters / 1000.0) * 0.06
    
    # Convert pace to seconds
    pace_min, pace_sec = map(int, pace.split(':'))
    pace_seconds = pace_min * 60 + pace_sec
    
    # Apply altitude factor
    adjusted_seconds = pace_seconds * altitude_factor
    
    # Convert back to mm:ss format
    adjusted_min = int(adjusted_seconds // 60)
    adjusted_sec = int(adjusted_seconds % 60)
    
    return f"{adjusted_min}:{str(adjusted_sec).zfill(2)}"

def get_vo2_max_utilization(vdot):
    """
    Get the percentage of VO2 max utilized at different training intensities
    
    Args:
        vdot: VDOT value
        
    Returns:
        Dictionary with utilization percentages for different training intensities
    """
    # These are approximate values based on Daniels' principles
    return {
        "easy": 65,  # Easy pace utilizes about 65% of VO2 max
        "threshold": 85,  # Threshold pace utilizes about 85% of VO2 max
        "interval": 95,  # Interval pace utilizes about 95% of VO2 max
        "repetition": 98  # Repetition pace utilizes about 98% of VO2 max
    }

def calculate_paces_from_vdot(vdot):
    """Calculate training paces from VDOT using Daniels' formulas"""
    # Convert VDOT to float for calculations
    vdot = float(vdot)
    
    # Calculate paces using Daniels' formulas
    easy_min = vdot * 0.66  # Lower end of easy range
    easy_max = vdot * 0.74  # Upper end of easy range
    marathon = vdot * 0.795  # Marathon pace
    threshold = vdot * 0.875  # Threshold pace
    interval = vdot * 0.92  # Interval pace
    repetition_min = vdot * 0.88  # Lower end of repetition range
    repetition_max = vdot * 0.92  # Upper end of repetition range
    
    # Format paces
    return {
        "E": f"{format_seconds_to_pace(easy_min)}-{format_seconds_to_pace(easy_max)}",
        "M": format_seconds_to_pace(marathon),
        "T": format_seconds_to_pace(threshold),
        "I": format_seconds_to_pace(interval),
        "R": f"{format_seconds_to_pace(repetition_min)}-{format_seconds_to_pace(repetition_max)}"
    }

def get_paces(vdot):
    """Get training paces for a given VDOT, using calculated values if not in lookup table"""
    vdot_rounded = round(vdot)
    
    # If we have exact values in the lookup table, use those
    if vdot_rounded in VDOT_PACES:
        return VDOT_PACES[vdot_rounded]
    
    # Otherwise calculate using Daniels' formulas
    return calculate_paces_from_vdot(vdot)

# ---- Granular VDOT Race Time Variability (from CSV) ----
GRANULAR_STDDEV = {}

# Map CSV distance names to canonical names
DISTANCE_MAP = {
    'Mile': 'mile',
    '5K': '5k',
    '10K': '10k',
    'Half': 'half',
    'Marathon': 'marathon',
}

def load_granular_stddev():
    """Load granular VDOT race time stddev from CSV into nested dict."""
    csv_path = Path(__file__).parent.parent / 'wingo-bets' / 'public' / 'Granular_VDOT_Race_Time_Variability.csv'
    data = {}
    try:
        with open(csv_path, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                vdot = int(row['VDOT'])
                dist = DISTANCE_MAP.get(row['Distance'], row['Distance'])
                stddev = float(row['StdDev (sec)'])
                if vdot not in data:
                    data[vdot] = {}
                data[vdot][dist] = stddev
    except Exception as e:
        print(f"Error loading granular stddev CSV: {e}")
    return data

GRANULAR_STDDEV = load_granular_stddev()

def get_race_time_stddev(vdot, distance):
    """
    Return interpolated stddev (in seconds) for a given VDOT and distance.
    Distance can be 'mile', '5k', '10k', 'half', 'marathon'.
    Returns None if out of range.
    """
    if not GRANULAR_STDDEV:
        return None
    vdot_low = int(math.floor(vdot))
    vdot_high = int(math.ceil(vdot))
    dist = distance.lower()
    # Try to match canonical names
    if dist in ['mile', '5k', '10k', 'half', 'marathon']:
        pass
    else:
        # Try to map from CSV
        for k, v in DISTANCE_MAP.items():
            if dist == v:
                dist = v
                break
    # Check if both VDOTs exist
    if vdot_low not in GRANULAR_STDDEV or vdot_high not in GRANULAR_STDDEV:
        return None
    if dist not in GRANULAR_STDDEV[vdot_low] or dist not in GRANULAR_STDDEV[vdot_high]:
        return None
    if vdot_low == vdot_high:
        return GRANULAR_STDDEV[vdot_low][dist]
    # Interpolate
    stddev_low = GRANULAR_STDDEV[vdot_low][dist]
    stddev_high = GRANULAR_STDDEV[vdot_high][dist]
    interp = stddev_low + (stddev_high - stddev_low) * (vdot - vdot_low) / (vdot_high - vdot_low)
    return interp 