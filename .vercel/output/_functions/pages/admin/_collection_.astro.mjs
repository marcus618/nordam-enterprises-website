/* empty css                                    */
import { b as createAstro, c as createComponent, f as renderHead, e as addAttribute, a as renderTemplate, d as renderScript } from '../../chunks/astro/server_Dx7wWgsM.mjs';
import 'kleur/colors';
import 'clsx';
import { Octokit } from 'octokit';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://www.nordamenterprises.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const token = Astro2.cookies.get("github_token")?.value;
  if (!token) return Astro2.redirect("/api/auth/login");
  const octokit = new Octokit({ auth: token });
  const owner = "marcus618";
  const repo = "nordam-enterprises-website";
  const collection = Astro2.params.collection || "";
  const singularMap = {
    products: "Product",
    projects: "Project",
    services: "Service"
  };
  const singular = singularMap[collection] || collection.slice(0, -1);
  let files = [];
  let error = null;
  try {
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: `src/content/${collection}`
    });
    if (Array.isArray(response.data)) {
      files = response.data.filter(
        (file) => file.name.endsWith(".md") || file.name.endsWith(".mdx")
      );
    }
  } catch (e) {
    if (typeof e === "object" && e && "status" in e && e.status !== 404) {
      error = e.message;
    }
  }
  return renderTemplate`<html lang="en"> <head><title>Manage ${collection}</title><meta charset="utf-8"><meta name="viewport" content="width=device-width">${renderHead()}</head> <body class="bg-gray-50 min-h-screen p-8 font-sans"> <div class="max-w-4xl mx-auto"> <div class="flex items-center justify-between mb-8"> <div> <a href="/admin" class="text-blue-600 hover:underline mb-2 block">&larr; Back to Dashboard</a> <h1 class="text-3xl font-bold text-gray-900">${collection.charAt(0).toUpperCase() + collection.slice(1)}</h1> </div> <a${addAttribute(`/admin/${collection}/new`, "href")} class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
+ New ${singular} </a> </div> ${error && renderTemplate`<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
Error loading ${collection}: ${error} </div>`} <div class="bg-white shadow rounded-lg overflow-hidden"> <table class="min-w-full divide-y divide-gray-200"> <thead class="bg-gray-50"> <tr> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th> <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> </tr> </thead> <tbody class="bg-white divide-y divide-gray-200"> ${files.length === 0 ? renderTemplate`<tr> <td colspan="2" class="px-6 py-4 text-center text-gray-500">
No ${collection} found. Click "New ${singular}"
                                        to create one.
</td> </tr>` : files.map((file) => renderTemplate`<tr class="hover:bg-gray-50 transition-opacity duration-300"${addAttribute(`row-${file.sha}`, "id")}> <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"> <div class="flex items-center gap-3"> <span class="file-name">${file.name}</span> <div class="hidden delete-spinner animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div> </div> </td> <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"> <div class="flex justify-end gap-4 actions-area"> <a${addAttribute(`/admin/${collection}/edit/${file.name}`, "href")} class="text-indigo-600 hover:text-indigo-900">Edit</a> <button type="button" class="text-red-600 hover:text-red-900 delete-btn"${addAttribute(file.path, "data-path")}${addAttribute(file.sha, "data-sha")}${addAttribute(collection, "data-collection")}>
Delete
</button> </div> </td> </tr>

${renderScript($$result, "C:/Users/marcu/Desktop/nordam-enterprises/src/pages/admin/[collection]/index.astro?astro&type=script&index=0&lang.ts")}`)} </tbody> </table> </div> </div> </body> </html>`;
}, "C:/Users/marcu/Desktop/nordam-enterprises/src/pages/admin/[collection]/index.astro", void 0);
const $$file = "C:/Users/marcu/Desktop/nordam-enterprises/src/pages/admin/[collection]/index.astro";
const $$url = "/admin/[collection]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
