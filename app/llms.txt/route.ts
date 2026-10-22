import { engagements } from "@/components/sections/engagements/data";
import { stages } from "@/components/sections/process/data";
import { services } from "@/components/sections/services/data";
import { contactEmail } from "@/lib/contact";
import { SITE_NAME, SITE_SUMMARY, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * /llms.txt (llmstxt.org): a plain summary of the site for AI assistants and answer engines,
 * built from the same data the page renders so the two cannot drift apart.
 */
export function GET() {
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_SUMMARY}`,
    "",
    "Small team. Direct access. Faster decisions. The people on the first call are the engineers and designers who build the product, and every deliverable lives in the client's own repository.",
    "",
    "## Services",
    "",
    ...services.flatMap((service) => [
      `### ${service.name}`,
      "",
      `${service.title}. ${service.description}`,
      "",
      `Stack: ${service.tags.join(", ")}.`,
      "",
      ...service.practices.map((practice) => `- ${practice}`),
      "",
      `Details: ${SITE_URL}/#service-${service.id}`,
      "",
    ]),
    "## Ways to engage",
    "",
    ...engagements.map(
      (engagement) =>
        `- ${capitalise(engagement.keyword)}: ${engagement.title} ${engagement.summary} ${engagement.scope}`,
    ),
    "",
    "## Process",
    "",
    ...stages.map(
      (stage, index) =>
        `${index + 1}. ${capitalise(stage.keyword)}: ${stage.title}. ${stage.description}`,
    ),
    "",
    "## Contact",
    "",
    `- Email: ${contactEmail}`,
    `- Request a quote, proposal or review: ${SITE_URL}/#contact`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function capitalise(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
