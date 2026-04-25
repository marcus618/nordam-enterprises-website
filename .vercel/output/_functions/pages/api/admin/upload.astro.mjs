import { Octokit } from 'octokit';
export { renderers } from '../../../renderers.mjs';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
const POST = async ({ request, cookies }) => {
  const requestId = crypto.randomUUID();
  try {
    const token = cookies.get("github_token")?.value;
    if (!token) return json({ success: false, error: "Unauthorized", requestId }, 401);
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) return json({ success: false, error: "No file found", requestId }, 400);
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-z0-9.]/gi, "-").toLowerCase();
    const filename = `${timestamp}-${safeName}`;
    const path = `public/images/${filename}`;
    const arrayBuffer = await file.arrayBuffer();
    const content = Buffer.from(arrayBuffer).toString("base64");
    const octokit = new Octokit({ auth: token });
    const owner = "marcus618";
    const repo = "nordam-enterprises-website";
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Upload image: ${filename}`,
      content
    });
    return json({ success: true, url: `/images/${filename}`, requestId });
  } catch (error) {
    console.error("Upload error", { requestId, message: error?.message, stack: error?.stack });
    return json(
      { success: false, error: error?.message || "Unknown upload error", requestId },
      500
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
