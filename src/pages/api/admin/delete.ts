// src/pages/api/admin/delete.ts
import type { APIRoute } from "astro";
import { Octokit } from "octokit";
import matter from "gray-matter";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get("github_token")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });

  const formData = await request.formData();
  const filePath = formData.get("filePath")?.toString();
  const sha = formData.get("sha")?.toString();
  const collection = formData.get("collection")?.toString(); // "projects", "services", or "products"

  if (!filePath || !sha || !collection) return new Response("Missing info", { status: 400 });

  const octokit = new Octokit({ auth: token });
  const owner = import.meta.env.REPO_OWNER;
  const repo = import.meta.env.REPO_NAME;

  try {
    // 1. GET the file content first to find image paths
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner, repo, path: filePath
    });

    let imagesToDelete: string[] = [];
    if (!Array.isArray(fileData) && fileData.content) {
      const content = Buffer.from(fileData.content, "base64").toString("utf-8");
      const { data: frontmatter } = matter(content);

      // Only projects have an array of images
      if (collection === "projects" && Array.isArray(frontmatter.images)) {
        imagesToDelete = frontmatter.images;
      }
      // For services/products, image is a string (single image)
      if ((collection === "services" || collection === "products") && typeof frontmatter.image === "string") {
        imagesToDelete = [frontmatter.image];
      }
    }

    // 2. Delete the Markdown file
    await octokit.rest.repos.deleteFile({
      owner, repo, path: filePath, message: `Delete ${collection.slice(0, -1)}: ${filePath}`, sha
    });

    // 3. Delete the associated images (if any)
    for (const imageUrl of imagesToDelete) {
      if (!imageUrl) continue;
      try {
        // Convert public URL (/images/file.jpg) to repo path (public/images/file.jpg)
        const repoPath = imageUrl.startsWith("/images/") ? `public${imageUrl}` : imageUrl;

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
        // Continue even if image is missing
        console.error(`Could not delete image ${imageUrl}:`, e.message);
      }
    }

    return redirect(`/admin/${collection}`);
  } catch (error) {
    return new Response(`Delete failed: ${error.message}`, { status: 500 });
  }
};