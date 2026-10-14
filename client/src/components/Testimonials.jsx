import React from 'react';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: "Dr. Rachel Morales",
    role: "Occupational Physiotherapist",
    org: "Apex Ergonomics",
    comment: "SitSmart translates clinical biomechanical angles into a frictionless webcam tool. Our patients with chronic cervical strain improved their posture habits by 65% within 3 weeks.",
    rating: 5
  },
  {
    name: "Marcus Chen",
    role: "Senior Full-Stack Engineer",
    org: "Remote Software Dev",
    comment: "The 5-second slouch alert is a game-changer. I used to catch myself hunching forward for hours without realizing it. Now I finish my coding days without upper back tension.",
    rating: 5
  },
  {
    name: "Elena Rostova",
    role: "Head of People & Wellness",
    org: "Fintech Scaleup (250+ staff)",
    comment: "Rolling out SitSmart to our hybrid teams was effortless because zero software installation or wearable gadgets are required. Our workplace RSI complaints dropped by 40%.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-400 font-bold text-xs uppercase tracking-widest">
            Loved by Remote Teams &amp; Clinicians
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
            Real Stories, Real Relief
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            See how professionals protect their posture and stay energized all day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-slate-700 mb-2" />
                <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-sm font-bold text-white">{r.name}</h4>
                <p className="text-xs text-brand-400 font-medium">{r.role}</p>
                <span className="text-[11px] text-slate-400">{r.org}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
