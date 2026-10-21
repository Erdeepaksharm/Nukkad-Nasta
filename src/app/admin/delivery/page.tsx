import { createClient } from '@/lib/supabase/server';
import { Bike, MapPin, Plus, ShieldCheck } from 'lucide-react';

const SAMPLE_ZONES = [
  { id: '1', name: 'Zone A — Central Noida (Sector 18, 15, 16, 27)', pincodes: ['201301'], min_order: 5000, fee: 0, eta_minutes: 20 },
  { id: '2', name: 'Zone B — Sector 29, 37, 44 & Botanical Garden', pincodes: ['201303', '201304'], min_order: 10000, fee: 2900, eta_minutes: 30 },
  { id: '3', name: 'Zone C — Sector 50, 51, 61 & 62 Tech Parks', pincodes: ['201305', '201307'], min_order: 15000, fee: 4900, eta_minutes: 40 },
  { id: '4', name: 'Zone D — Noida Expressway & Sector 137', pincodes: ['201308', '201309'], min_order: 25000, fee: 6900, eta_minutes: 50 },
];

export default async function AdminDeliveryPage() {
  const supabase = await createClient();
  const { data: dbZones } = await supabase.from('delivery_zones').select('*');
  const zones = dbZones && dbZones.length > 0 ? dbZones : SAMPLE_ZONES;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Delivery Management</h1>
          <p className="text-stone-400 text-sm">Configure delivery coverage zones, fees, and preparation times</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {zones.map((zone: any) => (
          <div key={zone.id} className="card p-6 border-stone-800 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-white text-lg">{zone.name}</h2>
                <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-1">
                  <MapPin size={13} className="text-cyan-400" />
                  <span>Pincodes: {Array.isArray(zone.pincodes) ? zone.pincodes.join(', ') : zone.pincodes}</span>
                </div>
              </div>
              <span className="text-xs bg-green-500/20 text-green-400 font-bold px-2 py-0.5 rounded">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-stone-950 p-3 rounded-xl border border-stone-800 text-center">
              <div>
                <div className="text-stone-500 text-[10px] uppercase font-bold">Delivery Fee</div>
                <div className="text-amber-400 font-extrabold text-sm mt-0.5">
                  {zone.fee === 0 ? 'FREE' : `₹${Math.round(zone.fee / 100)}`}
                </div>
              </div>
              <div>
                <div className="text-stone-500 text-[10px] uppercase font-bold">Min Order</div>
                <div className="text-white font-bold text-sm mt-0.5">
                  ₹{Math.round((zone.min_order || 0) / 100)}
                </div>
              </div>
              <div>
                <div className="text-stone-500 text-[10px] uppercase font-bold">Est. Time</div>
                <div className="text-cyan-400 font-bold text-sm mt-0.5">
                  {zone.eta_minutes} mins
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
