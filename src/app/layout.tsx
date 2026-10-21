import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import AdminBar from '@/components/AdminBar';

export const metadata: Metadata = {
  title: 'Nukkad Nasta — Authentic Street Food',
  description: 'Order fresh Noida street food online. Delivery, pickup & dine-in.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AdminBar />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-stone-950 border-t border-stone-800 py-10 px-6 mt-16">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-amber-400 font-bold text-lg mb-3">🍴 Nukkad Nasta</h3>
                <p className="text-stone-400 text-sm">Authentic street food from the heart of Noida. Fresh, fast & delicious.</p>
              </div>
              <div>
                <h4 className="text-amber-300 font-semibold mb-3">Quick Links</h4>
                <ul className="space-y-1 text-stone-400 text-sm">
                  <li><a href="/menu" className="hover:text-amber-400 transition-colors">Menu</a></li>
                  <li><a href="/reservations" className="hover:text-amber-400 transition-colors">Reserve a Table</a></li>
                  <li><a href="/about" className="hover:text-amber-400 transition-colors">About Us</a></li>
                  <li><a href="/contact" className="hover:text-amber-400 transition-colors">Contact</a></li>
                  <li><a href="/faq" className="hover:text-amber-400 transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-amber-300 font-semibold mb-3">Contact</h4>
                <p className="text-stone-400 text-sm">📍 12, Food Street, Sector 18, Noida 201301</p>
                <p className="text-stone-400 text-sm mt-1">📞 +91 98765 43210</p>
                <p className="text-stone-400 text-sm mt-1">✉️ hello@nukkadnasta.in</p>
                <p className="text-stone-400 text-sm mt-1">🕐 Mon–Fri 8am–10:30pm</p>
              </div>
            </div>
            <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-stone-800 flex flex-wrap gap-4 justify-between items-center text-stone-500 text-xs">
              <span>© 2024 Nukkad Nasta. All rights reserved.</span>
              <div className="flex gap-4">
                <a href="/privacy" className="hover:text-amber-400 transition-colors">Privacy</a>
                <a href="/terms" className="hover:text-amber-400 transition-colors">Terms</a>
                <a href="/cancellation" className="hover:text-amber-400 transition-colors">Cancellation Policy</a>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
