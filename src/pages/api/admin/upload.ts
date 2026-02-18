// src/pages/api/admin/upload.ts
import type { APIRoute } from "astro";
import { Octokit } from "octokit";

export const POST: APIRoute = async ({ request, cookies }) => {
  // 1. Auth Check
  const token = cookies.get("github_token")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });

  // 2. Get the File
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new Response("No file found", { status: 400 });
  }

  // 3. Generate a safe filename
  // specific to your project, we save to "public/images/"
  // We add a timestamp to avoid name collisions
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-z0-9.]/gi, '-').toLowerCase();
  const filename = `${timestamp}-${safeName}`;
  const path = `public/images/${filename}`;

  // 4. Convert File to Base64
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const content = buffer.toString("base64");

  // 5. Commit to GitHub
  const octokit = new Octokit({ auth: token });
  const owner = import.meta.env.REPO_OWNER;
  const repo = import.meta.env.REPO_NAME;

  try {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Upload image: ${filename}`,
      content,
    });

    // 6. Return the public URL
    // This is what we will insert into the markdown frontmatter
    return new Response(JSON.stringify({ 
      url: `/images/${filename}`, 
      success: true 
    }), { 
      status: 200,
      headers: { "Content-Type": "application/json" } 
    });

  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};