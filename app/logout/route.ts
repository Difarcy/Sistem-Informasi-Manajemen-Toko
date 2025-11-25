import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  await deleteSession();
  
  // Revalidate paths to force server components to re-render
  revalidatePath("/");
  revalidatePath("/dashboard");
  
  // Get redirect destination from query parameter or referer
  const url = new URL(request.url);
  const redirect = url.searchParams.get("redirect");
  const referer = request.headers.get("referer");
  
  // Determine redirect destination
  let redirectTo = "/auth/login"; // Default to login page
  
  if (redirect === "landing" || redirect === "/") {
    // Explicit redirect to landing page
    redirectTo = "/";
  } else if (referer && referer.includes("/dashboard")) {
    // If coming from dashboard, redirect to login
    redirectTo = "/auth/login";
  } else if (referer && !referer.includes("/dashboard") && !referer.includes("/auth")) {
    // If coming from landing page or other public pages, redirect to landing
    redirectTo = "/";
  }
  
  // Create redirect response with cache control headers
  const response = NextResponse.redirect(new URL(redirectTo, request.url));
  response.headers.set("Cache-Control", "no-store, must-revalidate");
  
  return response;
}

