from fastapi import FastAPI, HTTPException, Depends, status, Header, Request, File, UploadFile, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta
from mangum import Mangum
from fastapi.middleware.wsgi import WSGIMiddleware
from jose import JWTError, jwt
from passlib.context import CryptContext
import sqlite3
import os
from sqlalchemy import Column, Integer, String, DateTime, Float, create_engine
from sqlalchemy.orm import declarative_base, Session, sessionmaker
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import shutil
from pathlib import Path
import json

# Initialize FastAPI app
app = FastAPI()

# Create ASGI handler for AWS Lambda
handler = Mangum(app)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174", 
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "https://320.pythonanywhere.com",
        "http://320.pythonanywhere.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add error handling middleware
@app.middleware("http")
async def add_error_handling(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        print(f"Error handling request: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )

# Security
SECRET_KEY = "your-secret-key-here"  # Change this in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# SQLAlchemy setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./wingo.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database setup
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    print("Initializing database...")
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully!")

# Models
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    wingo_balance: float
    created_at: datetime

    class Config:
        from_attributes = True

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    wingo_balance = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordReset(BaseModel):
    token: str
    new_password: str

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    print(f"Authorization header: {authorization}")
    if not authorization or not authorization.startswith("Bearer "):
        print("Invalid authorization header format")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = authorization.split(" ")[1]
    print(f"Extracted token: {token}")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"Decoded payload: {payload}")
        username: str = payload.get("sub")
        if username is None:
            print("No username in token payload")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError as e:
        print(f"JWT decode error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(User).filter(User.username == username).first()
    print(f"Found user in database: {user}")
    if user is None:
        print(f"No user found for username: {username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/me", response_model=UserResponse)
async def get_current_user_endpoint(current_user: User = Depends(get_current_user)):
    return current_user

# Routes
def send_welcome_email(email: str, username: str, full_name: str):
    message = MIMEMultipart()
    message["From"] = "noreply@wingo.com"
    message["To"] = email
    message["Subject"] = "You're in. Let's get weird. 🐴"

    # Extract first name from full name
    first_name = full_name.split()[0] if full_name else username

    body = f"""
Hi {first_name},

Welcome to the WINGO World — where workout independence is always 320 meters away.

You've registered. That's step one.
Now comes the fun part:
🔁 Run laps at Wingate.
🎯 Earn $WINGOs.
🎟 Unlock exclusive events, friendly wagers, and voting power.
🌀 Embrace the chaos of a track club with no dues, no merch, and no sponsors.

Need help? Ask DAISY™ (but don't expect a straight answer).
https://www.daisy320.com/coach 

See you at da Gate.

— The 320 Team
"""

    message.attach(MIMEText(body, "plain"))

    # For development, print the email and send it
    print(f"Sending welcome email to {email}")
    print(f"Subject: {message['Subject']}")
    print(f"Body: {body}")

    # Send the email using Gmail SMTP
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login("your-email@gmail.com", "your-app-password")  # Replace with your Gmail credentials
            server.send_message(message)
        print(f"Email sent successfully to {email}")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        # Don't raise an error if email fails, just log it

@app.post("/register")
async def register_user(user: UserCreate):
    db = SessionLocal()
    try:
        # Check if email already exists
        if db.query(User).filter(User.email == user.email).first():
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        
        # Check if username already exists
        if db.query(User).filter(User.username == user.username).first():
            raise HTTPException(
                status_code=400,
                detail="Username already taken"
            )
        
        # Create new user
        hashed_password = get_password_hash(user.password)
        db_user = User(
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_user.username}, expires_delta=access_token_expires
            )
        
        # Send welcome email
        try:
            send_welcome_email(user.email, user.username, user.full_name)
        except Exception as e:
            print(f"Failed to send welcome email: {str(e)}")
            # Don't raise an error if email fails, just log it

        return {
            "user": {
                "id": db_user.id,
                "email": db_user.email,
                "username": db_user.username,
                "full_name": db_user.full_name,
                "wingo_balance": db_user.wingo_balance
            },
            "token": access_token
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    finally:
        db.close()

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == form_data.username).first()
        
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )

        response = {"access_token": access_token, "token_type": "bearer"}
        print(f"Login successful for user: {user.email}")
        return response

    except Exception as e:
        print(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Login failed: {str(e)}"
        )

@app.get("/test")
async def test():
    return {"status": "ok", "message": "Server is working!"}

@app.get("/")
async def root():
    return FileResponse("api_test.html")

@app.get("/api")
async def api_root():
    return {"message": "Wingo API is running!"}

@app.get("/debug/users")
async def debug_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return {"users": users}

@app.get("/admin/users")
async def admin_users(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return {
        "users": [
            {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "wingo_balance": user.wingo_balance,
                "created_at": user.created_at
            }
            for user in users
        ]
    }

@app.get("/admin")
async def admin_page():
    return FileResponse("admin.html")

@app.get("/admin_submissions.html")
async def admin_submissions_page():
    return FileResponse("admin_submissions.html")

# Store password reset tokens (in production, use a database)
password_reset_tokens = {}

@app.post("/forgot-password")
async def forgot_password(request: PasswordResetRequest):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == request.email).first()
        if not user:
            raise HTTPException(
                status_code=404,
                detail="Email not found"
            )

        # Generate reset token
        token = secrets.token_urlsafe(32)
        password_reset_tokens[token] = {
            "email": user.email,
            "expires": datetime.utcnow() + timedelta(hours=1)
        }

        # Send reset email
        reset_link = f"http://localhost:5173/reset-password?token={token}"
        message = MIMEMultipart()
        message["From"] = "noreply@wingo.com"
        message["To"] = user.email
        message["Subject"] = "Reset Your Wingo Password"

        body = f"""
        Hello {user.username},

        You have requested to reset your password. Click the link below to reset your password:

        {reset_link}

        This link will expire in 1 hour.

        If you did not request this password reset, please ignore this email.

        Best regards,
        The Wingo Team
        """

        message.attach(MIMEText(body, "plain"))

        # For development, just print the reset link
        print(f"Password reset link: {reset_link}")

        return {"message": "Password reset instructions sent to your email"}
    finally:
        db.close()

@app.post("/reset-password")
async def reset_password(reset: PasswordReset):
    if reset.token not in password_reset_tokens:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired token"
        )

    token_data = password_reset_tokens[reset.token]
    if datetime.utcnow() > token_data["expires"]:
        del password_reset_tokens[reset.token]
        raise HTTPException(
            status_code=400,
            detail="Token has expired"
        )

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == token_data["email"]).first()
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        # Update password
        user.hashed_password = get_password_hash(reset.new_password)
        db.commit()

        # Remove used token
        del password_reset_tokens[reset.token]

        return {"message": "Password has been reset successfully"}
    finally:
        db.close()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Create submissions metadata file
SUBMISSIONS_FILE = Path(__file__).parent / "submissions.json"
if not SUBMISSIONS_FILE.exists():
    SUBMISSIONS_FILE.write_text("[]")

def save_submission(username: str, link: str, context: str, files: list, wingos: int):
    try:
        submissions = json.loads(SUBMISSIONS_FILE.read_text())
        submissions.append({
            "username": username,
            "link": link,
            "context": context,
            "files": files,
            "wingos": wingos,
            "submitted_at": datetime.utcnow().isoformat()
        })
        SUBMISSIONS_FILE.write_text(json.dumps(submissions, indent=2))
        print(f"Saved submission to {SUBMISSIONS_FILE}")
    except Exception as e:
        print(f"Error saving submission metadata: {str(e)}")

def get_submissions_metadata():
    try:
        if not SUBMISSIONS_FILE.exists():
            print(f"Submissions file not found at {SUBMISSIONS_FILE}")
            return []
        submissions = json.loads(SUBMISSIONS_FILE.read_text())
        print(f"Loaded {len(submissions)} submissions from {SUBMISSIONS_FILE}")
        return submissions
    except Exception as e:
        print(f"Error reading submission metadata: {str(e)}")
        return []

@app.post("/api/mine-wingo/submit")
async def submit_mining(
    link: Optional[str] = Form(None),
    context: Optional[str] = Form(None),
    wingos: int = Form(...),  # Make wingos required
    files: List[UploadFile] = File([]),
    current_user: User = Depends(get_current_user)
):
    try:
        print(f"Received submission from user: {current_user.username}")
        print(f"Link: {link}")
        print(f"Context: {context}")
        print(f"WINGOs: {wingos}")
        print(f"Number of files: {len(files)}")
        
        # Create a directory for this user's submissions
        user_dir = UPLOAD_DIR / current_user.username
        user_dir.mkdir(exist_ok=True)
        print(f"Created/accessed user directory: {user_dir}")
        
        # Save uploaded files
        saved_files = []
        for file in files:
            print(f"Processing file: {file.filename}")
            file_path = user_dir / file.filename
            print(f"Saving to: {file_path}")
            
            # Ensure the file has content
            content = await file.read()
            if not content:
                print(f"Warning: File {file.filename} is empty")
                continue
                
            # Write the file
            with file_path.open("wb") as buffer:
                buffer.write(content)
            
            # Verify the file was written
            if file_path.exists():
                print(f"Successfully saved file: {file_path}")
                saved_files.append(str(file_path))
            else:
                print(f"Failed to save file: {file_path}")
        
        print(f"Total files saved: {len(saved_files)}")
        print(f"Saved files: {saved_files}")
        
        # Save submission metadata
        save_submission(current_user.username, link, context, saved_files, wingos)
        
        return {
            "message": "Submission received by DAISY™",
            "details": {
                "link": link,
                "context": context,
                "wingos": wingos,
                "files": saved_files,
                "submitted_by": current_user.username,
                "submitted_at": datetime.utcnow().isoformat()
            }
        }
    except Exception as e:
        print(f"Error processing submission: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process submission: {str(e)}"
        )

@app.get("/admin/submissions")
async def get_submissions(current_user: User = Depends(get_current_user)):
    try:
        # Get all submissions from metadata
        submissions = get_submissions_metadata()
        
        # Add file details for each submission
        for submission in submissions:
            files = []
            # Only process files that were part of this submission
            for file_path in submission.get("files", []):
                path = Path(file_path)
                if path.exists():
                    files.append({
                        "filename": path.name,
                        "size": path.stat().st_size,
                        "path": str(path),
                        "type": path.suffix[1:] if path.suffix else "unknown"
                    })
            submission["files"] = files
        
        return {"submissions": submissions}
    except Exception as e:
        print(f"Error getting submissions: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get submissions: {str(e)}"
        )

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

application = WSGIMiddleware(app)