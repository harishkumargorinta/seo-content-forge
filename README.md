
# SEO Content Forge

SEO Content Forge is a Next.js application designed to assist with content creation, SEO optimization, and social media content generation using AI. It leverages Genkit for AI functionalities and provides a suite of tools for content writers, marketers, and social media managers.

## Project Setup and Installation

Follow these steps to set up and run the project locally.

### Prerequisites

*   **Node.js**: Version 18.x or later (LTS recommended). You can download it from [nodejs.org](https://nodejs.org/).
*   **npm** or **yarn**: These package managers come with Node.js.

### 1. Clone the Repository

First, clone the repository to your local machine. Replace `YourGitHubUsername` with your actual GitHub username if you've forked it, or use the original repository URL.

```bash
git clone https://github.com/YourGitHubUsername/seo-content-forge.git
cd seo-content-forge
```

### 2. Install Dependencies

Install the project dependencies using npm or yarn:

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

This project uses Genkit, which typically requires API keys for AI models (e.g., Google Gemini).

1.  Create a new file named `.env.local` in the root of your project.
2.  Add the necessary environment variables. For Google AI (Gemini), you'll need a `GOOGLE_API_KEY`:

    ```env
    # .env.local
    GOOGLE_API_KEY=your_google_api_key_here
    ```

    You can obtain a Google API key from the [Google AI Studio](https://aistudio.google.com/app/apikey).

    *Note: The `ai/genkit.ts` file is configured to use `googleai/gemini-2.0-flash`. Ensure your API key has access to this model or update the model in the configuration if needed.*

### 4. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
# or
yarn dev
```

This will typically start the application on `http://localhost:9002`.

### 5. (Optional) Run Genkit Dev Server

If you need to inspect or test Genkit flows independently, you can run the Genkit development server:

```bash
npm run genkit:dev
# or for watching changes
npm run genkit:watch
```

This usually starts the Genkit developer UI on `http://localhost:4000`.

## Deployment

You can deploy this Next.js application to various platforms. Here are instructions for some popular ones:

### General Deployment Notes

*   **Environment Variables**: Ensure you set up all necessary environment variables (like `GOOGLE_API_KEY`) in your deployment platform's settings.
*   **Build Command**: `npm run build` (or `yarn build`)
*   **Start Command**: `npm start` (or `yarn start`)
*   **Output Directory**: `.next`

### Deploying to Vercel

Vercel is the platform built by the creators of Next.js and offers seamless deployment.

1.  **Push your code** to a GitHub, GitLab, or Bitbucket repository.
2.  Go to [Vercel](https://vercel.com/) and sign up or log in.
3.  Click on "Add New..." -> "Project".
4.  **Import your Git repository**.
5.  Vercel should automatically detect that it's a Next.js project and configure the build settings correctly.
    *   Framework Preset: Next.js
    *   Build Command: `next build` (or `npm run build`)
    *   Output Directory: `.next`
6.  **Configure Environment Variables**: Go to your project settings on Vercel, find the "Environment Variables" section, and add `GOOGLE_API_KEY` and any other necessary variables.
7.  Click "Deploy".

### Deploying to Netlify

Netlify is another popular platform for deploying web applications.

1.  **Push your code** to a GitHub, GitLab, or Bitbucket repository.
2.  Go to [Netlify](https://www.netlify.com/) and sign up or log in.
3.  Click on "Add new site" -> "Import an existing project".
4.  **Connect to your Git provider** and select your repository.
5.  Configure your build settings:
    *   Build command: `npm run build` (or `yarn build`)
    *   Publish directory: `.next`
6.  **Add Environment Variables**: Go to your site settings on Netlify, navigate to "Build & deploy" -> "Environment", and add your `GOOGLE_API_KEY` and other variables.
7.  You might need to install the Netlify adapter for Next.js if you are using advanced Next.js features that require it. Often, Netlify handles Next.js builds well by default. If you encounter issues, search for "Netlify Next.js runtime".
8.  Click "Deploy site".

### Deploying to Koyeb

Koyeb is a serverless platform that can deploy applications using Git or Docker.

1.  **Push your code** to a GitHub repository.
2.  Go to [Koyeb](https://www.koyeb.com/) and sign up or log in.
3.  Click "Create App".
4.  **Connect your GitHub account** and select your repository and branch.
5.  Configure your App:
    *   **Builder**: Koyeb typically auto-detects Next.js projects and uses a buildpack. If not, you might need to configure it.
    *   **Run command**: Ensure this is set to `npm start` or `yarn start`.
    *   **Port**: Set this to `3000` (Next.js default).
    *   **Environment Variables**: In the "Advanced" section or "Environment variables" tab, add `GOOGLE_API_KEY` and any other required variables.
    *   **Health Checks**: Configure an appropriate health check path (e.g., `/`).
6.  Give your App a name and click "Deploy".

### Other Platforms (e.g., AWS Amplify, Google Cloud Run, Azure App Service)

Most cloud platforms offer ways to deploy Next.js applications, either via direct Git integration, Docker containers, or specialized services.

*   **Docker**: You can create a `Dockerfile` for your Next.js application and deploy it to any platform that supports Docker containers (like Google Cloud Run, AWS ECS, Azure Container Instances, or Koyeb with Docker). A basic `Dockerfile` for Next.js might look like:

    ```dockerfile
    # Install dependencies only when needed
    FROM node:18-alpine AS deps
    # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
    RUN apk add --no-cache libc6-compat
    WORKDIR /app

    # Install dependencies based on the preferred package manager
    COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
    RUN \
      if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
      elif [ -f package-lock.json ]; then npm ci; \
      elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
      else echo "Lockfile not found." && exit 1; \
      fi

    # Rebuild the source code only when needed
    FROM node:18-alpine AS builder
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .

    # Next.js collects anonymous telemetry data about general usage.
    # Learn more here: https://nextjs.org/telemetry
    # Uncomment the following line in case you want to disable telemetry.
    # ENV NEXT_TELEMETRY_DISABLED 1

    RUN npm run build

    # Production image, copy all the files and run next
    FROM node:18-alpine AS runner
    WORKDIR /app

    ENV NODE_ENV production
    # Uncomment the following line in case you want to disable telemetry.
    # ENV NEXT_TELEMETRY_DISABLED 1

    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nextjs

    COPY --from=builder /app/public ./public

    # Automatically leverage output traces to reduce image size
    # https://nextjs.org/docs/advanced-features/output-file-tracing
    COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
    COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

    USER nextjs

    EXPOSE 3000

    ENV PORT 3000

    CMD ["node", "server.js"]
    ```
    *Remember to adapt this Dockerfile to your project's specifics, especially if you have a custom server.*

*   **Platform-Specific Services**:
    *   **AWS Amplify**: Connect your Git repository and follow Amplify's Next.js deployment guide.
    *   **Google Cloud Run**: Deploy using a Docker container or directly from source (if supported for Next.js).
    *   **Azure App Service**: Can deploy Node.js applications; you might need to configure it for Next.js specifics or use containers.

Always refer to the official documentation of the chosen deployment platform for the most accurate and up-to-date instructions for Next.js applications.

---

Developed by: YourGitHubUsername
```