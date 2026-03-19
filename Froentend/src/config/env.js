const LOCAL_API_BASE_URL = "http://localhost:3000";
const LOCAL_APP_ORIGIN = "http://localhost:5173";
const RENDER_API_BASE_URL = "https://backend-project-1-u8y5.onrender.com";
const DEFAULT_GOOGLE_CLIENT_ID =
  "750188595668-5n74cf33celldtk5jsvj8mqm29d0c8nf.apps.googleusercontent.com";
const DEFAULT_GITHUB_CLIENT_ID = "Ov23lil3WYgOhfmBSc1z";

function normalizeValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function trimTrailingSlash(value) {
  return normalizeValue(value).replace(/\/+$/, "");
}

const browserOrigin =
  typeof window !== "undefined" ? trimTrailingSlash(window.location.origin) : "";

export const apiBaseUrl = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BASEURL ||
    (import.meta.env.DEV ? LOCAL_API_BASE_URL : RENDER_API_BASE_URL)
);

export const appOrigin =
  trimTrailingSlash(import.meta.env.VITE_APP_ORIGIN) ||
  browserOrigin ||
  LOCAL_APP_ORIGIN;

export const googleClientId = normalizeValue(
  import.meta.env.VITE_GOOGLE_CLIENT_ID
) || DEFAULT_GOOGLE_CLIENT_ID;

export const githubClientId = normalizeValue(
  import.meta.env.VITE_GITHUB_CLIENT_ID
) || DEFAULT_GITHUB_CLIENT_ID;

export const githubCallbackUrl =
  trimTrailingSlash(import.meta.env.VITE_GITHUB_CALLBACK_URL) ||
  `${appOrigin}/github-callback`;

export function resolveBackendUrl(path = "") {
  if (!path) {
    return apiBaseUrl || "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return apiBaseUrl ? `${apiBaseUrl}${normalizedPath}` : normalizedPath;
}
