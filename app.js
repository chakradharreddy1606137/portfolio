/**
 * Portfolio Interactive Logic (Enhanced Attractive Edition)
 * Author: Kathulapalli Chakradhar Reddy
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initHeroNetworkCanvas();
  initTypewriter();
  initThemeToggle();
  initProjectFilters();
  initStatsCounter();
  initSpotlightEffect();
  initTerminalTilt();
  initSkillSearch();
  initSimulationLab();
  initCaseStudyModal();
  initCopyButtons();
  initContactForm();
  initMobileMenu();
  initActiveNavHighlight();
});

/* --------------------------------------------------------------------------
   1. Scroll Progress Bar
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  });
}

/* --------------------------------------------------------------------------
   2. Hero Interactive Neural Network / Constellation Canvas
   -------------------------------------------------------------------------- */
function initHeroNetworkCanvas() {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    createParticles();
  }

  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactivity
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.7)';
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((width * height) / 14000);
    for (let i = 0; i < Math.min(count, 70); i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = 1 - dist / 120;
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha * 0.22})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  resize();

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   3. Role Typewriter Animation
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const typedElem = document.getElementById('typed-text');
  if (!typedElem) return;

  const roles = [
    'Multi-Agent AI Systems',
    'Zero-Poison NDN Defenses',
    'Enterprise Network Automation',
    'Full-Stack Spring & React Apps',
    'Distributed Systems'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 85;

  function typeStep() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typedElem.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      typedElem.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end of text
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(typeStep, typingSpeed);
  }

  typeStep();
}

/* --------------------------------------------------------------------------
   4. Theme Toggle (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('kcr_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('kcr_theme', newTheme);
    showToast(`Switched to ${newTheme} mode`);
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Spotlight Effect (Cards follow mouse)
   -------------------------------------------------------------------------- */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.spotlight-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   6. 3D Perspective Tilt on Terminal Card
   -------------------------------------------------------------------------- */
function initTerminalTilt() {
  const tiltCard = document.getElementById('terminal-tilt-card');
  if (!tiltCard) return;

  const cardInner = tiltCard.querySelector('.terminal-card');

  tiltCard.addEventListener('mousemove', (e) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    cardInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  tiltCard.addEventListener('mouseleave', () => {
    cardInner.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

/* --------------------------------------------------------------------------
   7. Live SW-MARL Defense Simulation Lab
   -------------------------------------------------------------------------- */
function initSimulationLab() {
  const canvas = document.getElementById('sim-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const statusDot = document.getElementById('sim-status-dot');
  const statusText = document.getElementById('sim-status-text');
  const modeBadge = document.getElementById('sim-mode-badge');
  const poisonBar = document.getElementById('gauge-poison-bar');
  const poisonVal = document.getElementById('gauge-poison-val');
  const hitBar = document.getElementById('gauge-hit-bar');
  const hitVal = document.getElementById('gauge-hit-val');
  const windowVal = document.getElementById('gauge-window-val');
  const actionVal = document.getElementById('gauge-action-val');

  const btnAttack = document.getElementById('btn-inject-attack');
  const btnDefense = document.getElementById('btn-activate-sw');
  const btnReset = document.getElementById('btn-reset-sim');

  let simState = 'NORMAL'; // 'NORMAL', 'ATTACK', 'DEFENDING'
  let windowCount = 0;
  let packets = [];

  // Define Nodes in Network
  const nodes = [
    { label: 'Consumer', x: 80, y: 120, type: 'endpoint' },
    { label: 'Router 0 (MARL)', x: 300, y: 120, type: 'router', status: 'clean' },
    { label: 'Router 1 (MARL)', x: 500, y: 120, type: 'router', status: 'clean' },
    { label: 'Router 2 (MARL)', x: 700, y: 120, type: 'router', status: 'clean' },
    { label: 'Producer', x: 920, y: 120, type: 'endpoint' }
  ];

  class Packet {
    constructor(isPoisoned = false) {
      this.isPoisoned = isPoisoned;
      this.fromNode = 0;
      this.toNode = 1;
      this.progress = 0;
      this.speed = isPoisoned ? 0.025 : 0.018;
      this.blocked = false;
    }

    update() {
      this.progress += this.speed;
      if (this.progress >= 1) {
        this.progress = 0;
        this.fromNode++;
        this.toNode++;

        if (this.toNode >= nodes.length) {
          return false; // Reached end
        }

        // If in DEFENDING state, block poisoned packets at Router 0
        if (simState === 'DEFENDING' && this.isPoisoned && this.fromNode >= 1) {
          this.blocked = true;
          return false; // Quarantined
        }
      }
      return true;
    }

    draw() {
      const p1 = nodes[this.fromNode];
      const p2 = nodes[this.toNode];
      if (!p1 || !p2) return;

      const currentX = p1.x + (p2.x - p1.x) * this.progress;
      const currentY = p1.y + (p2.y - p1.y) * this.progress;

      ctx.beginPath();
      ctx.arc(currentX, currentY, this.isPoisoned ? 6 : 4.5, 0, Math.PI * 2);
      ctx.fillStyle = this.isPoisoned ? '#ef4444' : '#10b981';
      ctx.shadowColor = this.isPoisoned ? '#ef4444' : '#10b981';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Spawn packets periodically
  setInterval(() => {
    if (simState === 'NORMAL') {
      packets.push(new Packet(false));
    } else if (simState === 'ATTACK') {
      packets.push(new Packet(true));
      if (Math.random() > 0.4) packets.push(new Packet(false));
      windowCount = Math.min(20, windowCount + 1);
      updateGaugesAttack();
    } else if (simState === 'DEFENDING') {
      packets.push(new Packet(false));
      if (Math.random() > 0.6) packets.push(new Packet(true)); // Blocked
      windowCount = Math.max(0, windowCount - 1);
      updateGaugesDefending();
    }
  }, 320);

  function updateGaugesAttack() {
    statusDot.className = 'sim-status-dot under-attack';
    statusText.textContent = 'ADVERSARIAL ATTACK: Bogus Content Injected!';
    modeBadge.textContent = 'CPA DETECTED: BUFFER SPIKING';
    poisonBar.style.width = '34.7%';
    poisonVal.textContent = '34.7%';
    hitBar.style.width = '45.2%';
    hitVal.textContent = '45.2%';
    windowVal.textContent = `${windowCount} / 20`;
    actionVal.textContent = 'ADMIT (Compromised)';
    actionVal.style.color = '#ef4444';
  }

  function updateGaugesDefending() {
    statusDot.className = 'sim-status-dot defense-active';
    statusText.textContent = 'SW-MARL ACTIVE: Zero-Poison Quarantine & Q-Table Reset';
    modeBadge.textContent = 'P_window > 0 -> Q RESET';
    poisonBar.style.width = '0.0%';
    poisonVal.textContent = '0.0% (Zero-Poison)';
    hitBar.style.width = '92.3%';
    hitVal.textContent = '92.3%';
    windowVal.textContent = `${windowCount} / 20 (Self-Healing)`;
    actionVal.textContent = 'BYPASS (Action 0: Quarantine)';
    actionVal.style.color = '#38bdf8';
  }

  function resetToNormal() {
    simState = 'NORMAL';
    windowCount = 0;
    statusDot.className = 'sim-status-dot';
    statusText.textContent = 'System Normal: Processing Clean Traffic';
    modeBadge.textContent = 'MONITORING W=20';
    poisonBar.style.width = '0.0%';
    poisonVal.textContent = '0.0%';
    hitBar.style.width = '92.3%';
    hitVal.textContent = '92.3%';
    windowVal.textContent = '0 / 20';
    actionVal.textContent = 'ADMIT (Action 1)';
    actionVal.style.color = 'var(--accent-cyan)';
    showToast('Simulation restored to normal baseline traffic.');
  }

  if (btnAttack) {
    btnAttack.addEventListener('click', () => {
      simState = 'ATTACK';
      showToast('⚠️ Adversarial Cache Poisoning Attack Injected!');
    });
  }

  if (btnDefense) {
    btnDefense.addEventListener('click', () => {
      simState = 'DEFENDING';
      showToast('🛡️ SW-MARL Defense Triggered: Q-Tables Reset & Poison Quarantined!');
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', resetToNormal);
  }

  // Animation Loop for Simulation Canvas
  function drawSimulation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Links
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 3;
    ctx.moveTo(nodes[0].x, nodes[0].y);
    for (let i = 1; i < nodes.length; i++) {
      ctx.lineTo(nodes[i].x, nodes[i].y);
    }
    ctx.stroke();

    // Draw Nodes
    for (let n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.type === 'router' ? 22 : 16, 0, Math.PI * 2);
      ctx.fillStyle = n.type === 'router' ? (simState === 'DEFENDING' ? '#06b6d4' : (simState === 'ATTACK' ? '#ef4444' : '#6366f1')) : '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node Label
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '12px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, n.x, n.y + 36);
    }

    // Update and Draw Packets
    packets = packets.filter(p => {
      const active = p.update();
      if (active) p.draw();
      return active;
    });

    requestAnimationFrame(drawSimulation);
  }

  drawSimulation();
}

/* --------------------------------------------------------------------------
   8. Interactive Skill Search
   -------------------------------------------------------------------------- */
function initSkillSearch() {
  const searchInput = document.getElementById('skill-search-input');
  const countBadge = document.getElementById('skill-count-badge');
  const chips = document.querySelectorAll('.skill-chip');

  if (!searchInput || !chips.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    let matchCount = 0;

    chips.forEach(chip => {
      const text = chip.textContent.toLowerCase();
      if (!query) {
        chip.classList.remove('highlight');
        chip.style.opacity = '1';
        matchCount++;
      } else if (text.includes(query)) {
        chip.classList.add('highlight');
        chip.style.opacity = '1';
        matchCount++;
      } else {
        chip.classList.remove('highlight');
        chip.style.opacity = '0.25';
      }
    });

    if (countBadge) {
      countBadge.textContent = `${matchCount} match${matchCount === 1 ? '' : 'es'}`;
    }
  });
}

/* --------------------------------------------------------------------------
   9. Interactive Case Study Modal
   -------------------------------------------------------------------------- */
function initCaseStudyModal() {
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close-btn');
  const openButtons = document.querySelectorAll('.open-case-study');

  if (!modal) return;

  const caseStudies = {
    'sw-marl': {
      title: 'Zero-Poison SW-MARL: Architectural Deep-Dive',
      html: `
        <h4>1. Problem Context & Threat Model</h4>
        <p>In Named Data Networks (NDN), in-network routers cache content in Content Stores (CS). Adversaries launch Cache Poisoning Attacks (CPA) by spamming bogus Interests to displace legitimate content, dropping cache hit rates by over 50% and doubling latency.</p>

        <h4>2. Decentralized MARL Architecture</h4>
        <p>We modeled each physical router as an autonomous Q-Learning agent with Actor-Critic policy gradients (147,000 parameters) using the <strong>PettingZoo Parallel API</strong> and <strong>Ray RLlib</strong>. State space tracks 11 temporal network features over a sliding window buffer ($W=100\text{ to }200$).</p>

        <h4>3. The Self-Healing Mathematical Defense</h4>
        <p>Unlike cumulative unlimited windows that cause permanent router lockdown, our sliding window computes:</p>
        <pre class="json-code font-mono"><code>P_window = Sum(P_{t-i}) for i=0 to W-1
If P_window > 0:
    Trigger Q(s, a) -> 0 (Instant Quarantine)</code></pre>
        <p>Once the attack subsides, the sliding window self-heals, restoring normal caching without human intervention.</p>

        <h4>4. Validated Empirical Results</h4>
        <ul>
          <li><strong>0.0% Poisoned Cache Content</strong> (vs 34.7% undefended).</li>
          <li><strong>92.3% Cache Hit Ratio</strong> preserved under active attacks.</li>
          <li><strong>0.3% False Positive Rate</strong> on legitimate traffic.</li>
        </ul>
      `
    },
    'net-auto': {
      title: 'Enterprise Network Automation Platform: Architecture',
      html: `
        <h4>1. Multi-Vendor Provisioning & Netmiko</h4>
        <p>Built a centralized telemetry and configuration automation platform managing Cisco Catalyst 3750 and 7200 routers. Automated Jinja2 template rendering for zero-touch interface, VLAN, and OSPF deployments.</p>

        <h4>2. Automated Root-Cause Diagnostics & CI/CD</h4>
        <p>Engineered an intelligent diagnostic engine that continuously inspects CRC errors, interface flaps, and routing table convergence. Automated daily Git-versioned configuration backups with unified diff tracking.</p>

        <h4>3. Containerization</h4>
        <p>Packaged the backend using FastAPI and Docker; verified configuration integrity via automated Pytest test suites and GitHub Actions CI/CD pipelines.</p>
      `
    },
    'student-placement': {
      title: 'Student Placement Management System: Architecture',
      html: `
        <h4>1. Role-Based Access Control (RBAC)</h4>
        <p>Built a secure full-stack platform separating Student, Company, and Admin privileges using Spring Security, JWT token validation, and BCrypt encryption.</p>

        <h4>2. Business Logic & Data Integrity</h4>
        <p>Enforces automated eligibility filtering based on CGPA thresholds, prevents duplicate applications, validates submission deadlines, and executes cascade deletion rules via Spring Data JPA and MySQL transactions.</p>

        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <a href="https://chakradharreddy1606137.github.io/Student_Placement_Management/" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary glow-btn">
            Launch Live Application ➔
          </a>
          <a href="https://github.com/chakradharreddy1606137/Student_Placement_Management" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline">
            GitHub Repository
          </a>
        </div>
      `
    },
    'commercial-planning': {
      title: 'Commercial Planning & Scenario Modeling Platform',
      html: `
        <h4>1. Anaplan Hub-and-Spoke Architecture</h4>
        <p>Modeled connected planning architectures where enterprise sales and quota data synchronize between central hub data models and spoke scenario modules.</p>

        <h4>2. Real-Time What-If Recalculations</h4>
        <p>Allows commercial leaders to simulate territory realignment, commission rate adjustments, and pipeline forecasts with low-latency multi-dimensional recalculations.</p>
      `
    }
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project');
      const data = caseStudies[projId];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalBody.innerHTML = data.html;
      modal.classList.add('active');
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   10. Interactive Project Filtering
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fade-in 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   11. Animated Stats Counter (Scroll Triggered)
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(elem => {
          const target = parseFloat(elem.getAttribute('data-count'));
          const suffix = elem.getAttribute('data-suffix') || '';
          animateValue(elem, 0, target, 1600, suffix);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsStrip = document.querySelector('.hero-stats-strip');
  if (statsStrip) observer.observe(statsStrip);
}

function animateValue(obj, start, end, duration, suffix) {
  let startTimestamp = null;
  const isFloat = end % 1 !== 0;

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = start + easeProgress * (end - start);

    obj.textContent = (isFloat ? currentVal.toFixed(1) : Math.floor(currentVal)) + suffix;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.textContent = (isFloat ? end.toFixed(1) : end) + suffix;
    }
  };

  window.requestAnimationFrame(step);
}

/* --------------------------------------------------------------------------
   12. One-Click Copy to Clipboard
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied "${textToCopy}" to clipboard!`);
      } catch (err) {
        const tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`Copied to clipboard!`);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   13. Contact Form Handling
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('send-message-btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.');
      return;
    }

    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending Message...</span>';
    }

    try {
      const response = await fetch('https://formsubmit.co/ajax/kcr1606137@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Portfolio Message from ${name}: ${subject}`,
          name: name,
          email: email,
          subject: subject,
          message: message,
          _template: 'table'
        })
      });

      const result = await response.json();
      if (response.ok && result.success !== 'false') {
        showToast('✅ Message sent! It has been delivered to Chakradhar\'s Gmail inbox.');
        form.reset();
      } else {
        throw new Error('Endpoint error');
      }
    } catch (err) {
      // Graceful fallback to mailto if offline or blocked
      const mailtoLink = `mailto:kcr1606137@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
      showToast('Opening your email client to complete sending...');
      window.location.href = mailtoLink;
      form.reset();
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    }
  });
}

/* --------------------------------------------------------------------------
   14. Mobile Menu Drawer Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (!mobileToggle || !navLinks) return;

  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
    });
  });
}

/* --------------------------------------------------------------------------
   15. Active Navigation Highlighting on Scroll
   -------------------------------------------------------------------------- */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Utility: Toast Notification
   -------------------------------------------------------------------------- */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#10b981" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3200);
}
