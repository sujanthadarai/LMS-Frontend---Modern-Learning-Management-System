import { Link } from "react-router-dom";
import {
  GraduationCap, Mail, Phone, MapPin,
  Facebook, Twitter, Linkedin, Instagram, Youtube,
  ArrowUpRight, Send, ChevronRight,
} from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "All Courses", path: "/courses" },
    { name: "Our Trainers", path: "/trainers" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Contact", path: "/contact" },
  ];

  const courses = [
    { name: "Python Programming", path: "/courses/python" },
    { name: "Django Development", path: "/courses/django" },
    { name: "MERN Stack", path: "/courses/mern" },
    { name: "Data Science", path: "/courses/data-science" },
    { name: "Web Development", path: "/courses/web-dev" },
    { name: "UI/UX Design", path: "/courses/ui-ux" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook", color: "#1877F2" },
    { icon: Twitter, href: "#", label: "Twitter", color: "#1DA1F2" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "#0A66C2" },
    { icon: Instagram, href: "#", label: "Instagram", color: "#E1306C" },
    { icon: Youtube, href: "#", label: "YouTube", color: "#FF0000" },
  ];

  const stats = [
    { value: "12,000+", label: "Students Enrolled" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "50+", label: "Expert Trainers" },
    { value: "30+", label: "Courses Available" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .footer-root {
          font-family: 'DM Sans', sans-serif;
          background: #080C14;
          color: #e2e8f0;
          position: relative;
          overflow: hidden;
        }

        .footer-root * { box-sizing: border-box; }

        /* Ambient glow blobs */
        .footer-blob-1 {
          position: absolute; top: -120px; left: -120px;
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none;
        }
        .footer-blob-2 {
          position: absolute; bottom: -100px; right: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none;
        }
        .footer-blob-3 {
          position: absolute; top: 40%; left: 50%;
          transform: translate(-50%, -50%);
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none;
        }

        /* Grid noise texture overlay */
        .footer-root::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none; z-index: 0;
        }

        .footer-inner { position: relative; z-index: 1; max-width: 1280px; margin: 0 auto; padding: 0 24px; }

        /* Stats Strip */
        .stats-strip {
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 40px 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 0;
        }
        @media (max-width: 768px) { .stats-strip { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .stats-strip { grid-template-columns: 1fr 1fr; } }

        .stat-item {
          background: #0d1220;
          padding: 28px 24px;
          text-align: center;
          position: relative;
          transition: background 0.3s;
        }
        .stat-item:hover { background: #111827; }
        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 2rem; font-weight: 800;
          background: linear-gradient(135deg, #818cf8 0%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1; margin-bottom: 6px;
        }
        .stat-label {
          font-size: 0.78rem; font-weight: 500;
          color: #64748b; text-transform: uppercase; letter-spacing: 0.08em;
        }

        /* Newsletter */
        .newsletter-band {
          padding: 56px 0 48px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center;
        }
        @media (max-width: 768px) { .newsletter-band { grid-template-columns: 1fr; gap: 28px; } }

        .newsletter-eyebrow {
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase; color: #6366f1;
          display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
        }
        .newsletter-eyebrow::before {
          content: ''; width: 24px; height: 2px; background: #6366f1; border-radius: 2px;
        }
        .newsletter-title {
          font-family: 'Syne', sans-serif; font-size: 1.75rem; font-weight: 700;
          color: #f1f5f9; line-height: 1.2; margin: 0 0 8px;
        }
        .newsletter-sub { color: #64748b; font-size: 0.9rem; line-height: 1.6; margin: 0; }

        .newsletter-form { display: flex; gap: 10px; }
        @media (max-width: 480px) { .newsletter-form { flex-direction: column; } }

        .newsletter-input {
          flex: 1; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 13px 18px;
          color: #f1f5f9; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          outline: none; transition: border-color 0.3s, background 0.3s;
        }
        .newsletter-input::placeholder { color: #475569; }
        .newsletter-input:focus {
          border-color: #6366f1;
          background: rgba(99,102,241,0.06);
        }
        .newsletter-btn {
          display: flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white; border: none; border-radius: 10px;
          padding: 13px 22px; font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; font-weight: 600; cursor: pointer;
          white-space: nowrap; transition: all 0.3s; position: relative; overflow: hidden;
        }
        .newsletter-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .newsletter-btn:hover::after { opacity: 1; }
        .newsletter-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.35); }
        .newsletter-btn:active { transform: translateY(0); }

        .subscribed-msg {
          display: flex; align-items: center; gap: 10px;
          color: #34d399; font-weight: 500; font-size: 0.9rem;
          background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.2);
          border-radius: 10px; padding: 13px 18px;
        }

        /* Main grid */
        .footer-grid {
          padding: 64px 0 48px;
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
          gap: 48px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        @media (max-width: 1024px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; } }
        @media (max-width: 600px) { .footer-grid { grid-template-columns: 1fr; gap: 36px; } }

        /* Logo */
        .logo-wrap { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; text-decoration: none; }
        .logo-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(99,102,241,0.4);
          flex-shrink: 0;
        }
        .logo-name {
          font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 800;
          color: #f1f5f9; line-height: 1;
        }
        .logo-tagline { font-size: 0.7rem; font-weight: 500; color: #6366f1; letter-spacing: 0.05em; }

        .brand-desc { color: #475569; font-size: 0.875rem; line-height: 1.75; margin-bottom: 24px; }

        .social-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .social-btn {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          color: #64748b; cursor: pointer; transition: all 0.25s; text-decoration: none;
        }
        .social-btn:hover {
          background: rgba(255,255,255,0.1); color: white;
          border-color: rgba(255,255,255,0.18); transform: translateY(-2px);
        }

        /* Column heading */
        .col-heading {
          font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em; color: #94a3b8;
          margin: 0 0 20px; padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: relative;
        }
        .col-heading::after {
          content: ''; position: absolute; bottom: -1px; left: 0;
          width: 28px; height: 2px;
          background: linear-gradient(90deg, #6366f1, #38bdf8);
          border-radius: 2px;
        }

        .link-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
        .link-item a {
          display: flex; align-items: center; gap: 0; color: #64748b;
          font-size: 0.875rem; text-decoration: none; padding: 6px 0;
          transition: color 0.2s, gap 0.2s; position: relative;
        }
        .link-chevron {
          width: 14px; height: 14px; opacity: 0;
          transform: translateX(-6px); transition: all 0.2s; flex-shrink: 0;
        }
        .link-item a:hover { color: #a5b4fc; gap: 6px; }
        .link-item a:hover .link-chevron { opacity: 1; transform: translateX(0); }

        /* Contact */
        .contact-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 16px; }
        .contact-row { display: flex; align-items: flex-start; gap: 14px; }
        .contact-icon-wrap {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          margin-top: 1px;
        }
        .contact-icon-wrap svg { color: #818cf8; }
        .contact-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #475569; margin-bottom: 2px; }
        .contact-value { font-size: 0.875rem; color: #94a3b8; line-height: 1.5; }
        .contact-value a { color: #94a3b8; text-decoration: none; transition: color 0.2s; }
        .contact-value a:hover { color: #a5b4fc; }

        /* Bottom bar */
        .footer-bottom {
          padding: 24px 0;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 12px;
        }
        .footer-copy { font-size: 0.8rem; color: #334155; }
        .footer-copy span { color: #475569; }
        .footer-legal { display: flex; gap: 24px; flex-wrap: wrap; }
        .footer-legal a {
          font-size: 0.8rem; color: #334155; text-decoration: none;
          transition: color 0.2s; display: flex; align-items: center; gap: 4px;
        }
        .footer-legal a:hover { color: #818cf8; }

        .badge-made {
          font-size: 0.75rem; color: #1e293b;
          display: flex; align-items: center; gap: 6px;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #6366f1; animation: pulse-dot 2s infinite; }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* QR Block */
        .qr-block {
          display: block; margin-top: 20px; text-decoration: none;
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 14px; padding: 14px;
          background: rgba(99,102,241,0.05);
          transition: all 0.3s; cursor: pointer;
        }
        .qr-block:hover {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.1);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.15);
        }
        .qr-inner { display: flex; align-items: center; gap: 14px; }
        .qr-img {
          width: 72px; height: 72px; border-radius: 8px;
          flex-shrink: 0; image-rendering: pixelated;
          border: 2px solid rgba(99,102,241,0.3);
        }
        .qr-text-col { flex: 1; }
        .qr-title {
          font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 700;
          color: #c7d2fe; margin-bottom: 3px;
        }
        .qr-sub { font-size: 0.72rem; color: #475569; margin-bottom: 6px; }
        .qr-cta {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.72rem; font-weight: 600; color: #818cf8;
          text-transform: uppercase; letter-spacing: 0.06em;
        }

        /* Divider line */
        .footer-divider { height: 1px; background: rgba(255,255,255,0.04); }
      `}</style>

      <footer className="footer-root">
        <div className="footer-blob-1" />
        <div className="footer-blob-2" />
        <div className="footer-blob-3" />

        <div className="footer-inner">

          {/* Stats Strip */}
          <div style={{ paddingTop: "48px" }}>
            <div className="stats-strip">
              {stats.map((s) => (
                <div className="stat-item" key={s.label}>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="newsletter-band">
            <div>
              <div className="newsletter-eyebrow">Stay Updated</div>
              <h3 className="newsletter-title">Get Tech Insights<br />in Your Inbox</h3>
              <p className="newsletter-sub">Course launches, career tips, and industry trends — delivered weekly.</p>
            </div>
            <div>
              {subscribed ? (
                <div className="subscribed-msg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  You're subscribed! Welcome aboard.
                </div>
              ) : (
                <form className="newsletter-form" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    className="newsletter-input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="newsletter-btn">
                    <Send size={15} />
                    Subscribe
                  </button>
                </form>
              )}
              <p style={{ fontSize: "0.72rem", color: "#334155", marginTop: "10px" }}>
                No spam. Unsubscribe anytime. &nbsp;·&nbsp; 4,000+ readers
              </p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="footer-grid">

            {/* Brand */}
            <div>
              <Link to="/" className="logo-wrap">
                <div className="logo-icon">
                  <GraduationCap size={22} color="white" />
                </div>
                <div>
                  <div className="logo-name">Sipayala</div>
                  <div className="logo-tagline">Info Tech</div>
                </div>
              </Link>
              <p className="brand-desc">
                Empowering the next generation of tech professionals with practical, industry-relevant skills. 
                From beginner to job-ready — we guide every step.
              </p>
              <div className="social-row">
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.href} className="social-btn" aria-label={s.label}
                    style={{ "--hover-color": s.color }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + "50"; e.currentTarget.style.background = s.color + "18"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.background = ""; }}
                  >
                    <s.icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="col-heading">Quick Links</h4>
              <ul className="link-list">
                {quickLinks.map((l) => (
                  <li className="link-item" key={l.name}>
                    <Link to={l.path}>
                      <ChevronRight className="link-chevron" />
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Courses */}
            <div>
              <h4 className="col-heading">Courses</h4>
              <ul className="link-list">
                {courses.map((c) => (
                  <li className="link-item" key={c.name}>
                    <Link to={c.path}>
                      <ChevronRight className="link-chevron" />
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="col-heading">Contact Us</h4>
              <ul className="contact-list">
                <li className="contact-row">
                  <div className="contact-icon-wrap"><MapPin size={16} /></div>
                  <div>
                    <div className="contact-label">Address</div>
                    <div className="contact-value">New Baneshwor, Ward 10<br />Kathmandu, Nepal</div>
                  </div>
                </li>
                <li className="contact-row">
                  <div className="contact-icon-wrap"><Phone size={16} /></div>
                  <div>
                    <div className="contact-label">Phone</div>
                    <div className="contact-value">
                      <a href="tel:+97714567890">+977 1-4567890</a>
                    </div>
                  </div>
                </li>
                <li className="contact-row">
                  <div className="contact-icon-wrap"><Mail size={16} /></div>
                  <div>
                    <div className="contact-label">Email</div>
                    <div className="contact-value">
                      <a href="mailto:info@sipayalainfotech.com">info@sipayalainfotech.com</a>
                    </div>
                  </div>
                </li>
              </ul>

              {/* QR Code */}
              <a
                href="https://www.google.com/maps/place/Sipalaya+Info+Tech+Pvt.+Ltd./@27.6715277,85.3431704,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="qr-block"
              >
                <div className="qr-inner">
                  <img
                    src="data:image/png;base64,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"
                    alt="Scan to find us on Google Maps"
                    className="qr-img"
                  />
                  <div className="qr-text-col">
                    <div className="qr-title">Find Us on Maps</div>
                    <div className="qr-sub">Scan QR to open location</div>
                    <div className="qr-cta">Open in Google Maps <ArrowUpRight size={11} /></div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <p className="footer-copy">
              © {currentYear} <span>Sipayala Info Tech.</span> All rights reserved.
            </p>
            <div className="badge-made">
              <div className="badge-dot" />
              Proudly based in Kathmandu, Nepal
            </div>
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/sitemap">Sitemap <ArrowUpRight size={11} /></Link>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;