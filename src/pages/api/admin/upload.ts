import type { APIRoute } from "astro";
import { Octokit } from "octokit";

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const requestId = crypto.randomUUID();

  try {
    const token = cookies.get("github_token")?.value;
    if (!token) return json({ success: false, error: "Unauthorized", requestId }, 401);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) return json({ success: false, error: "No file found", requestId }, 400);

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-z0-9.]/gi, "-").toLowerCase();
    const filename = `${timestamp}-${safeName}`;
    const path = `public/images/${filename}`;

    const arrayBuffer = await file.arrayBuffer();
    const content = Buffer.from(arrayBuffer).toString("base64");

    const octokit = new Octokit({ auth: token });
    const owner = import.meta.env.REPO_OWNER;
    const repo = import.meta.env.REPO_NAME;

    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Upload image: ${filename}`,
      content,
    });

    return json({ success: true, url: `/images/${filename}`, requestId });
  } catch (error: any) {
    console.error("Upload error", { requestId, message: error?.message, stack: error?.stack });
    return json(
      { success: false, error: error?.message || "Unknown upload error", requestId },
      500
    );
  }
};