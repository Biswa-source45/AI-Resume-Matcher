/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
const LoadingSpinner = ({ size = "medium", className = "" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {" "}
      <motion.div
        className={`${sizeClasses[size]} border-2 border-primary-600 border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />{" "}
    </div>
  );
};
export default LoadingSpinner;
