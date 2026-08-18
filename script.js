(function () {
  "use strict";

  /* Case studies: expanded by default on desktop, collapsed (except the
     first) on narrow/mobile widths so the page doesn't read as one long
     wall of always-open text. */
  var storyEls = document.querySelectorAll(".story");
  function setStoryDefaults() {
    var isMobile = window.matchMedia("(max-width: 640px)").matches;
    storyEls.forEach(function (el, i) {
      if (el.dataset.userToggled) return; // don't override a manual click
      el.open = isMobile ? i === 0 : true;
    });
  }
  setStoryDefaults();
  window.addEventListener("resize", setStoryDefaults);
  storyEls.forEach(function (el) {
    el.addEventListener("toggle", function () { el.dataset.userToggled = "1"; });
  });

  /* Theme toggle */
  var root = document.documentElement;
  var themeBtn = document.getElementById("themeToggle");
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  if (stored) root.setAttribute("data-theme", stored);
  function applyThemeIcon() {
    var t = root.getAttribute("data-theme") || "dark";
    themeBtn.textContent = t === "light" ? "◑" : "◐";
  }
  applyThemeIcon();
  themeBtn.addEventListener("click", function () {
    var current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    var next = current === "light" ? "dark" : "light";
    if (next === "dark") { root.removeAttribute("data-theme"); }
    else { root.setAttribute("data-theme", "light"); }
    try { localStorage.setItem("theme", next); } catch (e) {}
    applyThemeIcon();
  });

  /* Mobile nav toggle */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* Active nav link on scroll */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section, main header[id]"));
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          links.forEach(function (l) {
            l.classList.toggle("active", l.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* Architecture stage tabs */
  var archData = {
    sources: {
      title: "Sources",
      body: "Before touching a migration, understand what the legacy system actually does — Vertica, Oracle/GoldenGate and Mainframe environments each carry business logic that isn't documented anywhere except the code. Dependency analysis with Product Owners and Business Analysts happens before any transformation is designed."
    },
    ingestion: {
      title: "Ingestion",
      body: "Getting data out of the source system reliably, using CDC (Qlik Replicate) and log-based replication (GoldenGate) so downstream transformation isn't working from stale or incomplete extracts."
    },
    transform: {
      title: "Transformation",
      body: "Converting legacy procedural logic — IBM DataStage, BTEQ — into PySpark and Snowflake Stored Procedures, preserving business rules while making the logic testable and maintainable."
    },
    storage: {
      title: "Storage",
      body: "Snowflake as the warehouse layer: using Time Travel and Zero Copy Clone to make migrations safely reversible, and automating DDL generation so schema conversion isn't manual, error-prone work."
    },
    serving: {
      title: "Serving & Analytics",
      body: "Business-critical data marts for retail operations, KPI reporting, employee analytics and customer insights — built with the reporting and analytics consumers in mind from the start, not bolted on afterward."
    }
  };
  var stageButtons = document.querySelectorAll(".arch-stage");
  var archPanel = document.getElementById("archPanel");
  stageButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      stageButtons.forEach(function (b) { b.setAttribute("aria-selected", "false"); });
      btn.setAttribute("aria-selected", "true");
      var d = archData[btn.getAttribute("data-stage")];
      if (d && archPanel) {
        archPanel.innerHTML = "<h4>" + d.title + "</h4><p>" + d.body + "</p>";
      }
    });
  });
})();
