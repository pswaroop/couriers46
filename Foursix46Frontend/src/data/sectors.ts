export interface Sector {
  name: string;
  slug: string;
  status: "draft" | "published";
  sortOrder: number;

  hero: {
    heroTitle: string;
    heroSubtitle?: string;
    heroImage?: string;
  };

  intro: string;
  contentBlocks: any[];

  recommendedServices: string[]; // service slugs
  featuredLocations?: string[];

  seo: {
    seoTitle: string;
    seoDescription: string;
    canonicalUrl?: string;
    ogImage?: string;
    noindex?: boolean;
  };

  faqs?: string[];
  faqHeading?: string;
}

export const sectors: Sector[] = [
  {
    name: "Dental Courier",
    slug: "dental",
    status: "published",
    sortOrder: 1,

    hero: {
      heroTitle: "Dental Courier Services",
      heroSubtitle: "Secure and time-sensitive dental deliveries",
      heroImage: "/images/dental.jpg"
    },

    intro: "<p>We provide specialist courier services for dental labs and clinics...</p>",

    contentBlocks: [
      {
        type: "textSection",
        heading: "Why Choose Our Dental Courier",
        body: "<p>Temperature-controlled, secure, and reliable delivery.</p>"
      }
    ],

    recommendedServices: ["same-day-courier", "next-day-courier"],
    featuredLocations: ["cardiff", "london"],

    seo: {
      seoTitle: "Dental Courier Services UK",
      seoDescription: "Specialist dental courier services across the UK."
    },

    faqHeading: "Sector FAQs"
  }
];