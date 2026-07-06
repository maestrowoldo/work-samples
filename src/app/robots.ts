import { MetadataRoute } from "next";
import { buildAbsoluteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: buildAbsoluteUrl("/sitemap.xml"),
  };
}
