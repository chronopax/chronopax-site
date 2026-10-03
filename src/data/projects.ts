export interface Project {
  title: string;
  status: string;
  statusColor?: "teal" | "orange";
  description: string;
  // Omit until the project has its own page or repo; the card then shows no "Learn more" link.
  link?: { href: string; label?: string };
  interest: string;
  featured?: boolean;
}

// Single source for project cards on the homepage (featured only) and /projects (all, in this order).
export const projects: Project[] = [
  {
    title: "Email Cleaner Agent",
    status: "Open Source",
    description:
      "An autonomous email management agent with a contributor economy model. AGPL-3.0 licensed with a dual-licensing path for commercial use. Built for people who want their inbox handled without giving up control.",
    interest: "Interested in contributing or following development? Get in touch →",
    featured: true,
  },
  {
    title: "Document Intelligence System",
    status: "In Development",
    description:
      "A document processing and intelligence platform with tenant-isolated architecture. Built for secure, compliance-sensitive environments. Early access coming.",
    interest: "Interested in early access or collaboration? Get in touch →",
    featured: true,
  },
  {
    title: "Home Agent Orchestration",
    status: "Coming Soon",
    statusColor: "orange",
    description:
      "A framework for orchestrating AI agents across home lab and personal infrastructure. Design phase — more details coming soon.",
    interest: "Want to know when this is ready? Get in touch →",
    featured: true,
  },
];
