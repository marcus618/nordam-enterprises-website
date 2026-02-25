import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url, redirect }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const scope = "repo,user"; 
  
  // dynamically construct the redirect_uri based on the current URL (works in dev and prod)
  const redirectUri = `${url.origin}/api/auth/callback`; 

  return redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
  );
};