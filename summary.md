# Project Summary: RAG-Lite Notebook
**Date**: January 31, 2026
**Status**: LIVE & DEPLOYED (Vercel)

## 1. Environment Configuration
- **OS**: Windows 13 (win32)
- **Runtime**: Next.js 16.1.6 (Turbopack)
- **Deployment**: Vercel (Production)
- **AI Stack**: 
  - `ai`: 4.1.20
  - `@ai-sdk/react`: 1.1.20
  - `@ai-sdk/anthropic`: 1.1.10

## 2. Core Implementation
### A. Anthropic Model Access
- **Model**: `claude-3-haiku-20240307`
- **Logic**: Use Haiku for optimal speed and compatibility with Tier 0/1 API keys.

### B. UI/UX Architecture
- **Design**: Professional "Notebook" layout with modern typography (Inter).
- **Features**: 
  - Sidebar with document selection/filtering logic.
  - Wide-screen responsive layout.
  - Compact, floating input field.

## 3. Deployment Fixes
- **TypeScript**: Added type casts (`as any`) to resolve `LanguageModelV1` conflicts during the Vercel production build process.
- **ESLint**: Synchronized `eslint-config-next` with the Next.js version (16.1.6) to pass strict Vercel CI checks.

