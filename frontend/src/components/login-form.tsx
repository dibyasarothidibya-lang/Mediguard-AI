"use client"
import * as api from "@/lib/api"
import { useState, type FormEvent } from "react"
import { FirebaseError } from "firebase/app"
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GalleryVerticalEndIcon } from "lucide-react"

function getLoginErrorMessage(error: unknown) {
  if (error instanceof api.BackendAuthError) {
  return error.message
  }
  if (!(error instanceof FirebaseError)) {
    return "Unable to sign in. Please try again."
  }

  switch (error.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "The email or password is incorrect."
    case "auth/invalid-email":
      return "Enter a valid email address."
    case "auth/user-disabled":
      return "This account has been disabled."
    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment and try again."
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in window."
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled."
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email. Use its original sign-in method."
    case "auth/network-request-failed":
      return "Check your internet connection and try again."
    default:
      return "Unable to sign in. Please try again."
  }
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [pendingMethod, setPendingMethod] = useState<
    "password" | "google" | null
  >(null)
  const [error, setError] = useState("")
  const isLoading = pendingMethod !== null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")

    if (!email || !password) {
      setError("Enter your email and password.")
      return
    }

    setPendingMethod("password")

    try {
      const credential = await signInWithEmailAndPassword(
  auth,
  email,
  password
)

await api.getCurrentBackendUser(credential.user)

router.replace("/chat")
    } catch (error) {
      setError(getLoginErrorMessage(error))
    } finally {
      setPendingMethod(null)
    }
  }

  async function handleGoogleSignIn() {
    setError("")
    setPendingMethod("google")

    try {
      const credential = await signInWithPopup(
  auth,
  new GoogleAuthProvider()
)

await api.getCurrentBackendUser(credential.user)

router.replace("/chat")
    } catch (error) {
      setError(getLoginErrorMessage(error))
    } finally {
      setPendingMethod(null)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
  method="post"
  onSubmit={handleSubmit}
  aria-busy={isLoading}
>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEndIcon className="size-6" />
              </div>
              <span className="sr-only">Mediguard AI</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Mediguard AI</h1>
            <FieldDescription>
              Don&apos;t have an account? <a href="/signup">Sign up</a>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder=""
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder=""
              required
            />
          </Field>
          <Field>
            {error ? (
              <FieldDescription role="alert" className="text-destructive">
                {error}
              </FieldDescription>
            ) : null}
            <Button type="submit" disabled={isLoading}>
              {pendingMethod === "password" ? "Signing in..." : "Login"}
            </Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field>
            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              {pendingMethod === "google"
                ? "Connecting to Google..."
                : "Continue with Google"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="about">Terms of Service</a>{" "}
        and <a href="about">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
