// No hooks needed — WorkSection is static JSX.
// With @astrojs/react automatic JSX runtime, no React import is required.

const projects = [
  {
    num: '01',
    tag: 'Talk',
    title: 'From Dead to Living: Building a Design System with AI',
    desc: 'A 30-minute talk on how AI changes the way we build and evolve design systems, from static libraries to living systems.',
    year: '2026',
    role: 'Speaker',
    tools: ['Figma Slides', 'Figma MCP', 'Claude Code'],
    href: 'https://youtu.be/v6-77V0hZZo?si=Lxy-qAV6TwpbaX9U',
  },
  {
    num: '02',
    tag: 'AI product design',
    comingSoon: true,
    title: 'Agentic Network Submission (ANS)',
    desc: 'Agentic AI workflow for automating compliance declarations. Built with AI-first delivery to reduce manual effort, improve data accuracy, and scale faster.',
    year: '2025',
    role: 'Design lead',
    tools: ['Figma', 'UXPilot'],
  },
  {
    num: '03',
    tag: 'Design System',
    comingSoon: true,
    title: 'Design System × Marketplace — from fragmented to unified',
    desc: 'Design system-led rebuild of a complex marketplace. Established tokens, components, and governance to enable consistency, faster delivery, and scalable growth.',
    year: '2023',
    role: 'Solo — design + build',
    tools: ['Figma'],
  },
];

export default function WorkSection() {
  return (
    <section id="work" className="work-section">
      <div className="work-inner">

        {/* Header */}
        <div className="work-header">
          <div>
            <div className="work-eyebrow">work</div>
            <h2 className="work-headline">
              Selected projects
            </h2>
          </div>
          <span className="work-count">{projects.length} projects</span>
        </div>

        {/* Table header */}
        <div className="work-table-header">
          {['#', 'Project', 'Year'].map((h) => (
            <span key={h} className="work-col-label">{h}</span>
          ))}
        </div>

        {/* Project rows */}
        <div>
          {projects.map((p, i) => {
            const Tag = p.href ? 'a' : 'div';
            const linkProps = p.href
              ? { href: p.href, target: '_blank', rel: 'noopener noreferrer', style: { boxShadow: 'none', textDecoration: 'none', color: 'inherit', display: 'block' } }
              : {};
            return (
            <Tag key={i} className="work-row" {...linkProps}>
              <div className="work-row-grid">
                <span className="work-num">{p.num}</span>

                <div>
                  <div className="work-tag-row">
                    <span className="work-tag">{p.tag}</span>
                  </div>
                  <div className="work-title">
                    {p.title}
                    {p.comingSoon && (
                      <span className="work-coming-soon-badge">
                        <span className="work-coming-soon-dot" />
                        Coming soon
                      </span>
                    )}
                  </div>

                  <div className="work-expand">
                    <p className="work-desc">{p.desc}</p>
                    <div className="work-detail-row">
                      <span className="work-meta-label">{p.role}</span>
                      <span className="work-meta-dot">·</span>
                      <div className="work-tools">
                        {p.tools.map((t) => (
                          <span key={t} className="work-tool">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="work-year-col">
                  <span className="work-year">{p.year}</span>
                  <span className="work-arrow">→</span>
                </div>
              </div>
            </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
