/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, LogOut, Brain, FileText, Menu, X } from "lucide-react";
import useAuthStore from "../store/authStore";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const result = await signOut();

    if (result?.success) {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });

      navigate("/login", { replace: true });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wrapper */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 text-lg sm:text-xl font-bold text-black"
          >
            <Brain className="w-6 h-6 text-primary-600" />
            <span>AI Resume Matcher</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="flex items-center space-x-1 text-neutral-600 hover:text-primary-600 transition-colors duration-200"
            >
              <FileText className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-700 font-medium">
                  {user?.displayName ||
                    user?.email?.split("@")[0] ||
                    "User"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-neutral-600 hover:text-red-600 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-neutral-700 hover:text-primary-600 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="md:hidden border-t border-neutral-200 bg-white shadow-sm"
        >
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2 text-neutral-700 hover:text-primary-600 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <div className="flex items-center space-x-2 text-neutral-700">
              <User className="w-4 h-4 text-neutral-500" />
              <span className="text-sm font-medium">
                {user?.displayName ||
                  user?.email?.split("@")[0] ||
                  "User"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
