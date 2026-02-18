// src/pages/api/admin/projects/delete.ts
import type { APIRoute } from "astro";
import { Octokit } from "octokit";
import matter from "gray-matter";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get("github_token")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });

  const formData = await request.formData();
  const filePath = formData.get("filePath")?.toString();
  const sha = formData.get("sha")?.toString();

  if (!filePath || !sha) return new Response("Missing info", { status: 400 });

  const octokit = new Octokit({ auth: token });
  const owner = import.meta.env.REPO_OWNER;
  const repo = import.meta.env.REPO_NAME;

  try {
    // 1. GET the file content first to find image paths
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner, repo, path: filePath
    });

    if (!Array.isArray(fileData) && fileData.content) {
      const content = Buffer.from(fileData.content, "base64").toString("utf-8");
      const { data: frontmatter } = matter(content);
      const imagesToDelete = frontmatter.images || [];

      // 2. Delete the Markdown file
      await octokit.rest.repos.deleteFile({
        owner, repo, path: filePath, message: `Delete project: ${filePath}`, sha
      });

      // 3. Delete the associated images
      // Note: We use public/images/... because that's where they live in the repo
      for (const imageUrl of imagesToDelete) {
        try {
          // Convert public URL (/images/file.jpg) to repo path (public/images/file.jpg)
          const repoPath = `public${imageUrl}`;
          
          // We need the SHA for each image to delete it
          const { data: imgData } = await octokit.rest.repos.getContent({
            owner, repo, path: repoPath
          });

          if (!Array.isArray(imgData)) {
            await octokit.rest.repos.deleteFile({
              owner, repo, path: repoPath,
              message: `Cleanup unused image: ${imageUrl}`,
              sha: imgData.sha
            });
          }
        } catch (e) {
          console.error(`Could not delete image ${imageUrl}:`, e.message);
          // We continue anyway so the project deletion isn't blocked by one missing image
        }
      }
    }

    return redirect("/admin/projects");
  } catch (error) {
    return new Response(`Delete failed: ${error.message}`, { status: 500 });
  }
};