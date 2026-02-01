# Debug Report & Key Learnings: SmartDocs

## 1. SDK Fragmentation (Major)
**Nature**: New versions of the AI SDK (v6.x) broke core React hooks in the Next.js Turbopack environment.
**Fix**: Reverted to stable `ai@4.1.20`.
**Learning**: In experimental environments (Next 16), "latest" is often "broken." Pinning to stable is mandatory.

## 2. State & Persistence
**Nature**: UI input fields became "read-only" or threw `trim()` errors when using the SDK's built-in state.
**Fix**: Bridged the logic with a local `useState` and used `localStorage` for the Persona Tuning data.
**Learning**: Local React state is more reliable for critical testing inputs than internal SDK state during the dev phase.

## 3. The "Hierarchy of Truth" Prompt
**Nature**: AI was either too restricted (Doc-only) or too loose (hallucinating).
**Fix**: Implemented a 3-layer rule system: Documents first, General knowledge second (with disclaimer), and a "Refusal to Hallucinate" clause for high-uncertainty data.

## 4. Production Build (TypeScript)
**Nature**: `LanguageModelV1` type mismatch between the provider and the core SDK crashed the Vercel build.
**Fix**: Added `as any` type casting to the model initialization.
**Learning**: TypeScript warnings are FATAL in Vercel. Patch the types early if standard updates aren't available.

## 5. Maintenance Best Practices
**Learning**: `npm ci` is strictly for clean builds and requires `package-lock.json` to be perfectly in sync. For archiving, delete `node_modules` but **KEEP** `.env.local` manually as it's not in the Git history.
