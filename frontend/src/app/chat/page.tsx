"use client";

import { Streamdown } from "streamdown";
import { sendChatMessage } from "@/lib/api";
import QrScannerDialog from "@/components/QR/qr-scanner-dialog";
import TermsDialog from "@/components/terms-dialog";
import ThemeToggle from "@/app/components/theme-toggle";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Home,
  Lock,
  LogOut,
  MessageSquare,
  PanelLeft,
  Paperclip,
  Plus,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  SquarePen,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  {
    title: "Explain medicine packaging",
    prompt: "Can you explain this medicine packaging label and its active ingredients: [paste medicine name or label details]?",
  },
  {
    title: "Check drug interactions",
    prompt: "Are there any known drug interactions between [Medicine A] and [Medicine B]?",
  },
  {
    title: "Dosage & precautions",
    prompt: "What are the common dosage directions, precautions, and missed-dose rules for [medicine name]?",
  },
  {
    title: "Storage & expiration rules",
    prompt: "How should [medicine name] be stored properly, and what does the lot/expiry code mean?",
  },
];

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mandatory Safety Terms Agreement State
  const [hasAgreedTerms, setHasAgreedTerms] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [isDecliningTerms, setIsDecliningTerms] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
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
      setIsAuthReady(true);
      if (!currentUser) {
        setHasAgreedTerms(false);
        setShowTermsModal(false);
        router.replace("/login?redirect=/chat&required=true");
      } else {
        const agreed =
          typeof window !== "undefined" &&
          localStorage.getItem(`mediguard_terms_agreed_${currentUser.uid}`) === "true";
        setHasAgreedTerms(agreed);
        setShowTermsModal(!agreed);
      }
    });
  }, [router]);

  const handleAcceptTerms = useCallback(() => {
    if (user) {
      localStorage.setItem(`mediguard_terms_agreed_${user.uid}`, "true");
    }
    setHasAgreedTerms(true);
    setShowTermsModal(false);
  }, [user]);

  const handleDeclineTerms = useCallback(async () => {
    setIsDecliningTerms(true);
    try {
      if (user) {
        localStorage.removeItem(`mediguard_terms_agreed_${user.uid}`);
      }
      await signOut(auth);
      router.replace("/");
    } finally {
      setIsDecliningTerms(false);
    }
  }, [user, router]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isSending]);

  // Auto-resize textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  };

  const handleStartNewChat = useCallback(() => {
    setMessages([]);
    setText("");
    setChatError(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, []);

  const handleQrConfirm = useCallback((decodedText: string) => {
    const scannedContent = `Scanned QR content: ${decodedText}`;
    setText((current) =>
      current ? `${current}\n${scannedContent}` : scannedContent
    );
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSendMessage = useCallback(
    async (textToSend?: string) => {
      const query = (textToSend ?? text).trim();

      if (sendingRef.current) return;

      if (!hasAgreedTerms) {
        setShowTermsModal(true);
        return;
      }

      if (!user || isSigningOut || auth.currentUser?.uid !== user.uid) {
        setChatError("Please sign in before sending a message.");
        return;
      }

      if (!query || query.length > 4000) {
        setChatError("Please enter a question between 1 and 4000 characters.");
        return;
      }

      if (/\[(medicine[^\]]*|paste[^\]]*)\]/i.test(query)) {
        setChatError(
          "Replace the text in brackets with your medicine details before sending."
        );
        return;
      }

      sendingRef.current = true;
      setIsSending(true);
      setChatError(null);

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: query,
      };

      setMessages((prev) => [...prev, userMessage]);
      setText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      try {
        const answer = await sendChatMessage(user, query, messages);

        if (auth.currentUser?.uid !== user.uid) {
          throw new Error("Your session changed. Please sign in again.");
        }

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: answer,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        setChatError(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
        );
      } finally {
        sendingRef.current = false;
        setIsSending(false);
      }
    },
    [text, user, isSigningOut, messages, hasAgreedTerms]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSending && text.trim()) {
        handleSendMessage();
      }
    }
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    try {
      await signOut(auth);
      router.replace("/login");
    } finally {
      setIsSigningOut(false);
    }
  }, [router]);

  if (!isAuthReady || !user) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 p-4 text-white">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-24 size-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 size-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center rounded-3xl border border-white/10 bg-neutral-900/90 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/25">
            <Lock className="size-7" />
          </div>

          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
            <ShieldAlert className="size-3.5 text-amber-400" />
            Authentication Required
          </span>

          <h1 className="text-xl font-bold tracking-tight text-white">
            Sign In to Access MediGuard AI
          </h1>

          <p className="mt-2 text-xs leading-relaxed text-neutral-400">
            MediGuard AI assistant and medicine information and verification tools are reserved for registered users to maintain safety audit logs.
          </p>

          <div className="mt-6 flex w-full flex-col gap-2.5">
            <Link
              href="/login?redirect=/chat&required=true"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] hover:bg-indigo-500 active:scale-[0.98]"
            >
              <span>Sign In / Create Account</span>
              <ArrowUp className="size-4 rotate-45 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2.5 text-xs font-medium text-neutral-400 transition-all hover:bg-white/5 hover:text-white"
            >
              <Home className="size-3.5" />
              <span>Return to Homepage</span>
            </Link>
          </div>

          <div className="mt-5 flex items-center gap-2 text-[11px] text-neutral-500">
            <div className="size-3 animate-spin rounded-full border-2 border-neutral-600 border-t-indigo-400" />
            <span>Redirecting to login portal...</span>
          </div>
        </div>
      </main>
    );
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-screen overflow-hidden bg-white text-neutral-900 dark:bg-[#212121] dark:text-[#ececec]">
      {/* ChatGPT Style Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col justify-between border-r border-neutral-200 bg-[#f9f9f9] transition-transform duration-300 md:static md:translate-x-0 dark:border-white/5 dark:bg-[#171717] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:-ml-[260px]"
        }`}
      >
        {/* Top Sidebar Bar */}
        <div className="flex flex-col p-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-neutral-200/60 dark:hover:bg-[#212121]"
              title="MediGuard AI Homepage"
            >
              <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                <ShieldCheck className="size-4" />
              </div>
              <span className="text-sm font-semibold tracking-tight">MediGuard AI</span>
            </Link>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-200/60 hover:text-neutral-900 md:hidden dark:text-neutral-400 dark:hover:bg-[#212121] dark:hover:text-white"
              title="Close sidebar"
            >
              <PanelLeft className="size-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={handleStartNewChat}
            className="group mt-4 flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-medium shadow-2xs transition-all duration-200 hover:scale-[1.01] hover:bg-neutral-50 active:scale-[0.98] dark:border-white/10 dark:bg-[#212121] dark:hover:bg-[#2a2a2a]"
          >
            <span className="flex items-center gap-2.5">
              <Plus className="size-4 transition-transform duration-200 group-hover:rotate-90 text-indigo-500" />
              New chat
            </span>
            <SquarePen className="size-4 text-neutral-400 transition-transform duration-200 group-hover:scale-110" />
          </button>

          {/* Recent History / Current Context */}
          <div className="mt-6 flex flex-col gap-1 text-xs">
            <span className="px-3 py-1 font-semibold text-neutral-400 uppercase tracking-wider dark:text-neutral-500">
              Active Session
            </span>
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-lg bg-neutral-200/60 px-3 py-2 text-left font-medium text-neutral-900 dark:bg-[#212121] dark:text-white"
            >
              <MessageSquare className="size-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">
                {messages[0]?.content.slice(0, 24) || "New conversation"}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom User Profile */}
        <div className="border-t border-neutral-200 p-3 dark:border-white/5">
          <div className="flex items-center justify-between rounded-xl p-2 hover:bg-neutral-200/60 dark:hover:bg-[#212121]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white uppercase">
                {user?.displayName?.[0] || user?.email?.[0] || "U"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-xs font-semibold">
                  {user?.displayName || "User"}
                </span>
                <span className="truncate text-[11px] text-neutral-400">
                  {user?.email}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-white/10 dark:hover:text-white"
                title="Sign out"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between px-2 pt-2 text-[11px] text-neutral-400">
            <Link href="/" className="hover:text-neutral-900 dark:hover:text-white flex items-center gap-1">
              <Home className="size-3" /> Home
            </Link>
            <Link href="/about" className="hover:text-neutral-900 dark:hover:text-white">
              Disclaimer
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Chat Canvas */}
      <main className="relative flex flex-1 flex-col overflow-hidden">
        {/* Top Bar (Minimalist like ChatGPT) */}
        <header className="flex h-12 shrink-0 items-center justify-between px-3 md:px-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
              title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <PanelLeft className="size-5" />
            </button>

            {/* Model Selector Pill (ChatGPT 4o style) */}
            <div className="flex items-center gap-1 rounded-xl px-2.5 py-1 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-white/10 cursor-pointer">
              <span>MediGuard 2.4</span>
              <ChevronDown className="size-3.5 text-neutral-400" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
              title="Review safety terms and liability limitations"
            >
              <ShieldAlert className="size-3 text-amber-500" />
              <span>Safety Terms</span>
            </button>

            <button
              type="button"
              onClick={handleStartNewChat}
              className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 md:hidden dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
              title="New chat"
            >
              <SquarePen className="size-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Conversation or Center Empty State */}
        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            /* ChatGPT Empty State */
            <div className="flex min-h-[calc(100vh-140px)] flex-col items-center justify-center px-4 pb-20">
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white text-center">
                What can I help with?
              </h1>

              {/* Suggestions Cards (ChatGPT style) */}
              <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {SUGGESTIONS.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => {
                      if (!hasAgreedTerms) {
                        setShowTermsModal(true);
                        return;
                      }
                      setText(item.prompt);
                      if (textareaRef.current) {
                        textareaRef.current.focus();
                      }
                    }}
                    className="group lucid-card-hover flex flex-col items-start rounded-2xl border border-neutral-200/80 bg-neutral-50/60 p-4 text-left shadow-2xs hover:bg-neutral-100/80 hover:border-neutral-300 hover:shadow-md active:scale-[0.98] dark:border-white/10 dark:bg-[#1f1f1f] dark:hover:bg-[#282828] dark:hover:border-white/20"
                  >
                    <span className="text-sm font-medium text-neutral-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                      {item.title}
                    </span>
                    <span className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                      {item.prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages Stream */
            <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`animate-fade-in flex flex-col ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  {message.role === "user" ? (
                    /* User Message: Clean Right Bubble */
                    <div className="max-w-[85%] rounded-[22px] bg-[#f4f4f4] px-5 py-3 text-[15px] leading-relaxed text-neutral-900 shadow-2xs transition-all sm:max-w-[75%] dark:bg-[#2f2f2f] dark:text-[#ececec]">
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                  ) : (
                    /* Assistant Message: Clean Left-aligned Stream (No Box!) */
                    <div className="group w-full max-w-full text-[15px] leading-relaxed text-neutral-900 dark:text-[#ececec]">
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <Streamdown
                          mode="static"
                          skipHtml
                          rehypePlugins={[]}
                          allowedElements={[
                            "p",
                            "strong",
                            "em",
                            "ul",
                            "ol",
                            "li",
                            "h1",
                            "h2",
                            "h3",
                            "h4",
                            "blockquote",
                            "code",
                            "pre",
                            "br",
                            "hr",
                            "a",
                            "table",
                            "thead",
                            "tbody",
                            "tr",
                            "th",
                            "td",
                          ]}
                          className="[&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5"
                        >
                          {message.content}
                        </Streamdown>
                      </div>

                      {/* Minimalist Action Toolbar below response */}
                      <div className="mt-2 flex items-center gap-1 text-neutral-400 opacity-80 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleCopy(message.id, message.content)}
                          className="flex items-center gap-1 rounded-md p-1.5 transition-transform duration-150 hover:scale-115 active:scale-85 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-white/10 dark:hover:text-white"
                          title="Copy response"
                        >
                          {copiedId === message.id ? (
                            <Check className="size-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          className="rounded-md p-1.5 transition-transform duration-150 hover:scale-115 active:scale-85 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-white/10 dark:hover:text-white"
                          title="Good response"
                        >
                          <ThumbsUp className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          className="rounded-md p-1.5 transition-transform duration-150 hover:scale-115 active:scale-85 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-white/10 dark:hover:text-white"
                          title="Bad response"
                        >
                          <ThumbsDown className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isSending && (
                <div className="animate-fade-in flex items-center gap-2 text-sm text-neutral-400">
                  <span className="flex size-2 animate-ping rounded-full bg-indigo-500" />
                  <span>MediGuard is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ChatGPT Style Bottom Input Composer */}
        <div className="shrink-0 bg-white/80 p-4 backdrop-blur-md dark:bg-[#212121]/80">
          <div className="mx-auto max-w-3xl">
            {chatError && (
              <div className="animate-fade-in mb-2 flex items-center justify-between rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                <span>{chatError}</span>
                <button
                  type="button"
                  onClick={() => setChatError(null)}
                  className="font-bold hover:underline"
                >
                  ✕
                </button>
              </div>
            )}

            {/* The Iconic ChatGPT Pill Container */}
            <div className="relative flex flex-col rounded-[26px] border border-black/10 bg-[#f4f4f4] px-4 pt-3 pb-2 shadow-xs transition-all focus-within:border-black/20 focus-within:shadow-md dark:border-white/10 dark:bg-[#2f2f2f] dark:focus-within:border-white/20">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                disabled={isSending || !hasAgreedTerms}
                placeholder={hasAgreedTerms ? "Message MediGuard..." : "Please accept safety terms to use assistant..."}
                rows={1}
                className="max-h-[200px] min-h-[24px] w-full resize-none bg-transparent text-[15px] leading-relaxed text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white dark:placeholder:text-neutral-500 disabled:opacity-50"
              />

              {/* Bottom Action Row inside the Pill */}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled
                    title="Image attachment is coming soon"
                    className="flex size-8 items-center justify-center rounded-full text-neutral-400 transition-transform duration-150 hover:scale-105 active:scale-95 disabled:opacity-40 dark:text-neutral-400 dark:hover:bg-white/10"
                  >
                    <Plus className="size-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!hasAgreedTerms) {
                        setShowTermsModal(true);
                        return;
                      }
                      setIsQrScannerOpen(true);
                    }}
                    disabled={!hasAgreedTerms}
                    className="flex items-center gap-1.5 rounded-full border border-neutral-300/80 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-2xs transition-all duration-150 hover:scale-105 hover:bg-neutral-100 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 dark:border-white/10 dark:bg-[#242424] dark:text-neutral-300 dark:hover:bg-[#2c2c2c]"
                    title="Scan GS1 DataMatrix or packaging QR"
                  >
                    <QrCode className="size-3.5 text-indigo-500" />
                    <span>Scan QR</span>
                  </button>
                </div>

                {/* Circular Send Arrow Button */}
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!text.trim() || isSending || !hasAgreedTerms}
                  className="flex size-8 items-center justify-center rounded-full bg-black text-white shadow-xs transition-all duration-150 hover:scale-105 hover:opacity-90 active:scale-90 disabled:scale-100 disabled:opacity-20 dark:bg-white dark:text-black"
                  aria-label="Send message"
                >
                  <ArrowUp className="size-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Subtle disclaimer below composer */}
            <p className="mt-2 text-center text-[11px] text-neutral-400 dark:text-neutral-500">
              MediGuard can make mistakes. Check important medical information with a doctor or pharmacist.
            </p>
          </div>
        </div>
      </main>

      <QrScannerDialog
        open={isQrScannerOpen}
        onOpenChange={setIsQrScannerOpen}
        onConfirm={handleQrConfirm}
      />

      <TermsDialog
        isOpen={showTermsModal}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
        isDeclining={isDecliningTerms}
      />
    </div>
  );
}