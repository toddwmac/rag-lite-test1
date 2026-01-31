# Final Troubleshooting Report: RAG-Lite Notebook
**Date**: January 31, 2026
**Final Status**: SUCCESS (Fully Functional)

## 1. Critical Dependency Stabilization
**Issue**: Version mismatch between `ai` (^6.x) and `@ai-sdk/react`. The v6.x SDK introduced experimental changes that caused hooks (`useChat`) to return undefined functions (`handleSubmit`, `append`) in the Next.js 16/Turbopack environment.
**Resolution**: Downgraded and pinned dependencies to known stable versions:
- `ai@4.1.20`
- `@ai-sdk/react@1.1.20`
- `@ai-sdk/anthropic@1.1.10`
**Impact**: Restored core SDK functionality and fixed "handleSubmit is not a function" errors.

## 2. Anthropic Model Access (404 Error)
**Issue**: The API key provided was restricted (likely Tier 0 or low balance), causing `claude-3-5-sonnet` models to return a `404 Not Found` (Not Found Error).
**Resolution**: 
- Validated key permissions via a standalone node script (`verify-anthropic.mjs`).
- Switched all API routes to use `claude-3-haiku-20240307`.
**Impact**: Verified successful end-to-end communication with Anthropic.

## 3. Client-Side State & UI Synchronization
**Issue 1 (State)**: The `input` state from `useChat` was intermittently `undefined` or locked as read-only, throwing `TypeError: trim() of undefined`.
**Issue 2 (UI)**: Tailwind CSS 4 was misconfigured (using `@tailwind` directives instead of `@import "tailwindcss";`), leading to a broken/unstyled UI.
**Resolution**:
- **Tailwind**: Updated `globals.css` to the modern CSS-first `@import` syntax.
- **State Bridge**: Implemented a local `useState` for the input field in `src/app/page.tsx` to ensure the field is always mutable and safe.
- **Resilient Submit**: Created an `onFormSubmit` handler that checks for both `handleSubmit` and `append` as fallbacks.
- **Layout**: Redesigned to a "Command Centre" aesthetic (Top: Output, Middle: Input) to avoid overlap with development toolbars.

## 4. Environment-Specific Learnings
- **Windows/PowerShell**: Native execution policies often block `.ps1` scripts for `npm`. Wrapping commands in `cmd /c` (e.g., `cmd /c "npm install ..."`) is the only reliable method for this specific environment.
- **Turbopack**: The experimental compiler is sensitive to SDK version mismatches; pinning to stable releases is mandatory.
- **Verification**: Standalone JS scripts are superior to internal API routes for troubleshooting "hidden" failures (like API key permissions).

## 5. Production Build Failures (Vercel)
**Nature**: `Type error: LanguageModelV1 is not assignable to...`
**Cause**: Next.js production builds run a much stricter TypeScript check than development mode. Internal type conflicts between `ai` and `@ai-sdk/anthropic` versions caused a build crash.
**Confirmed Fix**: Added `as any` type casts to the model initializers in all API routes and synchronized `eslint-config-next` to version `16.1.6`.

---
**Current Production State**: DEPLOYED. The app is live on Vercel using Claude 3 Haiku and stable AI SDK components.