import type { User } from "firebase/auth"

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000"

export class BackendAuthError extends Error {}

export async function getCurrentBackendUser(user: User) {
  const token = await user.getIdToken()

  let response: Response

  try {
    response = await fetch(`${BACKEND_URL}/api/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch {
    throw new BackendAuthError(
      "Cannot reach MediGuard. Please try again."
    )
  }

  if (response.status === 401) {
    throw new BackendAuthError(
      "Your session was rejected. Please sign in again."
    )
  }

  if (!response.ok) {
    throw new BackendAuthError(
      "MediGuard could not complete sign-in. Please try again."
    )
  }

  return response.json()
}
export async function sendChatMessage(
  user: User,
  question: string,
  messages: ReadonlyArray<{ role: "user" | "assistant"; content: string }> = [],
): Promise<string> {
  const token = await user.getIdToken();

  // Include only a contiguous suffix of complete, bounded exchanges.
  const history: Array<{ role: "user" | "assistant"; content: string }> = [];
  let historyLength = 0;
  for (let i = messages.length - 2; i >= 0 && history.length < 6; i -= 2) {
    const pair = messages.slice(i, i + 2);
    const size = pair.reduce((total, message) => total + message.content.length, 0);
    if (pair[0]?.role !== "user" || pair[1]?.role !== "assistant" ||
        pair.some((message) => !message.content.trim() || message.content.length > 4000) ||
        historyLength + size > 16000) break;
    history.unshift(...pair.map(({ role, content }) => ({ role, content })));
    historyLength += size;
  }

  let response: Response;

  try {
    response = await fetch(`${BACKEND_URL}/api/chat/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, history }),
    });
  } catch {
    throw new Error(
      "Cannot reach MediGuard. Check your connection and try again.",
    );
  }

  if (response.status === 401) {
    throw new BackendAuthError(
      "Your session was rejected. Please sign in again.",
    );
  }

  if (response.status === 400) {
    throw new Error(
      "Enter a question between 1 and 4000 characters.",
    );
  }

  if (response.status === 429) {
    throw new Error(
      "You have reached the chat request limit. Please wait before trying again.",
    );
  }

  if (!response.ok) {
    throw new Error(
      "The medicine assistant is temporarily unavailable. Please try again later.",
    );
  }

  const data: unknown = await response.json();

  if (
    typeof data !== "object" ||
    data === null ||
    !("answer" in data) ||
    typeof data.answer !== "string" ||
    !data.answer.trim()
  ) {
    throw new Error("MediGuard returned an invalid response.");
  }

  return data.answer;
}

export type AdminOverviewData = {
  stats: {
    total_registered_users: number;
    active_users: number;
    total_queries: number;
  };
  users: Array<{
    id: number;
    email: string;
    display_name: string;
    firebase_uid: string;
    created_at: string;
    last_active_at: string;
    query_count: number;
  }>;
  queries: Array<{
    id: number;
    user_email: string;
    user_name: string;
    question: string;
    answer: string;
    created_at: string;
    client_ip: string;
  }>;
};

export async function fetchAdminOverview(user: User): Promise<AdminOverviewData> {
  const token = await user.getIdToken();
  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}/api/admin/overview/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    throw new Error("Could not connect to MediGuard Admin API. Please ensure backend is running.");
  }

  if (response.status === 403) {
    throw new Error("Access denied. You do not have administrator permissions.");
  }

  if (response.status === 401) {
    throw new Error("Authentication required. Please sign in with an administrator account.");
  }

  if (!response.ok) {
    throw new Error("Failed to load admin analytics telemetry.");
  }

  return response.json();
}