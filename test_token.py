import requests

CLIENT_ID = "94661"
CLIENT_SECRET = "f5c453ed72a6deffb7454678a5651d27c7159a23"  # Make sure it's correct
CODE = "4774c0bdffed12620458a4dd77010f96e0e64fbb"

response = requests.post(
    "https://www.strava.com/oauth/token",
    data={
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": CODE,
        "grant_type": "authorization_code"
    }
)

print(response.json())
