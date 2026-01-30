# Implementation Plan: RAG-Lite Next.js App

This plan outlines the steps to build a NotebookLM-style experience hosted on Vercel.

## 1. Technical Stack Decisions
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **AI Provider:** **Anthropic (Claude 3.5 Sonnet)**
  - *Reason:* Claude is exceptional at processing long context from documents and has a very "human" writing style similar to NotebookLM.
- **AI SDK:** Vercel AI SDK (`ai` package)
- **Styling:** Tailwind CSS + Shadcn UI (for clean, professional components)

## 2. Phase 1: Project Initialization
1. Initialize Next.js: `npx create-next-app@latest . --typescript --tailwind --eslint`
2. Install AI dependencies: `npm install ai @ai-sdk/anthropic lucide-react`
3. Create the data directory: `mkdir data`

## 3. Phase 2: The "RAG" Logic (Backend)
1. **File Reader:** Create a utility to read all `.md` and `.txt` files from the `/data` folder.
2. **Context Injection:** 
   - When a user sends a message, the backend will read the files.
   - It will prepend the file content to the AI prompt: *"You are a helpful assistant. Use the following documents to answer the user's question: [Document Content]..."*
3. **API Route:** Implement `src/app/api/chat/route.ts` to handle the streaming response from Claude.

## 4. Phase 3: The User Interface (Frontend)
1. **Chat Window:** A clean, centered chat interface with a message history.
2. **Source Sidebar:** A small sidebar or list showing which documents are currently being used as context.
3. **Loading States:** Professional "AI is thinking" animations.

## 5. Phase 4: Deployment
1. **GitHub:** Initialize git, commit code, and push to a new GitHub repository.
2. **Vercel:** Connect the repo, add the `ANTHROPIC_API_KEY`, and deploy.

## 6. Future Enhancements (Phase 5)
- **PDF Support:** Add `pdf-parse` to handle exported PDF files.
- **Search/Filtering:** If the notebook gets very large, add a simple keyword search to only send relevant parts of the files to the AI.

---
*Plan approved for implementation on 2026-01-30*
