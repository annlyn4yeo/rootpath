import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      // Stamped at build time: every deploy rebuilds the page, so the build is its last change.
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
