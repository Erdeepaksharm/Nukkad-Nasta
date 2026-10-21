export default function CancellationPage() {
  return (
    <div className="py-16 px-4 sm:px-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white mb-4">Cancellation & Refund Policy</h1>
      <div className="card space-y-4 text-xs text-stone-300 leading-relaxed p-6">
        <p><strong>1. Cancellation Window:</strong> You may cancel your order within 60 seconds of placing it without penalty.</p>
        <p><strong>2. After Food Preparation Begins:</strong> Once the kitchen starts preparing your food (status changed to &ldquo;Cooking Fresh&rdquo;), cancellation cannot be accommodated as fresh food cannot be re-used.</p>
        <p><strong>3. Refunds:</strong> In case of an unfulfilled order, accidental double payment, or verified quality issue, refunds will be processed to the original payment method within 3 to 5 business days.</p>
        <p><strong>4. Damaged or Missing Items:</strong> If any item is missing or damaged during transit, please contact us within 15 minutes of delivery for an instant replacement or refund.</p>
      </div>
    </div>
  );
}
