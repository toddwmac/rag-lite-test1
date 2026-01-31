# Deployment Guide: NotebookLM Web App to Vercel

## 1. Final Tech Stack for Vercel
- **Framework:** Next.js 16+
- **Styling:** Tailwind CSS 4
- **AI Logic:** Vercel AI SDK (Stable v4.x)
- **Model:** **Anthropic Claude 3 Haiku** (Optimized for cost and speed)

## 2. Pre-Deployment Configuration
Before deploying, ensure your `package.json` contains the following stable dependencies to avoid build errors:
- `"ai": "4.1.20"`
- `"@ai-sdk/react": "1.1.20"`

## 3. Vercel Environment Variables
You MUST add the following key in your Vercel Project Settings:
- `ANTHROPIC_API_KEY`: Your sk-ant... key.

## 4. Why Haiku?
We have configured the app to use **Claude 3 Haiku** instead of Sonnet. 
- **Benefit 1:** It is significantly cheaper for high-frequency RAG usage.
- **Benefit 2:** It works immediately without requiring higher-tier account balances.
- **Benefit 3:** It is the fastest model in the Anthropic lineup, providing a better "instant" chat feel.

## 5. Deployment Steps
1. Push your code to **GitHub**.
2. Connect the repo to **Vercel**.
3. Add the API Key.
4. **Deploy.** Vercel will handle the Linux build environment and optimize your Tailwind 4 styles automatically.

---
*Ready for Production: 2026-01-31*