# Technical Fix Report: PDF Parsing ENOENT on Serverless/Vercel
**Status**: FINAL (Verified on Local and Vercel)
**Date**: January 31, 2026

## 1. Problem Description
In the Vercel deployment, PDF files located in the `/data` directory were being discovered but failed to be processed. The logs indicated an `ENOENT` error referring to a file path similar to `test/data/05-versions-space.pdf`, which does not exist in our repository.

## 2. Root Cause Analysis
The project uses the `pdf-parse` library for text extraction. This library has a problematic initialization sequence in its `index.js`:
- It checks if it is being run as a main module or if `module.parent` is null to determine "debug mode".
- If it thinks it is in debug mode, it immediately attempts to run a self-test by reading a hardcoded path: `./test/data/05-versions-space.pdf`.
- In many modern environments (especially with ESM or specific bundlers like Turbopack/Next.js), this check can fail or be misinterpreted, triggering the self-test.
- Since the `test/` directory is not part of our production build or repository, the library throws a fatal `ENOENT` error before it can even be used.

## 3. The Fix: Subpath Require
Instead of importing the library's default entry point, we bypass `index.js` and load the core parsing logic directly from the library's internal structure. Using `require` for this specific subpath ensures the highest compatibility with Next.js server-side bundling.

### Implementation Details
**File**: `src/lib/context.ts`

**Implementation**:
```typescript
try {
  // Use require for the subpath to avoid the index.js self-test logic 
  // and maintain compatibility with Next.js/Turbopack server-side.
  const pdf = require('pdf-parse/lib/pdf-parse.js');
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdf(dataBuffer);
  context += `\n--- Document: ${file} (PDF) ---\n${data.text}\n`;
} catch (pdfError: any) {
  console.error(`PDF Parse Error for ${file}:`, pdfError.message);
}
```

## 4. Guide for Future Fixes (Other Repos)
When applying this fix to a similar repository, follow these steps:

### A. Identification
- **Check Logs**: Look for `Error: ENOENT: no such file or directory` specifically mentioning `05-versions-space.pdf`.
- **Check Dependencies**: Verify if `pdf-parse` is listed in `package.json`.

### B. Architectural Checklist
Look at these files to find where the change is needed:
1. **Context/Data Utility**: Search for where `.pdf` files are handled (usually `src/lib/context.ts`).
2. **Import Strategy**: Replace `import pdf from 'pdf-parse'` or `await import('pdf-parse')` with the direct subpath `require('pdf-parse/lib/pdf-parse.js')`.

### C. Verification
- Start the server with `npm run dev`.
- Watch for a `DeprecationWarning: Buffer()` in the terminal—this is a safe indicator that `pdf-parse` is initializing and running.
- Ensure `ANTHROPIC_API_KEY` is set in `.env.local` to verify the full flow.

## 5. Logging & Vercel Troubleshooting
It is recommended to maintain server-side `console.log` and `console.error` statements in `src/app/api/chat/route.ts` and `src/lib/context.ts` during the initial Vercel deployment.

**Why logs are critical on Vercel:**
- **Secret Verification**: Confirms if `ANTHROPIC_API_KEY` is correctly injected into the serverless environment.
- **Pathing Confirmation**: Confirms that `process.cwd()` correctly points to the directory containing the `/data` folder in the Vercel build.
- **Parsing Errors**: Captures library-specific warnings or failures (like the `Buffer()` deprecation) that indicate successful library invocation.

## 6. Architectural Note
This project **does not** have end-user upload functionality. It uses a **Local Discovery Architecture**:
- Files must be manually placed in the `/data` directory.
- The system uses `fs.readdir` and `fs.readFile` to "import" these files into the AI context.
- Any future "Upload" feature would require adding a new API route and a multipart/form-data frontend component.
