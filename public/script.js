/* ===== MEIDA LANDING : CONFIGURATION (le seul endroit à modifier) ===== */
var CONFIG = {
  loginUrl: "https://platform.getmeida.com/login",   // adresse de votre plateforme
  email: "contact@getmeida.com",            // e-mail de contact
  whatsapp: "",                             // ex. "213550123456" (indicatif sans +). Vide = bouton masqué
  formEndpoint: "https://platform.getmeida.com/leads" // demandes enregistrées dans Meida (admin > Prospects). Vide = ouverture de l'e-mail
};
/* ===================================================================== */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var fmt = function (n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); };

  /* ---------- config wiring ---------- */
  $$("[data-login]").forEach(function (a) { a.href = CONFIG.loginUrl; });
  $$("[data-mail]").forEach(function (a) { a.href = "mailto:" + CONFIG.email; a.textContent = CONFIG.email; });
  var waNum = (CONFIG.whatsapp || "").replace(/\D/g, "");
  $$("[data-wa]").forEach(function (a) { a.href = "https://wa.me/" + waNum; a.textContent = "+" + waNum; });
  if (!waNum) { $$(".wa-li").forEach(function (e) { e.hidden = true; }); var wb = $("#f-wa"); if (wb) wb.hidden = true; }

  /* ---------- i18n ----------
     French is /, Arabic is /ar/ (built from i18n/ar.json by build.mjs).
     The page language comes from <html lang>; the switch is a plain link. */
  var T = {
    fr: { cur: "DA", sales: "ventes", ord: "commandes",
      errReq: "Merci de renseigner votre nom, votre établissement et un numéro de téléphone valide.", ok: "Votre message est prêt dans votre messagerie. Si rien ne s'ouvre, écrivez-nous à {m}.", sent: "Merci ! Votre demande est envoyée. Nous vous rappelons rapidement.", fail: "L'envoi automatique a échoué. Nous ouvrons votre messagerie à la place." },
    ar: { cur: "دج", sales: "مبيعات", ord: "طلبات",
      errReq: "يرجى إدخال اسمك ومؤسستك ورقم هاتف صحيح.", ok: "رسالتك جاهزة في تطبيق البريد. إن لم يُفتح شيء فراسلنا على {m}.", sent: "شكرًا! تم إرسال طلبك. سنتصل بك قريبًا.", fail: "فشل الإرسال التلقائي. سنفتح تطبيق البريد بدلًا من ذلك." }
  };
  var lang = document.documentElement.lang === "ar" ? "ar" : "fr";
  var langLink = $("#lang");
  if (langLink) langLink.addEventListener("click", function () { store.set("meida_lang", lang === "fr" ? "ar" : "fr"); });

  /* ---------- nav ---------- */
  var nav = $("#nav"), prog = $("#progress"), totop = $("#totop"), mbar = $("#mbar"), contact = $("#contact");
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle("stuck", y > 10);
    prog.style.width = (h > 0 ? y / h * 100 : 0) + "%";
    totop.classList.toggle("show", y > 800);
    var cr = contact.getBoundingClientRect();
    mbar.classList.toggle("show", y > 700 && !(cr.top < innerHeight * .7 && cr.bottom > 0));
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  totop.addEventListener("click", function () { scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
  $$(".menu a").forEach(function (a) { a.addEventListener("click", function () { $("#nav-toggle").checked = false; }); });
  if ("IntersectionObserver" in window) {
    var links = {}; $$(".menu a[href^='#']").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var so = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { $$(".menu a.act").forEach(function (a) { a.classList.remove("act"); }); if (links[e.target.id]) links[e.target.id].classList.add("act"); } }); }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s); });
  }

  /* ---------- reveal + counters ---------- */
  var rv = $$(".reveal");
  rv.forEach(function (el, i) { el.style.setProperty("--d", ((i % 4) * 0.07) + "s"); });
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
    rv.forEach(function (el) { io.observe(el); });
    var co = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; co.unobserve(e.target); var to = +e.target.dataset.to, t0 = performance.now(); (function f(t) { var p = Math.min(1, (t - t0) / 1100); e.target.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t0); }); }, { threshold: .6 });
    $$(".count").forEach(function (c) { c.textContent = "0"; co.observe(c); });
  } else { rv.forEach(function (el) { el.classList.add("in"); }); }

  /* ---------- hero live ticker ---------- */
  var sales = 84500, orders = 63;
  var ORD = {
    fr: { nw: "NOUVELLE", wt: "EN CUISINE", ok: "SERVIE", items: ["2 plats, 1 boisson", "3 articles", "4 articles", "1 pizza, 2 cafés", "2 burgers", "1 tajine, 1 salade"], tbl: "Table", cnt: "Comptoir" },
    ar: { nw: "جديد", wt: "في المطبخ", ok: "تم التقديم", items: ["طبقان ومشروب", "3 أصناف", "4 أصناف", "بيتزا وقهوتان", "برغران", "طاجين وسلطة"], tbl: "طاولة", cnt: "كونتوار" }
  };
  var list = [{ t: 4, i: 0, s: "nw" }, { t: 0, i: 1, s: "wt" }, { t: 7, i: 2, s: "ok" }];
  function renderOrders(force) {
    var box = $("#orders"); if (!box) return; var L = ORD[lang];
    box.innerHTML = list.map(function (o, idx) {
      var cls = { nw: "new", wt: "wait", ok: "ok" }[o.s];
      return '<div class="o' + (idx === 0 && !force ? " in" : "") + '"><span>' + (o.t ? L.tbl + " " + o.t : L.cnt) + " · " + L.items[o.i] + "</span><em class=\"" + cls + '">' + L[o.s] + "</em></div>";
    }).join("");
    $("#k-sales").textContent = fmt(sales); $("#k-orders").textContent = orders; $("#k-avg").textContent = fmt(sales / orders);
  }
  if (!reduce) {
    setInterval(function () {
      if (document.hidden) return;
      sales += Math.round((600 + Math.random() * 1700) / 50) * 50; orders++;
      list.unshift({ t: Math.random() > .35 ? 1 + Math.floor(Math.random() * 12) : 0, i: Math.floor(Math.random() * 6), s: "nw" });
      list.pop(); list[1].s = "wt"; list[2].s = "ok"; renderOrders();
    }, 3600);
  }

  /* ---------- product tour tabs ---------- */
  var tabs = $$("[role=tab]");
  function selTab(t, focus) {
    tabs.forEach(function (x) { var on = x === t; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; $("#" + x.getAttribute("aria-controls")).hidden = !on; });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selTab(t); });
    t.addEventListener("keydown", function (e) {
      var d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (document.dir === "rtl" || document.documentElement.dir === "rtl") d = d ? -d : d;
      if (d) { e.preventDefault(); selTab(tabs[(i + d + tabs.length) % tabs.length], true); }
      if (e.key === "Home") { e.preventDefault(); selTab(tabs[0], true); }
      if (e.key === "End") { e.preventDefault(); selTab(tabs[tabs.length - 1], true); }
    });
  });
  // decorative QR-style pattern (illustration only)
  (function () {
    var p = $("#qrp"); if (!p) return; var n = 29, s = 7, d = "", f = function (x, y) { return (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9); };
    function fin(ox, oy) { for (var y = 0; y < 7; y++) for (var x = 0; x < 7; x++) { var edge = x === 0 || y === 0 || x === 6 || y === 6, core = x >= 2 && x <= 4 && y >= 2 && y <= 4; if (edge || core) d += "M" + (ox + x) + " " + (oy + y) + "h1v1h-1z"; } }
    fin(0, 0); fin(n - 7, 0); fin(0, n - 7);
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) { if (f(x, y)) continue; s = (s * 1103515245 + 12345) & 0x7fffffff; if ((s >> 16) % 100 < 46) d += "M" + x + " " + y + "h1v1h-1z"; }
    p.setAttribute("d", d);
  })();

  /* ---------- plan pick -> form ---------- */
  var fPlan = $("#f-plan");
  $$("[data-pick]").forEach(function (a) { a.addEventListener("click", function () { if (fPlan) fPlan.value = a.dataset.pick; }); });

  /* ---------- calculator ---------- */
  var ci = { covers: $("#i-covers"), ticket: $("#i-ticket"), days: $("#i-days"), leak: $("#i-leak") };
  var planNow = "Essential";
  function renderCalc() {
    if (!ci.covers) return;
    Object.keys(ci).forEach(function (k) { var el = ci[k], p = (el.value - el.min) / (el.max - el.min) * 100; el.style.setProperty("--p", p + "%"); });
    var c = +ci.covers.value, t = +ci.ticket.value, d = +ci.days.value, lk = +ci.leak.value, cur = T[lang].cur;
    var rev = c * t * d, leak = rev * lk / 100;
    var sites = +($("input[name=sites]:checked") || { value: 1 }).value, need = $("#i-need").checked;
    // venue limits per plan: Essential 1, Professional 3, Business 10, Enterprise unlimited
    planNow = sites > 10 ? "Enterprise" : sites >= 4 ? "Business" : (sites >= 2 || need || c > 350) ? "Professional" : "Essential";
    $("#o-covers").textContent = c; $("#o-ticket").textContent = fmt(t) + " " + cur; $("#o-days").textContent = d; $("#o-leak").textContent = String(lk).replace(".", lang === "ar" ? "٫" : ",") + " %";
    $("#r-rev").textContent = fmt(rev) + " " + cur; $("#r-leak").textContent = fmt(leak) + " " + cur;
    $("#r-plan").textContent = planNow;
  }
  $("#calc").addEventListener("submit", function (e) { e.preventDefault(); });
  $$("#calc input").forEach(function (i) { i.addEventListener("input", renderCalc); i.addEventListener("change", renderCalc); });
  var rcta = $("#r-cta"); if (rcta) rcta.addEventListener("click", function () { if (fPlan) fPlan.value = planNow; });

  /* ---------- lead form ---------- */
  var form = $("#lead");
  function collect() {
    var f = new FormData(form), o = {}; f.forEach(function (v, k) { o[k] = String(v).trim(); }); return o;
  }
  function text(o) {
    return "Demande Meida\n\nNom : " + o.name + "\nTéléphone : " + o.phone + "\nÉtablissement : " + o.venue + " (" + o.type + ")\nVille : " + o.city + "\nPlan : " + o.plan + (o.msg ? "\nMessage : " + o.msg : "") + "\n\nSource : " + location.href;
  }
  function valid(o) {
    var bad = [];
    if (o.name.length < 2) bad.push("name"); if (o.venue.length < 2) bad.push("venue"); if (o.phone.replace(/\D/g, "").length < 8) bad.push("phone");
    $$("input,select,textarea", form).forEach(function (el) { el.classList.toggle("bad", bad.indexOf(el.name) > -1); });
    return bad.length === 0;
  }
  var err = $("#f-err"), okm = $("#f-ok");
  function show(el, msg) { err.hidden = true; okm.hidden = true; el.textContent = msg; el.hidden = false; }
  function mailto(o) { location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent("Meida – Demande de démo (" + o.plan + ")") + "&body=" + encodeURIComponent(text(o)); show(okm, T[lang].ok.replace("{m}", CONFIG.email)); }
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); var o = collect();
      if (o.website) return; // anti-bot honeypot
      if (!valid(o)) { show(err, T[lang].errReq); return; }
      if (CONFIG.formEndpoint) {
        fetch(CONFIG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(o) })
          .then(function (r) { if (!r.ok) throw 0; form.reset(); show(okm, T[lang].sent); })
          .catch(function () { show(err, T[lang].fail); setTimeout(function () { mailto(o); }, 900); });
      } else mailto(o);
    });
    var wa = $("#f-wa");
    if (wa) wa.addEventListener("click", function () { var o = collect(); if (!valid(o)) { show(err, T[lang].errReq); return; } window.open("https://wa.me/" + waNum + "?text=" + encodeURIComponent(text(o)), "_blank", "noopener"); });
  }

  /* ---------- init ---------- */
  renderCalc(); renderOrders(true);
  // a visitor who chose Arabic before lands on /ar/ next time
  if (lang === "fr" && store.get("meida_lang") === "ar") location.replace("/ar/" + location.hash);
})();
