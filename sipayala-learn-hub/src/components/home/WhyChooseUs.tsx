import { Code2, Users, Briefcase, Award, Clock, Headphones, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Code2,
    eyebrow: "Hands-on curriculum",
    title: "Project-Based Learning",
    description:
      "Ship 10+ production-grade projects across the course. Every project is scoped to match real hiring briefs—your portfolio will speak for itself.",
    stat: "10+",
    statLabel: "Portfolio projects",
    accent: "#2563EB",
    lightBg: "#EFF6FF",
  },
  {
    icon: Users,
    eyebrow: "Real practitioners",
    title: "Industry Expert Mentors",
    description:
      "Your instructors are engineers and leads from top-tier companies—still active in the field, not just educators. Office hours, code reviews, and 1-on-1 sessions included.",
    stat: "5+",
    statLabel: "Yrs avg. industry exp.",
    accent: "#0891B2",
    lightBg: "#ECFEFF",
  },
  {
    icon: Briefcase,
    eyebrow: "Career outcomes",
    title: "Job Placement Support",
    description:
      "ATS-optimized résumé, mock technical interviews, LinkedIn audits, and warm intros to 80+ hiring partners. We work alongside you until you're placed.",
    stat: "94%",
    statLabel: "Placement rate",
    accent: "#059669",
    lightBg: "#ECFDF5",
  },
  {
    icon: Award,
    eyebrow: "Proof of skills",
    title: "Recognized Certification",
    description:
      "Certificates verified on our public registry—employers can authenticate them in seconds. Accepted by hiring partners across 12 countries.",
    stat: "12+",
    statLabel: "Countries accepted",
    accent: "#D97706",
    lightBg: "#FFFBEB",
  },
  {
    icon: Clock,
    eyebrow: "Built around your life",
    title: "Flexible Schedules",
    description:
      "Weekend and evening cohorts designed for working professionals. All sessions recorded in 4K—rewatch any lecture as many times as you need.",
    stat: "3×",
    statLabel: "Weekly batch options",
    accent: "#7C3AED",
    lightBg: "#F5F3FF",
  },
  {
    icon: Headphones,
    eyebrow: "Beyond the course",
    title: "Lifetime Support",
    description:
      "Alumni community, updated course materials, and a dedicated Slack channel with mentors. Graduate once, stay connected forever.",
    stat: "∞",
    statLabel: "Access to materials",
    accent: "#DB2777",
    lightBg: "#FDF2F8",
  },
];

// ─── Animation config ─────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────

const WhyChooseUs = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Grid configuration based on screen size
  const getGridConfig = () => {
    if (isMobile) return "grid-cols-1";
    if (isTablet) return "grid-cols-2";
    return "grid-cols-3";
  };

  return (
    <section className="relative py-16 md:py-20 lg:py-28 bg-white overflow-hidden">
      {/* Hairline top border for section separation */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gray-100" />

      {/* Faint grid backdrop - hidden on mobile to prevent overflow */}
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      
      {/* Vignette over grid - adjusted for mobile */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_100%_60%_at_50%_50%,transparent_30%,white_100%)] md:bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,transparent_30%,white_100%)]" />

      <div className="relative container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* ── Header ── */}
        <div className="max-w-3xl mb-12 md:mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 md:mb-5 rounded-full
                             border border-blue-100 bg-blue-50 text-blue-600 text-[10px] md:text-[11px] font-semibold uppercase tracking-widest">
              Why Sipayala Info Tech
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 leading-[1.15] tracking-tight mb-4 md:mb-5">
              Not another bootcamp.{" "}
              <span className="text-blue-600 block sm:inline">An outcomes machine.</span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed max-w-2xl">
              We obsess over one metric: how fast you land a job you love, at a salary that
              reflects your skills. Everything below is how we get you there.
            </p>
          </motion.div>
        </div>

        {/* ── Feature grid with responsive columns ── */}
        <div className={`grid ${getGridConfig()} gap-3 sm:gap-4 md:gap-px bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 shadow-sm`}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: isMobile ? "-20px" : "-40px" }}
              variants={fadeUp}
              className="group relative bg-white p-5 sm:p-6 md:p-7 lg:p-8 flex flex-col gap-3 sm:gap-4 md:gap-5
                         hover:z-10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                         transition-all duration-300 cursor-default rounded-lg sm:rounded-none
                         border border-gray-200 sm:border-0 mb-2 sm:mb-0"
            >
              {/* Accent line that slides in on hover - hidden on mobile */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-sm hidden sm:block"
                style={{ backgroundColor: f.accent }}
              />

              {/* Icon + stat row */}
              <div className="flex items-start justify-between">
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: f.lightBg }}
                >
                  <f.icon
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 transition-colors duration-300"
                    style={{ color: f.accent }}
                  />
                </div>

                {/* Stat pill */}
                <div className="text-right">
                  <p
                    className="text-lg sm:text-xl md:text-2xl font-bold leading-none"
                    style={{ color: f.accent }}
                  >
                    {f.stat}
                  </p>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-400 mt-0.5 sm:mt-1 uppercase tracking-wider leading-tight">
                    {f.statLabel}
                  </p>
                </div>
              </div>

              {/* Text */}
              <div>
                <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest mb-1 sm:mb-1.5" 
                   style={{ color: f.accent }}>
                  {f.eyebrow}
                </p>
                <h3 className="text-sm sm:text-[15px] md:text-base font-bold text-gray-900 mb-1.5 sm:mb-2 leading-snug">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-[12px] md:text-[13px] text-gray-500 leading-relaxed">
                  {f.description}
                </p>
              </div>

              {/* Learn more – appears on hover (always visible on mobile) */}
              <div className={`mt-auto pt-1 sm:pt-2 flex items-center gap-1.5 text-[11px] sm:text-[12px] font-semibold 
                              ${isMobile ? 'opacity-100 translate-y-0' : 'opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0'} 
                              transition-all duration-200`}
                style={{ color: f.accent }}>
                Learn more <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom trust bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5
                     px-4 sm:px-6 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-200"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            <div className="flex -space-x-2.5">
              {["#2563EB", "#059669", "#D97706", "#7C3AED"].map((c, i) => (
                <div
                  key={i}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold"
                  style={{ backgroundColor: c }}
                >
                  {["SJ", "MC", "PS", "DK"][i]}
                </div>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              <span className="font-semibold text-gray-900">5,000+ graduates</span>{" "}
              <span className="hidden xs:inline">from 30+ countries trust Sipayala</span>
              <span className="xs:hidden">trust Sipayala</span>
            </p>
          </div>

          <a
            href="/courses"
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-xl
                       bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold
                       shadow-sm shadow-blue-200 transition-all hover:scale-105 active:scale-95"
          >
            Explore programmes <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>
        </motion.div>

        {/* Floating elements - decorative (hidden on mobile) */}
        <div className="hidden lg:block">
          <div className="absolute top-40 left-0 w-32 h-32 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-40 right-0 w-40 h-40 bg-purple-100/30 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;