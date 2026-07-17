import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1] as const;

const heroImage =
  "https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1600&w=2200";
const hardwareImage =
  "https://images.pexels.com/photos/17489157/pexels-photo-17489157.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1300&w=1800";

const services = [
  {
    number: "01",
    title: "Cloud GPU rental",
    body: "Rent GPU capacity for development, training, inference, notebooks, and any workload that needs serious acceleration without owning the hardware.",
    detail: "Elastic sessions, dedicated machines, or reserved capacity.",
  },
  {
    number: "02",
    title: "LLM endpoints",
    body: "Rent production-ready, managed endpoints for Gemma 4 and Qwen 3.6. We handle the infrastructure; your application talks to one clean API.",
    detail: "A direct path from your product to reliable model serving.",
  },
  {
    number: "03",
    title: "Private model hosting",
    body: "Bring your workload, context requirements, and traffic shape. We plan and run isolated GPU capacity that stays aligned with your product.",
    detail: "For teams that need more control than a public endpoint can offer.",
  },
];

const modelOptions = [
  {
    id: "gemma-4",
    name: "Gemma 4",
    description: "Reasoning, chat, and polished product experiences.",
    badge: "Conversational intelligence",
  },
  {
    id: "qwen-3-6",
    name: "Qwen 3.6",
    description: "Coding, agents, structured tasks, and technical workflows.",
    badge: "Agent-ready workflows",
  },
];

const deploymentOptions = [
  {
    id: "shared",
    name: "On-demand",
    description: "A flexible starting point for exploration and variable demand.",
  },
  {
    id: "dedicated",
    name: "Dedicated",
    description: "Reserved serving capacity for stable production traffic.",
  },
  {
    id: "private",
    name: "Private",
    description: "Isolated deployment planning for sensitive or tailored workloads.",
  },
];

const workflowItems = [
  { label: "Prompt", value: "Your application", icon: "01" },
  { label: "Route", value: "GPU.tn endpoint", icon: "02" },
  { label: "Infer", value: "Gemma 4 / Qwen 3.6", icon: "03" },
  { label: "Return", value: "A response your users feel", icon: "04" },
];

const operations = [
  {
    title: "Capacity that fits the workload",
    body: "Not every product needs the same topology. Start with a clear conversation around model size, context, concurrency, and how your users actually behave.",
  },
  {
    title: "The infrastructure stays behind the curtain",
    body: "Your team gets a usable deployment and a direct line to the people running it. Focus on prompts, product, and evaluation instead of GPU operations.",
  },
  {
    title: "A rental model built for change",
    body: "Move from testing to production or reshape capacity as your workflow evolves. Rent the right amount of infrastructure for the stage you are in.",
  },
];

const faqs = [
  {
    question: "What can I rent from GPU.tn?",
    answer:
      "You can rent cloud GPU capacity for general workloads or rent managed LLM endpoints for Gemma 4 and Qwen 3.6. We also scope private model hosting for teams that need isolated capacity.",
  },
  {
    question: "Do you sell GPUs or hardware?",
    answer:
      "No. GPU.tn is focused on GPU rental and hosted AI infrastructure. You get access to the compute you need without purchasing, operating, or maintaining the hardware yourself.",
  },
  {
    question: "How do managed LLM endpoints work?",
    answer:
      "You choose a model and deployment shape, then connect to a dedicated API endpoint. GPU.tn handles the serving infrastructure while your application sends requests and receives model output.",
  },
  {
    question: "Can I rent capacity for non-LLM GPU work?",
    answer:
      "Yes. Contact us with your workload details and we will help determine the right rental approach for development, inference, training, notebooks, or other accelerated compute tasks.",
  },
];

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="GPU.tn">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#bfe9ea] to-[#e7c98f]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="3" width="12" height="8" rx="1.5" fill="#06070a" />
          <circle cx="5" cy="7" r="1.5" fill="#06070a" />
          <circle cx="9" cy="7" r="1.5" fill="#06070a" />
        </svg>
      </div>
      <span className={`font-display text-lg font-medium tracking-[-0.05em] ${light ? "text-[#071012]" : "text-white"}`}>
        GPU<span className={light ? "text-[#487c79]" : "text-[#c7f0ed]"}>.tn</span>
      </span>
    </span>
  );
}

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="M3 13 13 3M5 3h8v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionEyebrow({ children, warm = false }: { children: string; warm?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-px w-8 ${warm ? "bg-[#e3c287]/70" : "bg-[#c7f0ed]/70"}`} />
      <p className={`font-mono text-[0.62rem] uppercase tracking-[0.48em] ${warm ? "text-[#e3c287]/80" : "text-[#c7f0ed]/80"}`}>
        {children}
      </p>
    </div>
  );
}

function CursorAura() {
  const [position, setPosition] = useState({ x: -600, y: -600 });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => setPosition({ x: event.clientX - 260, y: event.clientY - 260 });
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-0 hidden h-[32rem] w-[32rem] rounded-full opacity-40 blur-3xl mix-blend-screen lg:block"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        background: "radial-gradient(circle, rgba(160, 238, 235, 0.13) 0%, rgba(160, 238, 235, 0.035) 34%, transparent 70%)",
      }}
    />
  );
}

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => {
    const sectionIds = ["top", "services", "hosting", "rental", "faq"];
    const updateScroll = () => {
      setScrolled(window.scrollY > 28);
      const marker = window.scrollY + window.innerHeight * 0.3;
      let current = "top";
      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= marker) current = id;
      });
      setActiveSection(current);
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const navItems = [
    ["Services", "#services", "services"],
    ["LLM hosting", "#hosting", "hosting"],
    ["GPU rental", "#rental", "rental"],
    ["FAQ", "#faq", "faq"],
  ];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-5">
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easeOut }}
        className="mx-auto flex max-w-[92rem] items-center justify-between gap-3"
      >
        <a
          href="#top"
          aria-label="GPU.tn home"
          onClick={() => setActiveSection("top")}
          className={`pointer-events-auto group relative flex h-14 items-center overflow-hidden rounded-[1.1rem] border px-3.5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition-all duration-500 sm:pr-4 ${
            scrolled ? "border-white/[0.12] bg-[#071012]/90" : "border-white/[0.1] bg-[#071012]/55"
          }`}
        >
          <BrandMark />
          <span className="ml-4 hidden h-7 w-px bg-white/[0.12] sm:block" />
          <span className="ml-4 hidden flex-col sm:flex">
            <span className="font-mono text-[0.48rem] uppercase tracking-[0.28em] text-white/30">Cloud node</span>
            <span className="mt-1 flex items-center gap-1.5 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[#c7f0ed]/75">
              <i className="h-1 w-1 rounded-full bg-[#c7f0ed] shadow-[0_0_8px_#c7f0ed]" /> Tunisia / Online
            </span>
          </span>
          <span className="absolute inset-x-5 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-[#c7f0ed] to-transparent transition-transform duration-500 group-hover:scale-x-100" />
        </a>

        <nav
          className={`pointer-events-auto relative hidden h-14 items-center rounded-[1.1rem] border p-1.5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition-all duration-500 lg:flex ${
            scrolled ? "border-white/[0.12] bg-[#071012]/90" : "border-white/[0.1] bg-[#071012]/55"
          }`}
          aria-label="Main navigation"
        >
          <span className="mx-3 flex items-center gap-2 font-mono text-[0.48rem] uppercase tracking-[0.24em] text-white/28">
            <i className="h-1 w-1 rotate-45 bg-[#e3c287]" /> Navigate
          </span>
          <span className="mr-1 h-6 w-px bg-white/[0.1]" />
          {navItems.map(([label, href, id]) => {
            const active = activeSection === id;
            return (
              <a
                key={label}
                href={href}
                onClick={() => setActiveSection(id)}
                className={`relative flex h-full items-center px-4 text-[0.61rem] font-medium uppercase tracking-[0.17em] transition ${active ? "text-[#071012]" : "text-white/45 hover:text-white"}`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-[0.72rem] bg-[#c7f0ed]"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </a>
            );
          })}
        </nav>

        <div className="pointer-events-auto flex items-center gap-2">
          <a
            href="mailto:hello@gpu.tn?subject=GPU.tn%20capacity%20request"
            className={`group hidden h-14 items-center gap-4 rounded-[1.1rem] border pl-4 pr-2 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition-all duration-500 sm:flex ${
              scrolled ? "border-white/[0.12] bg-[#071012]/90" : "border-white/[0.1] bg-[#071012]/55"
            }`}
          >
            <span className="flex flex-col">
              <span className="font-mono text-[0.47rem] uppercase tracking-[0.25em] text-[#e3c287]/65">Start here</span>
              <span className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-white/85">Rent capacity</span>
            </span>
            <span className="grid h-10 w-10 place-items-center rounded-[0.8rem] bg-[#f4f0e8] text-[#071012] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <ArrowUpRight />
            </span>
          </a>
          <button type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="grid h-14 w-14 place-items-center rounded-[1.1rem] border border-white/[0.12] bg-[#071012]/80 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl lg:hidden">
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-px w-4 bg-current transition ${menuOpen ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-px w-4 bg-current transition ${menuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 h-px w-4 bg-current transition ${menuOpen ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </motion.div>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="pointer-events-auto mx-auto mt-2 max-w-[92rem] overflow-hidden rounded-[1.2rem] border border-white/[0.12] bg-[#071012]/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col px-6 py-5">
              <div className="mb-2 flex items-center gap-2 font-mono text-[0.5rem] uppercase tracking-[0.26em] text-[#c7f0ed]/55"><i className="h-1 w-1 rotate-45 bg-[#e3c287]" /> Navigation console</div>
              {navItems.map(([label, href, id], index) => (
                <a key={label} href={href} onClick={() => { setMenuOpen(false); setActiveSection(id); }} className="group flex items-center justify-between border-b border-white/[0.08] py-4 font-display text-xl text-white/80">
                  <span>{label}</span><span className="font-mono text-[0.55rem] tracking-[0.2em] text-white/25 transition group-hover:text-[#c7f0ed]">0{index + 1}</span>
                </a>
              ))}
              <a href="mailto:hello@gpu.tn?subject=GPU.tn%20capacity%20request" className="mt-5 rounded-full bg-[#f4f0e8] px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#07090b]">Request capacity</a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0, 0.35], ["0%", "14%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.35], [1.04, 1.18]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.23], [1, 0]);

  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden bg-[#07090b] text-white">
      {/* Parallax background */}
      <motion.img src={heroImage} alt="Illuminated network hardware in a data center" style={{ y: imageY, scale: imageScale }} className="absolute inset-0 -z-20 h-[115%] w-full object-cover object-[64%_center] opacity-75" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,9,11,0.97)_0%,rgba(7,9,11,0.81)_36%,rgba(7,9,11,0.25)_76%,rgba(7,9,11,0.55)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,9,11,0.58)_0%,transparent_34%,rgba(7,9,11,0.88)_100%)]" />
      <div className="hero-grain absolute inset-0 -z-10 opacity-30" />

      {/* Decorative vertical grid lines */}
      <div className="pointer-events-none absolute inset-0 -z-[5]" aria-hidden="true">
        {[25, 50, 75].map((pct) => (
          <div key={pct} className="absolute top-0 h-full w-px bg-white/[0.04]" style={{ left: `${pct}%` }} />
        ))}
      </div>

      {/* Main content */}
      <motion.div style={{ opacity: contentOpacity }} className="relative mx-auto flex min-h-[100svh] max-w-[92rem] flex-col justify-end px-5 pb-14 pt-32 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">

        {/* Hero headline — the visual centerpiece */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 1.1, ease: easeOut }}
          className="max-w-5xl font-display text-[clamp(2.6rem,6.2vw,5.8rem)] font-medium leading-[1] tracking-[-0.06em]"
        >
          The infrastructure
          <br />
          behind your next
          <br />
          <span className="bg-gradient-to-r from-[#c7f0ed] via-[#e3c287] to-[#c7f0ed] bg-clip-text text-transparent">
            intelligent product.
          </span>
        </motion.h1>

        {/* Supporting copy + CTAs */}
        <div className="mt-10 grid items-end gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.85, ease: easeOut }}
            className="max-w-xl text-[1.05rem] leading-8 text-white/55"
          >
            Rent cloud GPU capacity for any workload, or rent managed LLM endpoints for Gemma&nbsp;4 and Qwen&nbsp;3.6. Clean infrastructure, direct support, no hardware to own.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.85, ease: easeOut }}
            className="flex flex-col gap-3 sm:flex-row lg:justify-end"
          >
            <a href="#hosting" className="group flex items-center justify-center gap-3 rounded-full bg-[#f4f0e8] px-6 py-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#07090b] transition hover:bg-white">
              Rent an LLM endpoint
              <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"><ArrowUpRight /></span>
            </a>
            <a href="mailto:hello@gpu.tn?subject=GPU.tn%20cloud%20GPU%20rental" className="rounded-full border border-white/20 px-6 py-3.5 text-center text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/90 transition hover:border-[#c7f0ed]/60 hover:bg-white/[0.06]">
              Rent cloud GPUs
            </a>
          </motion.div>
        </div>

        {/* Bottom bar with signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 1 }}
          className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/[0.1] pt-5"
        >
          <span className="flex items-center gap-2 font-mono text-[0.55rem] uppercase tracking-[0.22em] text-white/35">
            <i className="h-1.5 w-1.5 rounded-full bg-[#c7f0ed] shadow-[0_0_8px_#c7f0ed]" />
            All systems online
          </span>
          {["Gemma 4", "Qwen 3.6", "Cloud GPU", "Tunisia"].map((tag) => (
            <span key={tag} className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-white/25">{tag}</span>
          ))}
          <span className="ml-auto hidden items-center gap-4 lg:flex">
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-white/35">Scroll</span>
            <span className="relative h-8 w-px overflow-hidden bg-white/15">
              <span className="absolute left-0 top-0 h-1/2 w-px animate-[scroll-down_2s_ease-in-out_infinite] bg-[#c7f0ed]" />
            </span>
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

function SignalStrip() {
  const items = ["Cloud GPU rental", "Gemma 4", "Qwen 3.6", "Private endpoints", "General GPU workloads", "Technical support"];
  return (
    <section className="overflow-hidden border-y border-[#071012]/10 bg-[#c7f0ed] text-[#071012]" aria-label="GPU.tn capabilities">
      <motion.div className="flex w-max items-center gap-5 py-4" animate={{ x: [0, -420] }} transition={{ duration: 18, ease: "linear", repeat: Infinity }}>
        {[...items, ...items, ...items].map((item, index) => <span key={`${item}-${index}`} className="flex items-center gap-5 whitespace-nowrap font-display text-xl font-medium tracking-[-0.03em] sm:text-2xl">{item}<span className="h-1.5 w-1.5 rounded-full bg-[#9b7240]" /></span>)}
      </motion.div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="bg-[#f4f0e8] px-5 py-24 text-[#071012] sm:px-8 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[92rem]">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.75, ease: easeOut }} className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div><SectionEyebrow warm>Ways to work with GPU.tn</SectionEyebrow><h2 className="mt-6 max-w-md font-display text-[clamp(2.6rem,5vw,4.7rem)] font-medium leading-[0.99] tracking-[-0.065em]">Use the compute. Leave the metal to us.</h2></div>
          <p className="max-w-xl self-end text-lg leading-8 text-[#071012]/65">From a first prototype to a production workflow, GPU.tn gives your team an uncomplicated way to access the GPU capacity and language model infrastructure it needs.</p>
        </motion.div>
        <div className="mt-16 border-t border-[#071012]/15">
          {services.map((service, index) => (
            <motion.article key={service.title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.65, ease: easeOut, delay: index * 0.06 }} className="group grid gap-6 border-b border-[#071012]/15 py-8 transition sm:grid-cols-[0.12fr_0.47fr_0.41fr] sm:py-11">
              <span className="font-mono text-xs tracking-[0.2em] text-[#071012]/45">{service.number}</span>
              <h3 className="font-display text-3xl font-medium leading-none tracking-[-0.045em] sm:text-4xl">{service.title}</h3>
              <div className="max-w-md"><p className="leading-7 text-[#071012]/65">{service.body}</p><p className="mt-4 text-sm font-medium text-[#487c79]">{service.detail}</p></div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function EndpointComposer() {
  const [model, setModel] = useState(modelOptions[0]);
  const [deployment, setDeployment] = useState(deploymentOptions[0]);
  const [capacity, setCapacity] = useState(2);
  const [copied, setCopied] = useState(false);
  const configuration = useMemo(() => `POST https://api.gpu.tn/v1/chat/completions\nmodel: ${model.id}\ndeployment: ${deployment.id}\ncapacity: ${capacity} GPU unit${capacity > 1 ? "s" : ""}`, [model, deployment, capacity]);
  const requestHref = `mailto:hello@gpu.tn?subject=${encodeURIComponent(`GPU.tn ${model.name} endpoint request`)}&body=${encodeURIComponent(`Hello GPU.tn,\n\nI would like to discuss a ${deployment.name.toLowerCase()} ${model.name} endpoint with ${capacity} GPU rental unit${capacity > 1 ? "s" : ""}.\n\nMy workload: `)}`;
  const copyConfiguration = async () => {
    try { await navigator.clipboard.writeText(configuration); } catch { /* Visible config remains manually copyable. */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="hosting" className="relative overflow-hidden bg-[#071012] px-5 py-24 text-white sm:px-8 lg:px-12 lg:py-36">
      <div className="pointer-events-none absolute -left-60 top-1/2 h-[38rem] w-[38rem] -translate-y-1/2 rounded-full bg-[#c7f0ed]/[0.07] blur-[140px]" /><div className="pointer-events-none absolute -right-48 top-0 h-[32rem] w-[32rem] rounded-full bg-[#e3c287]/[0.07] blur-[140px]" />
      <div className="relative mx-auto grid max-w-[92rem] gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.75, ease: easeOut }}>
          <SectionEyebrow>Rent an LLM endpoint</SectionEyebrow>
          <h2 className="mt-6 font-display text-[clamp(2.65rem,5vw,4.7rem)] font-medium leading-[0.99] tracking-[-0.065em]">Put a serious model behind your product.</h2>
          <p className="mt-7 max-w-lg text-lg leading-8 text-white/60">Choose the model that suits the work, choose a rental shape, and we will turn that into an endpoint your team can build on.</p>
          <div className="mt-11 space-y-7 border-l border-white/[0.14] pl-6"><div><p className="font-display text-lg text-white">Built around the work, not a generic plan.</p><p className="mt-1 text-sm leading-6 text-white/45">Tell us about your users, context size, response expectations, and release timeline.</p></div><div><p className="font-display text-lg text-white">One endpoint, clear ownership.</p><p className="mt-1 text-sm leading-6 text-white/45">Your application talks to a clean API. GPU.tn takes care of the GPU layer beneath it.</p></div></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ delay: 0.08, duration: 0.8, ease: easeOut }} className="relative border border-white/[0.12] bg-white/[0.035] p-5 sm:p-7 lg:p-8">
          <div className="mb-7 flex items-center justify-between border-b border-white/[0.1] pb-4"><div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#c7f0ed] shadow-[0_0_18px_rgba(199,240,237,0.8)]" /><span className="font-mono text-[0.61rem] uppercase tracking-[0.32em] text-white/50">Endpoint composer</span></div><span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[#e3c287]/70">Configuration preview</span></div>
          <fieldset><legend className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-white/35">01 / Select a model</legend><div className="mt-3 grid gap-px border border-white/[0.1] bg-white/[0.1] sm:grid-cols-2">{modelOptions.map((option) => <button key={option.id} type="button" onClick={() => setModel(option)} className={`p-4 text-left transition ${model.id === option.id ? "bg-[#c7f0ed] text-[#071012]" : "bg-[#0a1517] text-white hover:bg-white/[0.06]"}`}><span className="block font-display text-lg font-medium">{option.name}</span><span className={`mt-1 block text-sm ${model.id === option.id ? "text-[#071012]/65" : "text-white/45"}`}>{option.description}</span><span className={`mt-4 block font-mono text-[0.56rem] uppercase tracking-[0.22em] ${model.id === option.id ? "text-[#487c79]" : "text-[#e3c287]/65"}`}>{option.badge}</span></button>)}</div></fieldset>
          <fieldset className="mt-7"><legend className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-white/35">02 / Rent the deployment shape</legend><div className="mt-3 grid gap-2 sm:grid-cols-3">{deploymentOptions.map((option) => <button key={option.id} type="button" onClick={() => setDeployment(option)} className={`border px-3 py-3 text-left transition ${deployment.id === option.id ? "border-[#e3c287]/70 bg-[#e3c287]/[0.1]" : "border-white/[0.1] hover:border-white/[0.3]"}`}><span className="block text-sm font-medium text-white">{option.name}</span><span className="mt-1 block text-xs leading-5 text-white/40">{option.description}</span></button>)}</div></fieldset>
          <div className="mt-7"><div className="flex items-end justify-between"><label htmlFor="capacity" className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-white/35">03 / Rental capacity</label><span className="font-display text-3xl text-[#f4f0e8]">{capacity}<span className="ml-1 text-sm text-white/40">GPU units</span></span></div><input id="capacity" className="mt-4" type="range" min="1" max="8" value={capacity} onChange={(event) => setCapacity(Number(event.target.value))} /><div className="mt-2 flex justify-between font-mono text-[0.53rem] uppercase tracking-[0.16em] text-white/30"><span>Initial</span><span>Expanded</span></div></div>
          <AnimatePresence mode="wait"><motion.pre key={configuration} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-7 overflow-x-auto border border-white/[0.09] bg-black/35 p-4 font-mono text-[0.72rem] leading-7 text-[#c7f0ed]/85">{configuration}</motion.pre></AnimatePresence>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row"><a href={requestHref} className="flex flex-1 items-center justify-center gap-2 bg-[#f4f0e8] px-5 py-3 text-[0.66rem] font-semibold uppercase tracking-[0.17em] text-[#071012] transition hover:bg-white">Request this endpoint <ArrowUpRight /></a><button type="button" onClick={copyConfiguration} className="border border-white/[0.15] px-5 py-3 text-[0.66rem] font-medium uppercase tracking-[0.17em] text-white/75 transition hover:border-white/45 hover:text-white">{copied ? "Copied" : "Copy config"}</button></div>
        </motion.div>
      </div>
    </section>
  );
}

function RentalModes() {
  const [mode, setMode] = useState(0);
  const modes = [
    { label: "On-demand", title: "For the work that is still taking shape.", body: "Rent GPU capacity as you explore, benchmark, prototype, or handle an unexpected burst. It is the direct way to start without overcommitting your infrastructure.", prompt: "I need flexible cloud GPU rental" },
    { label: "Dedicated", title: "For production with a predictable rhythm.", body: "Set aside GPU capacity for the workloads your team runs every day. Dedicated rental gives your application a steadier home as usage becomes a known quantity.", prompt: "I need dedicated GPU rental" },
    { label: "Reserved", title: "For the capacity you cannot leave to chance.", body: "Plan ahead for launches, major evaluations, and sustained usage. We will work with you on a clear reservation that matches the shape and timing of the workload.", prompt: "I need reserved GPU capacity" },
  ];
  const active = modes[mode];
  return (
    <section id="rental" className="relative overflow-hidden bg-[#0c1719] px-5 py-24 text-white sm:px-8 lg:px-12 lg:py-36">
      <div className="absolute inset-y-0 right-0 w-[45%] bg-[radial-gradient(circle_at_80%_50%,rgba(199,240,237,0.12),transparent_45%)]" />
      <div className="relative mx-auto max-w-[92rem]">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.75, ease: easeOut }} className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"><div><SectionEyebrow warm>Cloud GPU rental</SectionEyebrow><h2 className="mt-6 max-w-lg font-display text-[clamp(2.65rem,5vw,4.7rem)] font-medium leading-[0.99] tracking-[-0.065em]">Rent the capacity your workflow actually needs.</h2></div><p className="max-w-xl self-end text-lg leading-8 text-white/60">GPU rental is not one thing. Select the rhythm that fits your work today, and keep the freedom to change it tomorrow.</p></motion.div>
        <div className="relative mt-16 grid border-y border-white/[0.13] lg:grid-cols-[0.4fr_0.6fr]"><div className="divide-y divide-white/[0.13]">{modes.map((item, index) => <button key={item.label} type="button" onClick={() => setMode(index)} className={`group flex w-full items-center justify-between px-1 py-6 text-left sm:px-2 ${mode === index ? "text-[#c7f0ed]" : "text-white/45"}`}><span className="flex items-center gap-4 font-display text-2xl tracking-[-0.03em] sm:text-3xl"><span className="font-mono text-[0.6rem] tracking-[0.2em] text-white/30">0{index + 1}</span>{item.label}</span><span className={`transition-transform duration-300 ${mode === index ? "translate-x-0 text-[#e3c287]" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}><ArrowUpRight /></span></button>)}</div>
          <AnimatePresence mode="wait"><motion.div key={active.label} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.35, ease: easeOut }} className="flex min-h-[20rem] flex-col justify-between py-8 lg:border-l lg:border-white/[0.13] lg:px-12 lg:py-10"><div><p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[#e3c287]/70">{active.label} rental</p><h3 className="mt-5 max-w-xl font-display text-3xl font-medium leading-[1.05] tracking-[-0.045em] sm:text-4xl">{active.title}</h3><p className="mt-6 max-w-lg leading-8 text-white/55">{active.body}</p></div><a href={`mailto:hello@gpu.tn?subject=${encodeURIComponent(active.prompt)}`} className="mt-9 inline-flex w-fit items-center gap-3 border-b border-[#c7f0ed]/60 pb-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#c7f0ed] transition hover:border-[#e3c287] hover:text-[#e3c287]">Discuss this rental shape <ArrowUpRight /></a></motion.div></AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <section className="relative isolate overflow-hidden bg-[#071012] px-5 py-24 text-white sm:px-8 lg:px-12 lg:py-36">
      <img src={hardwareImage} alt="Close view of data center hardware" className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-45" /><div className="absolute inset-0 -z-10 bg-[#071012]/80" /><div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,16,18,0.96),rgba(7,16,18,0.62),rgba(7,16,18,0.92))]" />
      <div className="relative mx-auto max-w-[92rem]">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.75, ease: easeOut }} className="max-w-3xl"><SectionEyebrow>From product to response</SectionEyebrow><h2 className="mt-6 font-display text-[clamp(2.65rem,5vw,4.7rem)] font-medium leading-[0.99] tracking-[-0.065em]">Your users see intelligence. We operate the layer beneath it.</h2></motion.div>
        <div className="mt-16 grid gap-0 border-y border-white/[0.14] sm:grid-cols-2 lg:grid-cols-4">{workflowItems.map((item, index) => <motion.div key={item.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.65, delay: index * 0.08, ease: easeOut }} className="relative border-b border-white/[0.14] py-7 sm:border-r sm:px-6 lg:border-b-0 lg:px-8 lg:last:border-r-0"><span className="font-mono text-[0.6rem] tracking-[0.2em] text-[#e3c287]/75">{item.icon}</span><p className="mt-7 font-mono text-[0.57rem] uppercase tracking-[0.25em] text-white/40">{item.label}</p><p className="mt-2 max-w-[13rem] font-display text-xl leading-6 tracking-[-0.03em] text-white">{item.value}</p>{index < workflowItems.length - 1 && <span className="absolute -right-2 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 rotate-45 border-r border-t border-[#c7f0ed]/60 bg-[#0b1719] lg:block" />}</motion.div>)}</div>
        <p className="mt-8 max-w-2xl text-sm leading-7 text-white/50">The result is a calmer path to AI features: your application stays focused on experience and outcomes while GPU.tn keeps the serving layer ready for the work.</p>
      </div>
    </section>
  );
}

function OperatingStandard() {
  return (
    <section className="bg-[#f4f0e8] px-5 py-24 text-[#071012] sm:px-8 lg:px-12 lg:py-36"><div className="mx-auto max-w-[92rem]">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.75, ease: easeOut }} className="grid gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:gap-20"><div><SectionEyebrow warm>How we work</SectionEyebrow><h2 className="mt-6 max-w-lg font-display text-[clamp(2.65rem,5vw,4.7rem)] font-medium leading-[0.99] tracking-[-0.065em]">The operational details should feel uncomplicated.</h2></div><p className="max-w-xl self-end text-lg leading-8 text-[#071012]/65">AI infrastructure is technical. Working with it does not need to feel impersonal, unclear, or over-engineered. GPU.tn keeps the conversation precise and the path forward simple.</p></motion.div>
      <div className="mt-16 grid border-t border-[#071012]/15 lg:grid-cols-3">{operations.map((operation, index) => <motion.article key={operation.title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.65, delay: index * 0.07, ease: easeOut }} className="border-b border-[#071012]/15 py-8 lg:border-r lg:px-8 lg:last:border-r-0 lg:first:pl-0 lg:py-10"><span className="font-mono text-[0.6rem] tracking-[0.2em] text-[#9b7240]">0{index + 1}</span><h3 className="mt-5 max-w-xs font-display text-2xl font-medium leading-7 tracking-[-0.04em]">{operation.title}</h3><p className="mt-5 max-w-sm leading-7 text-[#071012]/60">{operation.body}</p></motion.article>)}</div>
    </div></section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-[#07090b] px-5 py-24 text-white sm:px-8 lg:px-12 lg:py-36"><div className="mx-auto grid max-w-[92rem] gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.75, ease: easeOut }}><SectionEyebrow>Questions, answered</SectionEyebrow><h2 className="mt-6 max-w-md font-display text-[clamp(2.6rem,5vw,4.7rem)] font-medium leading-[0.99] tracking-[-0.065em]">A clearer way to start the conversation.</h2><p className="mt-7 max-w-sm leading-7 text-white/50">If your question is not below, send a brief note about your workload. A real person will take it from there.</p></motion.div>
      <div className="border-t border-white/[0.12]">{faqs.map((faq, index) => { const isOpen = open === index; return <div key={faq.question} className="border-b border-white/[0.12]"><button type="button" onClick={() => setOpen(isOpen ? -1 : index)} className="flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7" aria-expanded={isOpen}><span className="font-display text-xl tracking-[-0.03em] sm:text-2xl">{faq.question}</span><span className={`relative h-5 w-5 shrink-0 transition ${isOpen ? "rotate-45 text-[#c7f0ed]" : "text-white/55"}`}><span className="absolute left-0 top-1/2 h-px w-5 bg-current" /><span className="absolute left-1/2 top-0 h-5 w-px bg-current" /></span></button><AnimatePresence initial={false}>{isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: easeOut }} className="overflow-hidden"><p className="max-w-2xl pb-7 pr-10 leading-8 text-white/55">{faq.answer}</p></motion.div>}</AnimatePresence></div>; })}</div>
    </div></section>
  );
}

function FinalCta() {
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-[#c7f0ed] px-5 py-24 text-[#071012] sm:px-8 lg:px-12 lg:py-36"><div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border border-[#071012]/10" /><div className="absolute -bottom-52 left-[30%] h-[34rem] w-[34rem] rounded-full bg-[#e3c287]/30 blur-3xl" /><div className="relative mx-auto max-w-[92rem]"><motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: easeOut }} className="max-w-5xl"><SectionEyebrow warm>GPU.tn</SectionEyebrow><h2 className="mt-7 font-display text-[clamp(3.2rem,7vw,7.2rem)] font-medium leading-[0.86] tracking-[-0.085em]">Rent the infrastructure.<br />Build what is next.</h2><p className="mt-8 max-w-2xl text-lg leading-8 text-[#071012]/65">Tell us what you are building and what the workload needs. We will help you choose the right rental path, from cloud GPU capacity to a managed LLM endpoint.</p><div className="mt-10 flex flex-col gap-3 sm:flex-row"><a href="mailto:hello@gpu.tn?subject=GPU.tn%20capacity%20request" className="group flex w-fit items-center justify-center gap-3 rounded-full bg-[#071012] px-7 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#152629]">Start a capacity request <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"><ArrowUpRight /></span></a><a href="mailto:hello@gpu.tn" className="rounded-full border border-[#071012]/25 px-7 py-4 text-center text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#071012] transition hover:border-[#071012]/70">hello@gpu.tn</a></div></motion.div></div></section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#071012] px-5 py-10 text-white/45 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[92rem] gap-10 border-b border-white/[0.1] pb-9 sm:grid-cols-[1fr_auto]"><div><BrandMark /><p className="mt-4 max-w-sm text-sm leading-6 text-white/40">Cloud GPU rental and managed LLM infrastructure for teams building with Gemma 4 and Qwen 3.6.</p></div><div className="grid grid-cols-2 gap-x-12 gap-y-3 text-[0.68rem] uppercase tracking-[0.15em] sm:text-right"><a href="#services" className="transition hover:text-[#c7f0ed]">Services</a><a href="#hosting" className="transition hover:text-[#c7f0ed]">LLM hosting</a><a href="#rental" className="transition hover:text-[#c7f0ed]">GPU rental</a><a href="mailto:hello@gpu.tn" className="transition hover:text-[#c7f0ed]">Contact</a></div></div><div className="mx-auto flex max-w-[92rem] flex-col gap-3 pt-6 text-[0.62rem] uppercase tracking-[0.16em] text-white/25 sm:flex-row sm:items-center sm:justify-between"><span>GPU.tn &copy; {new Date().getFullYear()}</span><span>Designed for workloads that refuse to wait</span></div></footer>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 130, damping: 30, restDelta: 0.001 });
  return <motion.div aria-hidden="true" className="fixed left-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#c7f0ed] via-[#f4f0e8] to-[#e3c287]" style={{ scaleX }} />;
}

export default function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07090b] antialiased">
      <CursorAura />
      <ScrollProgress />
      <Navigation />
      <Hero />
      <SignalStrip />
      <Services />
      <EndpointComposer />
      <RentalModes />
      <Workflow />
      <OperatingStandard />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}