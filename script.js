// =========================================================
// Getachew Dires Alebachew — Portfolio
// Small, dependency-free interactivity.
// =========================================================
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var yearEl = document.getElementById("year");

  // ---- Footer year ----
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Header elevation on scroll ----
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ---- Mobile nav toggle ----
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      mobileNav.classList.toggle("is-open", !open);
    });

    mobileNav.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("is-open");
      });
    });
  }

  // ---- Active nav link while scrolling ----
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-link");

  if (sections.length && "IntersectionObserver" in window) {
    var byId = {};
    navLinks.forEach(function (link) {
      byId[link.getAttribute("href")] = byId[link.getAttribute("href")] || [];
      byId[link.getAttribute("href")].push(link);
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = "#" + entry.target.id;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove("is-active"); });
            (byId[id] || []).forEach(function (l) { l.classList.add("is-active"); });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (s) { observer.observe(s); });
  }

  // ---- Skill meters: fill once the section is visible ----
  var meters = document.querySelectorAll(".meter-fill");
  if (meters.length) {
    if ("IntersectionObserver" in window) {
      var meterObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      meters.forEach(function (m) { meterObserver.observe(m); });
    } else {
      meters.forEach(function (m) { m.classList.add("is-visible"); });
    }
  }

  // ---- Copy email button ----
  document.querySelectorAll(".copy-btn[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");
      var done = function () {
        var original = btn.textContent;
        btn.textContent = "Copied";
        btn.classList.add("is-copied");
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove("is-copied");
        }, 1800);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(function () {
          fallbackCopy(value);
          done();
        });
      } else {
        fallbackCopy(value);
        done();
      }
    });
  });

  function fallbackCopy(text) {
    var temp = document.createElement("textarea");
    temp.value = text;
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    temp.select();
    try { document.execCommand("copy"); } catch (e) { /* no-op */ }
    document.body.removeChild(temp);
  }

  // ---- Contact form: build a mailto link (no backend on GitHub Pages) ----
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var subject = form.subject.value.trim() || "Portfolio contact from " + name;
      var message = form.message.value.trim();

      var body = message + "\n\n— " + name + " (" + email + ")";
      var mailto =
        "mailto:gechcs12@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;
    });
  }
})();
