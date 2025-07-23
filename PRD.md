# News Aggregator - Product Requirements Document

A clean, focused daily news aggregator that curates 2 articles per day from user-specified sources.

**Experience Qualities**:
1. **Curated** - Deliberate selection creates signal over noise for busy readers
2. **Minimal** - Clean interface eliminates distractions and focuses on content
3. **Reliable** - Consistent daily delivery builds trust and reading habits

**Complexity Level**: Light Application (multiple features with basic state)
- Manages URL sources, fetches content, displays articles with basic persistence for user preferences

## Essential Features

### Source Management
- **Functionality**: Add, remove, and manage news source URLs
- **Purpose**: User controls their content diet and trusted sources
- **Trigger**: Settings panel or dedicated sources page
- **Progression**: View sources → Add URL → Validate → Save → Display in list → Remove option
- **Success criteria**: URLs persist, validation prevents broken sources

### Daily Article Curation
- **Functionality**: Automatically select 2 articles from available sources each day
- **Purpose**: Prevent information overload while ensuring variety
- **Trigger**: Page load or manual refresh
- **Progression**: Load sources → Fetch recent articles → Apply selection algorithm → Display results
- **Success criteria**: Always shows exactly 2 articles, rotates sources fairly

### Article Display
- **Functionality**: Show article title, source, summary, and link to original
- **Purpose**: Quick scanning with option to read full content
- **Trigger**: Automatic on app load
- **Progression**: Display cards → Click title → Open original article → Return to app
- **Success criteria**: Clear hierarchy, readable summaries, working external links

### Reading Progress
- **Functionality**: Mark articles as read/unread
- **Purpose**: Track consumption and avoid re-reading
- **Trigger**: Click read toggle or automatic on external link click
- **Progression**: View article → Mark read → Visual state change → Persist status
- **Success criteria**: State persists across sessions, clear visual distinction

## Edge Case Handling

- **Source Unavailable**: Graceful fallback to other sources with user notification
- **No New Content**: Display message with last successful fetch time
- **Invalid URLs**: Validation feedback and removal of broken sources
- **Network Issues**: Cached content display with offline indicator
- **Rate Limiting**: Respect source limits with intelligent fetch timing

## Design Direction

The design should feel trustworthy and professional like a premium news service, with clean typography that prioritizes readability over flashy elements.

## Color Selection

Complementary (opposite colors) - Using a sophisticated blue/orange pairing to create trust (blue) with selective highlighting (orange) for key actions and read states.

- **Primary Color**: Deep Blue (oklch(0.4 0.15 240)) - Communicates trust and authority
- **Secondary Colors**: Light grays (oklch(0.95 0 0)) for backgrounds and subtle elements
- **Accent Color**: Warm Orange (oklch(0.7 0.15 40)) - Attention-grabbing for CTAs and read indicators
- **Foreground/Background Pairings**: 
  - Background (White oklch(1 0 0)): Dark Gray text (oklch(0.2 0 0)) - Ratio 16.0:1 ✓
  - Primary (Deep Blue oklch(0.4 0.15 240)): White text (oklch(1 0 0)) - Ratio 7.2:1 ✓
  - Accent (Warm Orange oklch(0.7 0.15 40)): White text (oklch(1 0 0)) - Ratio 4.8:1 ✓
  - Card (Light Gray oklch(0.98 0 0)): Dark Gray text (oklch(0.2 0 0)) - Ratio 15.1:1 ✓

## Font Selection

Typography should convey authority and readability with a modern serif for headlines to suggest journalistic credibility and clean sans-serif for body text.

- **Typographic Hierarchy**:
  - H1 (App Title): Playfair Display Bold/32px/tight letter spacing
  - H2 (Article Headlines): Playfair Display SemiBold/24px/normal spacing
  - Body (Article Text): Inter Regular/16px/1.5 line height
  - Caption (Sources/Meta): Inter Medium/14px/muted color

## Animations

Subtle functionality-focused animations that guide attention during content updates and provide satisfying feedback for interactions without drawing attention to themselves.

- **Purposeful Meaning**: Gentle fade-ins for new content communicate freshness, quick state transitions for read/unread provide immediate feedback
- **Hierarchy of Movement**: Article loading gets primary animation focus, secondary interactions use subtle scale/color changes

## Component Selection

- **Components**: Card (article display), Button (actions), Input (URL entry), Badge (source labels), Separator (content division), Dialog (source management)
- **Customizations**: Custom article card layout with image, metadata, and action states
- **States**: Cards have hover elevation, buttons show clear pressed states, inputs validate in real-time
- **Icon Selection**: Plus (add source), X (remove), ExternalLink (read more), Check (mark read)
- **Spacing**: Consistent 4/6/8 unit spacing scale (16px/24px/32px) with generous whitespace
- **Mobile**: Single column layout, touch-friendly buttons (44px minimum), collapsible source management