export function generateHTML({
  title,
  name,
  subtitle,
  body,
  social = [],
}) {
  const escapeHTML = (value = '') =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const safeURL = (value = '') => {
    try {
      const url = new URL(value, 'https://example.com');

      if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) {
        return '#';
      }

      return escapeHTML(value);
    } catch {
      return '#';
    }
  };

  const socialLinks = social
    .filter((item) => item?.url && item?.label)
    .map(
      ({ url, label }) => `
        <a
          href="${safeURL(url)}"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link"
        >
          ${escapeHTML(label)}
        </a>
      `
    )
    .join(
      '<span class="separator" aria-hidden="true">✦</span>'
    );

  return `<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <meta
    name="description"
    content="${escapeHTML(subtitle)}"
  />

  <meta
    name="theme-color"
    content="#0a0a0a"
  />

  <title>${escapeHTML(title)}</title>


  <!-- =================================
       FONTS
  ================================== -->

  <link
    rel="preconnect"
    href="https://fonts.googleapis.com"
  />

  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin
  />

  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap"
    rel="stylesheet"
  />


  <style>

    /* =====================================
       VARIABLES
    ===================================== */

    :root {

      --bg: #0a0a0a;

      --text: #f5f5f5;

      --muted: #888888;

      --accent: #ff3b3b;

      --accent-glow: rgba(255, 59, 59, 0.12);

      --accent-subtle: rgba(255, 59, 59, 0.06);

      --dim: #1a1a1a;

      --glass: rgba(255, 255, 255, 0.03);


      --timeline: color-mix(
        in srgb,
        var(--accent) 28%,
        var(--bg)
      );

      --page-line: color-mix(
        in srgb,
        var(--accent) 24%,
        var(--bg)
      );


      --max-width: 1200px;

      --content-width: 760px;


      --page-x:
        clamp(20px, 5vw, 56px);

      --page-y:
        clamp(28px, 4vw, 46px);


      --section-space:
        clamp(34px, 4vw, 50px);


      --timeline-x: 10px;

      --content-offset: 58px;
    }



    /* =====================================
       RESET
    ===================================== */

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }


    html {
      background: var(--bg);

      scroll-behavior: smooth;
    }


    body {

      margin: 0;

      min-height: 100vh;

      background: var(--bg);

      color: var(--text);


      font-family:
        'Inter',
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        sans-serif;


      font-size: 16px;

      line-height: 1.6;


      -webkit-font-smoothing: antialiased;

      text-rendering: optimizeLegibility;
    }


    ::selection {

      background: var(--accent);

      color: var(--bg);
    }


    a {
      color: inherit;
      text-decoration: none;
    }


    a:focus-visible {

      outline:
        2px solid
        var(--accent);

      outline-offset: 5px;
    }



    /* =====================================
       GLOW ORB
    ===================================== */

    .glow-orb {
      position: fixed;
      top: -30%;
      right: -15%;
      width: 90vmax;
      height: 90vmax;
      background: radial-gradient(
        circle at center,
        rgba(255, 59, 59, 0.05) 0%,
        rgba(255, 59, 59, 0.02) 30%,
        transparent 65%
      );
      pointer-events: none;
      z-index: 0;
      animation: floatGlow 25s ease-in-out infinite alternate;
    }

    .glow-orb-secondary {
      position: fixed;
      bottom: -40%;
      left: -20%;
      width: 70vmax;
      height: 70vmax;
      background: radial-gradient(
        circle at center,
        rgba(255, 59, 59, 0.03) 0%,
        transparent 60%
      );
      pointer-events: none;
      z-index: 0;
      animation: floatGlowSecondary 30s ease-in-out infinite alternate;
    }

    @keyframes floatGlow {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(-8%, 8%) scale(1.15); }
    }

    @keyframes floatGlowSecondary {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(10%, -10%) scale(1.2); }
    }



    /* =====================================
       PAGE
    ===================================== */

    .page {

      position: relative;


      width:
        min(
          calc(100% - (var(--page-x) * 2)),
          var(--max-width)
        );


      margin-inline: auto;


      padding-block:
        var(--page-y)
        64px;


      z-index: 1;
    }



    .page::before {

      content: "";


      position: absolute;

      left: 100px;

      top: 0;

      bottom: 0;


      width: 1px;


      background:
        var(--page-line);


      pointer-events: none;

      z-index: 0;
    }



    /* =====================================
       LEFT DYNAMIC YEAR
    ===================================== */

    .page-index {

      position: fixed;

      left: 260px;

      top: 230px;


      display: flex;

      flex-direction: column;

      align-items: center;


      gap: 16px;


      z-index: 10;

      pointer-events: none;
    }


    .page-index::before,
    .page-index::after {

      content: "";


      width: 1px;

      height: 32px;


      background:
        linear-gradient(to bottom, var(--dim), transparent);
    }


    .page-index::after {
      background: linear-gradient(to top, var(--dim), transparent);
    }


    .page-index span {

      writing-mode:
        vertical-rl;


      transform:
        rotate(180deg);


      color:
        var(--accent);


      font-family:
        'DM Mono',
        monospace;


      font-size:
        0.75rem;


      font-weight:
        300;


      letter-spacing:
        0.4em;


      text-transform:
        uppercase;


      opacity: 0.7;
    }



    /* =====================================
       HERO
    ===================================== */

    .hero {

      position: relative;

      z-index: 2;


      min-height:
        min(66vh, 600px);


      display:
        flex;

      flex-direction:
        column;

      justify-content:
        flex-end;


      margin-bottom:
        clamp(38px, 4vw, 56px);

      padding-bottom:
        clamp(115px, 14vw, 165px);
    }



    /* =====================================
       RIGHT VERTICAL PORTFOLIO
    ===================================== */

    .hero-tag {

      position: absolute;


      top: 28px;

      right: 0;

      writing-mode:
        vertical-rl;


      transform:
        rotate(180deg);


      color:
        var(--muted);


      font-family:
        'DM Mono',
        monospace;


      font-size:
        0.7rem;


      font-weight:
        300;


      letter-spacing:
        0.35em;


      text-transform:
        uppercase;


      padding-bottom:
        42px;


      opacity: 0.35;


      transition: opacity 0.4s ease;
    }

    .hero-tag:hover {
      opacity: 0.7;
    }



    /* =====================================
       HERO NAME
    ===================================== */

    .hero h1 {

      max-width:
        980px;

      margin:
        0 0 28px 140px;


      font-family:
        'Space Grotesk',
        sans-serif;


      font-size:
        clamp(
          4rem,
          11vw,
          8.5rem
        );


      font-weight:
        700;


      line-height:
        0.88;


      letter-spacing:
        -0.065em;


      overflow-wrap:
        anywhere;


      background: linear-gradient(
        135deg,
        #ffffff 0%,
        #ffffff 55%,
        rgba(255, 255, 255, 0.5) 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }


    .hero h1::after {
      content: '';
      display: inline-block;
      width: 10px;
      height: 10px;
      background: var(--accent);
      border-radius: 50%;
      margin-left: 14px;
      -webkit-text-fill-color: initial;
      box-shadow: 0 0 40px var(--accent-glow), 0 0 80px rgba(255, 59, 59, 0.1);
      animation: pulseDot 2.5s ease-in-out infinite;
    }

    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.7); }
    }



    /* =====================================
       SUBTITLE
    ===================================== */

    .subtitle-row {

      display:
        grid;


      grid-template-columns:
        minmax(0, 1fr)
        auto;


      align-items:
        end;


      gap:
        34px;
    }


    .subtitle {

      max-width:
        520px;


      margin:
        0 0 0 140px;


      color:
        var(--muted);


      font-size:
        clamp(
          1rem,
          1.8vw,
          1.12rem
        );


      line-height:
        1.7;


      font-weight: 300;
      letter-spacing: -0.01em;
    }


    .scroll-hint {

      display:
        flex;


      align-items:
        center;


      gap:
        10px;


      color:
        var(--muted);


      font-family:
        'Space Grotesk',
        sans-serif;


      font-size:
        0.6rem;


      font-weight:
        500;


      letter-spacing:
        0.15em;


      text-transform:
        uppercase;


      opacity: 0.4;


      transition: opacity 0.4s ease;
    }


    .scroll-hint:hover {
      opacity: 1;
    }


    .scroll-hint::after {

      content:
        "↓";


      color:
        var(--accent);


      font-size:
        1.1rem;


      animation: bounceDown 2.5s ease-in-out infinite;
    }

    @keyframes bounceDown {
      0%, 100% { transform: translateY(0); opacity: 1; }
      50% { transform: translateY(6px); opacity: 0.5; }
    }



    /* =====================================
       MAIN CONTENT
    ===================================== */

    .content {

      position: relative;

      z-index: 2;


      width:
        min(
          100%,
          var(--content-width)
        );


      margin-inline:
        auto;


      display:
        flex;


      flex-direction:
        column;

      gap:
        var(--section-space);


      counter-reset:
        section;
    }



    /* =====================================
       CONTENT TIMELINE
    ===================================== */

    .content::before {

      content: "";


      position:
        absolute;


      top: 0;

      bottom: 0;


      left:
        var(--timeline-x);


      width:
        1px;

      background:
        var(--timeline);
    }



    /* =====================================
       CONTENT ITEMS
    ===================================== */

    .content > * {

      position:
        relative;


      counter-increment:
        section;


      padding-left:
        var(--content-offset);
    }



    /* =====================================
       SECTION NUMBERS
    ===================================== */

    .content > *::before {

      content:
        counter(
          section,
          decimal-leading-zero
        );


      position:
        absolute;


      left:
        -5px;


      top:
        0;


      display:
        grid;


      place-items:
        center;


      width:
        32px;


      height:
        32px;


      background:
        var(--bg);


      border:
        1px solid
        var(--dim);


      color:
        var(--muted);


      font-family:
        'DM Mono',
        monospace;


      font-size:
        0.55rem;


      font-weight:
        300;


      transition:
        border-color 400ms cubic-bezier(0.16, 1, 0.3, 1),
        color 400ms cubic-bezier(0.16, 1, 0.3, 1),
        transform 400ms cubic-bezier(0.16, 1, 0.3, 1),
        box-shadow 400ms cubic-bezier(0.16, 1, 0.3, 1);


      border-radius: 6px;
    }


    .content > *:hover::before {

      border-color:
        var(--accent);


      color:
        var(--accent);


      transform:
        translateX(-3px) scale(1.06);


      box-shadow: 0 0 30px var(--accent-glow);
    }



    /* =====================================
       SECTION LABEL
    ===================================== */

    .content h2 {

      display:
        flex;


      align-items:
        center;


      width:
        fit-content;


      gap:
        14px;


      margin:
        0 0 10px;


      color:
        var(--accent);


      font-family:
        'DM Mono',
        monospace;


      font-size:
        0.6rem;


      font-weight:
        300;


      letter-spacing:
        0.25em;


      line-height:
        1.2;


      text-transform:
        uppercase;


      opacity: 0.6;
    }


    .content h2::after {

      content:
        "";


      width:
        48px;


      height:
        1px;


      background:
        linear-gradient(90deg, var(--dim), transparent);
    }



    /* =====================================
       HEADINGS
    ===================================== */

    .content h3 {

      max-width:
        680px;


      margin:
        0 0 6px;


      color:
        var(--text);


      font-family:
        'Space Grotesk',
        sans-serif;


      font-size:
        clamp(
          1.5rem,
          3.2vw,
          2.1rem
        );


      font-weight:
        600;


      line-height:
        1.1;


      letter-spacing:
        -0.03em;
    }



    /* =====================================
       PARAGRAPHS
    ===================================== */

    .content p {

      max-width:
        620px;


      margin:
        0 0 6px;


      color:
        var(--muted);


      font-size:
        0.96rem;


      line-height:
        1.7;


      font-weight: 300;
    }


    .content p:last-child {
      margin-bottom: 0;
    }



    /* =====================================
       SKILLS
    ===================================== */

    .content > *:has(ul) ul {

      display:
        flex;


      flex-wrap:
        wrap;


      gap:
        8px 14px;


      margin-top:
        12px;

      margin-left:
        -42px;


      padding-left:
        42px;


      list-style:
        none;
    }


    .content ul,
    .content ol {

      list-style:
        none;


      padding-block-start:
        0;
    }


    .content li {

      position:
        relative;


      padding:
        5px 16px 5px 12px;


      color:
        var(--text);


      font-size:
        0.82rem;


      line-height:
        1.5;


      white-space:
        nowrap;


      list-style:
        none;


      background: var(--glass);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 24px;


      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }


    .content li:hover {
      border-color: var(--accent);
      background: var(--accent-subtle);
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(255, 59, 59, 0.08);
    }


    .content li::before {

      content:
        "";


      position:
        absolute;


      left:
        4px;


      top:
        50%;


      width:
        3px;


      height:
        3px;


      border-radius:
        50%;


      background:
        var(--accent);


      transform:
        translateY(-50%);


      opacity: 0.4;
    }



    /* =====================================
       LINKS
    ===================================== */

    .content a {

      position:
        relative;


      display:
        inline-flex;


      align-items:
        center;


      gap:
        10px;


      margin-top:
        8px;


      color:
        var(--text);


      font-family:
        'Space Grotesk',
        sans-serif;


      font-size:
        0.88rem;


      font-weight:
        500;


      text-decoration:
        none;


      transition:
        color 400ms cubic-bezier(0.16, 1, 0.3, 1);
    }


    .content a::after {

      content:
        "→";


      color:
        var(--accent);


      transition:
        transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
    }


    .content a::before {

      content:
        "";


      position:
        absolute;


      left:
        0;


      right:
        22px;


      bottom:
        -3px;


      height:
        1.5px;


      background:
        var(--accent);


      transform-origin:
        left;


      transition:
        transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
    }


    .content a:hover {

      color:
        var(--accent);
    }


    .content a:hover::before {

      transform:
        scaleX(0);
    }


    .content a:hover::after {

      transform:
        translate(
          5px,
          -3px
        );
    }



    /* =====================================
       FOOTER
    ===================================== */

    footer {

      position:
        relative;


      z-index:
        2;


      width:
        min(
          100%,
          var(--content-width)
        );


      margin:
        clamp(38px, 5vw, 54px)
        auto
        0;


      padding-top:
        28px;


      border-top:
        1px solid
        var(--dim);


      display:
        flex;


      align-items:
        center;


      justify-content:
        space-between;


      gap:
        20px;


      color:
        var(--muted);


      font-size:
        0.8rem;


      font-weight: 300;
    }


    .social {

      display:
        flex;


      align-items:
        center;


      flex-wrap:
        wrap;


      gap: 2px;
    }


    .social-link {

      color:
        var(--text);


      text-decoration:
        none;


      transition:
        color 400ms cubic-bezier(0.16, 1, 0.3, 1),
        transform 400ms cubic-bezier(0.16, 1, 0.3, 1);


      padding: 4px 10px;
      border-radius: 4px;
      font-weight: 400;
    }


    .social-link:hover {

      color:
        var(--accent);


      transform: translateY(-2px);
    }


    .separator {

      margin-inline:
        6px;


      color:
        var(--dim);


      font-size: 0.55rem;
    }


    .brand {
      text-align:
        right;


      opacity: 0.5;
    }


    .brand a {

      color:
        var(--accent);


      text-decoration:
        none;


      transition: opacity 0.4s ease;
      font-weight: 400;
    }


    .brand a:hover {
      opacity: 0.7;
    }



    /* =====================================
       TABLET
    ===================================== */

    @media (max-width: 1100px) {

      .page-index {
        left: 20px;
      }


      .page::before {
        left: 80px;
      }


      .hero h1 {
        margin: 0 0 28px 120px;
      }


      .subtitle {
        margin: 0 0 0 120px;
      }
    }


    @media (max-width: 900px) {

      .page-index {

        left:
          16px;

        top:
          220px;
      }


      .page::before {

        left:
          70px;
      }


      .hero-tag {
        right:
          -2px;
      }


      .hero {

        min-height:
          62vh;


        padding-bottom:
          105px;


        margin-bottom:
          38px;
      }


      .hero h1 {
        margin: 0 0 28px 100px;
      }


      .subtitle {
        margin: 0 0 0 100px;
      }
    }



    /* =====================================
       MOBILE
    ===================================== */

    @media (max-width: 640px) {

      :root {

        --page-x:
          20px;


        --section-space:
          34px;


        --timeline-x:
          8px;


        --content-offset:
          38px;
      }


      .page {

        padding-bottom:
          48px;
      }

      .page-index,
      .hero-tag {

        display:
          none;
      }


      .page::before {

        display:
          none;
      }


      .glow-orb,
      .glow-orb-secondary {
        display: none;
      }


      .hero {

        min-height:
          64vh;


        margin-bottom:
          32px;


        padding-bottom:
          76px;
      }


      .hero h1 {

        margin:
          0 0 22px 0;


        font-size:
          clamp(
            3.6rem,
            17vw,
            5.5rem
          );
      }


      .hero h1::after {
        width: 8px;
        height: 8px;
        margin-left: 8px;
      }


      .subtitle-row {

        grid-template-columns:
          1fr;


        gap:
          10px;
      }


      .subtitle {

        margin:
          0;
      }


      .scroll-hint {
        display:
          none;
      }



      /* =================================
         MOBILE TIMELINE
      ================================= */

      .content::before {

        left:
          var(--timeline-x);
      }


      .content > * {

        padding-left:
          var(--content-offset);
      }


      .content > *::before {

        left:
          -1px;


        width:
          20px;


        height:
          20px;


        font-size:
          0.5rem;
      }



      /* =================================
         MOBILE SKILLS
      ================================= */

      .content > *:has(ul) ul {

        margin-left:
          -22px;


        padding-left:
          22px;


        margin-top:
          10px;
      }


      .content li {

        font-size:
          0.78rem;


        padding:
          4px 14px 4px 10px;


        white-space: normal;
      }


      .content h2 {

        margin-bottom:
          8px;
      }


      .content h3 {

        font-size:
          1.4rem;


        margin-bottom:
          5px;
      }


      .content p {

        font-size:
          0.92rem;


        line-height:
          1.6;
      }



      /* =================================
         MOBILE FOOTER
      ================================= */

      footer {

        align-items:
          flex-start;


        flex-direction:
          column;


        margin-top:
          40px;


        gap: 16px;
      }


      .brand {

        text-align:
          left;
      }
    }



    /* =====================================
       SMALL MOBILE
    ===================================== */

    @media (max-width: 400px) {

      .hero {

        min-height:
          60vh;


        padding-bottom:
          68px;


        margin-bottom:
          28px;
      }


      .hero h1 {

        font-size:
          3.35rem;
      }


      .content {

        gap:
          30px;
      }


      .content ul {

        gap:
          6px 10px;
      }


      .content li {

        font-size:
          0.75rem;
      }
    }



    /* =====================================
       REDUCED MOTION
    ===================================== */

    @media (prefers-reduced-motion: reduce) {

      html {

        scroll-behavior:
          auto;
      }


      .glow-orb,
      .glow-orb-secondary {
        display: none;
      }


      *,
      *::before,
      *::after {

        transition-duration:
          0.01ms !important;


        animation-duration:
          0.01ms !important;


        animation-iteration-count:
          1 !important;
      }
    }

  </style>

</head>


<body>

  <!-- GLOW ORBS -->
  <div class="glow-orb" aria-hidden="true"></div>
  <div class="glow-orb-secondary" aria-hidden="true"></div>

  <div class="page">


    <!-- =================================
         LEFT DYNAMIC YEAR
    ================================== -->

    <aside
      class="page-index"
      aria-hidden="true"
    >
      <span class="current-year"></span>
    </aside>



    <!-- =================================
         HERO
    ================================== -->

    <header class="hero">


      <!-- RIGHT VERTICAL PORTFOLIO -->

      <div
        class="hero-tag"
        aria-hidden="true"
      >
        Portfolio
      </div>


      <!-- NAME -->

      <h1>
        ${escapeHTML(name)}
      </h1>


      <!-- SUBTITLE -->

      <div class="subtitle-row">

        <p class="subtitle">
          ${escapeHTML(subtitle)}
        </p>


        <div class="scroll-hint">
          Explore
        </div>

      </div>

    </header>



    <!-- =================================
         PORTFOLIO CONTENT
    ================================== -->

    <main class="content">

      ${body}

    </main>



    <!-- =================================
         FOOTER
    ================================== -->

    <footer>

      <div class="social">
        ${socialLinks}
      </div>


      <div class="brand">

        Built with

        <a
          href="https://github.com/DevAshTeam/renderfolio"
          target="_blank"
          rel="noopener noreferrer"
        >
          renderfolio
        </a>

      </div>

    </footer>

  </div>



  <!-- =================================
       DYNAMIC YEAR
  ================================== -->

  <script>

    const yearElement =
      document.querySelector(
        '.current-year'
      );


    if (yearElement) {

      yearElement.textContent =
        new Date().getFullYear();

    }

  </script>

</body>

</html>`;
}


// resume (PDF)
export function generateResumeHTML({ title, name, subtitle, body, social = [] }) {
  const socialLinks = social
    .map(s => `<a href="${s.url}">${s.label}</a>`)
    .join('&nbsp;&nbsp;·&nbsp;&nbsp;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 10.5pt;
      line-height: 1.5;
      color: #1a1a1a;
      background: white;
    }

    .page {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 50px;
    }

    header {
      margin-bottom: 24px;
      padding-bottom: 14px;
      border-bottom: 2px solid #111;
    }

    header h1 {
      font-size: 22pt;
      font-weight: 700;
      letter-spacing: -0.03em;
      margin-bottom: 3px;
    }

    header .subtitle {
      font-size: 11pt;
      color: #444;
      font-weight: 500;
      margin-bottom: 6px;
    }

    header .social {
      font-size: 9.5pt;
      color: #555;
    }

    header .social a {
      color: #111;
      text-decoration: none;
      border-bottom: 1px solid #aaa;
    }

    h2 {
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 20px 0 7px;
      color: #111;
      border-bottom: 1px solid #ddd;
      padding-bottom: 3px;
    }

    h3 {
      font-size: 11pt;
      font-weight: 600;
      margin: 11px 0 2px;
      color: #111;
    }

    p {
      margin-bottom: 5px;
      color: #333;
    }

    ul {
      margin: 3px 0 9px 18px;
      color: #333;
    }

    li { margin-bottom: 2px; }

    a {
      color: #111;
      text-decoration: none;
      border-bottom: 1px solid #999;
    }

    footer {
      margin-top: 28px;
      font-size: 8.5pt;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="page">
    <header>
      <h1>${name}</h1>
      <p class="subtitle">${subtitle}</p>
      ${social.length ? `<div class="social">${socialLinks}</div>` : ''}
    </header>

    ${body}

    <footer>
      Generated with renderfolio
    </footer>
  </div>
</body>
</html>`;
}