/* empty css                                 */
import { b as createAstro, c as createComponent, f as renderHead, e as addAttribute, a as renderTemplate } from '../chunks/astro/server_Dx7wWgsM.mjs';
import 'kleur/colors';
import 'clsx';
import { Octokit } from 'octokit';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://www.nordamenterprises.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const ALLOWED_USERS = ["marcus618", "NordamEnt"];
  const token = Astro2.cookies.get("github_token")?.value;
  if (!token) {
    return Astro2.redirect("/api/auth/login");
  }
  const octokit = new Octokit({ auth: token });
  let user;
  try {
    const { data } = await octokit.rest.users.getAuthenticated();
    user = data;
    if (!ALLOWED_USERS.includes(user.login)) {
      console.warn(`Unauthorized login attempt by: ${user.login}`);
      Astro2.cookies.delete("github_token", { path: "/" });
      return Astro2.redirect("/api/auth/login?error=unauthorized");
    }
  } catch (error) {
    Astro2.cookies.delete("github_token", { path: "/" });
    return Astro2.redirect("/api/auth/login");
  }
  return renderTemplate`<html lang="en"> <head><title>Admin Dashboard</title><meta charset="utf-8"><meta name="viewport" content="width=device-width">${renderHead()}</head> <body class="bg-gray-100 min-h-screen p-8 font-sans"> <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6"> <div class="flex items-center justify-between mb-8 border-b pb-4"> <h1 class="text-2xl font-bold text-gray-800">Admin Dashboard</h1> <div class="flex items-center gap-4"> <span class="text-sm text-gray-600">Logged in as <strong>${user.login}</strong></span> <img${addAttribute(user.avatar_url, "src")} alt="Profile" class="w-10 h-10 rounded-full border"> <form method="POST" action="/api/auth/logout"> <button class="text-sm text-red-600 hover:text-red-800 underline">Logout</button> </form> </div> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> <a href="/admin/services" class="block p-6 bg-blue-50 border border-blue-100 rounded-lg hover:shadow-lg transition"> <h2 class="text-xl font-semibold text-blue-800 mb-2">Services</h2> <p class="text-gray-600 text-sm">Manage your service offerings.</p> </a> <a href="/admin/products" class="block p-6 bg-green-50 border border-green-100 rounded-lg hover:shadow-lg transition"> <h2 class="text-xl font-semibold text-green-800 mb-2">Products</h2> <p class="text-gray-600 text-sm">Edit product details and prices.</p> </a> <a href="/admin/projects" class="block p-6 bg-purple-50 border border-purple-100 rounded-lg hover:shadow-lg transition"> <h2 class="text-xl font-semibold text-purple-800 mb-2">Projects</h2> <p class="text-gray-600 text-sm">Update your project portfolio.</p> </a> </div> </div> </body></html>`;
}, "C:/Users/marcu/Desktop/nordam-enterprises/src/pages/admin/index.astro", void 0);

const $$file = "C:/Users/marcu/Desktop/nordam-enterprises/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
