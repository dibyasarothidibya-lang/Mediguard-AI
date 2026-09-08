"use client";

import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import { SpeechInput } from "@/components/ai-elements/speech-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  BotIcon,
  HomeIcon,
  LogOutIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const suggestions = [
  "Identify a medicine from its packaging",
  "Explain a batch or expiry label",
  "Check common medicine warnings",
  "Help me understand dosage information",
];

function ComposerAttachments() {
  const attachments = usePromptInputAttachments();

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <Attachments className="px-1 pt-1" variant="inline">
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}
        >
          <AttachmentPreview />
          <span className="max-w-40 truncate text-xs">
            {attachment.filename ?? "Medicine image"}
          </span>
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
}

export default function MediGuardChatPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);
      setIsAuthReady(true);
    });
  }, [router]);

  const handleSuggestion = useCallback((suggestion: string) => {
    setText(suggestion);
  }, []);

  const handleTranscription = useCallback((transcript: string) => {
    setText((current) =>
      current ? `${current} ${transcript}` : transcript,
    );
  }, []);

  const handleSubmit = useCallback(() => undefined, []);

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);

    try {
      await signOut(auth);
      router.replace("/login");
    } finally {
      setIsSigningOut(false);
    }
  }, [router]);

  if (!isAuthReady) {
    return (
      <main className="flex h-svh items-center justify-center bg-background text-foreground">
        <p role="status" className="text-sm text-muted-foreground">
          Checking your session...
        </p>
      </main>
    );
  }

  return (
    <TooltipProvider>
      <main className="flex h-svh min-h-0 flex-col overflow-hidden bg-background text-foreground">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background/90 px-4 backdrop-blur sm:px-6">
          <Link
            className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="/"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <ShieldCheckIcon className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold leading-none">
                MediGuard AI
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Medicine information assistant
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span
              className="hidden max-w-48 truncate text-sm text-muted-foreground sm:inline"
              title={user?.email ?? undefined}
            >
              {user?.displayName ?? user?.email ?? "Signed in"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <SparklesIcon className="size-3.5 text-indigo-500" />
              MediGuard1
            </span>
            <Link
              aria-label="Return to homepage"
              className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              href="/"
            >
              <HomeIcon className="size-4" />
            </Link>
            <Button
              aria-label="Sign out"
              disabled={isSigningOut}
              onClick={handleSignOut}
              size="icon"
              title="Sign out"
              variant="ghost"
            >
              <LogOutIcon className="size-4" />
            </Button>
          </div>
        </header>

        <Conversation className="min-h-0 flex-1">
          <ConversationContent className="mx-auto min-h-full w-full max-w-3xl justify-center px-4 py-10 sm:px-6">
            <ConversationEmptyState
              description="Ask about medicine packaging, labels, usage information, warnings, or upload a clear photo for analysis."
              icon={
                <span className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
                  <BotIcon className="size-7" />
                </span>
              }
              title="How can MediGuard1 help?"
            />
          </ConversationContent>
        </Conversation>

        <section className="shrink-0 border-t bg-background/95 px-4 pb-4 pt-3 backdrop-blur sm:px-6">
          <div className="mx-auto w-full max-w-3xl space-y-3">
            <Suggestions>
              {suggestions.map((suggestion) => (
                <Suggestion
                  key={suggestion}
                  onClick={handleSuggestion}
                  suggestion={suggestion}
                />
              ))}
            </Suggestions>

            <PromptInput
              accept="image/*"
              globalDrop
              maxFileSize={10 * 1024 * 1024}
              maxFiles={4}
              multiple
              onSubmit={handleSubmit}
            >
              <PromptInputHeader>
                <ComposerAttachments />
              </PromptInputHeader>
              <PromptInputBody>
                <PromptInputTextarea
                  onChange={(event) => setText(event.currentTarget.value)}
                  placeholder="Ask about a medicine or attach packaging photos..."
                  value={text}
                />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments label="Add medicine photos" />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                  <SpeechInput
                    onTranscriptionChange={handleTranscription}
                    size="icon-sm"
                    variant="ghost"
                  />
                  <span className="inline-flex h-7 items-center gap-1.5 rounded-md bg-muted px-2 text-xs font-medium text-muted-foreground">
                    <SparklesIcon className="size-3" />
                    MediGuard1
                  </span>
                </PromptInputTools>
                <PromptInputSubmit
                  disabled
                  status="ready"
                  title="Connect the backend to enable sending"
                />
              </PromptInputFooter>
            </PromptInput>

            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              MediGuard provides educational information and does not replace a
              doctor, pharmacist, diagnosis, or emergency care.
            </p>
          </div>
        </section>
      </main>
    </TooltipProvider>
  );
}
