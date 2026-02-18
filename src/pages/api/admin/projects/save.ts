// src/pages/api/admin/projects/save.ts
import type { APIRoute } from "astro";
import { Octokit } from "octokit";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get("github_token")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });

  const formData = await request.formData();
  const title = formData.get("title")?.toString();
  const sortOrder = Number(formData.get("sortOrder"));
  const imagesString = formData.get("images")?.toString() || "";
  const body = formData.get("body")?.toString();
  const filePath = formData.get("filePath")?.toString();
  const sha = formData.get("sha")?.toString(); 

  // CHANGED: We no longer require 'sha' to be present
  if (!title || !filePath) {
    return new Response("Missing required fields", { status: 400 });
  }

  const imageList = imagesString.split(",").map((img) => img.trim()).filter(Boolean);
  
  let imagesYaml = "images: []"; 
  if (imageList.length > 0) {
    imagesYaml = "images:\n" + imageList.map((img) => `  - '${img}'`).join("\n");
  }

  // 4. Reconstruct File
  const cleanTitle = title.replace(/'/g, "''");

  const newFileContent = `---
title: '${cleanTitle}'
${imagesYaml}
sortOrder: ${sortOrder}
---

${body}`;

  const octokit = new Octokit({ auth: token });
  const owner = import.meta.env.REPO_OWNER;
  const repo = import.meta.env.REPO_NAME;

  try {
    // Prepare the payload
    const payload: any = {
      owner,
      repo,
      path: filePath,
      message: sha ? `Update project: ${title}` : `Create project: ${title}`, // Custom message
      content: Buffer.from(newFileContent).toString("base64"),
    };

    // CHANGED: Only add SHA if we are UPDATING an existing file
    if (sha) {
      payload.sha = sha;
    }

    await octokit.rest.repos.createOrUpdateFileContents(payload);

    return redirect("/admin/projects");
  } catch (error) {
    console.error("Error saving file:", error);
    return new Response(`Error saving to GitHub: ${error.message}`, { status: 500 });
  }
};