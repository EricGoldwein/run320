# WINGO Project Rulebook

## Introduction

The WINGO project is the digital backbone of the 320 Track Club, a unique running community based in Brooklyn, New York. The club is centered around the iconic Wingate Track, a 320-meter track that serves as the heart of the community. The project is managed by DAISY™ (Digital Athletic Intelligence System), an AI coach that oversees the WINGO ecosystem.

## Core Concepts

### The 320 Track Club
- A Brooklyn-based running community
- No dues, no merch, no sponsors
- Centered around the 320-meter Wingate Track
- Focus on workout independence and community

### WINGO Token
- Native token of the 320 Track Club ecosystem
- Tokens can be earned through multiple activities:
  - Mining (primary method)
  - Bets
  - Prizes
  - Other activities

### DAISY™ (Digital Athletic Intelligence System)
- AI coach managing the WINGO ecosystem
- Validates mining submissions
- Tracks user progress
- Manages the WINGO economy

## Mining System

### Mining Requirements
- Must complete Wingate Track segments
- Each mining submission requires:
  - Strava activity link (string, URL format)
  - Context/description (string, max 500 characters)
  - WINGO amount (non-negative integer, no decimals)
    - Note: Future versions may support fractional WINGO for partial loops
  - Optional GPX files
    - Max file size: 10MB
    - Allowed formats: .gpx only
    - Max files per submission: 5

### Mining Validation
- WINGO amount must be a non-negative integer
- Submissions are stored with metadata:
  - Username (string)
  - Link (string, URL)
  - Context (string)
  - Files (array of file paths)
  - WINGO amount (integer)
  - Submission timestamp (ISO 8601 format)

## User System

### Authentication
- Users must register with:
  - Email
  - Username
  - Full name
  - Password
- JWT-based authentication system
- Token expiration: 30 minutes
- Password reset functionality available

### User Profile
- Each user has:
  - Current WINGO balance
  - Total mined WINGO
  - Total distance covered
  - Mining history

## Wallet System

### Balance Types
1. Current Balance
   - Total WINGO including all activities
   - Includes mining, bets, prizes, etc.

2. Total Mined
   - WINGO earned through mining only
   - Tracks mining-specific earnings

3. Total Distance
   - Distance covered while mining
   - Measured in kilometers

### Transaction History
- Tracks all WINGO movements
- Includes mining rewards
- Includes bets and prizes
- Timestamped entries

## Ledger System

### Global Statistics
1. Total WINGO in Circulation
   - All WINGO from all sources
   - Includes mining, bets, prizes

2. Total WINGO Mined
   - Total WINGO earned through mining
   - Mining-specific metric

3. Total Distance
   - Total distance covered by all miners
   - Global mining activity metric

### User Balances Table
- Shows all users' balances
- Includes:
  - Rank (integer, 1-based)
  - Username (string)
  - Current Balance (integer)
  - Total Mined (integer)
  - Distance (float, kilometers)
  - Last Mined (timestamp)
  - Share (float, percentage of total mined WINGO)
    - Calculated as: (user's total mined / total WINGO mined) * 100
    - Rounded to 2 decimal places

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

### Submissions Table
```sql
CREATE TABLE submissions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    strava_link TEXT NOT NULL,
    context TEXT,
    wingo_amount INTEGER NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Files Table
```sql
CREATE TABLE files (
    id INTEGER PRIMARY KEY,
    submission_id INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES submissions(id)
);
```

### Balances Table
```sql
CREATE TABLE balances (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    current_balance INTEGER DEFAULT 0,
    total_mined INTEGER DEFAULT 0,
    total_distance FLOAT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Developer Warnings

### Database Limitations
- SQLite is used for development and initial deployment
- No concurrent writes support
- Consider migration to PostgreSQL for production scale
- File storage is local; consider S3 for production

### Authentication
- JWT tokens expire after 30 minutes
- Implement token refresh mechanism for long sessions
- Store refresh tokens securely

### Performance Considerations
- Index frequently queried fields
- Implement caching for global statistics
- Consider rate limiting for API endpoints
- Monitor file storage growth

### Future Scalability
- Plan for PostgreSQL migration
- Consider S3 for file storage
- Implement proper connection pooling
- Add monitoring and logging infrastructure

## Technical Infrastructure

### File Management
- Uploads directory structure:
  - User-specific directories
  - GPX files stored per user
  - Metadata stored in submissions.json

### API Endpoints
- `/api/mine-wingo/submit`: Mining submissions
- `/me`: User profile
- `/admin/submissions`: Admin view of submissions
- `/admin/users`: Admin view of users

### Security
- JWT-based authentication
- Password hashing using bcrypt
- CORS enabled for development
- File upload validation
- Input validation for all submissions

## Admin Features

### Submission Management
- View all submissions
- Track submission metadata
- Monitor user activity
- Access to user balances

### User Management
- View all users
- Monitor user balances
- Track user activity
- Access to submission history

## Development Guidelines

### Frontend
- React-based components
- Tailwind CSS for styling
- Responsive design
- Real-time updates

### Backend
- FastAPI framework
- SQLite database
- JWT authentication
- File handling system

### Data Flow
1. User submits mining activity
2. Backend validates and stores submission
3. Updates user balance
4. Updates global statistics
5. Frontend reflects changes

## Community Guidelines

### Track Etiquette
- Respect other runners
- Follow track direction
- Maintain proper spacing
- Clean up after yourself

### Mining Guidelines
- Submit accurate activity data
- Provide clear context
- Follow fair mining practices
- Respect the community

### Communication
- Use appropriate language
- Be respectful to other members
- Follow DAISY™'s guidance
- Report issues promptly

## Future Developments

### Planned Features
- Enhanced mining rewards
- Community events
- Betting system
- Prize distribution
- Voting system

### Technical Roadmap
- Improved validation
- Enhanced security
- Better performance
- More user features

This rulebook serves as a living document and will be updated as the 320 Track Club and WINGO ecosystem evolve. For questions or clarifications, please contact DAISY™ or the development team. 