
"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

export default function HomeContent({ posts }: { posts: any[] }) {
  const [activeSection, setActiveSection] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: "", email: "", projectType: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [contactMsg, setContactMsg] = useState("");

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [newsletterMsg, setNewsletterMsg] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      if (res.ok) {
        setContactStatus("sent");
        setContactMsg("Message sent successfully!");
        setContactForm({ name: "", email: "", projectType: "", message: "" });
      } else {
        setContactStatus("error");
        setContactMsg(data.error || "Failed to send.");
      }
    } catch {
      setContactStatus("error");
      setContactMsg("Network error. Please try again.");
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterStatus("sent");
        setNewsletterMsg("Subscribed!");
        setNewsletterEmail("");
      } else {
        setNewsletterStatus("error");
        setNewsletterMsg(data.error || "Failed.");
      }
    } catch {
      setNewsletterStatus("error");
      setNewsletterMsg("Network error.");
    }
  };

  const navigate = (section: string) => {
    setActiveSection(section);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    // Typewriter effect
    const subtitle = document.querySelector(".hero-subtitle");
    if (!subtitle) return;
    const texts = ["QA/QC Engineer", "Automation Tester", "Test Leader", "ISTQB Certified"];
    let idx = 0, charIdx = 0, deleting = false;
    let timer: NodeJS.Timeout;
    function type() {
      const current = texts[idx];
      if(!deleting) {
        charIdx++;
        subtitle!.innerHTML = current.slice(0, charIdx) + "<span className=\"cursor-block\"></span>";
        if(charIdx === current.length) { deleting = true; timer = setTimeout(type, 2000); return; }
      } else {
        charIdx--;
        subtitle!.innerHTML = current.slice(0, charIdx) + "<span className=\"cursor-block\"></span>";
        if(charIdx === 0) { deleting = false; idx = (idx + 1) % texts.length; }
      }
      timer = setTimeout(type, deleting ? 40 : 80);
    }
    timer = setTimeout(type, 800);
    return () => clearTimeout(timer);
  }, []);

  const [lang, setLang] = useState<"EN" | "VI">("EN");
  const toggleLang = () => setLang(lang === "EN" ? "VI" : "EN");

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* Hide scrollbar for clean look */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
      `}} />

{/* SIDEBAR */}
<aside className="sidebar">
  <div className="sidebar-avatar">
    <img src="/avatar.png" alt="Tan Nguyen" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
  </div>
  <div className="sidebar-name">Tan<br />Nguyen</div>
  <button className="sidebar-lang" onClick={toggleLang}>{lang} <span>▾</span></button>
  <nav>
    <ul className="sidebar-nav" id="sidebarNav">
      <li><a href="#" className={activeSection === "home" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("home"); }}>Home</a></li>
      <li><a href="#" className={activeSection === "about" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("about"); }}>About</a></li>
      <li><a href="#" className={activeSection === "resume" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("resume"); }}>Resume</a></li>

      <li><a href="#" className={activeSection === "blog" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("blog"); }}>Blog</a></li>
      <li><a href="#" className={activeSection === "tools" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("tools"); }}>Tools</a></li>
      <li><a href="#" className={activeSection === "contacts" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("contacts"); }}>Contacts</a></li>
    </ul>
  </nav>
  <div className="sidebar-divider"></div>
  <div className="sidebar-social">
    <a href="#" aria-label="LinkedIn" title="LinkedIn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    </a>
    <a href="#" aria-label="Google" title="Google">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
    </a>
  </div>
  <div className="sidebar-badge">
    <div className="badge-quote">"Quality is never an accident; it is always the result of intelligent effort."</div>
    <div className="badge-author">— John Ruskin</div>
  </div>
  <div className="sidebar-footer">
    <a href="#">Privacy Policy</a><br />
    © 2026
  </div>
</aside>

{/* MAIN */}
<main className="main">

  {/* HOME */}
  <section className={`page-section ${activeSection === "home" ? "active" : ""}`} id="section-home">
    <div className="hero-section">
      <div className="hero-machine">
        <div className="retro-mac">
          <div className="retro-mac-body">
            <div className="retro-mac-screen-bezel">
              <div className="retro-mac-screen">
                <div className="screen-scanlines"></div>
                <span className="screen-hello">hello.<span className="screen-cursor"></span></span>
              </div>
            </div>
            <div className="retro-mac-disk"></div>
          </div>
          <div className="retro-mac-base">
            <div className="mac-vent"></div>
            <div className="mac-vent"></div>
            <div className="mac-vent"></div>
            <div className="mac-vent"></div>
            <div className="mac-vent"></div>
          </div>
          <div className="mac-peripherals">
            <div className="retro-keyboard">
              <div className="keyboard-row"><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div></div>
              <div className="keyboard-row"><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div></div>
              <div className="keyboard-row"><div className="key"></div><div className="key"></div><div className="key"></div><div className="key spacebar"></div><div className="key"></div><div className="key"></div><div className="key"></div></div>
            </div>
            <div className="retro-mouse">
              <div className="mouse-button"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-text">
        <h1 className="hero-greeting" id="heroName">Tan<br />Nguyen</h1>
        <div className="hero-subtitle">QA/QC Engineer<span className="cursor-block"></span></div>
        <div className="hero-buttons">
          <a href="#" className="hero-btn primary" onClick={(e) => { e.preventDefault(); navigate("contacts"); }}>HIRE ME</a>
          <a href="/resume" target="_blank" className="hero-btn">⬇ DOWNLOAD SUMMARY CV</a>
        </div>
      </div>
    </div>
  </section>

  {/* ABOUT */}
  <section className={`page-section ${activeSection === "about" ? "active" : ""}`} id="section-about">
    <div className="about-section">
      <div className="section-header">// ABOUT</div>
      <h2 className="section-title">About_Me</h2>
      <div className="about-grid">
        <div className="about-bio">
          <p>Hello! I'm a <strong>Test Consultant Engineer</strong> with over <strong>10 years of experience</strong> in Information Technology, specializing in manual testing, automation testing, and QA team leadership.</p>
          <p>Currently at <strong>Hitachi Digital Services Vietnam</strong>, working on FUJIFILM cloud platforms and laboratory automation data pipelines on AWS. Previously led QC teams at FPT Software for large-scale data migration projects.</p>
          <p>My expertise spans <strong>Data Pipelines</strong>, Cloud (AWS, Snowflake, Redshift), SAP/ERP, E-commerce, Fulfillment, and Healthcare domains. I apply <strong>AI-driven approaches</strong> to optimize test case design and quality assurance.</p>
          <p>Passionate about mentoring teams, building test strategies from scratch, and exploring SDET and AI Agent technologies.</p>
        </div>
        <div>
          <div className="about-info-box">
            <div className="info-row"><span className="info-label">Name</span><span className="info-value">Tan Nguyen</span></div>
            <div className="info-row"><span className="info-label">Location</span><span className="info-value">Vietnam</span></div>
            <div className="info-row"><span className="info-label">Experience</span><span className="info-value">10+ Years</span></div>
            <div className="info-row"><span className="info-label">Speciality</span><span className="info-value">Test Consulting & QA Leadership</span></div>
            <div className="info-row"><span className="info-label">Phone</span><span className="info-value">[Protected]</span></div>
            <div className="info-row"><span className="info-label">Email</span><span className="info-value">Contact via Form</span></div>
          </div>
          <div className="about-highlight-grid">
            <div className="highlight-box"><h4>🔍 Core Testing</h4><p>Manual (Web/Mobile), API Testing (Postman, JMeter, K6), E2E.</p></div>
            <div className="highlight-box"><h4>🤖 Automation</h4><p>Selenium, Cucumber, TestNG, Java, Jenkins. AI-optimized test design.</p></div>
            <div className="highlight-box"><h4>💼 Leadership</h4><p>4+ years leading QA teams up to 15 members across enterprise projects.</p></div>
            <div className="highlight-box"><h4>☁️ Cloud & Data</h4><p>AWS, Airflow, Snowflake, Redshift, ETL/ELT pipelines, SAP BTP.</p></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* RESUME */}
  <section className={`page-section ${activeSection === "resume" ? "active" : ""}`} id="section-resume">
    <div className="resume-section">
      <div className="section-header">// RESUME</div>
      <h2 className="section-title">Experience_</h2>
      <div className="resume-grid">
        <div>
          <div className="resume-col-title">▸ WORK EXPERIENCE</div>
          <div className="timeline">
            <div className="timeline-item">
              <div className="tl-period">JAN 2026 — PRESENT</div>
              <div className="tl-title">Test Consultant Engineer</div>
              <div className="tl-sub">Hitachi Digital Services Vietnam</div>
              <div className="tl-desc">FUJIFILM IWpro RM/Print — Built test strategy, wrote functional &amp; SST test cases, executed E2E scenarios. Lab Automation Platform — Data pipeline testing on AWS, delivered successful demo to client.</div>
            </div>
            <div className="timeline-item">
              <div className="tl-period">MAR 2024 — JAN 2026</div>
              <div className="tl-title">QC Leader</div>
              <div className="tl-sub">FPT Software</div>
              <div className="tl-desc">Data Pipeline &amp; Migration for a top Japan Airline. Led QC team of 10 for 30+ schemas, 500+ tables. Hands-on AWS, Airflow, Snowflake, Redshift. Applied AI to test optimization.</div>
            </div>
            <div className="timeline-item">
              <div className="tl-period">2023 — 2024</div>
              <div className="tl-title">QA/QC Leader</div>
              <div className="tl-sub">Laidon Company (SAP Certified Partner)</div>
              <div className="tl-desc">SimpleMDG — SAP BTP cloud app for Master Data Governance. Led 15 QC across 10+ customers. Team of 70 members.</div>
            </div>
            <div className="timeline-item">
              <div className="tl-period">2020 — 2023</div>
              <div className="tl-title">QA/QC Leader</div>
              <div className="tl-sub">Baspro Company (Dai Viet Group)</div>
              <div className="tl-desc">9 platforms (SC, FOS, DH, LMD, DMS, WMS, CRM, POS, DVGo). Deployed for 10+ customers, 6000+ orders/day. Postman API testing, K6 performance.</div>
            </div>
            <div className="timeline-item">
              <div className="tl-period">2016 — 2020</div>
              <div className="tl-title">QA/QC Engineer</div>
              <div className="tl-sub">TMA Solutions</div>
              <div className="tl-desc">Vibrent Health (US Healthcare), Iron Mountain. Automation team lead (Java, Selenium). Multiple Star Performer awards.</div>
            </div>
            <div className="timeline-item">
              <div className="tl-period">2012 — 2016</div>
              <div className="tl-title">IT Support</div>
              <div className="tl-sub">VNG Corporation</div>
              <div className="tl-desc">End-user support, networking, GSuite &amp; SCCM deployment.</div>
            </div>
          </div>

        </div>
        <div>
          <div className="resume-col-title">▸ EDUCATION & CERTS</div>
          <div className="timeline">
            <div className="timeline-item">
              <div className="tl-period">2020</div>
              <div className="tl-title">Fullstack Selenium in Java</div>
              <div className="tl-sub">Automation FC</div>
              <div className="tl-desc">Advanced training in Selenium WebDriver, Java, TestNG, and CI/CD pipelines for automation testing.</div>
            </div>
            <div className="timeline-item">
              <div className="tl-period">2016</div>
              <div className="tl-title">Fresher Tester Certificate</div>
              <div className="tl-sub">TVN Testing</div>
              <div className="tl-desc">Comprehensive foundation in manual testing, test case design, and bug tracking.</div>
            </div>
            <div className="timeline-item">
              <div className="tl-period">2014</div>
              <div className="tl-title">CCNA & MCSA</div>
              <div className="tl-sub">Computer Science Center, VNU-HCM</div>
              <div className="tl-desc">Cisco Certified Network Associate and Microsoft Certified Solutions Associate.</div>
            </div>
            <div className="timeline-item">
              <div className="tl-period">2012</div>
              <div className="tl-title">Bachelor's Degree — IT Networking</div>
              <div className="tl-sub">University of Industry – HCM City</div>
              <div className="tl-desc">Networking, algorithms, operating systems, and core computer science fundamentals.</div>
            </div>
          </div>
          <a href="/resume" target="_blank" className="hero-btn" style={{ display: "inline-flex", marginTop: "16px", fontSize: "0.68rem" }}>
            ⬇ DOWNLOAD SUMMARY CV
          </a>
        </div>
      </div>
    </div>
  </section>

  {/* PORTFOLIO */}
  <section className={`page-section ${activeSection === "portfolio" ? "active" : ""}`} id="section-portfolio">
    <div className="portfolio-section">
      <div className="section-header">// PORTFOLIO</div>
      <h2 className="section-title">Projects_</h2>
      <div className="portfolio-filter">
        <button className="pf-btn active" data-pf="all">[ ALL ]</button>
        <button className="pf-btn" data-pf="ai">AI &amp; LLM</button>
        <button className="pf-btn" data-pf="enterprise">ENTERPRISE</button>
        <button className="pf-btn" data-pf="web">WEB APPS</button>
        <button className="pf-btn" data-pf="mobile">MOBILE</button>
      </div>
      <div className="portfolio-grid" id="portfolioGrid">
        <div className="portfolio-card featured" data-pf="ai">
          <div className="pf-card-top">AI / LLM ENGINEERING</div>
          <div className="pf-card-img" style={{ background: "#1a2a3a" }}>
            <div className="pf-img-grid"></div>
            <span>🤖</span>
          </div>
          <div className="pf-card-body">
            <div className="pf-card-title">Multi-Agent Document Analysis System</div>
            <div className="pf-card-desc">Orchestrated multi-agent LLM pipeline processing 128k+ token enterprise documents. Local-only deployment for data security. Schema extraction and business analysis report generation.</div>
            <div className="pf-tags">
              <span className="pf-tag">Python</span><span className="pf-tag">Claude API</span><span className="pf-tag">LangChain</span><span className="pf-tag">RAG</span><span className="pf-tag">Local-only</span>
            </div>
          </div>
        </div>
        <div className="portfolio-card" data-pf="enterprise">
          <div className="pf-card-top">ENTERPRISE / ERP</div>
          <div className="pf-card-img" style={{ background: "#2a1a0a" }}><div className="pf-img-grid"></div>🏢</div>
          <div className="pf-card-body">
            <div className="pf-card-title">Japanese ERP Migration</div>
            <div className="pf-card-desc">Architecture & QA for large-scale ERP migration. Full RTM, test strategy, BA documentation for Japanese manufacturing client.</div>
            <div className="pf-tags"><span className="pf-tag">Java</span><span className="pf-tag">Oracle</span><span className="pf-tag">ISTQB</span></div>
          </div>
        </div>
        <div className="portfolio-card" data-pf="web">
          <div className="pf-card-top">WEB APPLICATION</div>
          <div className="pf-card-img" style={{ background: "#0a1a2a" }}><div className="pf-img-grid"></div>🌐</div>
          <div className="pf-card-body">
            <div className="pf-card-title">Healthcare CRM Platform</div>
            <div className="pf-card-desc">Full-stack CRM for healthcare providers with appointment management and secure API integrations.</div>
            <div className="pf-tags"><span className="pf-tag">React</span><span className="pf-tag">Node.js</span><span className="pf-tag">PostgreSQL</span></div>
          </div>
        </div>
        <div className="portfolio-card" data-pf="ai">
          <div className="pf-card-top">AI / TESTING</div>
          <div className="pf-card-img" style={{ background: "#1a2a1a" }}><div className="pf-img-grid"></div>🔬</div>
          <div className="pf-card-body">
            <div className="pf-card-title">Self-Healing Test Framework</div>
            <div className="pf-card-desc">AI-powered framework that auto-updates selectors when UI changes. Reduces test maintenance by 70%.</div>
            <div className="pf-tags"><span className="pf-tag">Python</span><span className="pf-tag">Playwright</span><span className="pf-tag">LLM</span></div>
          </div>
        </div>
        <div className="portfolio-card" data-pf="mobile">
          <div className="pf-card-top">MOBILE APP</div>
          <div className="pf-card-img" style={{ background: "#2a0a2a" }}><div className="pf-img-grid"></div>📱</div>
          <div className="pf-card-body">
            <div className="pf-card-title">Field Operations App</div>
            <div className="pf-card-desc">Cross-platform mobile app with offline sync, GPS tracking, and real-time dashboard.</div>
            <div className="pf-tags"><span className="pf-tag">React Native</span><span className="pf-tag">Firebase</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* BLOG */}
  <section className={`page-section ${activeSection === "blog" ? "active" : ""}`} id="section-blog">
    <div className="blog-section">
      <div className="section-header">// BLOG</div>
      <h2 className="section-title">Articles_</h2>
      {/* Newsletter */}
      <div className="newsletter-box">
        <span className="newsletter-label">Stay updated</span>
        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
          <input className="newsletter-input" type="email" placeholder="Your email..." required value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} />
          <button className="newsletter-submit" type="submit" disabled={newsletterStatus === "sending"}>{newsletterStatus === "sending" ? "SUBSCRIBING..." : "SUBSCRIBE"}</button>
        </form>
        {newsletterMsg && <div style={{ fontSize: "0.7rem", marginTop: "6px", color: newsletterStatus === "sent" ? "#00e676" : newsletterStatus === "error" ? "#ff5252" : "#888" }}>{newsletterMsg}</div>}
        <div className="newsletter-policy">
          <input type="checkbox" id="policyCheck" />
          <label htmlFor="policyCheck">I accept the data processing for newsletter delivery. <a href="#">Privacy Policy</a></label>
        </div>
      </div>
      {/* Terminal filter */}
      <div className="terminal-header">
        <div className="terminal-dot t-red"></div>
        <div className="terminal-dot t-yellow"></div>
        <div className="terminal-dot t-green"></div>
        <span className="terminal-title">FILTER.SYS // READY</span>
        <span className="terminal-minimize">—</span>
      </div>
      <div className="terminal-body">
        <div className="terminal-search">
          <span className="terminal-prompt">$</span>
          <input className="terminal-search-input" placeholder="SEARCH ARTICLES..." id="blogSearch" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <span className="terminal-slash">/</span>
        </div>
      </div>
      <div className="terminal-bottom">
        <button className="blog-filter-btn active active-bracket" data-blog="all">ALL</button>
        <button className="blog-filter-btn" data-blog="ai">ARTIFICIAL INTELLIGENCE</button>
        <button className="blog-filter-btn" data-blog="testing">QA / TESTING</button>
        <button className="blog-filter-btn" data-blog="architecture">ARCHITECTURE</button>
        <button className="blog-filter-btn" data-blog="tools">GUIDES &amp; TUTORIALS</button>
        <button className="blog-filter-btn" data-blog="reports">REPORTS &amp; ANALYSIS</button>
      </div>
      {/* Blog cards */}
      <div className="blog-grid" id="blogGrid">
        {posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())))).map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id} style={{ textDecoration: "none" }}>
            <div className="blog-card" data-blog={post.tags?.[0]?.toLowerCase() || "other"}>
              <div className="blog-card-header cat-ai">{post.tags?.[0]?.toUpperCase() || "ARTICLE"}</div>
              <div className="blog-card-img" style={{ background: "linear-gradient(135deg,#0d1f3c,#1a3a6e)" }}>
                <div className="blog-img-overlay"></div>
                <span>📄</span>
              </div>
              <div className="blog-card-body">
                <div className="blog-card-meta">{post.date}</div>
                <div className="blog-card-title">{post.title}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="blog-load-more" style={{ marginTop: "20px" }}>
        <button className="hero-btn" >⬇ LOAD MORE ARTICLES</button>
      </div>
    </div>
  </section>

  {/* TOOLS */}
  <section className={`page-section ${activeSection === "tools" ? "active" : ""}`} id="section-tools">
    <div className="tools-section">
      <div className="section-header">// TOOLS</div>
      <h2 className="section-title">My_Stack</h2>
      <p style={{ fontSize: "0.75rem", color: "#444", marginTop: "-16px", marginBottom: "20px" }}>Tools and technologies I use daily in my work.</p>
      <div className="tools-grid">
        <div className="tool-card"><div className="tool-icon">🔍</div><div className="tool-name">Postman</div><div className="tool-desc">Primary tool for API testing and automation</div><span className="tool-badge daily">DAILY</span></div>
        <div className="tool-card"><div className="tool-icon">🤖</div><div className="tool-name">Selenium</div><div className="tool-desc">Web application testing framework</div><span className="tool-badge daily">DAILY</span></div>
        <div className="tool-card"><div className="tool-icon">⚡</div><div className="tool-name">JMeter</div><div className="tool-desc">Performance and load testing</div><span className="tool-badge daily">DAILY</span></div>
        <div className="tool-card"><div className="tool-icon">🥒</div><div className="tool-name">Cucumber</div><div className="tool-desc">BDD testing framework</div><span className="tool-badge daily">DAILY</span></div>
        <div className="tool-card"><div className="tool-icon">☕</div><div className="tool-name">Java</div><div className="tool-desc">Primary language for automation frameworks</div><span className="tool-badge pro">PRO</span></div>
        <div className="tool-card"><div className="tool-icon">📜</div><div className="tool-name">JavaScript</div><div className="tool-desc">Scripting for K6 and web automation</div><span className="tool-badge pro">PRO</span></div>
        <div className="tool-card"><div className="tool-icon">🏗️</div><div className="tool-name">Jenkins</div><div className="tool-desc">CI/CD pipeline integration</div><span className="tool-badge pro">PRO</span></div>
        <div className="tool-card"><div className="tool-icon">🗃️</div><div className="tool-name">MySQL/Postgres</div><div className="tool-desc">Relational databases for data validation</div><span className="tool-badge pro">PRO</span></div>
        <div className="tool-card"><div className="tool-icon">☁️</div><div className="tool-name">AWS</div><div className="tool-desc">Cloud services and infrastructure</div><span className="tool-badge pro">PRO</span></div>
        <div className="tool-card"><div className="tool-icon">📊</div><div className="tool-name">Azure DevOps</div><div className="tool-desc">Test management and CI/CD</div><span className="tool-badge pro">PRO</span></div>
        <div className="tool-card"><div className="tool-icon">📝</div><div className="tool-name">Jira</div><div className="tool-desc">Bug tracking and agile project management</div><span className="tool-badge pro">PRO</span></div>
        <div className="tool-card"><div className="tool-icon">🌬️</div><div className="tool-name">Airflow</div><div className="tool-desc">Data pipeline orchestration</div><span className="tool-badge learning">LEARNING</span></div>
      </div>
    </div>
  </section>

  {/* CONTACTS */}
  <section className={`page-section ${activeSection === "contacts" ? "active" : ""}`} id="section-contacts">
    <div className="contacts-section">
      <div className="section-header">// CONTACTS</div>
      <h2 className="section-title">Get_In_Touch</h2>
      <div className="contact-grid">
        <div>
          <div className="contact-item">
            <div className="contact-icon-box">✉</div>
            <div><div className="contact-label">Email</div><div className="contact-value">Contact via Form</div></div>
          </div>
          <div className="contact-item">
            <div className="contact-icon-box">📍</div>
            <div><div className="contact-label">Location</div><div className="contact-value">Vietnam</div></div>
          </div>
          <div className="contact-item">
            <div className="contact-icon-box">📞</div>
            <div><div className="contact-label">Phone</div><div className="contact-value">[Protected]</div></div>
          </div>
          <div className="contact-item">
            <div className="contact-icon-box">💼</div>
            <div><div className="contact-label">Availability</div><div className="contact-value">Open for New Opportunities</div></div>
          </div>
          <div className="social-row">
            <a href="#" className="social-btn" title="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="#" className="social-btn" title="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="#" className="social-btn" title="Twitter/X">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>
        <div className="contact-form-box">
          <div className="cf-title">▸ SEND A MESSAGE</div>
          <form id="contactForm" noValidate onSubmit={handleContactSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="fname">Name</label>
                <input className="form-input" type="text" id="fname" placeholder="John Doe" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="femail">Email</label>
                <input className="form-input" type="email" id="femail" placeholder="john@example.com" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ftype">Project Type</label>
              <select className="form-select" id="ftype" value={contactForm.projectType} onChange={(e) => setContactForm({ ...contactForm, projectType: e.target.value })}>
                <option value="">Select...</option>
                <option>Automation Testing</option>
                <option>Manual Testing</option>
                <option>QA Leadership / Consulting</option>
                <option>API & Performance Testing</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="fmsg">Message</label>
              <textarea className="form-textarea" id="fmsg" placeholder="Tell me about your project..." value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} required></textarea>
            </div>
            {contactMsg && <div style={{ fontSize: "0.72rem", marginBottom: "10px", padding: "8px 12px", borderRadius: "4px", background: contactStatus === "sent" ? "rgba(0,230,118,0.1)" : "rgba(255,82,82,0.1)", color: contactStatus === "sent" ? "#00e676" : "#ff5252", border: `1px solid ${contactStatus === "sent" ? "rgba(0,230,118,0.3)" : "rgba(255,82,82,0.3)"}` }}>{contactMsg}</div>}
            <button type="submit" className="form-submit" disabled={contactStatus === "sending"}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              {contactStatus === "sending" ? "SENDING..." : "SEND MESSAGE"}
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>

</main>



    </>
  );
}
