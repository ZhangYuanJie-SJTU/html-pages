/* 《微弱信号检测》教学网页 · 交互脚本 */
(function () {
  "use strict";

  /* ---------- 1. 公式渲染 ---------- */
  function renderMath() {
    if (!window.renderMathInElement) return;
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
      throwOnError: false,
      strict: false
    });
  }

  /* ---------- 2. 阅读进度 ---------- */
  function progress() {
    var bar = document.querySelector(".progress");
    if (!bar) return;
    function upd() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = p.toFixed(2) + "%";
    }
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    upd();
  }

  /* ---------- 3. 目录高亮 ---------- */
  function tocHighlight() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var targets = Object.keys(map).map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if (!targets.length) return;

    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var current = null;
      targets.forEach(function (t) { if (visible[t.id] && !current) current = t.id; });
      links.forEach(function (a) { a.classList.remove("active"); });
      if (current && map[current]) {
        map[current].classList.add("active");
        var side = document.querySelector(".side");
        if (side && window.innerWidth > 980) {
          var r = map[current].getBoundingClientRect();
          if (r.top < 80 || r.bottom > window.innerHeight - 40) {
            map[current].scrollIntoView({ block: "nearest" });
          }
        }
      }
    }, { rootMargin: "-10% 0px -70% 0px", threshold: 0 });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- 4. 移动端侧栏 ---------- */
  function mobileNav() {
    var btn = document.querySelector(".menu-btn");
    var side = document.querySelector(".side");
    if (!btn || !side) return;
    btn.addEventListener("click", function () { side.classList.toggle("open"); });
    side.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && window.innerWidth <= 980) side.classList.remove("open");
    });
  }

  /* ---------- 5. 噪声计算器 ---------- */
  function calculator() {
    var box = document.getElementById("calc");
    if (!box) return;
    var R = document.getElementById("in-R");
    var T = document.getElementById("in-T");
    var B = document.getElementById("in-B");
    var I = document.getElementById("in-I");
    var outV = document.getElementById("out-vn");
    var outI = document.getElementById("out-in");
    var outS = document.getElementById("out-sn");

    var k = 1.380649e-23;   // J/K
    var q = 1.602176634e-19; // C

    function fmt(x, unit, suffix) {
      if (!isFinite(x) || x <= 0) return "—";
      var pre = { "-15": "f", "-12": "p", "-9": "n", "-6": "µ", "-3": "m", "0": "", "3": "k", "6": "M", "9": "G" };
      var e3 = Math.floor(Math.log10(x) / 3) * 3;
      var m = x / Math.pow(10, e3);
      while (m >= 1000 && pre[String(e3 + 3)] !== undefined) { m /= 1000; e3 += 3; }
      while (m < 1 && pre[String(e3 - 3)] !== undefined) { m *= 1000; e3 -= 3; }
      var p = pre[String(e3)];
      if (p === undefined) {
        var e = Math.floor(Math.log10(x));
        return (x / Math.pow(10, e)).toFixed(2) + "×10^" + e + " " + unit + (suffix || "");
      }
      return m.toFixed(2) + " " + p + unit + (suffix || "");
    }

    function run() {
      var r = parseFloat(R.value) * 1e3;   // kΩ → Ω
      var t = parseFloat(T.value);
      var b = parseFloat(B.value);
      var i = parseFloat(I.value) * 1e-9;  // nA → A
      if (!(r > 0) || !(t > 0) || !(b > 0)) {
        outV.textContent = "—"; outI.textContent = "—"; outS.textContent = "—";
        return;
      }
      var vn2 = 4 * k * t * r * b;
      var in2 = 2 * q * (i > 0 ? i : 0) * b;
      var vn = Math.sqrt(vn2);
      var inn = Math.sqrt(in2);
      outV.textContent = fmt(vn, "V", " rms");
      outI.textContent = fmt(inn, "A", " rms");
      outS.textContent = fmt(Math.sqrt(4 * k * t * r), "V", "/√Hz");
    }

    [R, T, B, I].forEach(function (el) {
      el.addEventListener("input", run);
      el.addEventListener("change", run);
    });
    run();
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderMath();
    progress();
    tocHighlight();
    mobileNav();
    calculator();
  });
})();
