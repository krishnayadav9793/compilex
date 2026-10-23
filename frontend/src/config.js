// Centralized API configuration for CompileX frontend
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://compilex-llai.onrender.com"
).replace(/\/+$/, "");
