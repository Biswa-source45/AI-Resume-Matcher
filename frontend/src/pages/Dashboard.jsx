/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  AlertCircle,
  Brain,
  MessageCircle,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { api } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ResumeAnalysis from "../components/ResumeAnalysis";
import ChatBox from "../components/ChatBox";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const INFO_POPUP_KEY = "resume_analyzer_info_shown";

// Helper to validate PDF by checking file signature
const isPdfByBytes = async (file) => {
  try {
    const arr = await file.arrayBuffer();
    const header = new Uint8Array(arr.slice(0, 4));
    // PDF signature: %PDF
    return (
      header[0] === 0x25 &&
      header[1] === 0x50 &&
      header[2] === 0x44 &&
      header[3] === 0x46
    );
  } catch (err) {
    console.warn("PDF validation failed:", err);
    return false;
  }
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const fileInputRef = useRef(null);
  const [showInfoPopup, setShowInfoPopup] = useState(false); // Default to false

  useEffect(() => {
    let mounted = true;

    const loadExistingAnalysis = async () => {
      if (!user?.email) return;
      try {
        const response = await api.getSummaries();
        if (mounted && response?.summaries?.length > 0) {
          setAnalysis(response.summaries[0]);
          setActiveTab("analysis");
        }
      } catch (err) {
        console.warn("Failed to load existing analysis:", err);
      }
    };

    loadExistingAnalysis();
    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    // Only check sessionStorage after the component has mounted
    const hasShown = sessionStorage.getItem(INFO_POPUP_KEY);
    if (!hasShown) {
      setShowInfoPopup(true);
    }
  }, []);

  const handleFileUpload = async (event) => {
    setError(null);
    const file = event.target?.files?.[0];
    if (!file) return;

    // More permissive PDF validation for mobile browsers
    const isPdfType = file.type === "application/pdf";
    const nameLooksPdf = file.name?.toLowerCase().endsWith(".pdf");
    let looksLikePdf = isPdfType || nameLooksPdf;

    if (!looksLikePdf) {
      // Fallback: check PDF signature
      looksLikePdf = await isPdfByBytes(file);
    }

    if (!looksLikePdf) {
      setError("Please upload a valid PDF file");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 10MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response = await api.analyzeResume(file);
      const newAnalysis = response?.analysis || response;
      setAnalysis(newAnalysis);
      setActiveTab("analysis");

      // Refresh summaries list in background
      try {
        await api.getSummaries();
      } catch (e) {
        console.warn("Failed to refresh summaries:", e);
      }
    } catch (err) {
      console.error("Upload/analysis failed:", err);
      setError(err?.message || "Failed to analyze resume. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleStartChat = () => {
    if (!analysis) {
      setError("Please upload and analyze a resume first");
      return;
    }
    setShowChat(true);
  };

  const handleCloseInfo = () => {
    sessionStorage.setItem(INFO_POPUP_KEY, "true");
    setShowInfoPopup(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center sm:text-left"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            Welcome back, {user?.email?.split("@")[0] || "User"}!
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base">
            Upload your resume to get AI-powered career insights and analysis
          </p>
        </motion.div>

        {/* Error Message */}
        <ErrorMessage error={error} onClose={() => setError(null)} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Section */}
          <div className="lg:col-span-2">
            {activeTab === "upload" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-primary-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
                    Upload Your Resume
                  </h2>
                  <p className="text-neutral-600 text-sm sm:text-base">
                    Get instant AI analysis and career recommendations
                  </p>
                </div>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 sm:p-12 text-center hover:border-primary-400 transition-colors duration-200">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer flex flex-col items-center space-y-4"
                  >
                    <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-neutral-900 mb-1">
                        {uploading
                          ? "Analyzing your resume..."
                          : "Choose PDF file"}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {uploading
                          ? "Our AI is analyzing your resume..."
                          : "Tap to select or drag and drop"}
                      </p>
                    </div>
                    {uploading && <LoadingSpinner size="large" />}
                  </label>
                </div>

                {/* Features */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Keep existing feature sections */}
                  {/* ... existing feature grid items ... */}
                </div>
              </motion.div>
            )}

            {activeTab === "analysis" && analysis && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <ResumeAnalysis analysis={analysis} />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 text-center sm:text-left">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`w-full text-left px-4 py-3 border-dashed border rounded-lg transition-colors duration-200 ${
                    activeTab === "upload"
                      ? "bg-primary-50 text-primary-700 border border-primary-200"
                      : "hover:bg-neutral-50 text-neutral-700"
                  }`}
                >
                  <div className="flex items-center space-x-3 justify-center sm:justify-start">
                    <Upload className="w-5 h-5" />
                    <span>Upload New Resume</span>
                  </div>
                </button>

                {analysis && (
                  <button
                    onClick={() => setActiveTab("analysis")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeTab === "analysis"
                        ? "bg-primary-50 text-primary-700 border border-primary-200"
                        : "hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <div className="flex items-center space-x-3 justify-center sm:justify-start">
                      <FileText className="w-5 h-5" />
                      <span>View Analysis</span>
                    </div>
                  </button>
                )}

                {analysis && (
                  <button
                    onClick={handleStartChat}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary-50 text-secondary-700 border border-secondary-200 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3 justify-center sm:justify-start">
                      <MessageCircle className="w-5 h-5" />
                      <span>Chat with AI</span>
                    </div>
                  </button>
                )}
              </div>

              {analysis && (
                <div className="mt-6 pt-6 border-t border-neutral-200 text-center sm:text-left">
                  <h4 className="font-medium text-neutral-900 mb-3">
                    Recent Analysis
                  </h4>
                  <div className="text-sm text-neutral-600 space-y-1">
                    <p>
                      <span className="font-medium">File:</span>{" "}
                      {analysis.resume_title}
                    </p>
                    <p>
                      <span className="font-medium">Experience:</span>{" "}
                      {analysis.experience_level}
                    </p>
                    <p>
                      <span className="font-medium">Sentiment:</span>{" "}
                      {analysis.sentiment}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfoPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { delay: 0.1 } }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="flex flex-col items-center text-center">
                <AlertCircle className="h-12 w-12 text-amber-500" />
                <h3 className="mt-4 text-xl font-semibold text-neutral-900">
                  Device Compatibility Notice
                </h3>
                <p className="mt-2 text-sm text-neutral-600">
                  For the best experience, we recommend using a desktop or
                  laptop computer. Some features like file upload and analysis
                  may have limited functionality on mobile devices.
                </p>
                <button
                  onClick={handleCloseInfo}
                  className="mt-6 w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-black shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Got it, thanks
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <ChatBox analysis={analysis} onClose={() => setShowChat(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
