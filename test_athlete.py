import requests

ACCESS_TOKEN = "d3075b228a250d30988b036a43b0b2ba851f0358"
ACTIVITY_ID = 13940527991

response = requests.get(
    f"https://www.strava.com/api/v3/activities/{ACTIVITY_ID}",
    headers={"Authorization": f"Bearer {ACCESS_TOKEN}"},
    params={"include_all_efforts": True}
)

print(f"Status: {response.status_code}")
print(response.json())
