// src/pages/Team.tsx
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import {
  Users, Linkedin, Github, Twitter, Mail, MapPin,
  Star, Quote, Search, X, BookOpen,
  MessageCircle, Calendar, ArrowRight,
  RefreshCw, AlertCircle, Sparkles,
} from "lucide-react";
import {
  motion, AnimatePresence, useScroll, useTransform, useInView,
  useMotionValue, useSpring, animate,
} from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface TeamMember {
  id: number;
  name: string;
  role: string;
  title: string;
  expertise: string[];
  bio: string;
  image: string;
  email: string;
  location?: string;
  social: { linkedin?: string; github?: string; twitter?: string; website?: string };
  stats: { students: number; experience: number; courses: number; rating: number; projects?: number };
  education: Array<{ degree: string; institution: string; year: string }>;
  achievements: string[];
  certifications?: string[];
  featured: boolean;
  department: "engineering" | "data-science" | "design" | "management" | "career" | "leadership";
  availability: "available" | "busy" | "limited";
  languages?: string[];
  fun_fact?: string;
  accentColor: string;
  glowColors: [string, string];
  tagline: string;
}

// ─── Team Data ─────────────────────────────────────────────────────────────────
const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1, name: "Dr. Priya Rana", role: "Co-Founder & Chief Academic Officer",
    title: "AI Research Scientist", tagline: "Turning research into real-world impact",
    expertise: ["Machine Learning", "Deep Learning", "Computer Vision", "NLP", "Python"],
    bio: "Former AI researcher at Google Brain with 12+ years in industry and academia. Led teams developing large-scale ML systems and published 15+ research papers. Passionate about making AI education accessible to everyone in Nepal and beyond.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=700&fit=crop&crop=faces",
    email: "priya.rana@sipalaya.info", location: "Kathmandu, Nepal",
    accentColor: "#6366f1", glowColors: ["#89ff00", "#00bcd4"],
    social: { linkedin: "#", github: "#", twitter: "#" },
    stats: { students: 8500, experience: 12, courses: 4, rating: 4.9, projects: 25 },
    education: [
      { degree: "Ph.D. in Computer Science (AI)", institution: "Stanford University", year: "2012" },
      { degree: "M.S. in Machine Learning", institution: "Carnegie Mellon University", year: "2008" },
    ],
    achievements: ["Google Women in Tech Award 2020", "15+ peer-reviewed publications", "5 patents in ML systems", "Keynote speaker at NeurIPS 2022"],
    certifications: ["TensorFlow Developer Certificate", "AWS Certified AI/ML"],
    featured: true, department: "leadership", availability: "limited",
    languages: ["English", "Hindi", "Nepali"], fun_fact: "Can solve a Rubik's cube in under 2 minutes",
  },
  {
    id: 2, name: "Bibek Khatri", role: "Lead Full-Stack Instructor",
    title: "Senior Software Architect", tagline: "Building the engineers who build tomorrow",
    expertise: ["React/Next.js", "Node.js", "Python/Django", "System Design", "TypeScript"],
    bio: "12+ years building scalable web applications for startups and enterprises. Previously Tech Lead at CloudFactory and Leapfrog. Mentored 200+ developers who now work at Google, Microsoft, and Amazon.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=700&fit=crop&crop=faces",
    email: "bibek.khatri@sipalaya.info", location: "Lalitpur, Nepal",
    accentColor: "#10b981", glowColors: ["#f59e0b", "#ec4899"],
    social: { linkedin: "#", github: "#" },
    stats: { students: 5200, experience: 12, courses: 6, rating: 4.8, projects: 45 },
    education: [
      { degree: "M.Sc. in Computer Science", institution: "Pulchowk Campus, TU", year: "2012" },
      { degree: "B.E. in Computer Engineering", institution: "Kathmandu University", year: "2009" },
    ],
    achievements: ["Built 30+ production apps", "Mentored 200+ developers", "Open source contributor", "Tech speaker at 25+ conferences"],
    certifications: ["AWS Certified Developer", "MongoDB Certified Developer"],
    featured: true, department: "engineering", availability: "available",
    languages: ["English", "Nepali", "Hindi"], fun_fact: "Has contributed to over 50 open source projects",
  },
  {
    id: 3, name: "Sunita Sharma", role: "Lead Data Science Instructor",
    title: "Data Science & Analytics Expert", tagline: "Making data speak for those who can't yet code",
    expertise: ["Data Science", "Machine Learning", "Python", "Big Data", "Statistics"],
    bio: "Ex-Senior Data Scientist at Fusemachines with expertise in building end-to-end ML pipelines. Specializes in making complex data concepts accessible to beginners. Passionate about women in tech.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=700&fit=crop&crop=faces",
    email: "sunita.sharma@sipalaya.info", location: "Kathmandu, Nepal",
    accentColor: "#f59e0b", glowColors: ["#6366f1", "#06b6d4"],
    social: { linkedin: "#", github: "#" },
    stats: { students: 4300, experience: 8, courses: 5, rating: 4.9, projects: 20 },
    education: [
      { degree: "M.S. in Data Science", institution: "University of San Francisco", year: "2016" },
      { degree: "B.E. in Electronics", institution: "IOE, Pulchowk", year: "2012" },
    ],
    achievements: ["Women in Data Science Ambassador", "Kaggle Competition Master", "Published 8 data science articles", "Led analytics for 15+ enterprise projects"],
    certifications: ["Google Data Analytics", "IBM Data Science Professional"],
    featured: true, department: "data-science", availability: "available",
    languages: ["English", "Nepali", "Hindi"], fun_fact: "Won 3 Kaggle competitions in 2023",
  },
  {
    id: 4, name: "Rajesh Hamal", role: "Lead Mobile Dev Instructor",
    title: "Mobile Architecture Specialist", tagline: "Every great app starts with a great foundation",
    expertise: ["iOS (Swift)", "Android (Kotlin)", "React Native", "Flutter", "Mobile Security"],
    bio: "Mobile developer with 10+ years experience building apps for fintech, e-commerce, and healthcare. Apps built by his students have 5M+ combined downloads on App Store and Play Store.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=700&fit=crop&crop=faces",
    email: "rajesh.hamal@sipalaya.info", location: "Pokhara, Nepal",
    accentColor: "#ec4899", glowColors: ["#10b981", "#818cf8"],
    social: { linkedin: "#", github: "#" },
    stats: { students: 3800, experience: 10, courses: 5, rating: 4.7, projects: 35 },
    education: [
      { degree: "M.Tech in Software Engineering", institution: "BITS Pilani", year: "2014" },
      { degree: "B.E. in Computer Science", institution: "Kathmandu University", year: "2010" },
    ],
    achievements: ["Built 25+ production apps", "Google Certified Android Developer", "Apple Certified iOS Developer", "Mentored 150+ mobile developers"],
    certifications: ["Google Associate Android Developer", "Meta iOS Developer"],
    featured: false, department: "engineering", availability: "busy",
    languages: ["English", "Nepali", "Hindi"], fun_fact: "Has apps with 5M+ total downloads",
  },
  {
    id: 5, name: "Anita Gurung", role: "UI/UX Design Lead",
    title: "Product Design Expert", tagline: "Design that moves people, literally and emotionally",
    expertise: ["UI Design", "UX Research", "Figma", "Design Systems", "User Testing"],
    bio: "Product designer with 8+ years experience designing for startups and enterprises. Previously led design at Deerwalk and designed products used by 2M+ users. Passionate about design education.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=700&fit=crop&crop=faces",
    email: "anita.gurung@sipalaya.info", location: "Kathmandu, Nepal",
    accentColor: "#8b5cf6", glowColors: ["#f43f5e", "#f59e0b"],
    social: { linkedin: "#" },
    stats: { students: 2900, experience: 8, courses: 4, rating: 4.8, projects: 30 },
    education: [
      { degree: "M.Des in Interaction Design", institution: "NID, Ahmedabad", year: "2016" },
      { degree: "B.Des in Visual Communication", institution: "Kathmandu University", year: "2012" },
    ],
    achievements: ["Design Lead for 3 award-winning apps", "Speaker at UX India 2023", "Published design articles on Medium", "Mentored 50+ junior designers"],
    certifications: ["Google UX Design", "NN/g UX Certification"],
    featured: false, department: "design", availability: "available",
    languages: ["English", "Nepali", "Hindi"], fun_fact: "Has designed products used by 2M+ users",
  },
  {
    id: 6, name: "Suresh Adhikari", role: "DevOps & Cloud Architect",
    title: "Cloud Infrastructure Specialist", tagline: "Infrastructure that scales, systems that never sleep",
    expertise: ["AWS/Azure/GCP", "Docker/Kubernetes", "CI/CD", "Infrastructure as Code", "DevSecOps"],
    bio: "Cloud architect with 9+ years experience designing scalable infrastructure. 5x AWS Certified and 3x Azure Certified. Previously led cloud migration for Nepal's largest e-commerce platform.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=700&fit=crop&crop=faces",
    email: "suresh.adhikari@sipalaya.info", location: "Kathmandu, Nepal",
    accentColor: "#06b6d4", glowColors: ["#8b5cf6", "#06b6d4"],
    social: { linkedin: "#", github: "#" },
    stats: { students: 2100, experience: 9, courses: 3, rating: 4.9, projects: 40 },
    education: [
      { degree: "M.Sc. in Cloud Computing", institution: "University of Melbourne", year: "2015" },
      { degree: "B.E. in Computer Engineering", institution: "Kathmandu University", year: "2011" },
    ],
    achievements: ["5x AWS Certified", "3x Azure Certified", "Kubernetes Certified Administrator", "Led 20+ cloud migration projects"],
    certifications: ["AWS Solutions Architect", "CKA", "Azure Administrator"],
    featured: false, department: "engineering", availability: "limited",
    languages: ["English", "Nepali", "Hindi"], fun_fact: "Has 10+ cloud certifications",
  },
  {
    id: 7, name: "Sabina Thapa", role: "Career Development Lead",
    title: "Career Coach & HR Expert", tagline: "Your dream job is one strategy away",
    expertise: ["Career Coaching", "Resume Optimization", "Interview Prep", "Salary Negotiation", "HR Strategy"],
    bio: "HR professional with 10+ years in tech recruitment. Placed 500+ candidates at companies like Google, Microsoft, Amazon, and local tech giants. Specializes in helping students land their dream jobs.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=700&fit=crop&crop=faces",
    email: "sabina.thapa@sipalaya.info", location: "Kathmandu, Nepal",
    accentColor: "#f43f5e", glowColors: ["#89ff00", "#f43f5e"],
    social: { linkedin: "#" },
    stats: { students: 3500, experience: 10, courses: 2, rating: 4.9, projects: 0 },
    education: [
      { degree: "MBA in HR", institution: "Kathmandu University", year: "2014" },
      { degree: "BBA", institution: "Purbanchal University", year: "2010" },
    ],
    achievements: ["Placed 500+ tech professionals", "Certified Career Coach", "Conducted 1000+ mock interviews", "Featured in 10+ career podcasts"],
    certifications: ["Certified Career Coach", "SHRM-CP"],
    featured: true, department: "career", availability: "available",
    languages: ["English", "Nepali", "Hindi"], fun_fact: "Has placed candidates in 15+ countries",
  },
  {
    id: 8, name: "Dr. Ramesh Poudel", role: "Cybersecurity Lead",
    title: "Information Security Expert", tagline: "Securing the systems that power our digital world",
    expertise: ["Cybersecurity", "Ethical Hacking", "Network Security", "Penetration Testing", "Security Architecture"],
    bio: "Cybersecurity expert with 15+ years in information security. Former CISO at Nepal's largest bank. Certified Ethical Hacker and CISSP. Trains students in ethical hacking and security best practices.",
    image: "https://images.unsplash.com/photo-1531427186111-1c5b6b6a5b9a?w=600&h=700&fit=crop&crop=faces",
    email: "ramesh.poudel@sipalaya.info", location: "Kathmandu, Nepal",
    accentColor: "#64748b", glowColors: ["#6366f1", "#ec4899"],
    social: { linkedin: "#" },
    stats: { students: 1800, experience: 15, courses: 3, rating: 4.8, projects: 50 },
    education: [
      { degree: "Ph.D. in Cybersecurity", institution: "Purdue University", year: "2009" },
      { degree: "M.S. in Information Security", institution: "Carnegie Mellon University", year: "2004" },
    ],
    achievements: ["CISSP Certified", "CEH Master", "Published 8 security papers", "Advisor to Nepal Cyber Bureau"],
    certifications: ["CISSP", "CEH", "CISM", "CompTIA Security+"],
    featured: false, department: "engineering", availability: "limited",
    languages: ["English", "Nepali", "Hindi"], fun_fact: "Has discovered 50+ security vulnerabilities",
  },
];

const DEPARTMENTS = [
  { id: "all", label: "All Members" },
  { id: "leadership", label: "Leadership" },
  { id: "engineering", label: "Engineering" },
  { id: "data-science", label: "Data Science" },
  { id: "design", label: "Design" },
  { id: "career", label: "Career Services" },
];

const formatNum = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(n);

const getAvailabilityLabel = (a: string) =>
  a === "available" ? "Open to sessions" : a === "limited" ? "Limited availability" : "Currently busy";

// ─── Spring animated number ────────────────────────────────────────────────────
const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8, ease: [0.16, 1, 0.3, 1],
      onUpdate: v => setDisplay(Math.floor(v)),
    });
    return controls.stop;
  }, [inView, value]);
  return <span ref={ref}>{formatNum(display)}{suffix}</span>;
};

// ─── Particle field ────────────────────────────────────────────────────────────
const ParticleField = ({ mouseX, mouseY }: { mouseX: number; mouseY: number }) => {
  const particles = useMemo(() => Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2.5 + 1,
    speed: Math.random() * 0.45 + 0.08,
    color: ["#89ff00", "#00bcd4", "#6366f1", "#f59e0b", "#ec4899"][Math.floor(Math.random() * 5)],
    delay: Math.random() * 3,
  })), []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{ width: p.size, height: p.size, background: p.color, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            x: (mouseX - 50) * p.speed * 0.9,
            y: (mouseY - 50) * p.speed * 0.9,
            opacity: [0.15, 0.55, 0.15],
            scale: [1, 1.6, 1],
          }}
          transition={{
            x: { type: "spring", stiffness: 28, damping: 18 },
            y: { type: "spring", stiffness: 28, damping: 18 },
            opacity: { duration: 3 + p.speed * 3, repeat: Infinity, ease: "easeInOut", delay: p.delay },
            scale: { duration: 4 + p.speed * 2, repeat: Infinity, ease: "easeInOut", delay: p.delay },
          }}
        />
      ))}
    </div>
  );
};

// ─── Liquid blob ───────────────────────────────────────────────────────────────
const LiquidBlob = ({ color, style, mouseX, mouseY, factor, duration = 9 }: {
  color: string; style: React.CSSProperties; mouseX: number; mouseY: number; factor: number; duration?: number;
}) => (
  <motion.div className="absolute pointer-events-none"
    style={{ background: `radial-gradient(circle, ${color}, transparent 70%)`, ...style }}
    animate={{
      x: (mouseX - 50) * factor,
      y: (mouseY - 50) * factor,
      scale: [1, 1.14, 0.9, 1.08, 1],
      borderRadius: ["50%", "44% 56% 62% 38%", "56% 44% 38% 62%", "38% 62% 56% 44%", "50%"],
    }}
    transition={{
      x: { type: "spring", stiffness: 18, damping: 14 },
      y: { type: "spring", stiffness: 18, damping: 14 },
      scale: { duration, repeat: Infinity, ease: "easeInOut" },
      borderRadius: { duration: duration * 1.2, repeat: Infinity, ease: "easeInOut" },
    }}
  />
);

// ─── Word-by-word headline ─────────────────────────────────────────────────────
const AnimatedHeadline = () => {
  const words = [
    { text: "The", color: "white", italic: false },
    { text: "experts", color: "white", italic: false },
    { text: "\n", color: "white", italic: false },
    { text: "behind", color: "#818cf8", italic: true },
    { text: "your", color: "white", italic: false },
    { text: "success", color: "white", italic: false },
  ];
  let lineBreakSeen = false;
  return (
    <h1 className="display text-[52px] md:text-[62px] font-normal text-white leading-[1.08] tracking-tight mb-6">
      {words.map((w, i) => {
        if (w.text === "\n") { lineBreakSeen = true; return <br key="br" />; }
        const delay = lineBreakSeen ? 0.42 + (i - 3) * 0.13 : 0.12 + i * 0.13;
        return (
          <motion.span key={i}
            className="inline-block"
            style={{ color: w.color, fontStyle: w.italic ? "italic" : "normal", marginRight: "0.22em" }}
            initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay, duration: 0.65, ease: [0.21, 1.02, 0.37, 1] }}>
            {w.text}
          </motion.span>
        );
      })}
    </h1>
  );
};

// ─── Hero avatar thumb ─────────────────────────────────────────────────────────
const HeroMemberThumb = ({ member, delay, parallaxFactor }: { member: TeamMember; delay: number; parallaxFactor: number }) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 20 }}
      className="relative cursor-pointer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <motion.div
        animate={{ y: hov ? -7 : 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 14 }}
        className="w-14 h-14 rounded-2xl overflow-hidden"
        style={{ boxShadow: hov ? `0 0 0 3px ${member.accentColor}, 0 8px 24px ${member.accentColor}60` : `0 0 0 2px ${member.accentColor}80` }}>
        <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
      </motion.div>
      <AnimatePresence>
        {hov && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.82 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.88 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap px-2.5 py-1 rounded-xl text-[11px] font-bold text-white shadow-lg pointer-events-none"
            style={{ background: member.accentColor }}>
            {member.name.split(" ")[0]}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
              style={{ borderTopColor: member.accentColor }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Floating photo card ───────────────────────────────────────────────────────
const FloatingPhotoCard = ({ member, index, mouseX, mouseY, onClick }: {
  member: TeamMember; index: number; mouseX: number; mouseY: number; onClick: () => void;
}) => {
  const factors = [0.042, 0.026, 0.055];
  const floatAmps = [12, 8, 16];
  const floatDurs = [4.2, 5.6, 3.7];
  const rotates = [-2, 3, -4];

  return (
    <motion.div
      className="absolute rounded-[20px] overflow-hidden cursor-pointer"
      style={{
        width: index === 0 ? 260 : 200,
        height: index === 0 ? 340 : 260,
        top: [20, 0, 160][index],
        left: [40, 220, 190][index],
        zIndex: [3, 2, 1][index],
        boxShadow: `0 24px 48px ${member.accentColor}45, 0 0 0 2px ${member.glowColors[0]}55`,
      }}
      initial={{ opacity: 0, y: 50, rotate: rotates[index] }}
      animate={{
        opacity: 1,
        rotate: rotates[index],
        y: [0, -floatAmps[index], floatAmps[index] * 0.5, 0],
        x: (mouseX - 50) * factors[index],
      }}
      transition={{
        opacity: { delay: 0.3 + index * 0.12, duration: 0.7 },
        y: { duration: floatDurs[index], repeat: Infinity, ease: "easeInOut", delay: index * 0.9 },
        x: { type: "spring", stiffness: 22, damping: 16 },
        rotate: { duration: 0 },
      }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 10, boxShadow: `0 32px 60px ${member.accentColor}55` }}
      transition2={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] } as any}
      onClick={onClick}
    >
      <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${member.accentColor}e0 0%, transparent 55%)` }} />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-[13px] font-black text-white">{member.name.split(" ")[0]}</p>
        <p className="text-[10px] text-white/70 font-semibold">{member.role.split(" ").slice(-2).join(" ")}</p>
      </div>
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm">
        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
        <span className="text-[10px] font-bold text-white">{member.stats.rating}</span>
      </div>
    </motion.div>
  );
};

// ─── Magnetic glow card ────────────────────────────────────────────────────────
const GlowMemberCard = ({ member, index, onClick }: { member: TeamMember; index: number; onClick: () => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [shimmerPos, setShimmerPos] = useState({ x: -200, y: -200 });

  const rotateX = useSpring(0, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 22 });
  const cardX = useSpring(0, { stiffness: 160, damping: 22 });
  const cardY = useSpring(0, { stiffness: 160, damping: 22 });

  const [statDisplay, setStatDisplay] = useState({ students: 0, experience: 0, courses: 0 });

  useEffect(() => {
    if (!inView) return;
    const c1 = animate(0, member.stats.students, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: v => setStatDisplay(p => ({ ...p, students: Math.floor(v) })) });
    const c2 = animate(0, member.stats.experience, { duration: 1.3, ease: [0.16, 1, 0.3, 1], onUpdate: v => setStatDisplay(p => ({ ...p, experience: Math.floor(v) })) });
    const c3 = animate(0, member.stats.courses, { duration: 1.0, ease: [0.16, 1, 0.3, 1], onUpdate: v => setStatDisplay(p => ({ ...p, courses: Math.floor(v) })) });
    return () => { c1.stop(); c2.stop(); c3.stop(); };
  }, [inView, member.stats.students, member.stats.experience, member.stats.courses]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const hw = rect.width / 2, hh = rect.height / 2;
    rotateX.set(-(cy - hh) / hh * 9);
    rotateY.set((cx - hw) / hw * 9);
    cardX.set((cx - hw) * 0.06);
    cardY.set((cy - hh) * 0.06);
    setShimmerPos({ x: cx, y: cy });
  }, [rotateX, rotateY, cardX, cardY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0); rotateY.set(0); cardX.set(0); cardY.set(0);
    setHovered(false);
  }, [rotateX, rotateY, cardX, cardY]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(rip => rip.id !== id)), 750);
    onClick();
  }, [onClick]);

  const availabilityColor =
    member.availability === "available" ? "#10b981" :
    member.availability === "limited" ? "#f59e0b" : "#ef4444";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: (index % 4) * 0.09, ease: [0.21, 1.02, 0.37, 1] }}
      className="glow-card"
      style={{
        rotateX, rotateY, x: cardX, y: cardY,
        transformStyle: "preserve-3d",
        ["--grad" as string]: `linear-gradient(235deg, ${member.glowColors[0]}, #010615 40%, ${member.glowColors[1]})`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="glow-inner">
        {/* Shimmer */}
        <div className="shimmer-overlay" style={{
          background: hovered
            ? `radial-gradient(circle 90px at ${shimmerPos.x}px ${shimmerPos.y}px, rgba(255,255,255,0.09), transparent 70%)`
            : "none",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s",
        }} />

        {/* Ripples */}
        {ripples.map(r => (
          <motion.div key={r.id} className="ripple"
            style={{ left: r.x, top: r.y }}
            initial={{ width: 0, height: 0, opacity: 0.45, x: "-50%", y: "-50%" }}
            animate={{ width: 340, height: 340, opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
          />
        ))}

        {/* Photo */}
        <div className="glow-photo">
          <motion.img src={member.image} alt={member.name} className="glow-img"
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
          />
          <div className="glow-img-overlay" />

          {/* Static name */}
          <motion.div className="glow-name-static"
            animate={{ opacity: hovered ? 0 : 1, y: hovered ? 10 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </motion.div>

          <div className="glow-rating-pill">
            <Star size={11} style={{ fill: "#fbbf24", color: "#fbbf24" }} />
            {member.stats.rating}
          </div>
          <div className="glow-avail-pill">
            <span className="glow-dot" style={{ background: availabilityColor }} />
            <span style={{ color: availabilityColor, fontSize: 10 }}>{member.availability}</span>
          </div>
        </div>

        {/* Content */}
        <motion.div className="glow-content"
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 16 }}
          transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}>
          <h2 className="glow-name">{member.name}</h2>
          <p className="glow-title">{member.title}</p>

          <div className="glow-chips">
            {member.expertise.slice(0, 3).map((s, ci) => (
              <motion.span key={s} className="glow-chip"
                initial={{ opacity: 0, x: -10 }}
                animate={hovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ delay: ci * 0.055, duration: 0.3, ease: "easeOut" }}
                whileHover={{ scale: 1.14, y: -2 }}
              >{s}</motion.span>
            ))}
            {member.expertise.length > 3 && <span className="glow-chip">+{member.expertise.length - 3}</span>}
          </div>

          <div className="glow-stats">
            <div className="glow-stat">
              <span className="glow-stat-v">{formatNum(statDisplay.students)}</span>
              <span className="glow-stat-l">Students</span>
            </div>
            <div className="glow-stat glow-stat-mid">
              <span className="glow-stat-v">{statDisplay.experience}y</span>
              <span className="glow-stat-l">Exp.</span>
            </div>
            <div className="glow-stat">
              <span className="glow-stat-v">{statDisplay.courses}</span>
              <span className="glow-stat-l">Courses</span>
            </div>
          </div>

          <div className="glow-footer">
            <div className="glow-socials">
              {member.social.linkedin && (
                <motion.a href={member.social.linkedin} onClick={e => e.stopPropagation()} className="glow-soc-btn"
                  whileHover={{ scale: 1.22, y: -4 }} whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 520, damping: 12 }}>in</motion.a>
              )}
              {member.social.github && (
                <motion.a href={member.social.github} onClick={e => e.stopPropagation()} className="glow-soc-btn"
                  whileHover={{ scale: 1.22, y: -4 }} whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 520, damping: 12 }}>gh</motion.a>
              )}
              {member.social.twitter && (
                <motion.a href={member.social.twitter} onClick={e => e.stopPropagation()} className="glow-soc-btn"
                  whileHover={{ scale: 1.22, y: -4 }} whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 520, damping: 12 }}>tw</motion.a>
              )}
            </div>
            <motion.span className="glow-view-btn"
              animate={{ x: hovered ? 0 : 8, opacity: hovered ? 1 : 0.35 }}
              transition={{ duration: 0.28 }}>
              View profile →
            </motion.span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ─── Modal ─────────────────────────────────────────────────────────────────────
const MemberModal = ({ member, onClose }: { member: TeamMember; onClose: () => void }) => {
  const availabilityColor =
    member.availability === "available" ? "#10b981" :
    member.availability === "limited" ? "#f59e0b" : "#ef4444";

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.065, delayChildren: 0.12 } } };
  const item = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 24 } } };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(2,4,16,0.9)", backdropFilter: "blur(18px)" }}
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.82, y: 50, opacity: 0, rotateX: 10 }}
        animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.9, y: 24, opacity: 0, rotateX: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="bg-white rounded-[28px] max-w-[860px] w-full max-h-[92vh] overflow-hidden flex flex-col"
        style={{ boxShadow: `0 50px 100px -12px ${member.accentColor}55, 0 24px 50px rgba(0,0,0,0.45)`, transformPerspective: 1200 }}
        onClick={e => e.stopPropagation()}>

        {/* Animated top bar */}
        <div className="h-1.5 flex-shrink-0 modal-bar"
          style={{ background: `linear-gradient(90deg, ${member.glowColors[0]}, ${member.accentColor}, ${member.glowColors[1]}, ${member.glowColors[0]})` }} />

        <div className="overflow-y-auto flex-1">
          <div className="grid md:grid-cols-[300px_1fr]">
            {/* Left */}
            <div className="relative" style={{ background: `linear-gradient(160deg, ${member.accentColor}1a, ${member.accentColor}06)` }}>
              <div className="relative h-72 md:h-80 overflow-hidden">
                <motion.img src={member.image} alt={member.name}
                  className="w-full h-full object-cover object-top"
                  initial={{ scale: 1.18, filter: "brightness(0.5)" }}
                  animate={{ scale: 1, filter: "brightness(1)" }}
                  transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }} />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${member.accentColor}cc 0%, transparent 60%)` }} />
                <div className="absolute bottom-4 left-4 right-4">
                  <motion.h2 initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.22, type: "spring", stiffness: 280 }}
                    className="text-[22px] font-black text-white leading-tight">{member.name}</motion.h2>
                  <motion.p initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 280 }}
                    className="text-[13px] font-semibold text-white/80 mt-0.5">{member.role}</motion.p>
                </div>
              </div>

              <motion.div className="p-5 space-y-4" variants={container} initial="hidden" animate="visible">
                <motion.div variants={item} className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-semibold"
                  style={{ background: `${availabilityColor}1a`, color: availabilityColor }}>
                  <motion.span className="w-2 h-2 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ background: availabilityColor, display: "inline-block" }} />
                  {getAvailabilityLabel(member.availability)}
                </motion.div>

                <motion.div variants={item} className="space-y-2">
                  {member.location && (
                    <div className="flex items-center gap-2 text-[12px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: member.accentColor }} />
                      {member.location}
                    </div>
                  )}
                  <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-800 transition-colors">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: member.accentColor }} />
                    {member.email}
                  </a>
                </motion.div>

                <motion.div variants={item} className="flex gap-2">
                  {member.social.linkedin && (
                    <motion.a href={member.social.linkedin} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: "#0A66C2" }}
                      whileHover={{ scale: 1.16, y: -3 }} transition={{ type: "spring", stiffness: 420, damping: 12 }}>
                      <Linkedin className="w-4 h-4" />
                    </motion.a>
                  )}
                  {member.social.github && (
                    <motion.a href={member.social.github} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-900 text-white"
                      whileHover={{ scale: 1.16, y: -3 }} transition={{ type: "spring", stiffness: 420, damping: 12 }}>
                      <Github className="w-4 h-4" />
                    </motion.a>
                  )}
                  {member.social.twitter && (
                    <motion.a href={member.social.twitter} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: "#1DA1F2" }}
                      whileHover={{ scale: 1.16, y: -3 }} transition={{ type: "spring", stiffness: 420, damping: 12 }}>
                      <Twitter className="w-4 h-4" />
                    </motion.a>
                  )}
                </motion.div>

                <motion.div variants={item} className="grid grid-cols-2 gap-2">
                  {[
                    { v: formatNum(member.stats.students) + "+", l: "Students" },
                    { v: member.stats.experience + "y", l: "Experience" },
                    { v: String(member.stats.courses), l: "Courses" },
                    { v: String(member.stats.rating) + "★", l: "Rating" },
                  ].map(s => (
                    <div key={s.l} className="rounded-xl py-2.5 px-3 text-center" style={{ background: `${member.accentColor}12` }}>
                      <p className="text-[15px] font-black" style={{ color: member.accentColor }}>{s.v}</p>
                      <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">{s.l}</p>
                    </div>
                  ))}
                </motion.div>

                {member.fun_fact && (
                  <motion.div variants={item} className="rounded-xl p-3 border"
                    style={{ background: `${member.accentColor}08`, borderColor: `${member.accentColor}22` }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: member.accentColor }}>✨ Fun Fact</p>
                    <p className="text-[12px] text-slate-600 leading-relaxed">{member.fun_fact}</p>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Right */}
            <motion.div className="p-7" variants={container} initial="hidden" animate="visible">
              <motion.div variants={item} className="flex justify-end mb-4">
                <motion.button onClick={onClose}
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 text-slate-500"
                  whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 380, damping: 16 }}>
                  <X className="w-4 h-4" />
                </motion.button>
              </motion.div>

              <motion.div variants={item}>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: member.accentColor }}>{member.title}</p>
                <p className="text-[15px] text-slate-500 italic mb-5 leading-relaxed">"{member.tagline}"</p>
              </motion.div>

              <motion.div variants={item} className="mb-6">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">About</h4>
                <p className="text-[13.5px] text-slate-600 leading-[1.75]">{member.bio}</p>
              </motion.div>

              <motion.div variants={item} className="mb-6">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill, si) => (
                    <motion.span key={skill} className="text-[12px] px-3 py-1 rounded-xl font-semibold"
                      style={{ background: `${member.accentColor}12`, color: member.accentColor }}
                      initial={{ opacity: 0, scale: 0.75 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.28 + si * 0.055, type: "spring", stiffness: 380, damping: 20 }}
                      whileHover={{ scale: 1.1, y: -2 }}>
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={item} className="mb-6">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">Key Achievements</h4>
                <ul className="space-y-2">
                  {member.achievements.map((a, i) => (
                    <motion.li key={i}
                      initial={{ x: -18, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.18 + i * 0.075, type: "spring", stiffness: 280, damping: 22 }}
                      className="flex items-start gap-2.5 text-[13px] text-slate-600">
                      <span className="mt-1 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[8px] font-bold text-white"
                        style={{ background: member.accentColor }}>✓</span>
                      {a}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={item} className="mb-6">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">Education</h4>
                {member.education.map((edu, i) => (
                  <div key={i} className="mb-2.5 pl-3 border-l-2" style={{ borderColor: `${member.accentColor}40` }}>
                    <p className="text-[13px] font-bold text-slate-800">{edu.degree}</p>
                    <p className="text-[11.5px] text-slate-500">{edu.institution} · {edu.year}</p>
                  </div>
                ))}
              </motion.div>

              {member.certifications && (
                <motion.div variants={item} className="mb-8">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">Certifications</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {member.certifications.map(cert => (
                      <span key={cert} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium border border-slate-200/80">
                        {cert}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div variants={item} className="flex gap-3">
                <motion.a href={`/courses?instructor=${member.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[13px] font-bold text-white"
                  style={{ background: member.accentColor, boxShadow: `0 8px 24px ${member.accentColor}40` }}
                  whileHover={{ y: -3, boxShadow: `0 14px 36px ${member.accentColor}55` }}
                  whileTap={{ y: 0, scale: 0.97 }}>
                  <BookOpen className="w-4 h-4" /> View Courses
                </motion.a>
                <motion.a href={`/contact?instructor=${member.id}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[13px] font-bold border-2"
                  style={{ borderColor: `${member.accentColor}40`, color: member.accentColor }}
                  whileHover={{ y: -3, background: `${member.accentColor}0a` }}
                  whileTap={{ y: 0, scale: 0.97 }}>
                  <Calendar className="w-4 h-4" /> Book Session
                </motion.a>
              </motion.div>

              <motion.div variants={item} className="mt-5 p-4 rounded-2xl relative overflow-hidden"
                style={{ background: `${member.accentColor}08`, border: `1px solid ${member.accentColor}16` }}>
                <Quote className="absolute top-2 left-3 w-8 h-8 opacity-10" style={{ color: member.accentColor }} />
                <p className="text-[13px] text-slate-600 italic pl-7 leading-relaxed">
                  "My goal is to not just teach you the syntax, but to make you a confident developer who can solve real problems."
                </p>
                <p className="text-[11px] font-bold mt-2 pl-7" style={{ color: member.accentColor }}>— {member.name}</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────────
const Team = () => {
  const [selectedDept, setSelectedDept] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [marqueeHovered, setMarqueeHovered] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, -60]);
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.96]);
  const blobParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/team/", { method: "HEAD" })
      .then(r => setApiAvailable(r.ok)).catch(() => setApiAvailable(false));
  }, []);

  const handleHeroMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  }, []);

  const filtered = TEAM_MEMBERS.filter(m => {
    const matchDept = selectedDept === "all" || m.department === selectedDept;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) ||
      m.expertise.some(e => e.toLowerCase().includes(q)) || m.bio.toLowerCase().includes(q);
    return matchDept && matchSearch;
  });
  const featured = filtered.filter(m => m.featured);
  const nonFeatured = filtered.filter(m => !m.featured);
  const hasFilters = selectedDept !== "all" || searchQuery.length > 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 48, scale: 0.91 },
    visible: (i: number) => ({
      opacity: 1, y: 0, scale: 1,
      transition: { delay: i * 0.075, type: "spring" as const, stiffness: 190, damping: 24 },
    }),
  };

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
        * { font-family: 'Poppins', system-ui, sans-serif; }
        .display { font-family: 'DM Serif Display', Georgia, serif; }

        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .ticker-track { animation: ticker 28s linear infinite; }
        .ticker-track.paused { animation-play-state: paused; }

        @keyframes glowPulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.88; } }

        @keyframes borderFlow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes dotPulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.42; transform:scale(0.72); } }

        @keyframes barShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        /* ─── Glow card ─── */
        .glow-card {
          position: relative; width: 100%;
          background: #060c21; border-radius: 8px;
          cursor: pointer; will-change: transform;
        }
        .glow-card::before {
          content: ''; position: absolute; inset: -2px;
          background: var(--grad); background-size: 300% 300%;
          z-index: 0; border-radius: 8px;
          animation: borderFlow 5s ease infinite;
        }
        .glow-card::after {
          content: ''; position: absolute; inset: -3px;
          background: var(--grad); z-index: -1;
          filter: blur(28px); border-radius: 8px;
          animation: glowPulse 3s ease-in-out infinite;
        }
        .glow-inner {
          position: relative; z-index: 1; background: #060c21;
          border-radius: 7px; overflow: hidden;
          display: flex; flex-direction: column;
        }
        .shimmer-overlay {
          position: absolute; inset: 0; z-index: 10;
          pointer-events: none; border-radius: 7px;
        }
        .ripple {
          position: absolute; border-radius: 50%;
          background: rgba(255,255,255,0.16);
          pointer-events: none; z-index: 20;
          transform: translate(-50%,-50%);
        }
        .glow-photo { position: relative; width: 100%; height: 280px; overflow: hidden; flex-shrink: 0; }
        .glow-img { width: 100%; height: 100%; object-fit: cover; object-position: top; opacity: 0.55; }
        .glow-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, #060c21 0%, transparent 60%); z-index: 1; }
        .glow-name-static { position: absolute; bottom: 0; left: 0; right: 0; z-index: 2; padding: 14px 16px; }
        .glow-name-static h3 { font-size: 16px; font-weight: 700; color: #fff; line-height: 1.2; }
        .glow-name-static p { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 2px; }
        .glow-rating-pill, .glow-avail-pill {
          position: absolute; top: 12px; z-index: 3; display: flex; align-items: center; gap: 5px;
          background: rgba(0,0,0,0.65); backdrop-filter: blur(8px);
          border-radius: 20px; padding: 4px 10px;
          font-size: 11px; font-weight: 600; color: #fbbf24;
          border: 0.5px solid rgba(255,255,255,0.12);
        }
        .glow-rating-pill { left: 12px; } .glow-avail-pill { right: 12px; }
        .glow-dot { width: 7px; height: 7px; border-radius: 50%; animation: dotPulse 2s ease-in-out infinite; display: inline-block; }
        .glow-content { padding: 0 16px 16px; }
        .glow-name { font-size: 16px; font-weight: 700; color: #fff; line-height: 1.2; margin-bottom: 2px; }
        .glow-title { font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.45); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 10px; }
        .glow-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px; }
        .glow-chip {
          font-size: 10px; padding: 3px 9px; border-radius: 20px;
          background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.6);
          border: 0.5px solid rgba(255,255,255,0.12); letter-spacing: 0.2px; display: inline-block; cursor: default;
        }
        .glow-stats { display: flex; border-top: 0.5px solid rgba(255,255,255,0.08); padding-top: 10px; margin-bottom: 10px; }
        .glow-stat { flex: 1; display: flex; flex-direction: column; align-items: center; }
        .glow-stat-mid { border-left: 0.5px solid rgba(255,255,255,0.08); border-right: 0.5px solid rgba(255,255,255,0.08); }
        .glow-stat-v { font-size: 14px; font-weight: 700; color: #fff; }
        .glow-stat-l { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.35); margin-top: 1px; }
        .glow-footer { display: flex; align-items: center; justify-content: space-between; border-top: 0.5px solid rgba(255,255,255,0.08); padding-top: 10px; }
        .glow-socials { display: flex; gap: 6px; }
        .glow-soc-btn {
          width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.07); border: 0.5px solid rgba(255,255,255,0.12);
          text-decoration: none; color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600;
        }
        .glow-view-btn { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.45); letter-spacing: 0.5px; }

        /* Modal bar shimmer */
        .modal-bar { background-size: 300% 100%; animation: barShimmer 2.5s linear infinite; }
      `}</style>

      {/* ══════ HERO ══════ */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center overflow-hidden"
        style={{ background: "#0a0a0f" }} onMouseMove={handleHeroMouseMove}>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div style={{ y: blobParallax }}>
            <LiquidBlob color="#6366f1" mouseX={mouse.x} mouseY={mouse.y} factor={0.26}
              style={{ top: -100, left: -80, width: 520, height: 520, opacity: 0.2 }} duration={9} />
          </motion.div>
          <LiquidBlob color="#f59e0b" mouseX={mouse.x} mouseY={mouse.y} factor={0.17}
            style={{ top: "10%", right: -100, width: 620, height: 620, opacity: 0.14 }} duration={11} />
          <LiquidBlob color="#10b981" mouseX={mouse.x} mouseY={mouse.y} factor={0.11}
            style={{ bottom: -80, left: "30%", width: 420, height: 420, opacity: 0.13 }} duration={13} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.8" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <ParticleField mouseX={mouse.x} mouseY={mouse.y} />
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
          className="relative z-10 container mx-auto px-6 max-w-6xl pt-24 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                <motion.span
                  className="inline-flex items-center gap-2 px-3 py-1.5 mb-7 rounded-full border text-[11px] font-bold uppercase tracking-[0.15em]"
                  style={{ background: "rgba(99,102,241,0.12)", borderColor: "rgba(99,102,241,0.3)", color: "#818cf8" }}
                  animate={{ boxShadow: ["0 0 0 0 rgba(99,102,241,0)", "0 0 0 6px rgba(99,102,241,0.08)", "0 0 0 0 rgba(99,102,241,0)"] }}
                  transition={{ duration: 2.5, repeat: Infinity }}>
                  <Sparkles className="w-3 h-3" /> Meet the Team
                </motion.span>
              </motion.div>

              <AnimatedHeadline />

              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.58 }}
                className="text-[16px] leading-[1.75] mb-10 max-w-lg"
                style={{ color: "rgba(255,255,255,0.5)" }}>
                Industry practitioners with real-world experience. Each mentor has worked at top tech companies and is deeply invested in your growth.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.68 }}
                className="flex items-center gap-3 mb-10">
                <div className="flex items-center gap-2">
                  {TEAM_MEMBERS.slice(0, 5).map((m, i) => (
                    <HeroMemberThumb key={m.id} member={m} delay={0.72 + i * 0.07} parallaxFactor={0.03 + i * 0.01} />
                  ))}
                </div>
                <motion.div animate={{ x: (mouse.x - 50) * 0.05, y: (mouse.y - 50) * 0.05 }}
                  transition={{ type: "spring", stiffness: 28, damping: 14 }}>
                  <p className="text-[13px] font-bold text-white">50+ Educators</p>
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>ready to guide you</p>
                </motion.div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.78 }}
                className="grid grid-cols-3 gap-3">
                {[
                  { v: 150, suffix: "+", l: "Years Combined Exp." },
                  { v: 12000, suffix: "+", l: "Students Mentored" },
                  { v: 98, suffix: "%", l: "Job Placement Rate" },
                ].map((s, i) => (
                  <motion.div key={s.l} className="rounded-2xl p-4"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    animate={{ x: (mouse.x - 50) * (0.022 + i * 0.01), y: (mouse.y - 50) * (0.018 + i * 0.008) }}
                    transition={{ type: "spring", stiffness: 24, damping: 14 }}
                    whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.08)" }}>
                    <p className="text-[24px] font-black text-white display">
                      <AnimatedNumber value={s.v} suffix={s.suffix} />
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{s.l}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Floating photos */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.22, ease: [0.21, 1.02, 0.37, 1] }}
              className="hidden lg:block relative h-[500px]">
              {TEAM_MEMBERS.filter(m => m.featured).slice(0, 3).map((m, i) => (
                <FloatingPhotoCard key={m.id} member={m} index={i} mouseX={mouse.x} mouseY={mouse.y}
                  onClick={() => setSelectedMember(m)} />
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute bottom-12 left-0 rounded-2xl p-3"
                style={{ background: "#0a0a0f", border: "1px solid rgba(255,255,255,0.1)", width: 160 }}
                animate2={{ y: [0, -5, 0] } as any}
                transition2={{ duration: 3, repeat: Infinity, ease: "easeInOut" } as any}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#818cf8" }}>Avg Rating</p>
                <div className="flex items-center gap-1.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  <span className="text-[13px] font-black text-white ml-1">4.9</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to top, #060c21, transparent)" }} />
      </section>

      {/* ══════ TICKER ══════ */}
      <div className="border-y py-3.5 overflow-hidden" style={{ background: "#060c21", borderColor: "rgba(255,255,255,0.06)" }}
        onMouseEnter={() => setMarqueeHovered(true)}
        onMouseLeave={() => setMarqueeHovered(false)}>
        <div className={`ticker-track flex items-center whitespace-nowrap select-none ${marqueeHovered ? "paused" : ""}`}
          style={{ width: "max-content" }}>
          {[...TEAM_MEMBERS, ...TEAM_MEMBERS].map((m, i) => (
            <motion.span key={i}
              className="flex items-center gap-2.5 px-6 text-[12px] font-semibold cursor-pointer"
              style={{ color: "rgba(255,255,255,0.38)" }}
              whileHover={{ color: "rgba(255,255,255,0.9)", scale: 1.03 }}
              transition={{ duration: 0.2 }}>
              <motion.span className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: m.glowColors[0] }}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }} />
              {m.name}
              <span className="text-[11px] font-normal" style={{ color: "rgba(255,255,255,0.22)" }}>
                · {m.role.split(" ").slice(0, 2).join(" ")}
              </span>
            </motion.span>
          ))}
        </div>
      </div>

      {/* ══════ GRID ══════ */}
      <section className="py-20" style={{ background: "#060c21" }}>
        <div className="container mx-auto px-6 max-w-6xl">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <motion.p initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ type: "spring", stiffness: 200, damping: 22 }}
                className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "#89ff00" }}>
                The Sipalaya Team
              </motion.p>
              <motion.h2 initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.07, type: "spring", stiffness: 200, damping: 24 }}
                className="display text-[36px] md:text-[42px] font-normal text-white leading-tight">
                {hasFilters ? `${filtered.length} member${filtered.length !== 1 ? "s" : ""} found` : "Every instructor, a practitioner"}
              </motion.h2>
            </div>

            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.12, type: "spring" }}
              className="flex items-center gap-2.5 h-11 px-4 rounded-xl min-w-[220px]"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.4)" }} />
              <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Name, role, skill…" className="flex-1 text-[13px] bg-transparent outline-none"
                style={{ color: "rgba(255,255,255,0.8)" }} />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button onClick={() => setSearchQuery("")}
                    initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ type: "spring", stiffness: 420, damping: 20 }}>
                    <X className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)" }} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {DEPARTMENTS.map((d, di) => (
              <motion.button key={d.id} onClick={() => setSelectedDept(d.id)}
                className="px-4 py-2 rounded-xl text-[12px] font-bold relative overflow-hidden"
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: di * 0.05, type: "spring", stiffness: 300, damping: 24 }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={selectedDept === d.id
                  ? { background: "linear-gradient(135deg, #89ff00, #00bcd4)", color: "#060c21", boxShadow: "0 4px 18px rgba(137,255,0,0.32)" }
                  : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {d.label}
                {selectedDept === d.id && filtered.length > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 420 }}
                    className="ml-2 px-1.5 py-0.5 bg-black/20 rounded-md text-[10px]">{filtered.length}</motion.span>
                )}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {!apiAvailable && (
              <motion.div initial={{ opacity: 0, y: -14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="mb-8 flex items-center gap-3 p-4 rounded-2xl"
                style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}>
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-amber-300">Showing sample profiles</p>
                  <p className="text-[12px] text-amber-400/70">Connect your API at /api/team/ for live team data.</p>
                </div>
                <motion.button onClick={() => window.location.reload()} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-amber-300"
                  style={{ background: "rgba(245,158,11,0.15)" }}>
                  <RefreshCw className="w-3 h-3" /> Retry
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {featured.length > 0 && !hasFilters && (
            <div className="mb-14">
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="text-[11px] font-bold uppercase tracking-[0.15em] mb-5" style={{ color: "rgba(255,255,255,0.28)" }}>
                Featured Educators
              </motion.p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {featured.map((m, i) => (
                    <motion.div key={m.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                      exit={{ opacity: 0, scale: 0.88 }} layout
                      transition={{ layout: { type: "spring", stiffness: 200, damping: 26 } }}>
                      <GlowMemberCard member={m} index={i} onClick={() => setSelectedMember(m)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {(hasFilters ? filtered : nonFeatured).length > 0 && (
            <div>
              {!hasFilters && (
                <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-5" style={{ color: "rgba(255,255,255,0.28)" }}>
                  All Instructors
                </motion.p>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {(hasFilters ? filtered : nonFeatured).map((m, i) => (
                    <motion.div key={m.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                      exit={{ opacity: 0, scale: 0.88 }} layout
                      transition={{ layout: { type: "spring", stiffness: 200, damping: 26 } }}>
                      <GlowMemberCard member={m} index={i} onClick={() => setSelectedMember(m)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }} className="py-24 text-center">
              <motion.div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(255,255,255,0.05)" }}
                animate={{ rotate: [0, 6, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
                <Users className="w-7 h-7" style={{ color: "rgba(255,255,255,0.18)" }} />
              </motion.div>
              <p className="text-[16px] font-bold text-white mb-1">No results found</p>
              <p className="text-[13px] mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>Try different keywords or clear your filters.</p>
              <motion.button onClick={() => { setSearchQuery(""); setSelectedDept("all"); }}
                className="px-6 py-3 rounded-2xl text-[13px] font-bold text-[#060c21]"
                style={{ background: "linear-gradient(135deg, #89ff00, #00bcd4)" }}
                whileHover={{ scale: 1.06, boxShadow: "0 8px 28px rgba(137,255,0,0.32)" }}
                whileTap={{ scale: 0.97 }}>
                Clear Filters
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: "#0a0a0f" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ scale: [1, 1.18, 1], opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-60px] right-[-60px] w-80 h-80 rounded-full"
            style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
          <motion.div animate={{ scale: [1, 1.12, 1], opacity: [0.09, 0.18, 0.09] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
            className="absolute bottom-[-60px] left-[-40px] w-72 h-72 rounded-full"
            style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="g2" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.8" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#g2)" />
          </svg>
        </div>

        <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ type: "spring", stiffness: 170, damping: 24 }}
          className="relative container mx-auto px-6 max-w-4xl text-center">
          <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: "#89ff00" }}>
            Start Learning
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.16, type: "spring", stiffness: 200 }}
            className="display text-[42px] md:text-[52px] font-normal text-white leading-tight mb-5">
            Ready to learn from<br />
            <span className="italic" style={{ color: "#818cf8" }}>the best?</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.24 }}
            className="text-[16px] mb-10 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            Join thousands of students who've transformed their careers with guidance from our expert mentors.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.3, type: "spring" }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a href="/courses"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-[14px] font-bold text-[#060c21]"
              style={{ background: "linear-gradient(135deg, #89ff00, #00bcd4)", boxShadow: "0 8px 32px rgba(137,255,0,0.25)" }}
              whileHover={{ y: -4, boxShadow: "0 16px 44px rgba(137,255,0,0.38)" }}
              whileTap={{ y: 0, scale: 0.97 }}>
              Explore All Courses <ArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.a href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-[14px] font-bold text-white border"
              style={{ borderColor: "rgba(255,255,255,0.2)" }}
              whileHover={{ y: -4, background: "rgba(255,255,255,0.07)" }}
              whileTap={{ y: 0, scale: 0.97 }}>
              <MessageCircle className="w-4 h-4" /> Talk to an Advisor
            </motion.a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-0 mt-12">
            {TEAM_MEMBERS.slice(0, 6).map((m, i) => (
              <motion.div key={m.id}
                className="w-10 h-10 rounded-full overflow-hidden -ml-2 first:ml-0 cursor-pointer"
                style={{ boxShadow: `0 0 0 2px ${m.glowColors[0]}` }}
                whileHover={{ y: -5, scale: 1.12, zIndex: 10 }}
                transition={{ type: "spring", stiffness: 420, damping: 14 }}
                onClick={() => setSelectedMember(m)}>
                <img src={m.image} alt={m.name} className="w-full h-full object-cover object-top" />
              </motion.div>
            ))}
            <div className="w-10 h-10 rounded-full -ml-2 flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: "#6366f1", boxShadow: "0 0 0 2px #6366f1" }}>+44</div>
            <p className="ml-4 text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>Waiting to mentor you</p>
          </motion.div>
        </motion.div>
      </section>

      <AnimatePresence>
        {selectedMember && <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
      </AnimatePresence>
    </Layout>
  );
};

export default Team;