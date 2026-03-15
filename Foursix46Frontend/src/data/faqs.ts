export type FAQ = {
  id: string;
  question: string;
  answer: string;
  status: "draft" | "published";
  tags?: string[];
  sortOrder?: number;
};

export const faqs: FAQ[] = [
  {
    id: "faq-collection-time",
    question: "How quickly can you collect my parcel?",
    answer:
      "<p>We aim to collect within 60 minutes for same-day courier services, depending on availability.</p>",
    status: "published",
    tags: ["collection", "speed"],
    sortOrder: 1,
  },
  {
    id: "faq-tracking",
    question: "Do you provide live tracking?",
    answer:
      "<p>Yes, all deliveries include real-time tracking and proof of delivery.</p>",
    status: "published",
    tags: ["tracking"],
    sortOrder: 2,
  },
  {
    id: "faq-insurance",
    question: "Are items insured during transport?",
    answer:
      "<p>All deliveries are covered by goods-in-transit insurance.</p>",
    status: "draft",
    tags: ["insurance"],
    sortOrder: 3,
  },
];