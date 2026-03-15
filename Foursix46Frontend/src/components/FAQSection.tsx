import { Helmet } from "react-helmet-async";

export default function FAQSection({ faqs, heading = "Frequently Asked Questions" }) {
  if (!faqs?.length) return null;

  return (
    <div className="bg-slate-50 py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-8">
          {heading}
        </h2>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="bg-white rounded-2xl p-6 shadow-sm cursor-pointer"
            >
              <summary className="font-semibold text-lg">
                {faq.question}
              </summary>
              <div
                className="mt-4 text-gray-700"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </details>
          ))}
        </div>
      </div>

      {/* FAQ JSON-LD Schema */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer.replace(/<[^>]*>?/gm, ""),
              },
            })),
          })}
        </script>
      </Helmet>
    </div>
  );
}