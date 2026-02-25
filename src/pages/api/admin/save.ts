import type { APIRoute } from "astro";
import { Octokit } from "octokit";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get("github_token")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });

  const formData = await request.formData();
  const collection = formData.get("collection")?.toString(); // "projects", "services", or "products"
  const title = formData.get("title")?.toString();
  const sortOrder = Number(formData.get("sortOrder"));
  const filePath = formData.get("filePath")?.toString();
  const sha = formData.get("sha")?.toString();
  const body = formData.get("body")?.toString() || "";

  if (!collection || !title || !filePath) {
    return new Response("Missing required fields", { status: 400 });
  }

  let frontmatter = `title: '${title.replace(/'/g, "''")}'\nsortOrder: ${sortOrder}\n`;

  if (collection === "projects") {
    const imagesString = formData.get("images")?.toString() || "";
    const imageList = imagesString.split(",").map((img) => img.trim()).filter(Boolean);
    frontmatter += imageList.length
      ? "images:\n" + imageList.map((img) => `  - '${img}'`).join("\n") + "\n"
      : "images: []\n";
  } else if (collection === "services" || collection === "products") {
    const image = formData.get("image")?.toString() || "";
    frontmatter += `image: '${image}'\n`;
  }

  const newFileContent = `---\n${frontmatter}---\n\n${body}`;

  const octokit = new Octokit({ auth: token });
  const owner = import.meta.env.REPO_OWNER;
  const repo = import.meta.env.REPO_NAME;

  try {
    // Failsafe: If creating (no sha), check if file exists first
    if (!sha) {
      try {
        await octokit.rest.repos.getContent({ owner, repo, path: filePath });
        // If no error, file exists!
        return new Response(
          JSON.stringify({ error: "A file with this name already exists." }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      } catch (err: any) {
        if (err.status !== 404) {
          // Some other error (not "not found")
          return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
        // If 404, file does not exist, safe to create
      }
    }

    const payload: any = {
      owner,
      repo,
      path: filePath,
      message: sha
        ? `Update ${collection.slice(0, -1)}: ${title}`
        : `Create ${collection.slice(0, -1)}: ${title}`,
      content: Buffer.from(newFileContent).toString("base64"),
    };
    if (sha) payload.sha = sha;

    await octokit.rest.repos.createOrUpdateFileContents(payload);

    return redirect(`/admin/${collection}`);
  } catch (error) {
    return new Response(
      `Error saving to GitHub: ${error.message}`,
      { status: 500 }
    );
  }
};