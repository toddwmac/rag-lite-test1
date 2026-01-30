# Project Summary: RAG-Lite NotebookLM System

This document summarizes our discussion regarding the architecture, hosting, and implementation of a simplified RAG (Retrieval-Augmented Generation) system using NotebookLM data.

## 1. The Goal
To create a web application that allows users to ask questions of a specific NotebookLM notebook in a simple, cost-effective, and maintainable way.

## 2. The "RAG-Lite" Architecture
Instead of a complex real-time API integration (which NotebookLM currently lacks), we are using a **File-Based RAG** approach:
- **Data Source:** Exported Markdown (`.md`) or PDF files from NotebookLM.
- **Storage:** Files are stored locally within the web app's project folder.
- **Processing:** The backend reads these files and provides them as "context" to an LLM (like Claude or GPT) to answer user queries.

## 3. Recommended Tech Stack
- **Framework:** Next.js (App Router) for unified frontend and backend.
- **AI Integration:** Vercel AI SDK for easy streaming and LLM management.
- **Styling:** Tailwind CSS for rapid UI development.
- **Version Control:** GitHub for code storage and deployment triggers.

## 4. Hosting Strategy
- **Platform:** **Vercel** (Single-project hosting for both UI and Logic).
- **Domain:** **Namecheap** (Pointed to Vercel via CNAME record).
- **Deployment:** Automated via GitHub "Push" events (Continuous Deployment).

## 5. Key Decisions & Insights
- **Avoid Shared Hosting:** Namecheap Shared Hosting is unsuitable for Node.js/AI logic; Vercel is the preferred alternative.
- **Unified vs. Split Hosting:** We decided against splitting the frontend (GitHub Pages) and backend (Vercel) to avoid CORS complexity and simplify management.
- **Session Management:** We identified that reinitializing chat sessions requires explicit folder/context verification to ensure the AI is operating in the correct directory.

## 6. Next Steps
1. Initialize a new Next.js project in the `rag-lite-test1` folder.
2. Export NotebookLM data and place it in a `/data` directory.
3. Implement the API route to read files and query the LLM.
4. Connect the project to GitHub and Vercel for live hosting.

---
*Summary generated on 2026-01-30*
