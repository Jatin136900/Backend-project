import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../axios.Config";
import { useAuth } from "../contexts/AuthProvider";
import { githubCallbackUrl } from "../config/env";
import { toast } from "react-toastify";

function getGithubErrorMessage(error) {
  const responseData = error.response?.data;
  const contentType = error.response?.headers?.["content-type"] || "";

  if (typeof responseData === "string" && contentType.includes("text/html")) {
    return "Render API configuration is failing. Please check deployed backend CORS/env settings.";
  }

  if (!error.response) {
    return "Unable to reach the server. Please check the deployed API URL and CORS settings.";
  }

  return responseData?.message || "GitHub login failed";
}

export default function GithubCallback() {
  const navigate = useNavigate();
  const { setAuthenticatedSession } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const oauthState = params.get("state");
    const oauthError = params.get("error");
    const expectedState = sessionStorage.getItem("github_oauth_state");

    if (oauthError) {
      sessionStorage.removeItem("github_oauth_state");
      sessionStorage.removeItem("post_login_redirect");
      navigate("/login", { replace: true });
      return;
    }

    if (!code || !oauthState || !expectedState || oauthState !== expectedState) {
      sessionStorage.removeItem("github_oauth_state");
      sessionStorage.removeItem("post_login_redirect");
      navigate("/login", { replace: true });
      return;
    }

    async function githubLogin() {
      try {
        const response = await instance.post("/api/auth/github-login", {
          code,
          redirectUri: githubCallbackUrl,
        });
        const redirectTo = sessionStorage.getItem("post_login_redirect") || "/";

        sessionStorage.removeItem("github_oauth_state");
        sessionStorage.removeItem("post_login_redirect");
        setAuthenticatedSession("user", response.data);
        navigate(redirectTo, { replace: true });
      } catch (error) {
        console.error(error);
        console.error("GitHub login failed", error);
        toast.error(getGithubErrorMessage(error));
        sessionStorage.removeItem("github_oauth_state");
        sessionStorage.removeItem("post_login_redirect");
        navigate("/login", { replace: true });
      }
    }

    githubLogin();
  }, [navigate, setAuthenticatedSession]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">Logging in with GitHub...</p>
    </div>
  );
}
