import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get("code");
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_CLIENT_SECRET;

  if (!code) {
    return new Response("No code provided", { status: 400 });
  }

  try {
    // 1. Exchange the code for an access token
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(data.error_description || "Unknown error", { status: 400 });
    }

    const accessToken = data.access_token;

    // 2. Set the session cookie (HttpOnly for security)
    cookies.set("github_token", accessToken, {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD, // Only use secure cookies in production (HTTPS)
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // 3. Redirect to the Admin Dashboard (we'll build this next)
    return redirect("/admin");
  } catch (error) {
    console.error(error);
    return new Response("Authentication failed", { status: 500 });
  }
};