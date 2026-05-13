
  # ClearStack Frontend

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## GitHub API setup

  The setup flow can now review a public GitHub repository directly from `/setup`.

  Copy `.env.example` to `.env.local` and configure:

  - `VITE_GITHUB_API_BASE_URL`
  - `VITE_GITHUB_API_VERSION`
  - `VITE_GITHUB_TOKEN` (optional, but useful for higher rate limits during local development)

  Notes:

  - This app only reviews public repositories.
  - The review validates the repository, reads metadata, scans the default branch tree, and matches setup-related files.
  - `VITE_` variables are exposed to the browser build. For production, move GitHub API access behind a backend proxy instead of shipping a token in the client.
  
