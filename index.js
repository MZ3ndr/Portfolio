(() => {
  const root = document.documentElement;

  // ===== Theme toggle (persisted) =====
  const THEME_KEY = "mz_theme";
  const themeToggle = document.getElementById("themeToggle");

  function setTheme(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme"); // default dark
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      return;
    }
    // Default to dark, but you could optionally respect system preference:
    // const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;
    // setTheme(prefersLight ? "light" : "dark");
    setTheme("dark");
  }

  themeToggle?.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    setTheme(isLight ? "dark" : "light");
    toast(isLight ? "Dark mode enabled" : "Light mode enabled");
  });

  initTheme();

  // ===== Mobile menu =====
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");

  menuToggle?.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    mobileNav.setAttribute("aria-hidden", String(!open));
  });

  // Close mobile nav on link click
  mobileNav?.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      mobileNav.setAttribute("aria-hidden", "true");
    });
  });

  // ===== Scroll reveal =====
  const revealEls = document.querySelectorAll(".reveal");

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => io.observe(el));

  // ===== Copy-to-clipboard =====
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast(`Copied: ${text}`);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      toast(`Copied: ${text}`);
    }
  }

  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy");
      if (text) copyText(text);
    });
  });

  // ===== Simple mail draft form (no backend) =====
  // Uses your GitHub as contact anchor; you can replace with a real email if you want.
  const mailForm = document.getElementById("mailForm");
  const formHint = document.getElementById("formHint");

  mailForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(mailForm);
    const subject = String(fd.get("subject") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (!subject || !message) return;

    // If you want a real email target, change this:
    const to = "example@example.com";

    const body = `${message}\n\n— Sent via Marc Zender portfolio`;
    const url = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = url;
    if (formHint) formHint.textContent = "Opening your mail client with a prefilled draft...";
  });

  // ===== Footer year =====
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ===== Toast =====
  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
  }
})();
