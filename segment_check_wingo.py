import requests

ACCESS_TOKEN = "ac0c625feb30d23396e2ea998535157ec07395e0"
SEGMENT_ID = 7831001

response = requests.get(
    "https://www.strava.com/api/v3/segment_efforts",
    headers={"Authorization": f"Bearer {ACCESS_TOKEN}"},
    params={
        "segment_id": SEGMENT_ID,
        "start_date_local": "2025-05-28T00:00:00",
        "end_date_local": "2025-05-28T23:59:59",
        "per_page": 100
    }
)

print(f"Status Code: {response.status_code}")
print(response.json())
