import requests

# Create a new user
try:
    response = requests.post(
        'http://127.0.0.1:3000/register',
        json={
            'email': 'test@example.com',
            'username': 'testuser',
            'password': 'testpass'
        }
    )
    print("Register response:", response.json())
except Exception as e:
    print("Register error:", str(e))
    print("Response content:", response.text if 'response' in locals() else "No response")

# Test login
try:
    # Using form data format for OAuth2 password flow
    response = requests.post(
        'http://127.0.0.1:3000/token',
        data={
            'username': 'testuser',
            'password': 'testpass',
            'grant_type': 'password',
            'scope': ''  # Required by FastAPI's OAuth2PasswordRequestForm
        },
        headers={
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    )
    print("\nLogin response:", response.json())
    token = response.json()['access_token']

    # Test getting user info
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get('http://127.0.0.1:3000/users/me', headers=headers)
    print("\nUser info response:", response.json())
except Exception as e:
    print("Error:", str(e))
    print("Response content:", response.text if 'response' in locals() else "No response") 