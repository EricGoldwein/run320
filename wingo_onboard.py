from flask import Flask, request, redirect, session, url_for, render_template_string, flash
import requests
from datetime import datetime, timedelta
from urllib.parse import urlencode
import os
import sqlite3
from typing import Dict, List

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev")

CLIENT_ID = "94661"  # This is the WINGO app's client ID, not your Strava athlete ID
CLIENT_SECRET = "f5c453ed72a6deffb7454678a5651d27c7159a23"
WINGATE_SEGMENT_ID = 7831001
REDIRECT_URI = "http://localhost:8182/callback"  # Updated port number

def init_db():
    """Initialize the database with required tables."""
    conn = sqlite3.connect('wingo.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS athletes (
            strava_id TEXT PRIMARY KEY,
            first_name TEXT,
            last_name TEXT,
            access_token TEXT,
            refresh_token TEXT,
            token_expires_at INTEGER,
            profile_url TEXT,
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def get_db():
    """Get database connection."""
    conn = sqlite3.connect('wingo.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/")
def index():
    """Show welcome page with registration option."""
    html = """
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0;
            padding: 20px;
            background-color: #f5f6fa;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }
        h1 { color: #2c3e50; }
        .welcome-text {
            margin: 20px 0;
            line-height: 1.6;
            color: #34495e;
        }
        .register-btn {
            display: inline-block;
            background-color: #3498db;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 18px;
            margin-top: 20px;
            transition: background-color 0.2s;
        }
        .register-btn:hover {
            background-color: #2980b9;
        }
        .steps {
            text-align: left;
            margin: 30px auto;
            max-width: 500px;
        }
        .step {
            margin: 15px 0;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
        .step-number {
            font-weight: bold;
            color: #3498db;
        }
    </style>
    <div class="container">
        <h1>Welcome to WINGO Tracking</h1>
        <div class="welcome-text">
            Track your Wingate Track attempts and compete with other athletes!
        </div>
        <div class="steps">
            <div class="step">
                <span class="step-number">1.</span> Find your Strava Athlete ID in your profile URL
            </div>
            <div class="step">
                <span class="step-number">2.</span> Register with your information
            </div>
            <div class="step">
                <span class="step-number">3.</span> Authorize WINGO to access your Strava data
            </div>
            <div class="step">
                <span class="step-number">4.</span> Start tracking your WINGO attempts!
            </div>
        </div>
        <a href="/register" class="register-btn">Register Now</a>
    </div>
    """
    return render_template_string(html)

@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Handle athlete registration
        strava_id = request.form.get('strava_id')
        first_name = request.form.get('first_name')
        last_name = request.form.get('last_name')
        profile_url = request.form.get('profile_url')
        
        if not all([strava_id, first_name, last_name]):
            return "Missing required information", 400
            
        # Store registration info in session for verification after Strava auth
        session['pending_registration'] = {
            'strava_id': strava_id,
            'first_name': first_name,
            'last_name': last_name,
            'profile_url': profile_url
        }
        return redirect(url_for("authorize"))
    
    # Show registration form
    html = """
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0;
            padding: 20px;
            background-color: #f5f6fa;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 { color: #2c3e50; }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            color: #2c3e50;
        }
        input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            background-color: #3498db;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            font-size: 16px;
        }
        button:hover {
            background-color: #2980b9;
        }
        .help-text {
            font-size: 0.9em;
            color: #666;
            margin-top: 5px;
        }
        .back-link {
            display: block;
            text-align: center;
            margin-top: 20px;
            color: #3498db;
            text-decoration: none;
        }
        .back-link:hover {
            text-decoration: underline;
        }
        .error-message {
            color: #e74c3c;
            background-color: #fde8e8;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
    </style>
    <div class="container">
        <h1>WINGO Athlete Registration</h1>
        <form method="POST">
            <div class="form-group">
                <label for="strava_id">Strava Athlete ID</label>
                <input type="text" id="strava_id" name="strava_id" required>
                <div class="help-text">Find this in your Strava profile URL (e.g., strava.com/athletes/12345678)</div>
            </div>
            <div class="form-group">
                <label for="first_name">First Name</label>
                <input type="text" id="first_name" name="first_name" required>
            </div>
            <div class="form-group">
                <label for="last_name">Last Name</label>
                <input type="text" id="last_name" name="last_name" required>
            </div>
            <div class="form-group">
                <label for="profile_url">Strava Profile URL (optional)</label>
                <input type="url" id="profile_url" name="profile_url">
            </div>
            <button type="submit">Register</button>
        </form>
        <a href="/" class="back-link">← Back to Home</a>
    </div>
    """
    return render_template_string(html)

@app.route("/authorize")
def authorize():
    params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "approval_prompt": "force",
        "scope": "activity:read_all"
    }
    url = f"https://www.strava.com/oauth/authorize?{urlencode(params)}"
    return redirect(url)

@app.route("/callback")
def callback():
    code = request.args.get("code")
    if not code:
        return "❌ Authorization failed."

    token_resp = requests.post("https://www.strava.com/oauth/token", data={
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code"
    })
    token_resp.raise_for_status()
    tokens = token_resp.json()

    # Get athlete info
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    athlete_resp = requests.get("https://www.strava.com/api/v3/athlete", headers=headers)
    athlete_resp.raise_for_status()
    athlete = athlete_resp.json()

    # Verify the Strava ID matches the authenticated user
    pending_reg = session.get('pending_registration')
    if pending_reg and str(pending_reg['strava_id']) != str(athlete['id']):
        # Clear the pending registration
        session.pop('pending_registration', None)
        return """
        <div style="text-align: center; padding: 20px;">
            <h2 style="color: #e74c3c;">❌ Registration Failed</h2>
            <p>The Strava ID you entered does not match your Strava account.</p>
            <p>Please go back and enter your correct Strava ID.</p>
            <a href="/register" style="color: #3498db; text-decoration: none;">← Back to Registration</a>
        </div>
        """

    # Store tokens in database
    conn = get_db()
    try:
        if pending_reg:
            # New registration
            conn.execute('''
                INSERT INTO athletes (strava_id, first_name, last_name, profile_url, access_token, refresh_token, token_expires_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                str(athlete['id']),
                pending_reg['first_name'],
                pending_reg['last_name'],
                pending_reg['profile_url'],
                tokens['access_token'],
                tokens['refresh_token'],
                tokens['expires_at']
            ))
        else:
            # Update existing user
            conn.execute('''
                UPDATE athletes 
                SET access_token = ?, refresh_token = ?, token_expires_at = ?
                WHERE strava_id = ?
            ''', (tokens['access_token'], tokens['refresh_token'], tokens['expires_at'], str(athlete['id'])))
        conn.commit()
    finally:
        conn.close()

    # Clear the pending registration
    session.pop('pending_registration', None)
    
    session["access_token"] = tokens["access_token"]
    session["refresh_token"] = tokens["refresh_token"]

    return redirect(url_for("wingo_check"))

@app.route("/wingo")
def wingo_check():
    access_token = session.get("access_token")
    if not access_token:
        return redirect(url_for("authorize"))

    start = datetime(2025, 5, 10)
    end = datetime(2025, 5, 20, 23, 59, 59)
    after = int(start.timestamp())
    before = int(end.timestamp())

    headers = {"Authorization": f"Bearer {access_token}"}
    acts = requests.get("https://www.strava.com/api/v3/athlete/activities", headers=headers, params={
        "after": after,
        "before": before,
        "per_page": 200
    })
    acts.raise_for_status()
    activities = acts.json()

    efforts = []
    for act in activities:
        if act.get("type") != "Run":
            continue
        r = requests.get(f"https://www.strava.com/api/v3/activities/{act['id']}", headers=headers)
        r.raise_for_status()
        for effort in r.json().get("segment_efforts", []):
            if effort.get("segment", {}).get("id") == WINGATE_SEGMENT_ID:
                efforts.append(effort)

    html = """
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0;
            padding: 20px;
            background-color: #f5f6fa;
            color: #2c3e50;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 { 
            color: #2c3e50;
            margin: 0 0 20px 0;
            font-size: 28px;
        }
        h3 { 
            color: #34495e;
            margin: 25px 0 15px 0;
            font-size: 20px;
            border-bottom: 2px solid #eee;
            padding-bottom: 5px;
        }
        .summary {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            font-size: 16px;
        }
        .athlete-name { 
            font-weight: bold; 
            color: #2c3e50;
        }
        .time { 
            color: #27ae60;
            font-weight: 500;
        }
        .activity-link { 
            color: #3498db; 
            text-decoration: none;
            margin-left: 10px;
        }
        .activity-link:hover { 
            text-decoration: underline;
        }
        .segment-link { 
            display: inline-block;
            background-color: #3498db;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        .segment-link:hover {
            background-color: #2980b9;
        }
        ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        li {
            padding: 12px 0;
            border-bottom: 1px solid #eee;
        }
        li:last-child {
            border-bottom: none;
        }
    </style>
    <div class="container">
        <h1>WINGO Attempts</h1>
        <a href="https://www.strava.com/segments/7831001" class="segment-link" target="_blank">View Wingate Track Segment on Strava</a>
    """
    if not efforts:
        html += "<div class='summary'>No WINGO attempts found.</div>"
    else:
        html += f"<div class='summary'>Total WINGO attempts: {len(efforts)}</div>"
        grouped = {}
        for e in efforts:
            date = datetime.fromisoformat(e["start_date_local"]).strftime("%Y-%m-%d")
            grouped.setdefault(date, []).append(e)

        for date, day_efforts in sorted(grouped.items()):
            html += f"<h3>{date}</h3><ul>"
            for e in day_efforts:
                athlete = e.get("athlete", {})
                athlete_name = f"{athlete.get('firstname', '')} {athlete.get('lastname', '')}"
                html += f"""
                <li>
                    <span class="athlete-name">{athlete_name}</span>
                    <span class="time">Time: {timedelta(seconds=e.get('elapsed_time', 0))}</span>
                    <a class="activity-link" href='https://www.strava.com/activities/{e.get('activity', {}).get('id')}'>View Activity</a>
                </li>
                """
            html += "</ul>"
    
    html += "</div>"

    return render_template_string(html)

if __name__ == "__main__":
    init_db()  # Initialize database on startup
    app.run(debug=True, port=8182)  # Updated port number 