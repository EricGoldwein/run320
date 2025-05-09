import requests

ACCESS_TOKEN = "230c01223688789f411882406cb39ee4e8274a8e"
SEGMENT_ID = 7831001

response = requests.get(
    "https://www.strava.com/api/v3/segment_efforts",
    headers={"Authorization": f"Bearer {ACCESS_TOKEN}"},
    params={
        "segment_id": SEGMENT_ID,
        "start_date_local": "2025-03-15T00:00:00",
        "end_date_local": "2025-03-25T23:59:59",
        "per_page": 100
    }
)

print(f"Status Code: {response.status_code}")
print(response.json())
