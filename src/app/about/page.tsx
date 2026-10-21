import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="py-16 px-4 sm:px-6 max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
          Our Heritage
        </span>
        <h1 className="text-4xl font-extrabold text-white mt-4 mb-3">About Nukkad Nasta</h1>
        <p className="text-stone-400 max-w-2xl mx-auto text-base">
          Born out of love for the bustling street corners of Noida — where every corner has a flavor, an aroma, and a story.
        </p>
      </div>

      <div className="card space-y-4 p-8">
        <h2 className="text-xl font-bold text-amber-300">The Story of Our Street Flavours</h2>
        <p className="text-stone-300 text-sm leading-relaxed">
          Nukkad Nasta began with a single vision: to bring the authentic, hygienic, and soul-satisfying experience of India&apos;s street food culture into a modern dining format. From the early morning rush for piping hot Poha and crispy Medu Vadas to late-night cravings for Pav Bhaji and Biryani, we celebrate the food that fuels our cities.
        </p>
        <p className="text-stone-300 text-sm leading-relaxed">
          We source all our spices directly from regional spice markets, grind our masalas fresh every single morning, and fry with 100% pure cold-pressed groundnut and mustard oils.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center p-6">
          <div className="text-3xl mb-2">🌿</div>
          <h3 className="font-bold text-white mb-1">100% Fresh Daily</h3>
          <p className="text-xs text-stone-400">Zero preservatives or frozen bases. Prepared fresh on order.</p>
        </div>
        <div className="card text-center p-6">
          <div className="text-3xl mb-2">👨‍🍳</div>
          <h3 className="font-bold text-white mb-1">Street Masters</h3>
          <p className="text-xs text-stone-400">Crafted by seasoned cooks with decades of street culinary wisdom.</p>
        </div>
        <div className="card text-center p-6">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-bold text-white mb-1">Hot & Sealed</h3>
          <p className="text-xs text-stone-400">Insulated eco-friendly packaging ensuring piping hot delivery.</p>
        </div>
      </div>

      <div className="text-center pt-6">
        <Link href="/menu" className="btn-primary py-3.5 px-8 font-bold text-sm">
          Browse Our Menu
        </Link>
      </div>
    </div>
  );
}
