"use client";

export default function ResumePage() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Inter', sans-serif;
          background: #f5f5f5;
          color: #1a1a1a;
          line-height: 1.5;
        }

        .resume-container {
          max-width: 800px;
          margin: 0 auto;
          background: #fff;
          padding: 48px 56px;
          min-height: 100vh;
        }

        .print-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #0a0a0a;
          padding: 10px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          z-index: 999;
          box-shadow: 0 2px 12px rgba(0,0,0,0.3);
        }

        .print-bar button {
          background: #00e676;
          color: #0a0a0a;
          border: none;
          padding: 8px 24px;
          font-weight: 600;
          font-size: 0.8rem;
          letter-spacing: 1px;
          cursor: pointer;
          font-family: 'Inter', monospace;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .print-bar button:hover {
          background: #69f0ae;
          transform: translateY(-1px);
        }

        .print-bar span {
          color: #888;
          font-size: 0.7rem;
          letter-spacing: 0.5px;
        }

        .resume-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 2px solid #0a0a0a;
          margin-top: 48px;
        }

        .resume-name { font-size: 2rem; font-weight: 700; letter-spacing: -0.5px; }
        .resume-title { font-size: 0.95rem; color: #555; margin-top: 4px; font-weight: 400; }

        .resume-contact {
          text-align: right;
          font-size: 0.72rem;
          color: #555;
          line-height: 1.8;
        }

        .resume-contact a { color: #0a0a0a; text-decoration: none; font-weight: 500; }

        .section { margin-bottom: 24px; }
        .section-title {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #0a0a0a;
          border-bottom: 1px solid #ddd;
          padding-bottom: 4px;
          margin-bottom: 12px;
        }

        .summary-text { font-size: 0.8rem; color: #333; line-height: 1.7; }

        .job {
          margin-bottom: 16px;
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .job-title { font-size: 0.82rem; font-weight: 600; color: #0a0a0a; }
        .job-period { font-size: 0.7rem; color: #888; font-weight: 500; }
        .job-company { font-size: 0.75rem; color: #555; font-style: italic; margin-bottom: 4px; }

        .job ul {
          padding-left: 18px;
          font-size: 0.75rem;
          color: #444;
          line-height: 1.7;
        }

        .job li { margin-bottom: 2px; }

        .skills-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px 32px;
          font-size: 0.75rem;
          color: #333;
        }

        .skill-item { display: flex; gap: 6px; }
        .skill-label { font-weight: 600; color: #0a0a0a; min-width: 100px; }

        .edu-item { margin-bottom: 8px; }
        .edu-title { font-size: 0.8rem; font-weight: 600; }
        .edu-school { font-size: 0.72rem; color: #555; }
        .edu-year { font-size: 0.7rem; color: #888; }

        @media print {
          .print-bar { display: none !important; }
          body { background: #fff; }
          .resume-container { padding: 32px 40px; margin: 0; box-shadow: none; }
          .resume-header { margin-top: 0; }
          @page { margin: 0.5cm; size: A4; }
        }
      `}</style>

      <div className="print-bar">
        <button onClick={() => window.print()}>📄 SAVE AS PDF</button>
        <span>Use Ctrl+P / Cmd+P → Save as PDF</span>
      </div>

      <div className="resume-container">
        <div className="resume-header">
          <div>
            <div className="resume-name">TAN NGUYEN</div>
            <div className="resume-title">QA/QC Engineer & Test Leader — 10+ Years Experience</div>
          </div>
          <div className="resume-contact">
            <a href="https://tester1000kg.vercel.app" target="_blank">tester1000kg.vercel.app</a><br />
            Vietnam<br />
            Available for New Opportunities
          </div>
        </div>

        {/* SUMMARY */}
        <div className="section">
          <div className="section-title">Professional Summary</div>
          <div className="summary-text">
            QA/QC Engineer with over 10 years in IT, specializing in manual testing, automation testing, and team leadership.
            Expertise across Data Pipelines, SAP/ERP, E-commerce, Fulfillment, and Healthcare domains.
            Led QA teams of up to 15 members, designed comprehensive test strategies for enterprise clients,
            and applied AI-driven approaches to optimize test coverage. Currently exploring SDET and AI Agent technologies.
          </div>
        </div>

        {/* EXPERIENCE */}
        <div className="section">
          <div className="section-title">Work Experience</div>

          <div className="job">
            <div className="job-header">
              <div className="job-title">Test Consultant Engineer & QC Leader</div>
              <div className="job-period">Mar 2024 — Present</div>
            </div>
            <div className="job-company">Hitachi Digital Services / FPT Software</div>
            <ul>
              <li>Built end-to-end QA for large-scale data pipeline & migration project (30+ schemas, 500+ tables) for a top Japanese airline.</li>
              <li>Hands-on with AWS services and Apache Airflow for ETL/ELT testing orchestration.</li>
              <li>Led QC team of 10 members, applied AI approaches to enhance test case design and syntax review.</li>
              <li>Validated data integrity on Snowflake and Amazon Redshift across all migration stages.</li>
            </ul>
          </div>

          <div className="job">
            <div className="job-header">
              <div className="job-title">QA/QC Leader</div>
              <div className="job-period">Mar 2023 — Mar 2024</div>
            </div>
            <div className="job-company">Laidon Company (SAP Certified Partner)</div>
            <ul>
              <li>Led QA team for SimpleMDG — SAP BTP cloud-native application for Master Data Governance.</li>
              <li>Designed quality control procedures across 10+ customers with team of 15 QC engineers.</li>
            </ul>
          </div>

          <div className="job">
            <div className="job-header">
              <div className="job-title">QA/QC Leader</div>
              <div className="job-period">Oct 2020 — Mar 2023</div>
            </div>
            <div className="job-company">Baspro Company (Dai Viet Group — VNR500)</div>
            <ul>
              <li>Built ecosystem for e-commerce, fulfillment, and logistics across 9 platforms (SC, FOS, DH, LMD, DMS, WMS, CRM, POS, DVGo).</li>
              <li>Deployed solutions for 10+ customers; system handled 6000+ orders/day.</li>
              <li>Implemented Postman for API automation and K6 for performance testing.</li>
              <li>Managed QA team, mentored members, and reported to stakeholders.</li>
            </ul>
          </div>

          <div className="job">
            <div className="job-header">
              <div className="job-title">QA/QC Engineer</div>
              <div className="job-period">May 2016 — Oct 2020</div>
            </div>
            <div className="job-company">TMA Solutions</div>
            <ul>
              <li>Projects: Vibrent Health (US Healthcare), Iron Mountain, Contact Management.</li>
              <li>API Testing (Postman, JMeter), SQL database testing, Agile methodology.</li>
              <li>Managed Automation team (Java, Selenium, Cucumber, TestNG, Jenkins).</li>
              <li>Multiple &quot;Star Performer Team&quot; awards (2018-2019).</li>
            </ul>
          </div>

          <div className="job">
            <div className="job-header">
              <div className="job-title">IT Support</div>
              <div className="job-period">Feb 2012 — Apr 2016</div>
            </div>
            <div className="job-company">VNG Corporation</div>
            <ul>
              <li>End-user support: networking, troubleshooting, GSuite and SCCM deployment.</li>
            </ul>
          </div>
        </div>

        {/* SKILLS */}
        <div className="section">
          <div className="section-title">Technical Skills</div>
          <div className="skills-grid">
            <div className="skill-item"><span className="skill-label">Testing:</span> Manual, Automation, API, Performance, E2E</div>
            <div className="skill-item"><span className="skill-label">Automation:</span> Selenium, Cucumber, TestNG, Maven</div>
            <div className="skill-item"><span className="skill-label">Languages:</span> Java, JavaScript</div>
            <div className="skill-item"><span className="skill-label">API Tools:</span> Postman, JMeter, K6, Swagger</div>
            <div className="skill-item"><span className="skill-label">Databases:</span> MySQL, PostgreSQL, MongoDB, Snowflake</div>
            <div className="skill-item"><span className="skill-label">Cloud:</span> AWS, Apache Airflow</div>
            <div className="skill-item"><span className="skill-label">CI/CD:</span> Jenkins, Git</div>
            <div className="skill-item"><span className="skill-label">Management:</span> Jira, Azure DevOps, TestRail</div>
          </div>
        </div>

        {/* EDUCATION */}
        <div className="section">
          <div className="section-title">Education & Certifications</div>
          <div className="edu-item">
            <div className="edu-title">Fullstack Selenium in Java</div>
            <div className="edu-school">Automation FC</div>
            <div className="edu-year">2020</div>
          </div>
          <div className="edu-item">
            <div className="edu-title">CCNA & MCSA</div>
            <div className="edu-school">Computer Science Center, VNU-HCM</div>
            <div className="edu-year">2014</div>
          </div>
          <div className="edu-item">
            <div className="edu-title">Bachelor&apos;s Degree — IT Networking</div>
            <div className="edu-school">University of Industry, HCM City</div>
            <div className="edu-year">2012</div>
          </div>
        </div>
      </div>
    </>
  );
}
