import { Octokit } from 'octokit';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies, redirect }) => {
  const token = cookies.get("github_token")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });
  const formData = await request.formData();
  const collection = formData.get("collection")?.toString();
  const title = formData.get("title")?.toString();
  const sortOrder = Number(formData.get("sortOrder"));
  const filePath = formData.get("filePath")?.toString();
  const sha = formData.get("sha")?.toString();
  const body = formData.get("body")?.toString() || "";
  if (!collection || !title || !filePath) {
    return new Response("Missing required fields", { status: 400 });
  }
  let frontmatter = `title: '${title.replace(/'/g, "''")}'
sortOrder: ${sortOrder}
`;
  if (collection === "projects") {
    const imagesString = formData.get("images")?.toString() || "";
    const imageList = imagesString.split(",").map((img) => img.trim()).filter(Boolean);
    frontmatter += imageList.length ? "images:\n" + imageList.map((img) => `  - '${img}'`).join("\n") + "\n" : "images: []\n";
  } else if (collection === "services" || collection === "products") {
    const image = formData.get("image")?.toString() || "";
    frontmatter += `image: '${image}'
`;
  }
  const newFileContent = `---
${frontmatter}---

${body}`;
  const octokit = new Octokit({ auth: token });
  const owner = "marcus618";
  const repo = "nordam-enterprises-website";
  try {
    if (!sha) {
      try {
        await octokit.rest.repos.getContent({ owner, repo, path: filePath });
        return new Response(
          JSON.stringify({ error: "A file with this name already exists." }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      } catch (err) {
        if (err.status !== 404) {
          return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }
    const payload = {
      owner,
      repo,
      path: filePath,
      message: sha ? `Update ${collection.slice(0, -1)}: ${title}` : `Create ${collection.slice(0, -1)}: ${title}`,
      content: Buffer.from(newFileContent).toString("base64")
    };
    if (sha) payload.sha = sha;
    await octokit.rest.repos.createOrUpdateFileContents(payload);
    return redirect(`/admin/${collection}`);
  } catch (error) {
    if (error instanceof Error) {
      return new Response(
        `Error saving to GitHub: ${error.message}`,
        { status: 500 }
      );
    }
    return new Response(
      "Error saving to GitHub: Unknown error",
      { status: 500 }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
