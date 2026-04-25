export { renderers } from '../../../renderers.mjs';

const GET = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get("code");
  const clientId = "Iv23lifBZ6068hm7YDK4";
  const clientSecret = "7a736fee0e422edf2c8bcf96b53522f063b3cf58";
  if (!code) {
    return new Response("No code provided", { status: 400 });
  }
  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code
      })
    });
    const data = await response.json();
    if (data.error) {
      return new Response(data.error_description || "Unknown error", { status: 400 });
    }
    const accessToken = data.access_token;
    cookies.set("github_token", accessToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      // Only use secure cookies in production (HTTPS)
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7
      // 1 week
    });
    return redirect("/admin");
  } catch (error) {
    console.error(error);
    return new Response("Authentication failed", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
