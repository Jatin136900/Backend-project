import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../axios.Config";
import { useAuth } from "../contexts/AuthProvider";

export default function GithubCallback() {
  const navigate = useNavigate();
  const { setAuthenticatedSession } = useAuth();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      navigate("/login");
      return;
    }

    async function githubLogin() {
      try {
        const response = await instance.post("/api/auth/github-login", { code });
        const redirectTo = sessionStorage.getItem("post_login_redirect") || "/";

        sessionStorage.removeItem("post_login_redirect");
        setAuthenticatedSession("user", response.data);
        navigate(redirectTo);
      } catch (error) {
        console.error(error);
        console.error("GitHub login failed", error);
        sessionStorage.removeItem("post_login_redirect");
        navigate("/login");
      }
    }

    githubLogin();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">Logging in with GitHub...</p>
    </div>
  );
}
