import { Package, Star, Clock, ShieldCheck } from "lucide-react";

const STATS = [
  { icon: Package,     value: "30+",    label: "Products in stock",     color: "text-blue-600",   bg: "bg-blue-100"   },
  { icon: Star,        value: "4.9/5",  label: "Customer rating",       color: "text-amber-600",  bg: "bg-amber-100"  },
  { icon: Clock,       value: "24/7",   label: "Customer support",      color: "text-emerald-600", bg: "bg-emerald-100" },
  { icon: ShieldCheck, value: "2 yrs",  label: "Warranty on all items", color: "text-indigo-600", bg: "bg-indigo-100" },
] as const;

export default function StatsSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 border-b border-blue-500/30" aria-label="Key figures">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/15">
          {STATS.map(({ icon: Icon, value, label, color, bg }) => (
            <div key={label} className="flex items-center gap-4 px-6 py-7">
              <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${bg} shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <dt className="sr-only">{label}</dt>
                <dd className="text-2xl font-black text-white leading-none">{value}</dd>
                <p className="text-xs text-blue-100 mt-1">{label}</p>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
