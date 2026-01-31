# Implementation Plan: RAG-Lite Next.js App (Revised)

## 1. Final Technical Stack
- **Framework:** Next.js 16 (Turbopack)
- **AI Provider:** **Anthropic (Claude 3 Haiku)**
  - *Adjustment:* Switched from Sonnet 3.5 to Haiku 3.0 to ensure 100% compatibility with standard API keys and faster response times.
- **AI SDK:** Vercel AI SDK (Pinned to stable: `ai@4.1.20`, `@ai-sdk/react@1.1.20`)
- **Styling:** Tailwind CSS 4 (Modern CSS-first approach)

## 2. Completed Phases

### Phase 1: Core Logic
- [x] **File Reader:** Implementation in `src/lib/context.ts` reads `/data` recursively.
- [x] **API Route:** `src/app/api/chat/route.ts` handles streaming and Haiku model logic.

### Phase 2: User Interface
- [x] **"Command Centre" Layout:** Redesigned for high accessibility and no overlap with dev tools.
- [x] **Resilient Submission:** Input state handled locally to bypass experimental hook issues.
- [x] **Brutalist Theme:** High-contrast B&W design for professional appearance.

### Phase 3: Stabilization
- [x] **SDK Downgrade:** Successfully reverted from experimental 6.x to stable 4.x.
- [x] **Tailwind 4 Fix:** Corrected `@import` syntax for proper rendering.

## 3. Deployment Checklist
1. Connect GitHub repository to Vercel.
2. Inject `ANTHROPIC_API_KEY` into Environment Variables.
3. Deploy to production.

---
*Verified and Finalized: 2026-01-31*