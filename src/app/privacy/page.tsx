export default function PrivacyPage() {
  return (
    <div className="py-16 px-4 sm:px-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white mb-4">Privacy Policy</h1>
      <div className="card space-y-4 text-xs text-stone-300 leading-relaxed p-6">
        <p><strong>1. Information Collection:</strong> We collect personal information such as your name, phone number, delivery address, and email when you place an order or book a table.</p>
        <p><strong>2. Use of Information:</strong> Your information is strictly used to fulfill food orders, provide live delivery updates, process payments, and improve customer service.</p>
        <p><strong>3. Data Security:</strong> All communications are encrypted over SSL. Payment transactions are processed via PCI-DSS compliant payment gateways like Razorpay. We do not store card numbers or CVVs.</p>
        <p><strong>4. Third-Party Sharing:</strong> We do not sell your personal data. We only share necessary delivery details with assigned delivery riders to complete fulfillment.</p>
        <p><strong>5. Contact:</strong> For any privacy concerns, reach out to privacy@nukkadnasta.in.</p>
      </div>
    </div>
  );
}
