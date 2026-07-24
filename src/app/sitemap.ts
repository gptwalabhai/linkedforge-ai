import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const staticPages = [
    "",
    "/pricing",
    "/blog",
    "/login",
    "/signup",
    "/dashboard",
    "/studio",
    "/posts",
    "/calendar",
    "/analytics",
    "/settings",
    "/admin",
    "/support",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" ? "daily" : "weekly") as "daily" | "weekly" | "always" | "hourly" | "monthly" | "yearly" | "never",
    priority: route === "" ? 1 : route === "/pricing" ? 0.9 : 0.8,
  }));

  return staticPages;
}
