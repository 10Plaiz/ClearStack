import { corsHeaders } from "../_shared/cors.ts";

type ChatRole = "user" | "assistant";

interface ChatRequest {
  message?: string;
  history?: Array<{ role?: ChatRole; content?: string }>;
  setup?: Record<string, unknown>;
}

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

const vertexProjectId = Deno.env.get("VERTEX_PROJECT_ID");
const vertexLocation = Deno.env.get("VERTEX_LOCATION") ?? "us-central1";
const vertexModel = Deno.env.get("VERTEX_MODEL");
const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return jsonResponse({ ok: true });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Use POST for chat requests." }, 405);
  }

  try {
    const body = (await req.json()) as ChatRequest;
    const message = body.message?.trim();

    if (!message) {
      return jsonResponse({ error: "Missing message." }, 400);
    }

    if (!vertexProjectId || !vertexModel || !serviceAccountJson) {
      return jsonResponse({ error: "Vertex AI is not configured." }, 500);
    }

    const reply = await askVertexAi({
      message,
      history: body.history ?? [],
      setup: body.setup ?? {},
    });

    return jsonResponse({ reply });
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "Chat request failed." }, 500);
  }
});

async function askVertexAi(input: {
  message: string;
  history: Array<{ role?: ChatRole; content?: string }>;
  setup: Record<string, unknown>;
}): Promise<string> {
  const accessToken = await getGoogleAccessToken();
  const modelPath = `projects/${vertexProjectId}/locations/${vertexLocation}/publishers/google/models/${vertexModel}`;
  const vertexHost = vertexLocation === "global" ? "aiplatform.googleapis.com" : `${vertexLocation}-aiplatform.googleapis.com`;
  const url = `https://${vertexHost}/v1/${modelPath}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: buildSystemInstruction() }],
      },
      contents: buildVertexContents(input),
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1400,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Vertex AI error:", response.status, detail);
    throw new Error("Vertex AI request failed.");
  }

  const payload = await response.json();
  const reply = payload?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text ?? "")
    .join("")
    .trim();

  if (!reply) {
    throw new Error("Vertex AI returned an empty reply.");
  }

  return reply;
}

function buildSystemInstruction(): string {
  return [
    "You are ClearStack's project-aware assistant.",
    "Answer only about project setup, documentation, scope, AI workflow, repository review, and learning checkpoints.",
    "Do not act as a general coding assistant. Do not generate full application code.",
    "Use the provided setup context and any repository file excerpts when they are relevant.",
    "If a user asks where something is or what a file says, answer from the repository context instead of guessing.",
    "Keep answers practical and beginner-friendly, usually 3 to 6 bullets or short paragraphs.",
    "Always finish the final sentence. Do not end with an incomplete bullet or trailing phrase.",
  ].join(" ");
}

function buildVertexContents(input: {
  message: string;
  history: Array<{ role?: ChatRole; content?: string }>;
  setup: Record<string, unknown>;
}) {
  const history = input.history
    .filter((item) => item.role && item.content?.trim())
    .slice(-8)
    .map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.content!.trim() }],
    }));

  while (history[0]?.role === "model") {
    history.shift();
  }

  return [
    ...history,
    {
      role: "user",
      parts: [
        {
          text: [
            `Setup context:\n${JSON.stringify(input.setup, null, 2)}`,
            `User question:\n${input.message}`,
          ].join("\n\n"),
        },
      ],
    },
  ];
}

async function getGoogleAccessToken(): Promise<string> {
  const serviceAccount = JSON.parse(serviceAccountJson ?? "") as ServiceAccount;
  const now = Math.floor(Date.now() / 1000);
  const jwtHeader = { alg: "RS256", typ: "JWT" };
  const jwtClaim = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const unsignedJwt = `${base64UrlEncode(JSON.stringify(jwtHeader))}.${base64UrlEncode(JSON.stringify(jwtClaim))}`;
  const signature = await signJwt(unsignedJwt, serviceAccount.private_key);
  const jwt = `${unsignedJwt}.${signature}`;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    const detail = await tokenResponse.text();
    console.error("Google token error:", tokenResponse.status, detail);
    throw new Error("Could not get Google access token.");
  }

  const tokenPayload = await tokenResponse.json();
  if (!tokenPayload.access_token) {
    throw new Error("Google token response did not include an access token.");
  }

  return tokenPayload.access_token;
}

async function signJwt(unsignedJwt: string, privateKeyPem: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(privateKeyPem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsignedJwt));
  return base64UrlEncode(signature);
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}

function base64UrlEncode(value: string | ArrayBuffer): string {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : new Uint8Array(value);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
