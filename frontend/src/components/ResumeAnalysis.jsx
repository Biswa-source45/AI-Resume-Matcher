/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Lightbulb,
  TrendingUp,
  Users,
  Award,
  Target,
  BarChart3,
  PieChart as PieIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const ResumeAnalysis = ({ analysis }) => {
  const [activeSection, setActiveSection] = useState("summary");
  const [roleChartType, setRoleChartType] = useState("bar");

  const sections = [
    { id: "summary", label: "Summary", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Lightbulb },
    { id: "roles", label: "Job Roles", icon: Target },
    { id: "insights", label: "Insights", icon: BarChart3 },
  ];

  // Skills Data
  const skillsData = [
    ...(analysis.soft_skills || []).slice(0, 5).map((skill) => ({
      name: skill,
      value: Math.floor(Math.random() * 30) + 70,
    })),
    ...(analysis.technical_skills || []).slice(0, 5).map((skill) => ({
      name: skill,
      value: Math.floor(Math.random() * 30) + 70,
    })),
  ];

  // Job Roles Data
  const rolesData = (analysis.job_roles || []).slice(0, 5).map((role) => ({
    name: role,
    value: Math.floor(Math.random() * 40) + 60,
  }));

  const COLORS = ["#0ea5e9", "#d946ef", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-neutral-900">Resume Analysis</h2>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-neutral-600">
              {analysis.experience_level || "Intermediate"} Level
            </span>
          </div>
        </div>

        <p className="text-neutral-600 leading-relaxed mb-4">
          {analysis.summary_text || "No summary available for this resume."}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-600 font-medium">
              {analysis.sentiment || "Positive"}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-blue-600 font-medium">
              {analysis.tone || "Professional"} Tone
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-2 overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  activeSection === section.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium whitespace-nowrap">
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Content */}
      <AnimatePresence mode="wait">
        {activeSection === "summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6"
          >
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              Executive Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">
                  Key Strengths
                </h4>
                <ul className="space-y-2">
                  {(analysis.soft_skills || [])
                    .slice(0, 4)
                    .map((skill, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-neutral-700">{skill}</span>
                      </li>
                    ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-neutral-900 mb-2">
                  Technical Expertise
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(analysis.technical_skills || [])
                    .slice(0, 6)
                    .map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === "skills" && (
          <motion.div
            key="skills"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 overflow-x-auto"
          >
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              Skills Analysis
            </h3>

            <div className="h-80 min-w-[600px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={skillsData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {activeSection === "roles" && (
          <motion.div
            key="roles"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 overflow-x-auto"
          >
            <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
              <h3 className="text-xl font-semibold text-neutral-900">
                Recommended Job Roles
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setRoleChartType("bar")}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium ${
                    roleChartType === "bar"
                      ? "bg-blue-100 text-blue-700"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Bar</span>
                </button>
                <button
                  onClick={() => setRoleChartType("pie")}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium ${
                    roleChartType === "pie"
                      ? "bg-blue-100 text-blue-700"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <PieIcon className="w-4 h-4" />
                  <span>Pie</span>
                </button>
              </div>
            </div>

            <div className="h-80 min-w-[600px]">
              {roleChartType === "bar" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={rolesData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="value"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={rolesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {rolesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
        )}

        {activeSection === "insights" && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6"
          >
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              Career Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">
                  Market Position
                </h4>
                <p className="text-blue-700 text-sm mb-3">
                  Your resume aligns well with current job market trends.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                  <span className="text-xs font-medium text-blue-900">85%</span>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">
                  Skill Diversity
                </h4>
                <p className="text-green-700 text-sm mb-3">
                  Excellent mix of technical and interpersonal strengths.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-full bg-green-200 rounded-full h-2">
                    
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "92%" }}
                    />
                  </div>
                  <span className="text-xs font-medium text-green-900">92%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeAnalysis;
