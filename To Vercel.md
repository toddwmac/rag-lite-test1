# Deployment Guide: NotebookLM Web App to Vercel

This guide outlines the simplest path to hosting your AI-powered web app using Vercel and GitHub, while keeping your domain at Namecheap.

## 1. The "Ideal" Tech Stack
For a beginner-friendly but powerful setup, use the **Next.js AI Starter Stack**:
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI Logic:** [Vercel AI SDK](https://sdk.vercel.ai/docs)
- **Data:** Local Markdown (`.md`) or PDF files exported from NotebookLM.

## 2. Project Structure
Next.js keeps your frontend and backend in one place, which avoids complex security (CORS) issues.

```text
my-notebook-app/
├── data/                <-- Your NotebookLM exported files
├── src/
│   ├── app/
│   │   ├── page.tsx     <-- Frontend: The Chat UI
│   │   └── api/
│   │       └── chat/
│   │           └── route.ts <-- Backend: AI & File Reading Logic
├── public/              <-- Images and static assets
└── package.json         <-- Project dependencies
```

## 3. The Deployment Workflow (The "Magic" Path)

### Step 1: GitHub (The Source)
1. Create a new repository on [GitHub](https://github.com).
2. Push your project code from your computer to this repository.
   - *Benefit:* This acts as a safe backup and version history for your code.

### Step 2: Vercel (The Host)
1. Log in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **"Add New" > "Project"**.
3. Select your GitHub repository from the list.
4. **Environment Variables:** Add your AI API keys (e.g., `ANTHROPIC_API_KEY`) in the Vercel dashboard.
5. Click **"Deploy"**.

### Step 3: Namecheap (The Identity)
1. In Vercel, go to **Project Settings > Domains**.
2. Add your custom domain (e.g., `notebook.yourdomain.com`).
3. In your **Namecheap** dashboard, add a CNAME record pointing to Vercel's servers (Vercel will provide the exact value).

## 4. Why This Works
- **Continuous Deployment:** Every time you "Push" a change to GitHub (like adding a new notebook file), Vercel automatically updates your live site.
- **Zero Server Management:** You don't have to worry about Linux, security patches, or server crashes.
- **Scalability:** Vercel handles 1 user or 1,000 users without you changing a single line of code.

---
*Generated for the NotebookLM MCP Project*
