import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ redirect }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  // We hardcode localhost for now to test. Later we will make this dynamic.
  const redirectUri = "http://localhost:4321/api/auth/callback"; 
  const scope = "repo,user"; // 'repo' gives read/write access

  return redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
  );
};