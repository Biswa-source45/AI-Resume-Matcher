/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import useAuthStore from "../store/authStore";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, loading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;
    const result = await signUp(formData.email, formData.password);
    if (result?.success) navigate("/dashboard");
  };

  const handleGoogleSignup = async () => {
    const result = await signInWithGoogle();
    if (result?.success) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-50 via-white to-secondary-50 px-4 relative overflow-hidden">
      {/* Decorative blurred gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-72 h-72 bg-primary-200/40 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-neutral-200 rounded-2xl shadow-2xl p-8"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="flex items-center justify-center space-x-2 text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary-600 to-secondary-600"
          >
            <div className="w-9 h-9 bg-linear-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center text-blue-600 font-bold text-2xl shadow-md">
              AI
            </div>
            <span className="text-black bg-clip-text bg-linear-to-r from-primary-600 to-secondary-600">
              Resume Matcher
            </span>
          </motion.div>
          <p className="text-neutral-700 mt-1">
            Create your account to get started
          </p>
        </div>

        <ErrorMessage error={error} onClose={clearError} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none"
            />
            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  Passwords do not match
                </p>
              )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              loading || formData.password !== formData.confirmPassword
            }
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-primary-600 to-secondary-600 cursor-pointer text-black py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60 transition-all duration-200 border-dashed border"
          >
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-neutral-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Signup Only */}
        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-lg font-medium text-neutral-700 shadow-md border border-neutral-300 bg-white hover:bg-neutral-50 transition-all duration-200"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Sign up with Google</span>
        </button>

        {/* Login Link */}
        <p className="text-center mt-6 text-sm text-neutral-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
