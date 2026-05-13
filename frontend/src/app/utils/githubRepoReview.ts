import type { RepoAnalysis } from "../context/SetupContext";
import { getRepository, getRepositoryTree, parseGitHubRepoUrl } from "./githubApi";

const SETUP_DOC_BASENAMES = new Set([
  "PROJECT_CONTEXT",
  "AI_WORKFLOW",
  "DECISIONS",
  "PROGRESS_HANDOFF",
  "PROJECT_GUIDE",
  "GUIDE",
  "SETUP",
  "SETUP_GUIDE",
  "CONTRIBUTING",
  "SECURITY",
  "CODE_OF_CONDUCT",
]);

const BUILD_MANIFESTS = new Set([
  "package.json",
  "pnpm-workspace.yaml",
  "pyproject.toml",
  "requirements.txt",
  "Pipfile",
  "Pipfile.lock",
  "go.mod",
  "Cargo.toml",
  "composer.json",
  "pom.xml",
  "build.gradle",
  "build.gradle.kts",
  "Makefile",
  "justfile",
  "deno.json",
  "deno.jsonc",
  "tox.ini",
  "noxfile.py",
]);

const AI_EXTENSIONS = new Set([".md", ".mdx", ".mdc", ".txt", ".json", ".yml", ".yaml"]);
const ISSUE_TEMPLATE_EXTENSIONS = new Set([".md", ".yml", ".yaml"]);
const AI_KEYWORDS = [
  "instruction",
  "instructions",
  "workflow",
  "rule",
  "rules",
  "guardrail",
  "guardrails",
  "prompt",
  "context",
  "agent",
  "agents",
  "copilot",
  "claude",
  "cursor",
  "codex",
];
const BINARY_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".ico",
  ".pdf",
  ".zip",
  ".tar",
  ".gz",
  ".tgz",
  ".rar",
  ".7z",
  ".mp3",
  ".mp4",
  ".mov",
  ".avi",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".exe",
  ".dll",
  ".bin",
]);

function normalizeDirectory(path: string): string {
  const slashIndex = path.lastIndexOf("/");
  return slashIndex === -1 ? "" : path.slice(0, slashIndex);
}

function basename(path: string): string {
  const slashIndex = path.lastIndexOf("/");
  return slashIndex === -1 ? path : path.slice(slashIndex + 1);
}

function extension(path: string): string {
  const filename = basename(path);
  const dotIndex = filename.lastIndexOf(".");
  return dotIndex === -1 ? "" : filename.slice(dotIndex).toLowerCase();
}

function basenameWithoutExtension(path: string): string {
  const filename = basename(path);
  const dotIndex = filename.lastIndexOf(".");
  return dotIndex === -1 ? filename : filename.slice(0, dotIndex);
}

function isRootDir(dir: string): boolean {
  return dir === "" || dir === ".github" || dir === "docs" || dir === "context";
}

function isInstructionDir(dir: string): boolean {
  return isRootDir(dir) || dir === ".cursor";
}

function isReadmePath(path: string): boolean {
  const dir = normalizeDirectory(path);
  const file = basename(path);
  const upper = file.toUpperCase();
  return isRootDir(dir) && (upper === "README" || upper.startsWith("README."));
}

function isSetupDocPath(path: string): boolean {
  const dir = normalizeDirectory(path);
  const base = basenameWithoutExtension(path).toUpperCase();
  return isRootDir(dir) && SETUP_DOC_BASENAMES.has(base);
}

function isAiInstructionPath(path: string): boolean {
  const dir = normalizeDirectory(path);
  if (!isInstructionDir(dir)) {
    return false;
  }

  const fileExtension = extension(path);
  if (!AI_EXTENSIONS.has(fileExtension)) {
    return false;
  }

  const base = basenameWithoutExtension(path).toLowerCase();
  return AI_KEYWORDS.some((keyword) => base.includes(keyword));
}

function isIssueTemplatePath(path: string): boolean {
  return path.startsWith(".github/ISSUE_TEMPLATE/") && ISSUE_TEMPLATE_EXTENSIONS.has(extension(path));
}

function isBuildManifestPath(path: string): boolean {
  return BUILD_MANIFESTS.has(basename(path));
}

function isBinaryLikePath(path: string): boolean {
  return BINARY_EXTENSIONS.has(extension(path));
}

function shouldFetchPath(path: string): boolean {
  if (isBinaryLikePath(path)) {
    return false;
  }

  return (
    isBuildManifestPath(path) ||
    isIssueTemplatePath(path) ||
    isReadmePath(path) ||
    isSetupDocPath(path) ||
    isAiInstructionPath(path)
  );
}

function hasTestSignals(paths: string[]): boolean {
  return paths.some((path) => {
    const lower = path.toLowerCase();
    return (
      lower.startsWith("tests/") ||
      lower.startsWith("test/") ||
      lower.startsWith("spec/") ||
      lower.includes("__tests__/") ||
      lower === "vitest.config.ts" ||
      lower === "vitest.config.js" ||
      lower === "jest.config.js" ||
      lower === "jest.config.ts" ||
      lower === "pytest.ini" ||
      lower === "tox.ini" ||
      lower === "noxfile.py"
    );
  });
}

function topLevelEntries(paths: string[]): string[] {
  const values = new Set<string>();

  for (const path of paths) {
    const [firstSegment, secondSegment] = path.split("/");
    if (!firstSegment) {
      continue;
    }

    values.add(secondSegment ? `${firstSegment}/` : firstSegment);
  }

  return Array.from(values).sort((left, right) => left.localeCompare(right));
}

export async function reviewPublicRepository(repoUrl: string): Promise<RepoAnalysis> {
  const parsed = parseGitHubRepoUrl(repoUrl);

  if (!parsed) {
    throw new Error("Enter a full GitHub repository URL, for example https://github.com/owner/repo.");
  }

  const repository = await getRepository(parsed.owner, parsed.repo);

  if (repository.private) {
    throw new Error("Only public GitHub repositories are supported.");
  }

  const tree = await getRepositoryTree(repository.owner.login, repository.name, repository.default_branch, true);
  const paths = tree.tree
    .filter((entry) => entry.path && entry.type !== "tree")
    .map((entry) => entry.path);

  const matchedFiles = paths.filter((path) => shouldFetchPath(path)).sort((left, right) => left.localeCompare(right));
  const hasReadme = paths.some((path) => isReadmePath(path));
  const hasDocs = paths.some((path) => path === "docs" || path.startsWith("docs/"));
  const hasAIInstructions = paths.some((path) => isAiInstructionPath(path));
  const hasDecisionLog = paths.some(
    (path) => basenameWithoutExtension(path).toUpperCase() === "DECISIONS" && isRootDir(normalizeDirectory(path))
  );
  const hasProjectGuide = paths.some((path) => {
    const upperBase = basenameWithoutExtension(path).toUpperCase();
    return ["PROJECT_GUIDE", "GUIDE", "SETUP", "SETUP_GUIDE", "CONTRIBUTING"].includes(upperBase);
  });
  const hasTestSetup = hasTestSignals(paths);

  const missingSignals: string[] = [];
  const warnings: string[] = [];

  if (!hasReadme) {
    missingSignals.push("README");
    warnings.push("No root README found.");
  }

  if (!hasDocs) {
    missingSignals.push("docs folder");
    warnings.push("No docs folder found.");
  }

  if (!hasAIInstructions) {
    missingSignals.push("AI instruction files");
    warnings.push("No AI instruction files found.");
  }

  if (!hasDecisionLog) {
    missingSignals.push("decision log");
    warnings.push("No decision log detected.");
  }

  if (!hasTestSetup) {
    missingSignals.push("test setup");
    warnings.push("No obvious test setup detected.");
  }

  if (tree.truncated) {
    warnings.unshift("Repository tree was truncated by GitHub. This review may be incomplete for very large repositories.");
  }

  if (repository.archived) {
    warnings.push("Repository is archived.");
  }

  if (repository.disabled) {
    warnings.push("Repository is disabled.");
  }

  return {
    owner: repository.owner.login,
    repoName: repository.name,
    fullName: repository.full_name,
    repoUrl: repository.html_url,
    defaultBranch: repository.default_branch,
    treeScanStatus: tree.truncated ? "truncated" : "complete",
    hasReadme,
    hasDocs,
    hasAIInstructions,
    hasDecisionLog,
    hasTestSetup,
    hasProjectGuide,
    folderStructure: topLevelEntries(paths),
    matchedFiles,
    missingSignals,
    warnings,
  };
}
