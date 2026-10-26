// Centralized API configuration for CompileX frontend
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000" || "https://compilex-1-q73y.onrender.com"
).replace(/\/+$/, "");
