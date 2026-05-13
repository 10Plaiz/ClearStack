const DEFAULT_API_BASE_URL = "https://api.github.com";
const DEFAULT_API_VERSION = "2022-11-28";

const githubApiBaseUrl = (import.meta.env.VITE_GITHUB_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, "");
const githubApiVersion = import.meta.env.VITE_GITHUB_API_VERSION || DEFAULT_API_VERSION;
const githubToken = import.meta.env.VITE_GITHUB_TOKEN?.trim();

export interface ParsedGitHubRepoUrl {
  owner: string;
  repo: string;
  normalizedUrl: string;
}

export interface GitHubRepository {
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  default_branch: string;
  archived: boolean;
  disabled: boolean;
  owner: {
    login: string;
    type: string;
  };
}

export interface GitHubTreeEntry {
  path: string;
  mode: string;
  type: "blob" | "tree" | "commit";
  size?: number;
  sha: string;
  url: string;
}

export interface GitHubTreeResponse {
  sha: string;
  truncated: boolean;
  tree: GitHubTreeEntry[];
}

export class GitHubApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
  }
}

function buildHeaders(accept = "application/vnd.github+json"): HeadersInit {
  const headers: Record<string, string> = {
    Accept: accept,
    "X-GitHub-Api-Version": githubApiVersion,
  };

  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  return headers;
}

function encodePath(path: string): string {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

async function buildGitHubError(response: Response): Promise<GitHubApiError> {
  let message = `GitHub API request failed with status ${response.status}.`;

  try {
    const payload = (await response.json()) as { message?: string };
    if (payload.message) {
      message = payload.message;
    }
  } catch {
    const text = await response.text();
    if (text.trim()) {
      message = text.trim();
    }
  }

  if (response.status === 404) {
    message = "Repository not found or not publicly accessible.";
  }

  if ((response.status === 403 || response.status === 429) && response.headers.get("x-ratelimit-remaining") === "0") {
    message = "GitHub API rate limit reached. Add VITE_GITHUB_TOKEN locally or try again later.";
  }

  return new GitHubApiError(message, response.status);
}

async function githubJsonRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${githubApiBaseUrl}${path}`, {
    ...init,
    headers: {
      ...buildHeaders(),
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    throw await buildGitHubError(response);
  }

  return (await response.json()) as T;
}

async function githubTextRequest(path: string, init?: RequestInit): Promise<string> {
  const response = await fetch(`${githubApiBaseUrl}${path}`, {
    ...init,
    headers: {
      ...buildHeaders("application/vnd.github.raw+json"),
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    throw await buildGitHubError(response);
  }

  return response.text();
}

export function parseGitHubRepoUrl(value: string): ParsedGitHubRepoUrl | null {
  if (!value.trim()) {
    return null;
  }

  let url: URL;

  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }

  if (!["github.com", "www.github.com"].includes(url.hostname.toLowerCase())) {
    return null;
  }

  const parts = url.pathname
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);

  if (parts.length < 2) {
    return null;
  }

  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/i, "");

  if (!owner || !repo) {
    return null;
  }

  return {
    owner,
    repo,
    normalizedUrl: `https://github.com/${owner}/${repo}`,
  };
}

export async function getRepository(owner: string, repo: string): Promise<GitHubRepository> {
  return githubJsonRequest<GitHubRepository>(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
}

export async function getRepositoryTree(
  owner: string,
  repo: string,
  treeShaOrRef: string,
  recursive = true
): Promise<GitHubTreeResponse> {
  const recursiveQuery = recursive ? "?recursive=1" : "";
  return githubJsonRequest<GitHubTreeResponse>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees/${encodeURIComponent(treeShaOrRef)}${recursiveQuery}`
  );
}

export async function getRepositoryContent(
  owner: string,
  repo: string,
  path: string,
  ref?: string
): Promise<string> {
  const encodedPath = encodePath(path);
  const query = ref ? `?ref=${encodeURIComponent(ref)}` : "";
  return githubTextRequest(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodedPath}${query}`);
}

export async function getRepositoryReadme(
  owner: string,
  repo: string,
  dir?: string,
  ref?: string
): Promise<string> {
  const path = dir
    ? `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme/${encodeURIComponent(dir)}`
    : `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`;
  const query = ref ? `?ref=${encodeURIComponent(ref)}` : "";
  return githubTextRequest(`${path}${query}`);
}
