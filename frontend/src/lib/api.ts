import type { User } from "firebase/auth"

export class BackendAuthError extends Error {}

export async function getCurrentBackendUser(user: User) {
  const token = await user.getIdToken()

  let response: Response

  try {
    response = await fetch("http://127.0.0.1:8000/api/me/", {
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