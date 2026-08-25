const TECH = [
  { name: "PyTorch", category: "ML Framework" },
  { name: "Swin Transformer", category: "Architecture" },
  { name: "FastAPI", category: "Backend" },
  { name: "Python", category: "Language" },
  { name: "Docker", category: "Deployment" },
  { name: "REST API", category: "Protocol" },
  { name: "Computer Vision", category: "Domain" },
  { name: "OpenCV", category: "Image Processing" },
];

export default function TechStack() {
  return (
    <section id="about" className="py-20 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-[11px] font-mono text-[#4a6a54] uppercase tracking-widest mb-2">Engineering</p>
            <h2 className="font-display text-[28px] font-semibold text-white tracking-tight mb-4">
              Powered by AI &amp;<br />Modern Engineering
            </h2>
            <p className="text-[15px] text-[#5a7a64] leading-relaxed max-w-md">
              End-to-end AI system combining deep learning computer vision with production-ready API architecture — from model training to real-time inference.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {TECH.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors"
              >
                <p className="text-[14px] text-white font-medium">{t.name}</p>
                <p className="text-[11px] font-mono text-[#4a6a54] mt-0.5">{t.category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
