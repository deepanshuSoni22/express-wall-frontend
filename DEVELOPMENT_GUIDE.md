# Express Wall - Development Guide

**Version:** 1.0  
**Last Updated:** October 26, 2025  
**Target Audience:** Developers, AI Agents, Code Contributors

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Design Patterns](#architecture--design-patterns)
3. [Application Flow](#application-flow)
4. [Critical Dependencies](#critical-dependencies)
5. [State Management](#state-management)
6. [Routing & Navigation](#routing--navigation)
7. [Authentication & Session Management](#authentication--session-management)
8. [API Integration](#api-integration)
9. [Component Structure](#component-structure)
10. [Styling System](#styling-system)
11. [Safe Modification Guidelines](#safe-modification-guidelines)
12. [Common Pitfalls](#common-pitfalls)
13. [Testing Strategy](#testing-strategy)
14. [Performance Considerations](#performance-considerations)

---

## Project Overview

### Purpose
Express Wall is a mental wellness application that guides users through an emotional journey:
- **Express**: Users share their feelings (text, voice, or drawing)
- **Release**: Breathing exercises for emotional release
- **Rebuild**: Reflection and grounding activities
- **Growth**: Personalized course recommendations

### Tech Stack
- **Framework:** React 19.1.1 + TypeScript
- **Build Tool:** Vite 7.1.2
- **Routing:** React Router DOM 7.8.2
- **State Management:** React Context API + TanStack Query 5.87.4
- **Styling:** TailwindCSS 3.4.17 + Custom Design System
- **UI Components:** Radix UI + shadcn/ui
- **Backend API:** Django (http://localhost:8000)

---

## Architecture & Design Patterns

### 1. Layered Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Pages, Components, UI Elements)   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Business Logic Layer        │
│    (Hooks, Context, Services)       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│          Data Access Layer          │
│  (API Clients, Service Functions)   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Backend API (Django)        │
└─────────────────────────────────────┘
```

### 2. Key Design Patterns

#### Provider Pattern
- **SessionProvider**: Global session state management
- **QueryClientProvider**: React Query cache management
- **TooltipProvider**: UI tooltip context

#### Protected Route Pattern
- **ProtectedRoute**: Ensures user authentication
- **FlowProtectedRoute**: Enforces sequential flow stages

#### Service Layer Pattern
- All API calls isolated in `/services` directory
- Centralized error handling
- Consistent credential management

#### Lazy Loading Pattern
- Route-based code splitting
- Suspense boundaries with loading states

---

## Application Flow

### Stage-Based Progression System

```
┌──────────┐    ┌─────────┐    ┌─────────┐    ┌────────┐    ┌────────┐
│  Express │ -> │ Release │ -> │ Rebuild │ -> │ Growth │ -> │ Ending │
│ (Stage 0)│    │(Stage 1)│    │(Stage 2)│    │(Stage 3)│    │(Stage 4)│
└──────────┘    └─────────┘    └─────────┘    └────────┘    └────────┘
```

### Flow Enforcement Rules

**CRITICAL: DO NOT MODIFY WITHOUT UNDERSTANDING**

1. **Stage 0 (Express)**: Always accessible after login
2. **Stage 1 (Release)**: Requires `sessionData.expressChoice`
3. **Stage 2 (Rebuild)**: Requires `sessionData.releaseChoice`
4. **Stage 3 (Growth)**: Requires `sessionData.rebuildChoice`
5. **Stage 4 (Ending)**: Accessible from any Growth page

### Session Data Dependencies

```typescript
// Session progression is tracked in SessionContext
interface SessionData {
  expressChoice?: ExpressChoice;      // Unlocks Stage 1
  expressContent?: string;
  releaseChoice?: ReleaseChoice;      // Unlocks Stage 2
  rebuildChoice?: RebuildChoice;      // Unlocks Stage 3
  rebuildContent?: string;
  startTime?: Date;
  endTime?: Date;
  user?: {                            // Required for all stages
    id: number;
    name: string;
    mobile_number: string;
  };
}
```

### Navigation Flow

```
Public Routes:
  / (Home) -> /onboarding -> /register

Authenticated Routes:
  /express -> /release -> /rebuild -> /growth -> /ending
                                       ↓
                                  /growth/courses
                                       ↓
                            /growth/session/:sessionId
```

---

## Critical Dependencies

### Must-Have Dependencies

```json
{
  "@tanstack/react-query": "^5.87.4",     // API state management - DO NOT REMOVE
  "react-router-dom": "^7.8.2",            // Routing - CORE DEPENDENCY
  "@radix-ui/react-slot": "^1.2.3",       // UI primitives
  "@radix-ui/react-tooltip": "^1.2.8",    // Tooltips
  "sonner": "^2.0.7",                      // Toast notifications
  "lottie-react": "^2.4.1",               // Loading animations
  "ogl": "^1.0.11"                        // WebGL backgrounds
}
```

### When Adding New Dependencies

1. Check bundle size impact
2. Verify TypeScript support
3. Test with React 19 compatibility
4. Update package.json and lock file
5. Document usage in this guide

---

## State Management

### 1. Session Context (Global)

**Location:** `src/contexts/SessionContext.tsx`

**Purpose:** Tracks user journey through the app

**Critical Methods:**
```typescript
updateSession(data: Partial<SessionData>): void
resetSession(): void
```

**Usage Pattern:**
```typescript
const { sessionData, updateSession } = useSession();

// Always update session when user completes a stage
updateSession({ 
  expressChoice: 'write',
  expressContent: userInput 
});
```

**⚠️ WARNING:** Never reset session mid-flow unless user explicitly logs out.

### 2. React Query (Server State)

**Configuration:** `src/App.tsx`

**Use Cases:**
- API data fetching
- Cache management
- Background refetching
- Optimistic updates

**Pattern:**
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['recommendations', userId],
  queryFn: () => recommendationService.getRecommendations()
});
```

### 3. Local Component State

**Use `useState` for:**
- UI state (modals, dropdowns)
- Form inputs
- Transient data
- Animation states

**Use Context for:**
- Cross-page data
- User authentication
- Theme preferences
- Global settings

---

## Routing & Navigation

### Route Protection Hierarchy

```typescript
// App.tsx route structure
<Route element={<ProtectedRoute />}>              {/* Auth check */}
  <Route element={<FlowProtectedRoute stage={0} />}> {/* Stage check */}
    <Route path="/express" element={<Express />} />
  </Route>
</Route>
```

### Adding New Routes - Checklist

- [ ] Determine if route needs authentication
- [ ] Determine if route is part of the flow sequence
- [ ] Add to appropriate protection level
- [ ] Update `appFlow` array in FlowProtectedRoute if sequential
- [ ] Implement lazy loading for code splitting
- [ ] Add ScrollToTop reset
- [ ] Test forward/backward navigation
- [ ] Test direct URL access (should redirect appropriately)

### Navigation Patterns

```typescript
// Standard navigation
navigate('/next-page');

// With state (for conditional rendering)
navigate('/release', { state: { fromExpress: true } });

// With scroll reset
window.scrollTo(0, 0);
navigate('/next-page');
```

---

## Authentication & Session Management

### Session Flow

```
1. User visits site
   ↓
2. SessionChecker runs checkAuthStatus()
   ↓
3. Backend returns { authenticated: boolean, user?: User }
   ↓
4. If authenticated: updateSession({ user })
   ↓
5. Auto-redirect from public pages to /express
```

### Session Endpoints

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/api/session-status/` | GET | Check if user logged in | `{ authenticated, user? }` |
| `/api/register/` | POST | Create account + session | `{ status, user }` |
| `/api/logout/` | POST | Clear session | `{ status }` |

### Authentication Patterns

```typescript
// Check session (on app load)
const result = await authService.checkSession();

// Register new user
const result = await authService.register(name, mobile);

// Logout
const result = await authService.logout();
```

### Credential Management

**CRITICAL:** All API calls MUST include:
```typescript
{
  credentials: 'include',  // Sends cookies
  headers: { 'Content-Type': 'application/json' }
}
```

### Error Handling

```typescript
// Authentication errors trigger redirects
catch (error) {
  if (error instanceof AuthenticationError) {
    window.location.href = error.redirectTo || '/register';
  }
}
```

---

## API Integration

### Service Architecture

```
services/
├── authService.ts          # Authentication endpoints
├── recommendationService.ts # ML recommendations
├── audioService.ts         # Audio processing
└── apiClient.ts           # Shared HTTP client + error handling
```

### API Base URL

**Local Development:** `http://localhost:8000`

**IMPORTANT:** Update for production deployment in all service files.

### API Client Pattern

```typescript
// apiClient.ts provides centralized error handling
export const apiClient = async (path: string, options: RequestInit = {}) => {
  const response = await fetch(`http://localhost:8000${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });

  // Automatic 401 handling
  if (response.status === 401) {
    throw new AuthenticationError(data.message, data.redirect_to);
  }

  return response.json();
};
```

### Recommendation Service API

**Key Endpoints:**

1. **Prepare Recommendations** (Async Processing)
   ```typescript
   POST /api/prepare-recommendations/
   Body: { text?: string }
   Response: { status: 'processing', job_id }
   ```

2. **Get Recommendations** (Cached)
   ```typescript
   POST /api/recommendations/
   Body: { text?: string }
   Response: { recommendations: RecommendedSession[] }
   ```

3. **Get Session Details**
   ```typescript
   GET /api/sessions/:sessionId/
   Response: { session: Session }
   ```

### Backend Integration Checklist

When adding new API endpoints:

- [ ] Add to appropriate service file
- [ ] Include `credentials: 'include'`
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Show user feedback (toasts)
- [ ] Update TypeScript types
- [ ] Test authentication flow
- [ ] Test error scenarios

---

## Component Structure

### Component Categories

```
components/
├── ui/                    # Reusable UI primitives (shadcn/ui)
│   ├── button.tsx
│   ├── tooltip.tsx
│   └── sonner.tsx
├── [Feature]View.tsx      # Full-page feature components
│   ├── JournalView.tsx
│   ├── VoiceView.tsx
│   └── DrawingView.tsx
├── [Feature]Exercise.tsx  # Interactive experiences
│   └── BreathingExercise.tsx
├── ProtectedRoute.tsx     # Route guards
├── FlowProtectedRoute.tsx # Stage guards
└── Transition.tsx         # Page transitions
```

### Component Naming Conventions

- **Pages:** `PascalCase` (Express.tsx, Release.tsx)
- **Components:** `PascalCase` (JournalView.tsx)
- **Utilities:** `camelCase` (utils.ts)
- **Hooks:** `use[Feature]` (useSpeechSynthesis.ts)
- **Services:** `[feature]Service` (authService.ts)

### Component Best Practices

```typescript
// ✅ GOOD: Typed props with clear interface
interface JournalViewProps extends WithContinueProps {
  initialContent?: string;
}

export const JournalView = ({ onContinue, initialContent }: JournalViewProps) => {
  // Component logic
};

// ❌ BAD: Untyped props
export const JournalView = ({ onContinue, initialContent }) => {
  // Component logic
};
```

### Component Communication

```typescript
// Parent -> Child: Props
<JournalView onContinue={handleContinue} />

// Child -> Parent: Callbacks
const handleContinue = () => {
  updateSession({ expressContent: text });
  navigate('/release');
};

// Sibling -> Sibling: Context
const { sessionData } = useSession();
```

---

## Styling System

### Design System Overview

**Base:** TailwindCSS + Custom CSS Variables + Design Tokens

**Location:** `src/index.css`

### Color System

```css
/* Primary color is now a gradient */
--primary: linear-gradient(135deg, #7dd3fc, #bae6fd, #e0f2fe);
--primary-foreground: #ffffff;
--primary-foreground-dark: 0 0% 17%;  /* For text on light backgrounds */

/* Wellness colors */
--healing: 212 96% 78%;  /* Light blue */
--calm: 214 94% 67%;     /* Sky blue */
--warm: 198 93% 60%;     /* Cyan blue */
```

### Gradient Utilities

```css
/* Icon backgrounds */
.icon-gradient-blue { background: var(--gradient-icon-blue); }
.icon-gradient-sky { background: var(--gradient-icon-sky); }
.icon-gradient-indigo { background: var(--gradient-icon-indigo); }

/* Card backgrounds */
.card-gradient-bg { 
  @apply bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50;
}
```

### Component Classes

**CRITICAL: These classes are used throughout the app**

```css
/* Layout */
.page-shell            /* Full-page wrapper */
.page-inner            /* Content container */
.page-header           /* Page title section */

/* Cards */
.option-grid           /* Grid for option cards */
.option-card           /* Interactive choice card */
.option-card-icon      /* Card icon container */
.option-card-title     /* Card heading */
.option-card-desc      /* Card description */

/* Typography */
.display-hero          /* Large heading */
.display-section       /* Section heading */
.page-subtitle         /* Descriptive text */

/* Video backgrounds */
.page-with-video       /* Container for video bg */
.page-video-bg         /* Video element styling */

/* Buttons */
.clean-button          /* Primary white button */
.wellness-button       /* Alternative style */
```

### Animation Classes

```css
.breathe-animation     /* Gentle scale pulse */
.gentle-pulse          /* Opacity pulse */
.floating              /* Vertical float */
.breathe-in            /* Inhale animation */
.breathe-out           /* Exhale animation */
```

### Responsive Design

```typescript
// Mobile-first breakpoints
sm: '640px'   // Tablet
md: '768px'   // Small laptop
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
```

### Safe Style Modifications

**DO:**
- Add new utility classes
- Extend existing color palette
- Create component-specific classes
- Use Tailwind's `@apply` directive

**DON'T:**
- Remove core design tokens (--primary, --foreground, etc.)
- Delete animation keyframes (used in components)
- Change global font families without testing
- Remove viewport height utilities (.h-full-viewport)

---

## Safe Modification Guidelines

### Before Making Changes

1. **Understand the Impact**
   - Read this guide thoroughly
   - Check component dependencies
   - Review related files

2. **Check for Usage**
   ```bash
   # Search for component/function usage
   grep -r "ComponentName" src/
   
   # Or use VS Code search (Ctrl+Shift+F)
   ```

3. **Test Related Features**
   - Authentication flow
   - Navigation between stages
   - Session persistence
   - API calls

### Common Change Scenarios

#### Adding a New Page

```typescript
// 1. Create page component
const NewPage = lazy(() => import('./pages/NewPage'));

// 2. Determine protection level
// Is it public? -> Add outside ProtectedRoute
// Does it require auth? -> Inside ProtectedRoute
// Is it part of flow? -> Inside FlowProtectedRoute with stage number

// 3. Add route
<Route element={<ProtectedRoute />}>
  <Route element={<FlowProtectedRoute stage={X} />}>
    <Route path="/new-page" element={<NewPage />} />
  </Route>
</Route>

// 4. Update session data types if needed (src/types/index.ts)
// 5. Update flow enforcement in FlowProtectedRoute if sequential
```

#### Modifying Session Flow

```typescript
// ⚠️ HIGH RISK - Test thoroughly

// 1. Update SessionData interface in src/types/index.ts
export interface SessionData {
  // Add new fields
  newField?: string;
}

// 2. Update FlowProtectedRoute logic
// Adjust userMaxAllowedStage calculation

// 3. Update all pages that set session data
updateSession({ newField: value });

// 4. Test entire flow from Express to Ending
```

#### Adding New API Endpoints

```typescript
// 1. Add to appropriate service file
export const newService = {
  async newEndpoint(data: DataType) {
    const response = await fetch('http://localhost:8000/api/new-endpoint/', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

// 2. Add TypeScript types
export interface NewDataType {
  field: string;
}

// 3. Use with React Query
const { data } = useQuery({
  queryKey: ['new-data'],
  queryFn: () => newService.newEndpoint(params)
});
```

#### Modifying Styles

```typescript
// SAFE: Add new classes
.my-new-class {
  @apply bg-blue-50 text-gray-700 rounded-lg;
}

// RISKY: Modifying existing classes
// Check usage first!
.option-card {
  // Don't change without checking all usages
}

// SAFE: Extend Tailwind config
// tailwind.config.ts
extend: {
  colors: {
    'my-color': '#hexcode'
  }
}
```

---

## Common Pitfalls

### 1. Breaking Session Flow

**Problem:** Modifying FlowProtectedRoute without updating session data checks

**Solution:** Always update both session data structure and flow logic together

```typescript
// ❌ BAD: Added new stage but forgot to update checks
if (sessionData.rebuildChoice) userMaxAllowedStage = 3;
// Missing: if (sessionData.growthComplete) userMaxAllowedStage = 4;

// ✅ GOOD: Complete update
if (sessionData.rebuildChoice) userMaxAllowedStage = 3;
if (sessionData.growthComplete) userMaxAllowedStage = 4;
```

### 2. Missing Credentials in API Calls

**Problem:** API returns 401 because cookies not sent

**Solution:** Always include `credentials: 'include'`

```typescript
// ❌ BAD
fetch('http://localhost:8000/api/endpoint/')

// ✅ GOOD
fetch('http://localhost:8000/api/endpoint/', {
  credentials: 'include'
})
```

### 3. Navigation Without Scroll Reset

**Problem:** User navigates but sees middle of next page

**Solution:** Always reset scroll before navigation

```typescript
// ❌ BAD
navigate('/next-page');

// ✅ GOOD
window.scrollTo(0, 0);
navigate('/next-page');
```

### 4. Forgetting Loading States

**Problem:** App feels broken during API calls

**Solution:** Always handle loading and error states

```typescript
// ❌ BAD
const { data } = useQuery({ queryKey: ['data'], queryFn: fetchData });
return <div>{data.value}</div>; // Crashes before data loads

// ✅ GOOD
const { data, isLoading, error } = useQuery({ 
  queryKey: ['data'], 
  queryFn: fetchData 
});

if (isLoading) return <LoaderOverlay />;
if (error) return <ErrorMessage error={error} />;
return <div>{data.value}</div>;
```

### 5. Hardcoding Stage Numbers

**Problem:** Adding new stage breaks all subsequent stages

**Solution:** Use constants or enums

```typescript
// ❌ BAD
<Route element={<FlowProtectedRoute stage={2} />}>

// ✅ BETTER
const STAGES = {
  EXPRESS: 0,
  RELEASE: 1,
  REBUILD: 2,
  GROWTH: 3,
  ENDING: 4
};

<Route element={<FlowProtectedRoute stage={STAGES.REBUILD} />}>
```

### 6. Removing CSS Classes Without Checking Usage

**Problem:** Deleting `.option-card` breaks all option pages

**Solution:** Search for usage before deleting

```bash
# Check usage
grep -r "option-card" src/

# If used, refactor instead of delete
# If not used, safe to delete
```

### 7. Not Testing Authentication Flow

**Problem:** Changes break login/logout

**Solution:** Always test these scenarios:
- [ ] User can register
- [ ] User can logout
- [ ] Session persists on refresh
- [ ] Protected routes redirect to login
- [ ] Flow stages enforce progression

---

## Testing Strategy

### Manual Testing Checklist

Before committing changes, test:

#### Authentication Flow
- [ ] Registration works
- [ ] Session persists on refresh
- [ ] Logout clears session
- [ ] Direct URL access redirects appropriately

#### Stage Progression
- [ ] Can access Express after login
- [ ] Cannot skip to Release without completing Express
- [ ] Cannot skip to Rebuild without completing Release
- [ ] Cannot skip to Growth without completing Rebuild
- [ ] Can access Ending from Growth pages

#### Navigation
- [ ] Back button works correctly
- [ ] Forward navigation works
- [ ] Direct URL access respects permissions
- [ ] Scroll resets on navigation

#### API Integration
- [ ] All API calls succeed
- [ ] Loading states display
- [ ] Error states handled gracefully
- [ ] Toast notifications appear

#### Responsive Design
- [ ] Mobile (375px) renders correctly
- [ ] Tablet (768px) renders correctly
- [ ] Desktop (1440px) renders correctly

### Automated Testing (Future)

Recommended test coverage:
- Unit tests for utilities and hooks
- Integration tests for services
- E2E tests for critical flows
- Component tests for UI elements

---

## Performance Considerations

### Current Optimizations

1. **Code Splitting:** All pages lazy-loaded
2. **Debounced Loading:** GlobalLoader prevents flash
3. **React Query Caching:** Reduces API calls
4. **Video Optimization:** `preload="auto"` for smooth playback

### Performance Guidelines

**DO:**
- Use React.memo for expensive components
- Implement virtualization for long lists
- Optimize images and videos
- Use CSS animations over JS when possible

**DON'T:**
- Load all routes upfront
- Make redundant API calls
- Use inline functions in render loops
- Render large lists without pagination

### Bundle Size Monitoring

```bash
# Build and analyze
npm run build

# Check bundle size
ls -lh dist/assets/

# Keep main bundle under 500KB gzipped
```

---

## Quick Reference

### File Locations

| What | Where |
|------|-------|
| Pages | `src/pages/` |
| Components | `src/components/` |
| API Services | `src/services/` |
| Type Definitions | `src/types/` |
| Hooks | `src/hooks/` |
| Context | `src/contexts/` |
| Styles | `src/index.css` |
| Config | `vite.config.ts`, `tailwind.config.ts` |

### Key Files to Review Before Major Changes

1. `src/App.tsx` - Routing structure
2. `src/contexts/SessionContext.tsx` - State management
3. `src/components/FlowProtectedRoute.tsx` - Flow logic
4. `src/types/index.ts` - Type definitions
5. `src/index.css` - Design system

### Environment Variables

```bash
# Add to .env.local (create if doesn't exist)
VITE_API_URL=http://localhost:8000
```

### Dev Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Check linting
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Oct 26, 2025 | Initial documentation |

---

## Contributing

When making changes:

1. Read relevant sections of this guide
2. Update this guide if patterns change
3. Test thoroughly (see Testing Strategy)
4. Document breaking changes
5. Update version history

---

## Support

For questions or clarifications about this codebase, refer to:
- This development guide
- Inline code comments
- TypeScript type definitions
- Git commit history

---

**Remember:** This application handles sensitive emotional content. Changes should prioritize user safety, privacy, and experience above all else.
