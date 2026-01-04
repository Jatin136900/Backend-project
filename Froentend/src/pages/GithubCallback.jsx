import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../axios.Config";

export default function GithubCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      navigate("/login");
      return;
    }

    async function githubLogin() {
      try {
        await instance.post("/api/auth/github-login", { code });
        navigate("/");
      } catch (error) {
        console.error(error);
        console.error("GitHub login failed", error);
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
