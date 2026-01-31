# Project Summary: RAG-Lite Notebook
**Date**: January 31, 2026
**Status**: VERIFIED & FUNCTIONAL

## 1. Environment Configuration
- **OS**: Windows 13 (win32)
- **Runtime**: Next.js 16.1.6 (Turbopack)
- **AI Stack**: 
  - `ai`: 4.1.20
  - `@ai-sdk/react`: 1.1.20
  - `@ai-sdk/anthropic`: 1.1.10

## 2. Core Implementation
### A. Anthropic Model Access
- **Model**: `claude-3-haiku-20240307`
- **Logic**: The application uses Haiku as the primary model to ensure compatibility with Tier 0/1 API keys while maintaining high-speed RAG performance.

### B. UI/UX Architecture
- **Design**: "Command Centre" / Brutalist Black-and-White layout.
- **Components**: 
  - **Output Zone (Top)**: Scrolling history of messages.
  - **Command Zone (Middle)**: High-contrast centered input field with robust submission logic.
  - **Status Zone (Bottom)**: System telemetry and data stream indicators.
- **Tech**: Tailwind CSS 4 (@import "tailwindcss" syntax).

### C. RAG Pipeline
- **Context**: Automatically reads `.md`, `.txt`, and `.pdf` files from the `/data` directory.
- **Injection**: Context is injected into the system prompt for every inquiry.

## 3. Verified Functionality
- [x] **Authentication**: Successful handshake with Anthropic API.
- [x] **Message Submission**: Verified via "SUBMIT" button and Enter key.
- [x] **Streaming**: Real-time response generation is active.
- [x] **Document Access**: AI correctly identifies and references local files.

## 4. Vercel Deployment Note
- Ensure `ANTHROPIC_API_KEY` is set in the Vercel dashboard.
- The project is configured for Linux deployment (Vercel's native environment).
