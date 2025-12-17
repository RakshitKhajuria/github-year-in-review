"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronDown,
  Star,
  GitPullRequest,
  GitCommit,
  Code2,
} from "lucide-react";
import { isValidGitHubUsername, getCurrentYear } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [year, setYear] = useState(getCurrentYear());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const currentYear = getCurrentYear();
  const years = Array.from({ length: currentYear - 2007 }, (_, i) => currentYear - i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter a GitHub username");
      return;
    }

    if (!isValidGitHubUsername(username.trim())) {
      setError("Invalid GitHub username format");
      return;
    }

    setIsLoading(true);

    // Build query params
    const params = new URLSearchParams({
      year: year.toString(),
    });

    // Only add token if provided (optional - for private repos)
    if (token.trim()) {
      params.set("token", token.trim());
    }

    // Navigate to wrapped page
    router.push(`/wrapped/${username.trim()}?${params.toString()}`);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-github-darker">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-github-darker to-blue-900/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Github className="w-12 h-12 text-white" />
            </motion.div>
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="text-white">GitHub</span>{" "}
            <span className="text-gradient gradient-primary">Wrapped</span>
          </h1>

          <p className="text-xl md:text-2xl text-github-muted max-w-lg mx-auto">
            Your year in code, beautifully visualized
          </p>
        </motion.div>

        {/* Features preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {[
            { icon: GitCommit, label: "Commits", color: "text-github-green" },
            { icon: Code2, label: "Languages", color: "text-github-purple" },
            { icon: GitPullRequest, label: "Pull Requests", color: "text-github-accent" },
            { icon: Star, label: "Achievements", color: "text-yellow-400" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 glass rounded-full"
            >
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-sm text-github-text">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full max-w-md"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Github className="w-5 h-5 text-github-muted" />
              </div>
              <input
                type="text"
                placeholder="Enter GitHub username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-github-dark border border-github-border rounded-xl text-white placeholder-github-muted focus:outline-none focus:ring-2 focus:ring-github-accent focus:border-transparent transition-all"
              />
            </div>

            {/* Year selector */}
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full px-4 py-4 bg-github-dark border border-github-border rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-github-accent focus:border-transparent transition-all"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y} {y === currentYear && "(Current Year)"}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-github-muted pointer-events-none" />
            </div>

            {/* Token input (optional - for private repos) */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowTokenInput(!showTokenInput)}
                className="w-full flex items-center justify-between px-4 py-3 bg-github-dark border border-github-border rounded-xl hover:border-github-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-github-muted" />
                  <span className="text-github-text">Include private repositories (optional)</span>
                </div>
                <div
                  className={`w-10 h-6 rounded-full transition-colors ${
                    showTokenInput ? "bg-github-green" : "bg-github-border"
                  }`}
                >
                  <motion.div
                    className="w-4 h-4 bg-white rounded-full mt-1"
                    animate={{ x: showTokenInput ? 22 : 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>

              {/* Token input */}
              <AnimatePresence>
                {showTokenInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="relative">
                      <input
                        type={showToken ? "text" : "password"}
                        placeholder="GitHub Personal Access Token (optional)"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full pl-4 pr-12 py-4 bg-github-dark border border-github-border rounded-xl text-white placeholder-github-muted focus:outline-none focus:ring-2 focus:ring-github-accent focus:border-transparent transition-all font-mono text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-github-muted hover:text-white transition-colors"
                      >
                        {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-github-muted">
                      Your token is never stored. It&apos;s only used once to fetch your data.{" "}
                      <a
                        href="https://github.com/settings/tokens/new?scopes=repo,read:user&description=GitHub%20Wrapped"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-github-accent hover:underline"
                      >
                        Create a token →
                      </a>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-github-green to-emerald-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-github-green/25 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Unwrapping your year...</span>
                </>
              ) : (
                <>
                  <span>Generate Your Wrapped</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-github-muted text-sm"
        >
          <p className="mb-2">
            Built with 💚 inspired by{" "}
            <span className="text-github-green">Spotify Wrapped</span>
          </p>
          <p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              View on GitHub
            </a>
          </p>
        </motion.footer>
      </div>
    </main>
  );
}

