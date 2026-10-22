import { services } from "@/components/sections/services/data";
import { contactEmail } from "@/lib/contact";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://root-path.tech"
).replace(/\/$/, "");

export const SITE_NAME = "Root-Path";

/** Other spellings people use for the brand, so they resolve to the same entity. */
export const SITE_ALTERNATE_NAMES = ["RootPath", "Root Path"];

/** Public profiles that belong to the brand. Search engines use them to confirm the entity. */
export const SITE_PROFILES = ["https://github.com/root-path-tech"];

/*
 * Keyword targets: "IT services", "IT consulting", "consultancy", "consultant" and
 * "software development", then web, mobile and cloud. The page is written for people hiring a
 * team, so the title and description use the phrases they search for rather than the brand
 * line, which the hero already carries. Title stays under ~60 characters and the description
 * under ~155, where Google cuts.
 */
export const SITE_TITLE =
  "Root-Path | Software Development & Consulting Studio";

export const SITE_DESCRIPTION =
  "Root-Path is an IT services and technology consultancy for web, mobile and cloud. Work directly with the consultants and engineers who build your software.";

/** One-line summary of what the consultancy does, reused by structured data and llms.txt. */
export const SITE_SUMMARY =
  "Root-Path is an IT services and technology consultancy. Its consultants and engineers design and build web platforms, iOS and Android apps, cloud infrastructure and APIs, and provide IT consulting such as architecture reviews, legacy modernization and technical roadmaps.";

/** Search phrases the business wants to be found for, beyond the service names. */
export const SITE_KEYWORDS = [
  "IT services",
  "IT consulting",
  "IT consultancy",
  "IT consultant",
  "technology consulting",
  "software consultancy",
  "software development",
  "custom software development",
  "web development",
  "mobile app development",
  "cloud engineering",
  "API development",
];

/** Other names searchers use for each service. */
const SERVICE_ALIASES: Record<(typeof services)[number]["id"], string[]> = {
  web: ["Web application development", "Website development"],
  mobile: ["iOS app development", "Android app development"],
  cloud: ["Cloud consulting", "API development", "DevOps"],
  consult: [
    "IT consulting",
    "Technology consulting",
    "Software architecture consulting",
    "Legacy modernization",
  ],
};

/** Static file in /public (see scripts/generate-brand-assets.mjs). */
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Root-Path: small team, direct access, faster decisions",
};

/** Optional Search Console / Bing Webmaster verification tokens, set at build time. */
export const SITE_VERIFICATION = {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
};

/** The services, their other names and their tools, without repeats, for `knowsAbout`. */
function expertise() {
  const topics = services.flatMap((service) => [
    service.name,
    ...SERVICE_ALIASES[service.id],
    ...service.tags,
  ]);
  return Array.from(new Set(["IT services", "IT consulting", ...topics]));
}

export function getJsonLd() {
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  const webpageId = `${SITE_URL}/#webpage`;
  const logoId = `${SITE_URL}/#logo`;
  // Matches the canonical URL Next.js renders for the home page.
  const pageUrl = SITE_URL;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAMES,
        url: pageUrl,
        description: SITE_SUMMARY,
        slogan: "Small team. Direct access. Faster decisions.",
        email: contactEmail,
        logo: {
          "@type": "ImageObject",
          "@id": logoId,
          url: `${SITE_URL}/apple-icon.png`,
          width: 180,
          height: 180,
          caption: SITE_NAME,
        },
        image: { "@id": logoId },
        sameAs: SITE_PROFILES,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: contactEmail,
          url: `${SITE_URL}/#contact`,
          availableLanguage: "en",
        },
        knowsAbout: expertise(),
        keywords: SITE_KEYWORDS.join(", "),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "IT services and consulting",
          itemListElement: services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              "@id": `${SITE_URL}/#service-${service.id}`,
              name: service.name,
              alternateName: SERVICE_ALIASES[service.id],
              serviceType: service.name,
              description: `${service.title}. ${service.description}`,
              url: `${SITE_URL}/#service-${service.id}`,
              provider: { "@id": organizationId },
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: pageUrl,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAMES,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": organizationId },
      },
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: pageUrl,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}${OG_IMAGE.url}`,
          width: OG_IMAGE.width,
          height: OG_IMAGE.height,
        },
      },
    ],
  };
}
