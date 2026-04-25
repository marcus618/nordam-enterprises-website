import { Octokit } from 'octokit';
import matter from 'gray-matter';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies, redirect }) => {
  const token = cookies.get("github_token")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });
  const formData = await request.formData();
  const filePath = formData.get("filePath")?.toString();
  const sha = formData.get("sha")?.toString();
  const collection = formData.get("collection")?.toString();
  if (!filePath || !sha || !collection) return new Response("Missing info", { status: 400 });
  const octokit = new Octokit({ auth: token });
  const owner = "marcus618";
  const repo = "nordam-enterprises-website";
  try {
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: filePath
    });
    let imagesToDelete = [];
    if (!Array.isArray(fileData) && fileData.type === "file" && "content" in fileData && fileData.content) {
      const content = Buffer.from(fileData.content, "base64").toString("utf-8");
      const { data: frontmatter } = matter(content);
      let rawImages = [];
      if (collection === "projects") {
        if (Array.isArray(frontmatter.images)) {
          rawImages = frontmatter.images;
        } else if (typeof frontmatter.images === "string") {
          rawImages = frontmatter.images.split(",");
        }
      } else {
        if (typeof frontmatter.image === "string") {
          rawImages = [frontmatter.image];
        }
      }
      imagesToDelete = rawImages.map((img) => img.trim()).filter(Boolean);
    }
    await octokit.rest.repos.deleteFile({
      owner,
      repo,
      path: filePath,
      message: `Delete ${collection.slice(0, -1)}: ${filePath}`,
      sha
    });
    for (const imageUrl of imagesToDelete) {
      if (!imageUrl) continue;
      try {
        const repoPath = imageUrl.startsWith("/images/") ? `public${imageUrl}` : imageUrl;
        const { data: imgData } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: repoPath
        });
        if (!Array.isArray(imgData)) {
          await octokit.rest.repos.deleteFile({
            owner,
            repo,
            path: repoPath,
            message: `Cleanup unused image: ${imageUrl}`,
            sha: imgData.sha
          });
        }
      } catch (e) {
        if (e instanceof Error) {
          console.error(`Could not delete image ${imageUrl}:`, e.message);
        } else {
          console.error(`Could not delete image ${imageUrl}:`, e);
        }
      }
    }
    return redirect(`/admin/${collection}`);
  } catch (error) {
    if (error instanceof Error) {
      return new Response(`Delete failed: ${error.message}`, { status: 500 });
    }
    return new Response("Delete failed: Unknown error", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
