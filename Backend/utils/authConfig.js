const DEFAULT_FRONTEND_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

function normalizeOrigin(value) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function parseOrigins(value) {
  return (value || "")
    .split(",")
    .map((entry) => normalizeOrigin(entry.trim()))
    .filter(Boolean);
}

function getConfiguredOrigins() {
  return [
    ...parseOrigins(process.env.FRONTEND_URL),
    ...parseOrigins(process.env.FRONTEND_URLS),
  ];
}

export function getAllowedOrigins() {
  return [...new Set([...getConfiguredOrigins(), ...DEFAULT_FRONTEND_ORIGINS])];
}

export function getPrimaryFrontendOrigin() {
  return getConfiguredOrigins()[0] || DEFAULT_FRONTEND_ORIGINS[0];
}

export function getCorsOptions() {
  const allowedOrigins = getAllowedOrigins();

  return {
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = normalizeOrigin(origin);

      if (normalizedOrigin && allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  };
}

function isHttpsForwarded(req) {
  const forwardedProto = req?.get("x-forwarded-proto");

  if (!forwardedProto) {
    return false;
  }

  return forwardedProto
    .split(",")
    .some((value) => value.trim().toLowerCase() === "https");
}

export function isSecureRequest(req) {
  const cookieSecure = process.env.COOKIE_SECURE?.trim().toLowerCase();

  if (cookieSecure === "true") {
    return true;
  }

  if (cookieSecure === "false") {
    return false;
  }

  return Boolean(req?.secure || isHttpsForwarded(req));
}

export function getCookieOptions(req, overrides = {}) {
  const secure = isSecureRequest(req);

  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    ...overrides,
  };
}

export function resolveFrontendUrl(pathname = "/") {
  const origin = getPrimaryFrontendOrigin();
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  return new URL(normalizedPath, `${origin}/`).toString();
}

export function getSafeGithubRedirectUri(redirectUri) {
  if (redirectUri) {
    try {
      const parsedUrl = new URL(redirectUri);
      const isAllowedOrigin = getAllowedOrigins().includes(parsedUrl.origin);

      if (isAllowedOrigin && parsedUrl.pathname === "/github-callback") {
        return parsedUrl.toString();
      }
    } catch {
      return resolveFrontendUrl("/github-callback");
    }
  }

  return resolveFrontendUrl("/github-callback");
}

export function getRequiredEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}
