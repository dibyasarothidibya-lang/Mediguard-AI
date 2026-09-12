"use client";
import { Streamdown } from "streamdown";
import { sendChatMessage } from "@/lib/api";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import QrScannerDialog from "@/components/QR/qr-scanner-dialog";
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
import { useCallback, useEffect, useRef, useState } from "react";
type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  { label: "Uses and ingredients", draft: "Explain the uses and ingredients of [medicine name]." },
  { label: "Packaging text", draft: "Explain this medicine packaging text: [paste label text]." },
  { label: "Side effects", draft: "What are the common side effects of [medicine name]?" },
  { label: "Interactions", draft: "Are there known interactions between [medicine one] and [medicine two]?" },
  { label: "Dosage label", draft: "Explain these dosage instructions: [paste medicine name and label instructions]." },
  { label: "Storage and expiry", draft: "How should I store [medicine name], and what does its expiry label mean?" },
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
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const sendingRef = useRef(false);
  const sessionUidRef = useRef<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      const nextUid = currentUser?.uid ?? null;
      if (sessionUidRef.current !== nextUid) {
        setMessages([]);
        setText("");
        setChatError(null);
      }
      sessionUidRef.current = nextUid;
      setUser(currentUser);
      setIsAuthReady(Boolean(currentUser));
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

  const handleQrConfirm = useCallback((decodedText: string) => {
  const scannedContent = `Scanned QR content: ${decodedText}`;

  setText((current) =>
    current ? `${current}\n${scannedContent}` : scannedContent,
  );
}, []);
  const handleSubmit = useCallback(
  async (message: PromptInputMessage) => {
    if (sendingRef.current) {
      throw new Error("A message is already being sent.");
    }

    const rejectSubmission = (reason: string): never => {
      setChatError(reason);
      throw new Error(reason);
    };

    if (
      !user ||
      isSigningOut ||
      auth.currentUser?.uid !== user.uid
    ) {
      return rejectSubmission("Please sign in before sending a message.");
    }

    if (message.files.length > 0) {
      rejectSubmission(
        "Image analysis is not available yet. Remove the images to send a text question.",
      );
    }

    const question = message.text.trim();

    if (/\[(medicine[^\]]*|paste[^\]]*)\]/i.test(question)) {
      return rejectSubmission("Replace the text in brackets with your medicine details before sending.");
    }

    if (!question || question.length > 4000) {
      rejectSubmission(
        "Enter a question between 1 and 4000 characters.",
      );
    }

    sendingRef.current = true;
    setIsSending(true);
    setChatError(null);

    try {
      const answer = await sendChatMessage(user, question, messages);

      if (auth.currentUser?.uid !== user.uid) {
        throw new Error("Your session changed. Please sign in again.");
      }

      const questionMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
      };

      const answerMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: answer,
      };

      setMessages((current) => [
        ...current,
        questionMessage,
        answerMessage,
      ]);

      setText((current) =>
        current === message.text ? "" : current,
      );
    } catch (error) {
      setChatError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );

      throw error;
    } finally {
      sendingRef.current = false;
      setIsSending(false);
    }
  },
  [user, isSigningOut, messages],
);

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
  <ConversationContent className="mx-auto min-h-full w-full max-w-3xl px-4 py-10 sm:px-6">
    {messages.length === 0 && !isSending && (
      <ConversationEmptyState
        title="How can MediGuard1 help?"
        description="Ask about medicine labels, ingredients, uses, or warnings."
        icon={<BotIcon className="size-7 text-indigo-500" />}
      />
    )}

    {messages.map((message) => (
      <article
        key={message.id}
        className={
          message.role === "user"
            ? "max-w-[90%] self-end rounded-2xl bg-indigo-600 px-4 py-3 text-white"
            : "max-w-[90%] self-start rounded-2xl bg-muted px-4 py-3 text-foreground"
        }
      >
        <p className="mb-1 text-xs font-semibold opacity-75">
          {message.role === "user" ? "You" : "MediGuard"}
        </p>

        {message.role === "assistant" ? (
          <Streamdown
            mode="static"
            skipHtml
            rehypePlugins={[]}
            allowedElements={["p", "strong", "em", "ul", "ol", "li", "h1", "h2", "h3", "h4", "blockquote", "code", "pre", "br", "hr", "a", "table", "thead", "tbody", "tr", "th", "td"]}
            className="min-w-0 break-words text-sm leading-relaxed [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5"
          >
            {message.content}
          </Streamdown>
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.content}
          </p>
        )}
      </article>
    ))}

    {isSending && (
      <p role="status" className="text-sm text-muted-foreground">
        MediGuard is preparing an answer…
      </p>
    )}
  </ConversationContent>
</Conversation>

        <section className="shrink-0 border-t bg-background/95 px-4 pb-4 pt-3 backdrop-blur sm:px-6">
          <div className="mx-auto w-full max-w-3xl space-y-3">
            <Suggestions>
              {suggestions.map((suggestion) => (
                <Suggestion
                  key={suggestion.label}
                  onClick={handleSuggestion}
                  suggestion={suggestion.draft}
                >
                  {suggestion.label}
                </Suggestion>
              ))}
            </Suggestions>
              {chatError && (
  <p role="alert" className="text-sm text-destructive">
    {chatError}
  </p>
)}
            <PromptInput
              accept="image/*"
              onDropCapture={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
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
                  placeholder="Ask a question about medicines......"
                  value={text}
                />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger
                      disabled
                      title="Image analysis is not available yet"
                    />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments label="Add medicine photos" />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                  <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsQrScannerOpen(true)}
                >
                  Scan QR
                </Button>
                  <span className="inline-flex h-7 items-center gap-1.5 rounded-md bg-muted px-2 text-xs font-medium text-muted-foreground">
                    <SparklesIcon className="size-3" />
                    MediGuard1
                  </span>
                </PromptInputTools>
                <PromptInputSubmit
  disabled={
    !user ||
    isSending ||
    isSigningOut ||
    !text.trim() ||
    text.trim().length > 4000
  }
  status={isSending ? "submitted" : "ready"}
  title={isSending ? "Waiting for an answer" : "Send message"}
  aria-label={isSending ? "Waiting for an answer" : "Send message"}
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

      <QrScannerDialog
        open={isQrScannerOpen}
        onOpenChange={setIsQrScannerOpen}
        onConfirm={handleQrConfirm}
      />
    </TooltipProvider>
  );
}