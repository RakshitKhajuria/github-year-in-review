"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

interface ErrorScreenProps {
  error: string;
  username: string;
}

export function ErrorScreen({ error, username }: ErrorScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-github-darker px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        {/* Error icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="mb-6 inline-flex p-4 rounded-full bg-red-500/10"
        >
          <AlertCircle className="w-12 h-12 text-red-400" />
        </motion.div>

        {/* Error message */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white mb-4"
        >
          Oops! Something went wrong
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-github-muted mb-2"
        >
          We couldn&apos;t generate the wrapped for{" "}
          <span className="text-white font-medium">@{username}</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-red-400 text-sm mb-8 p-3 bg-red-500/10 rounded-lg"
        >
          {error}
        </motion.p>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-left mb-8 p-4 bg-white/5 rounded-lg"
        >
          <p className="text-white font-medium mb-2">Things to try:</p>
          <ul className="text-github-muted text-sm space-y-1">
            <li>• Check if the username is correct</li>
            <li>• Make sure the user has public contributions</li>
            <li>• Try adding a Personal Access Token for private repos</li>
            <li>• Wait a moment and try again (rate limits)</li>
          </ul>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-github-green text-white rounded-lg hover:bg-github-green/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

