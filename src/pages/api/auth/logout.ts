import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("github_token", { path: "/" });
  return redirect("/");
};