export { renderers } from '../../../renderers.mjs';

const GET = async ({ url, redirect }) => {
  const clientId = "Iv23lifBZ6068hm7YDK4";
  const scope = "repo,user";
  const redirectUri = `${url.origin}/api/auth/callback`;
  return redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
