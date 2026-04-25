/* empty css                                          */
import { b as createAstro, c as createComponent, a as renderTemplate, d as renderScript, e as addAttribute, s as spreadAttributes, f as renderHead } from '../../../../chunks/astro/server_Dx7wWgsM.mjs';
import { Octokit } from 'octokit';
import matter from 'gray-matter';
import 'clsx';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.nordamenterprises.com");
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const token = Astro2.cookies.get("github_token")?.value;
  if (!token) return Astro2.redirect("/api/auth/login");
  const { slug, collection = "" } = Astro2.params;
  const isMultiImage = collection === "projects";
  const owner = "marcus618";
  const repo = "nordam-enterprises-website";
  const path = `src/content/${collection}/${slug}`;
  const octokit = new Octokit({ auth: token });
  let fileContent = "";
  let sha = "";
  let frontmatter = {};
  let markdownBody = "";
  const singularMap = {
    products: "Product",
    projects: "Project",
    services: "Service"
  };
  const singular = singularMap[collection] || collection.slice(0, -1);
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path
    });
    if (!Array.isArray(data) && data.content) {
      fileContent = Buffer.from(data.content, "base64").toString("utf-8");
      sha = data.sha;
      const parsed = matter(fileContent);
      frontmatter = parsed.data;
      markdownBody = parsed.content;
    }
  } catch (e) {
    return new Response("File not found on GitHub", { status: 404 });
  }
  let initialImages = [];
  if (isMultiImage) {
    if (Array.isArray(frontmatter.images)) {
      initialImages = frontmatter.images;
    } else if (frontmatter.images) {
      initialImages = [frontmatter.images];
    }
  } else {
    if (frontmatter.image) {
      initialImages = [frontmatter.image];
    }
  }
  const imagesString = initialImages.join(", ");
  initialImages[0] || "/images/placeholder.png";
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-theme="light"> <head><title>Edit ', " - ", '</title><meta charset="utf-8"><meta name="viewport" content="width=device-width">', '</head> <body class="bg-gray-50 min-h-screen p-8 font-sans"> <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"> <div class="bg-white p-8 rounded shadow"> <div class="flex justify-between items-center mb-6"> <h1 class="text-2xl font-bold text-gray-800">\nEdit ', " </h1> <a", ' class="text-sm text-gray-500 hover:text-gray-800">Cancel</a> </div> <form method="POST" action="/api/admin/save"', "", "", '> <input type="hidden" name="filePath"', '> <input type="hidden" name="sha"', '> <input type="hidden" name="collection"', '> <div class="mb-4"> <label class="block text-gray-700 text-sm font-bold mb-2">Title</label> <input type="text" name="title" id="title"', ' class="bg-white text-gray-900 shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" required> </div> <div class="mb-4"> <label class="block text-gray-700 text-sm font-bold mb-2">Sort Order</label> <input type="number" name="sortOrder"', ' class="bg-white text-gray-900 shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"> </div> <div class="mb-6"> <label class="block text-gray-700 text-sm font-bold mb-2"> ', " Image(s)\n</label> ", ' <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition text-center" id="drop-zone"> <input type="file" id="file-uploader" accept="image/*" class="hidden"', '> <label for="file-uploader" class="cursor-pointer"> <div class="text-blue-600 font-semibold">Click to upload</div> <p class="text-xs text-gray-500">or drag and drop ', ' here</p> </label> </div> <div id="preview-grid" class="grid grid-cols-3 gap-4 mt-4"></div> <p id="upload-status" class="text-xs text-gray-500 mt-2 h-4"></p> </div> ', ' <div class="mb-6"> <label class="block text-gray-700 text-sm font-bold mb-2">Description</label> <textarea id="body-input" name="body" rows="10" class="bg-white text-gray-900 shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-mono">', '</textarea> </div> <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">\nSave Changes\n</button> </form> </div> <div class="bg-gray-100 p-8 rounded shadow self-start sticky top-8 border border-gray-200"> <h2 class="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Live Preview</h2> <div id="preview-container" class="flex justify-center">  ', ' </div> </div> </div> <!-- Add marked.js for live markdown parsing in preview --> <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script> ', " </body> </html>"])), singular, slug, renderHead(), singular, addAttribute(`/admin/${collection}`, "href"), addAttribute(`edit-${collection}-form`, "id"), addAttribute(collection, "data-collection"), addAttribute(isMultiImage ? "true" : "false", "data-is-multi"), addAttribute(path, "value"), addAttribute(sha, "value"), addAttribute(collection, "value"), addAttribute(frontmatter.title || "", "value"), addAttribute(frontmatter.sortOrder || 10, "value"), singular, isMultiImage ? renderTemplate`<input type="hidden" name="images" id="image-input"${addAttribute(imagesString, "value")}>` : renderTemplate`<input type="hidden" name="image" id="image-input"${addAttribute(imagesString, "value")}>`, spreadAttributes(isMultiImage ? { multiple: true } : {}), isMultiImage ? "images" : "an image", renderScript($$result, "C:/Users/marcu/Desktop/nordam-enterprises/src/pages/admin/[collection]/edit/[slug].astro?astro&type=script&index=0&lang.ts"), markdownBody, isMultiImage ? renderTemplate`<div class="w-full max-w-2xl"> <div class="card bg-base-100 shadow-xl flex flex-col hidden" id="preview-project"> <div id="carousel-preview" class="carousel w-full rounded-t-box h-80 scroll-smooth"> <!-- images go here --> </div> <div class="card-body flex flex-col"> <h2 class="card-title" id="preview-project-title">${frontmatter.title || "Title"}</h2> <div class="text-base-content/80 text-sm flex-grow prose prose-sm max-w-none" id="preview-project-body"></div> </div> </div> </div>` : renderTemplate`<div class="w-full max-w-[400px]"> <div class="card bg-base-100 shadow-xl flex flex-col hidden" id="preview-content"> <figure><img id="preview-content-image"${addAttribute(initialImages[0] || "/images/placeholder.png", "src")} alt="Preview Image" class="w-full h-56 object-cover"></figure> <div class="card-body flex flex-col"> <h2 class="card-title" id="preview-content-title">${frontmatter.title || "Title"}</h2> <div class="text-base-content/80 text-sm flex-grow prose prose-sm max-w-none" id="preview-content-body"></div> <div class="card-actions justify-start pt-4"> <a href="#" class="btn btn-neutral w-full">
Contact us and Request a Quote
</a> </div> </div> </div> </div>`, renderScript($$result, "C:/Users/marcu/Desktop/nordam-enterprises/src/pages/admin/[collection]/edit/[slug].astro?astro&type=script&index=1&lang.ts"));
}, "C:/Users/marcu/Desktop/nordam-enterprises/src/pages/admin/[collection]/edit/[slug].astro", void 0);
const $$file = "C:/Users/marcu/Desktop/nordam-enterprises/src/pages/admin/[collection]/edit/[slug].astro";
const $$url = "/admin/[collection]/edit/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
