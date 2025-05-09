import requests

ACCESS_TOKEN = "230c01223688789f411882406cb39ee4e8274a8e"
SEGMENT_ID = 11646742  # Bandshell segment ID
PER_PAGE = 100
START_DATE_LOCAL = "2025-01-01T00:00:00"
END_DATE_LOCAL = "2025-05-01T00:00:00"

def get_segment_efforts(access_token, segment_id):
    url = "https://www.strava.com/api/v3/segment_efforts"
    headers = {"Authorization": f"Bearer {access_token}"}
    page = 1
    all_efforts = []

    while True:
        params = {
            "segment_id": segment_id,
            "per_page": PER_PAGE,
            "page": page,
            "start_date_local": START_DATE_LOCAL,
            "end_date_local": END_DATE_LOCAL
        }
        response = requests.get(url, headers=headers, params=params)

        if response.status_code != 200:
            print(f"Error: {response.json()}")
            break

        data = response.json()

        if not data:
            break

        all_efforts.extend(data)
        page += 1

    return all_efforts

def main():
    efforts = get_segment_efforts(ACCESS_TOKEN, SEGMENT_ID)

    if not efforts:
        print("No Bandshell segment efforts found.")
    else:
        print(f"🏃‍♂️ Ran Bandshell segment {len(efforts)} times since Jan 1, 2025.")

if __name__ == "__main__":
    main()