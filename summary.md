# Project Summary: Applied AI Labs: SmartDocs
**Date**: January 31, 2026
**Status**: LIVE & FULLY FEATURED

## 1. Technical Architecture
- **Framework**: Next.js 16 (Turbopack)
- **AI Model**: Claude 3 Haiku (Optimized for speed/cost)
- **Pinned SDKs**: `ai@4.1.20`, `@ai-sdk/react@1.1.20`
- **Hosting**: Vercel (CI/CD via GitHub)

## 2. Intelligence Features
- **Hybrid RAG**: Prioritizes local documents but uses general knowledge when the knowledgebase is silent.
- **Selective Context**: Interactive sidebar allows users to toggle specific documents on/off for every query.
- **Anonymous Citations**: The AI refers to sources collectively as "the knowledgebase" to maintain a professional flow.
- **Persona Tuning**: A live "Command Console" allowing real-time adjustment of AI tone and rules without code changes.

## 3. Persistent State
- **Persona Storage**: Custom instructions are saved to the browser's `localStorage`.
- **Default Management**: Supports "Save as Default" and "Load Default" for consistent testing.

## 4. Maintenance & Archiving
- **Cleanup**: `node_modules` can be safely deleted for archiving; restore via `npm install`.
- **Deployment**: Any "Push" to the main branch triggers an automatic Vercel build.