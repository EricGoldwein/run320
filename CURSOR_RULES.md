# Cursor Rules for WINGO Project

## Styling Rules

### ΩWINGO Styling
1. The Ω symbol must always be styled in saddle brown:
   ```jsx
   <span className="text-[#8B4513]">Ω</span>
   ```
2. The "WINGO" part must always be styled in dark/black:
   ```jsx
   <span className="text-gray-900">WINGO</span>
   ```
3. When used together, they should be wrapped separately:
   ```jsx
   <span className="text-[#8B4513]">Ω</span><span className="text-gray-900">WINGO</span>
   ```

### WINGO Styling
1. The WINGO symbol should be styled as a bold gold "W" with color #E6C200
2. The "W" should be bold but use normal font family
3. No drop shadow or size adjustments needed
4. The rest of "INGO" should be in normal text

### Text Colors
1. Regular text: `text-gray-600` or `text-gray-700`
2. Headings: `text-gray-900`
3. Links: `text-wingo-600` with hover `text-wingo-700`
4. Balance/Mined/Distance values: `text-gray-900`

## Terminology Rules
1. "WINGO" (without Ω) refers to the lap/activity
2. "ΩWINGO" refers to the token
3. "Experiences" is used instead of "Events"
4. "DAISY™" is the AI coach and should always include the ™ symbol

## File Organization
1. Components are in `wingo-bets/src/components/`
2. Pages are in `wingo-bets/src/pages/`
3. Types are in `wingo-bets/src/types/`

## Code Style
1. Use TypeScript for all components
2. Use Tailwind CSS for styling
3. Follow React functional component patterns
4. Use proper TypeScript interfaces for props

## Common Patterns
1. Card layouts use:
   ```jsx
   <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
   ```
2. Section headers use:
   ```jsx
   <h2 className="text-2xl font-bold text-gray-900 mb-4">
   ```
3. Links use:
   ```jsx
   <Link to="/path" className="text-wingo-600 hover:text-wingo-700">
   ```

## Error Handling
1. Always check for user authentication
2. Handle loading states
3. Provide fallback UI for missing data
4. Use proper error boundaries

## Performance Guidelines
1. Use proper React hooks
2. Implement proper loading states
3. Optimize images and assets
4. Use proper caching strategies

## Accessibility
1. Use semantic HTML
2. Include proper ARIA labels
3. Ensure proper color contrast
4. Support keyboard navigation

## Testing
1. Write unit tests for components
2. Test user interactions
3. Verify styling consistency
4. Check responsive design

## Documentation
1. Document component props
2. Include usage examples
3. Document any special behaviors
4. Keep this rulebook updated

This rulebook should be updated as new patterns and rules are established. 