export default function FAQPage() {
  const faqs = [
    { q: 'What is the minimum order value for delivery?', a: 'Our minimum order amount is ₹50. Free delivery is available on orders above ₹300 or using code FREEDEL.' },
    { q: 'What payment modes are accepted?', a: 'We accept Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), and major credit/debit cards.' },
    { q: 'How long does delivery take?', a: 'Average preparation and delivery time is 25 to 35 minutes depending on your delivery zone and traffic.' },
    { q: 'Is all food prepared fresh?', a: 'Yes! Every single item is prepared fresh upon receiving your order. We do not use pre-cooked frozen bases.' },
    { q: 'Can I customize my spice level or request Jain food?', a: 'Absolutely. Mention your preference in the order notes during checkout, or select our pure vegetarian and Jain filters on the menu.' },
    { q: 'Can I book a table in advance?', a: 'Yes, head to our Table Reservations page to reserve a table for 1 to 8+ people with zero booking fee.' },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">Frequently Asked Questions</h1>
        <p className="text-stone-400 text-sm">Everything you need to know about our food, ordering, and delivery</p>
      </div>

      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="card p-5">
            <h3 className="font-bold text-white text-base mb-2 text-amber-300">{f.q}</h3>
            <p className="text-stone-300 text-xs leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
