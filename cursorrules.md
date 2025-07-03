# Cursor Rules for WINGO Development

## 🏃‍♂️ Project Overview
WINGO is the digital token of the 320 Track Club, a Brooklyn-based running community centered around the 320-meter Wingate Track. The project is managed by DAISY™ (Data Activiated Individualized System for You), an AI Horse coach overseeing the WINGO ecosystem.

## ⚡ Quick Reference

### Essential Commands
```bash
# Backend
cd backend; python -m uvicorn main:app --reload --host 127.0.0.1 --port 3000

# Frontend  
cd wingo-bets; npm run dev

# Git (PowerShell)
git add .; git commit -m "message"; git push origin main
```

### Key Styling Patterns
```jsx
// WINGO branding
<span className="text-[#E6C200] font-bold">W</span>INGO

// Card layout
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

// DAISY™ branding
D<span className="text-cyan-600">AI</span>SY™
```

### Data Sources
- **Live Data**: Google Sheets → CSV → React
- **Static Data**: `/public/*.csv` files
- **User Data**: FastAPI backend + JWT
- **Assets**: `/public/avatars/` + Vercel CDN

## 🏆 What is WINGO?

### Core Concept
WINGO (Workout Independence Network Gains and Optimization) is the official token of the 320 Track Club. It's earned by completing the 320-meter lap at Wingate Track in Brooklyn.

**Key Principles:**
- Each Wingo (320m) = 1 W
- No fees. No purchases. No membership tier systems
- Just a loop, a dream, and a priceless, valueless token
- This isn't crypto. This isn't Web3. This is Web320

### WINGO Benefits
WINGO is your key to the 320 Track Club. Membership (1 W) perks include:
- Placement in the WINGO Ledger — updated live(ish) by Coach DAISY™
- Access to exclusive experiences like the Old Balance Wingate Invitational and 320 Day
- DAISY™-Daniels-powered race projections, pace generator tools, and custom workouts
- Wingocracy: voting rights on club decisions — 1 W = 1 vote
- WINGO Wager World: bet on friends using the proprietary DAISY™-degenerate formula

**Important:** WINGO cannot be traded or cashed out. 1 WINGO = 1 WINGO. That's all it will ever be.

### Coach DAISY™
Coach DAISY™ is an equine-powered AI coach and the benevolent overseer of the entire WINGO economy. All appeals go through the Centairenarian.

### Mining WINGO
- **How**: Complete the official 320-meter Wingo segment at Wingate Track
- **Rate**: Each verified Wingo = 1 W
- **Start**: Run 1 Initiation Wingo and text Coach DAISY™ (929-WAK-GRIG) your receipts
- **Verification**: Submissions are reviewed. False attempts will be rejected
- **Bonus**: Complete Daisy's Yellowstone Adventure for 5 W (one-time only)

### Mining Rules
- **No caps**: No daily limits or performance minimums
- **All movement counts**: Run, walk, or limp — still 1 W
- **No speed bonus**: No extra credit for speed or style
- **Bikers excluded**: Only foot-based movement counts
- **No retroactive mining**: Clock starts after initiation
- **No data = no WINGO**: Unless it's on video

## 🏗️ Architecture & Structure

### Directory Organization
```
wingo/
├── backend/           # Python FastAPI server
│   ├── main.py       # Main server file
│   └── requirements.txt
└── wingo-bets/       # React TypeScript frontend
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── pages/        # Route components
    │   ├── types/        # TypeScript interfaces
    │   ├── contexts/     # React contexts
    │   └── services/     # API services
    └── public/           # Static assets & CSV data
```

### Current Site Architecture

#### Data Sources & Integration
- **Google Sheets**: Primary data source for ledger and transaction logs
  - Auto-refreshes every 30 seconds
  - CSV export via Google Sheets API
  - Real-time leaderboard and mining activity
- **Static CSV Files**: DVOT tables and pace data in `/public/`
  - `vdot_full_race_times.csv` - Race time predictions
  - `vdot_paces.csv` - Training pace recommendations
  - Parsed with Papa Parse library
- **User Avatars**: Stored in `/public/avatars/`
  - Username-to-avatar mapping system
  - Generic fallback for missing avatars
  - Interactive modal display

#### Deployment & Infrastructure
- **Frontend**: React app deployed on Vercel
- **Static Assets**: Served from Vercel's CDN
- **Backend**: FastAPI server (local development on port 3000)
- **Authentication**: JWT-based with 30-minute expiration
- **File Uploads**: GPX files for mining submissions

#### Data Flow
```
Google Sheets → CSV Export → React App (Ledger/Log)
Static CSV Files → React App (DVOT Tables)
User Input → FastAPI Backend → Database
Avatar Images → Vercel CDN → React App
```

### Server Setup Rules
- **Backend**: `cd backend; python -m uvicorn main:app --reload --host 127.0.0.1 --port 3000`
- **Frontend**: `cd wingo-bets; npm run dev` (runs on localhost:5173)
- **PowerShell**: Use `;` instead of `&&` for command chaining

## 🎨 Styling Standards

### WINGO Branding
```jsx
// WINGO in titles (gold W, bold)
<span className="text-[#E6C200] font-bold">W</span>INGO

// WINGO in body text (bold W, normal INGO)
<span className="font-bold">W</span>INGO

// Single W for balance display
<span className="text-[#E6C200] font-bold">W</span>

// DAISY™ with cyan AI
D<span className="text-cyan-600">AI</span>SY™
```

### Color Palette
- **Primary Gold**: `#E6C200` (WINGO branding)
- **Text Primary**: `text-gray-900` (headings)
- **Text Secondary**: `text-gray-600` or `text-gray-700` (body)
- **Links**: `text-wingo-600` with hover `text-wingo-700`
- **Background**: `bg-white` with `border-gray-100`

### Component Patterns
```jsx
// Card layout
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

// Section headers
<h2 className="text-2xl font-bold text-gray-900 mb-4">

// Navigation links
<Link to="/path" className="text-wingo-600 hover:text-wingo-700">
```

## 💻 Code Standards

### TypeScript & React
- Use functional components with hooks
- Define proper interfaces for all props
- Use strict TypeScript configuration
- Prefer `useState`, `useEffect`, `useContext` patterns

### Styling Approach
- **Primary**: Tailwind CSS classes
- **Avoid**: Custom CSS unless absolutely necessary
- **Responsive**: Mobile-first design approach
- **Accessibility**: Semantic HTML with proper ARIA labels

### File Naming
- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Pages: `kebab-case.tsx` (e.g., `user-profile.tsx`)
- Types: `index.ts` in types directory
- Services: `camelCase.ts` (e.g., `authService.ts`)

## 🤖 AI Coding Guidelines

### When Creating New Components
1. **Always start with TypeScript interface** for props
2. **Use existing patterns** from similar components in the codebase
3. **Follow the established styling** - don't invent new patterns
4. **Include proper error handling** and loading states
5. **Test mobile responsiveness** by default

### When Modifying Existing Code
1. **Preserve existing patterns** unless explicitly asked to change
2. **Maintain WINGO branding** consistency
3. **Keep the same file structure** and naming conventions
4. **Don't break existing functionality** without confirmation

### Common Implementation Patterns

#### User Authentication Flow
```tsx
// Always check for user authentication
const { user } = useAuth();
if (!user) return <Navigate to="/login" />;

// Use proper loading states
const [isLoading, setIsLoading] = useState(true);
if (isLoading) return <LoadingSpinner />;
```

#### Data Fetching Pattern
```tsx
// Use this pattern for CSV data fetching
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/data.csv');
      if (!response.ok) throw new Error('Failed to fetch');
      const text = await response.text();
      // Parse CSV with Papa.parse
    } catch (err) {
      console.error('Error:', err);
    }
  };
  fetchData();
}, []);
```

#### Error Handling Pattern
```tsx
// Always include error boundaries
const [error, setError] = useState<string | null>(null);
if (error) return <ErrorMessage message={error} />;
```

### Decision Making Guidelines

#### When to Use Which Component
- **Cards**: Use for displaying user stats, balances, or grouped information
- **Tables**: Use for ledger data, race times, or structured data
- **Modals**: Use for detailed views, forms, or confirmations
- **Forms**: Use existing form patterns from register/login components

#### When to Add New Files vs Modify Existing
- **New feature**: Create new page/component
- **Bug fix**: Modify existing file
- **Styling update**: Modify existing file
- **New data source**: Add to existing service or create new service

#### Mobile-First Considerations
- **Always test on mobile first**
- **Use responsive classes**: `sm:`, `md:`, `lg:` prefixes
- **Keep text readable**: Minimum 14px for body text
- **Touch-friendly**: Minimum 44px for interactive elements

### Code Quality Checklist
Before suggesting any code changes, ensure:
- [ ] TypeScript interfaces are properly defined
- [ ] Error handling is included
- [ ] Loading states are implemented
- [ ] Mobile responsiveness is considered
- [ ] WINGO branding is consistent
- [ ] Existing patterns are followed
- [ ] No console errors are introduced

## 🔧 Development Workflow

### Git Practices
- **Commits**: Use conventional prefixes (`feat:`, `fix:`, `style:`, `refactor:`)
- **Messages**: Explain "why" not just "what"
- **Atomic**: Keep commits focused on single features/fixes
- **Branch**: Work on feature branches, merge to main

### Testing Checklist
- [ ] Test on mobile and desktop
- [ ] Check browser console for errors
- [ ] Verify CSV data integrity
- [ ] Test user authentication flows
- [ ] Validate form inputs and error handling

### Performance Guidelines
- Implement loading states for async operations
- Use proper React hooks (avoid unnecessary re-renders)
- Optimize images and assets
- Cache frequently accessed data
- Handle API errors gracefully

## 📊 Data Management

### CSV Files
- Store in `/public/` directory for client-side access
- Use Google Sheets as primary data source for live data
- Implement proper error handling for CSV parsing
- Validate data integrity before processing

### API Integration
- Use proper error boundaries
- Implement retry logic for failed requests
- Cache responses when appropriate
- Handle loading and error states

## 🏆 Core Concepts

### WINGO Token System
- **Mining**: Primary earning method through track segments
- **Balance**: Total WINGO including all activities
- **Mined**: WINGO earned through mining only
- **Distance**: Kilometers covered while mining

### User Authentication
- JWT-based system with 30-minute expiration
- Required fields: email, username, full name, password
- Password reset functionality available
- Proper session management

### DAISY™ Integration
- AI coach manages WINGO ecosystem
- Validates mining submissions
- Tracks user progress and statistics
- Manages the overall WINGO economy

## 🚨 Common Pitfalls

### Server Issues
- ❌ Running uvicorn from root directory
- ❌ Using `&&` in PowerShell (use `;`)
- ❌ Not checking error messages before proceeding

### Code Issues
- ❌ Mixing WINGO styling patterns
- ❌ Forgetting DAISY™ ™ symbol
- ❌ Not handling loading/error states
- ❌ Ignoring mobile responsiveness

### Data Issues
- ❌ Not validating user inputs
- ❌ Missing error handling for CSV parsing
- ❌ Not caching frequently accessed data
- ❌ Exposing sensitive data in client-side code

## 🔧 Troubleshooting

### Common Error Messages & Solutions

#### "Error loading ASGI app. Could not import module 'main'"
**Solution**: You're in the wrong directory. Run `cd backend` first.

#### "Port 5173 is in use"
**Solution**: The frontend will automatically use port 5174. Check the terminal output.

#### "Cannot find path 'backend/backend'"
**Solution**: You're already in the backend directory. Just run the uvicorn command.

#### CSV Parsing Errors
**Solution**: Check that CSV files are in `/public/` directory and have proper headers.

#### Avatar Not Loading
**Solution**: Check username mapping in `getAvatarForUser()` function and ensure avatar file exists in `/public/avatars/`.

### Environment-Specific Notes

#### Development Environment
- Backend runs on `127.0.0.1:3000`
- Frontend runs on `localhost:5173`
- Use `;` for command chaining in PowerShell
- CSV files served from local `/public/` directory

#### Production Environment (Vercel)
- Static assets served from Vercel CDN
- Google Sheets integration for live data
- JWT tokens have 30-minute expiration
- File uploads handled by FastAPI backend

## 📚 Documentation

### Component Documentation
- Document all props with TypeScript interfaces
- Include usage examples
- Document any special behaviors or edge cases
- Keep JSDoc comments updated

### Update This File
- Add new patterns as they emerge
- Update rules based on team feedback
- Keep examples current with codebase
- Document breaking changes

---

**Remember**: WINGO is about workout independence and community. Keep the code clean, the UX smooth, and the community engaged! 🏃‍♂️💨 