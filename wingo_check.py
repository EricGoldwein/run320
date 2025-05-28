from flask import Flask, request, redirect, session, url_for, render_template_string
import requests
from datetime import datetime, timedelta
from urllib.parse import urlencode
import os

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev")

CLIENT_ID = "94661"
CLIENT_SECRET = "f5c453ed72a6deffb7454678a5651d27c7159a23"
WINGATE_SEGMENT_ID = 7831001
REDIRECT_URI = "http://localhost:5000/callback"

@app.route("/")
def index():
    if "access_token" not in session:
        return redirect(url_for("authorize"))
    return redirect(url_for("wingo_check"))

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
    app.run(debug=True)
