/* ===== MEIDA LANDING : CONFIGURATION (le seul endroit à modifier) ===== */
var CONFIG = {
  loginUrl: "https://platform.getmeida.com/login",   // adresse de votre plateforme
  email: "contact@meida.dz",                // e-mail de contact
  whatsapp: "",                             // ex. "213550123456" (indicatif sans +). Vide = bouton masqué
  formEndpoint: ""                          // optionnel : URL Formspree / Getform. Vide = ouverture de l'e-mail
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

  /* ---------- i18n (FR par défaut, AR en option) ---------- */
  var AR = {
    skip: "انتقل إلى المحتوى", nav_meida: "ميدا", nav_tour: "نظرة", nav_features: "الميزات", nav_calc: "الحاسبة", nav_offers: "العروض", nav_faq: "أسئلة", login: "تسجيل الدخول", demo: "اطلب عرضًا تجريبيًا",
    hero_eyebrow: "إدارة المطاعم", hero_h1a: "منصة واحدة.", hero_h1b: "من الطلب إلى الصندوق.",
    hero_lead: "ميدا تعوّض التذاكر الورقية والآلات الحاسبة والحسابات التقريبية في نهاية اليوم بنظام بسيط يستعمله كل فريقك.",
    hero_cta1: "ادخل إلى منصتي", hero_cta2: "اطلب عرضًا تجريبيًا", trust1: "بالعربية والفرنسية", trust2: "التركيب والتكوين مشمولان", trust3: "التسعير حسب العرض",
    m_today: "اليوم", m_live: "مباشر", m_sales: "المبيعات", m_orders: "الطلبات", m_avg: "متوسط التذكرة",
    f1: "منصة واحدة لكل الفريق", f2: "لغتان: العربية والفرنسية", f3: "أيام لتكون جاهزًا للعمل", f4: "دقيقة لعرض تجريبي عندك",
    p_eyebrow: "الواقع", p_h2: "ما يؤلم صاحب المحل اليوم", p_lead: "إذا وجدت نفسك في إحدى هذه الجمل، فميدا مصنوعة لك.",
    p1t: "«لا أعرف أرقامي الحقيقية»", p1: "تُحسب المبيعات يدويًا في المساء. تعرفها متأخرًا أو لا تعرفها أبدًا.",
    p2t: "«المال يضيع»", p2: "تذاكر ورقية وأخطاء وطلبات مفقودة. لا إغلاق واضح للصندوق.",
    p3t: "«ساعة الذروة فوضى»", p3: "طلبات تُصرخ أو تُخربش. المطبخ والكونتوار يضيّعان الوقت.",
    p4t: "«قائمتي تبدو قديمة»", p4: "قوائم مطبوعة وأسعار يصعب تغييرها. زبائنك ينتظرون أفضل.",
    a_eyebrow: "ما هي ميدا؟", a_h3: "كل شيء على المائدة.",
    a_p: "ميدا منصة إدارة صُممت للمؤسسات الجزائرية. تجمع في أداة واحدة كل ما تحتاجه للخدمة والتحصيل والمتابعة. اسمها من المائدة، <b>مائدة</b> بالعربية: مكان مفتوح ومشترك وشفاف.",
    c1: "الطلب", c2: "المطبخ", c3: "الخدمة", c4: "الصندوق", c5: "التقارير",
    a_h2: "منصة واحدة لكل فريقك", a_lead: "النادل يأخذ الطلب، المطبخ يراه، الصندوق يُغلق بدقة، وأنت تتابع مبيعات يومك أينما كنت.",
    a_l1: "<b>سهلة الاستعمال.</b> فريقك يفهم الشاشة في دقائق.", a_l2: "<b>مصنوعة للجزائر.</b> العربية والفرنسية والدينار وعاداتنا المحلية.",
    a_l3: "<b>مرافقة مشمولة.</b> نركّب ونكوّن فريقك ونبقى متاحين.", a_l4: "<b>سعر واضح.</b> اشتراك شهري دون رسوم خفية.",
    a_by: "تطوّر ميدا شركة <b>Dzira Technology</b>، شركة تكنولوجية جزائرية.",
    t_eyebrow: "نظرة", t_h2: "اكتشف ميدا في 4 شاشات", t_lead: "اضغط لترى كيف يعمل كل موقع في مؤسستك.",
    tab1: "الصندوق", tab2: "المطبخ", tab3: "قائمة QR", tab4: "التقارير",
    tp1h: "صندوق سريع حتى في ساعة الذروة", tp1p: "المس الأطباق، عدّل، حصّل. عدة طلبات مفتوحة في الوقت نفسه، والتخفيضات والإلغاءات للأشخاص المخوّلين فقط.",
    tp1a: "الطاولات والكونتوار على الشاشة نفسها", tp1b: "طباعة مباشرة للتذاكر (Professional)", tp1c: "فتح وإغلاق الصندوق مع ظهور الفوارق",
    tp2h: "المطبخ يرى كل شيء لحظة بلحظة", tp2p: "كل طلب يصل بحالته. لا أوراق ضائعة ولا أطباق منسية: المطبخ والبار والكونتوار على تناغم.",
    tp2a: "الطلبات مصنّفة حسب الحالة", tp2b: "إرسال منفصل للمطبخ والبار (Professional)", tp2c: "أخطاء أقل وخدمة أسرع",
    tp3h: "قائمة رقمية يحبها زبائنك", tp3p: "رمز QR على الطاولة وقائمة أنيقة بالعربية والفرنسية. تغيّر سعرًا أو طبقًا في ثوانٍ دون إعادة طباعة.",
    tp3a: "العربية والفرنسية حسب اختيار الزبون", tp3b: "الأسعار والأطباق قابلة للتعديل في أي وقت", tp3c: "الزبون يطلب ويتابع طلبه من هاتفه",
    tp4h: "أرقامك كل يوم أينما كنت", tp4p: "المبيعات والطلبات ومتوسط التذكرة. تقرّر بأرقام دقيقة لا بانطباعات آخر السهرة.",
    tp4a: "تقرير مبيعات يومي", tp4b: "لوحة قيادة مباشرة (Professional)", tp4c: "المخزون وتكلفة الوصفات (Professional)",
    fe_eyebrow: "الميزات", fe_h2: "ماذا تفعل ميدا من أجلك", fe_lead: "من أول زبون إلى إغلاق المساء.",
    fe1t: "أخذ الطلبات", fe1: "صندوق سريع للكونتوار والطاولات. عدة طلبات مفتوحة، تخفيضات وإلغاءات بصلاحيات، وتذاكر وسجل للطلبات.",
    fe2t: "إغلاق الصندوق", fe2: "فتح وإغلاق كل خدمة بمجاميع واضحة وفوارق ظاهرة. لا صندوق غامض في المساء.",
    fe3t: "شاشة المطبخ", fe3: "تصل الطلبات إلى المطبخ بحالتها. أخطاء أقل وخدمة أسرع في ساعة الذروة.",
    fe4t: "قائمة رقمية برمز QR", fe4: "قائمة أنيقة بالعربية والفرنسية يفتحها زبائنك من هواتفهم. تغيّر أسعارك في ثوانٍ.",
    fe5t: "تقارير يومية", fe5: "مبيعاتك وطلباتك ومتوسط تذكرتك كل يوم. تقرّر بالأرقام لا بالانطباعات.",
    fe6t: "الصلاحيات والأمان", fe6: "لكل موظف دخوله الخاص. الإجراءات الحساسة محدودة وتترك أثرًا.",
    fe_note: "تضيف خطط Professional وBusiness وEnterprise الإرسال إلى المطبخ والبار والمخزون ولوحة القيادة المباشرة وتعدد الصناديق والطلب عبر الإنترنت وأكثر. انظر العروض أدناه.",
    v_eyebrow: "لمن", v_h2: "لكل مؤسسة تقدّم الخدمة", v_lead: "من مقهى الحي إلى العنوان الراقي.",
    v1t: "مطاعم", v1: "طاولات وخدمات ومطبخ وفاتورة بلا أخطاء.", v2t: "مقاهي", v2: "كونتوار سريع وقائمة QR وصندوق واضح.", v3t: "وجبات سريعة", v3: "أحجام كبيرة وطوابير منسابة ومطبخ متزامن.", v4t: "لاونج", v4: "طاولات ومناطق ومتابعة مبيعات السهرة.",
    ca_eyebrow: "الحاسبة", ca_h2: "كم يكلّفك صندوق غير واضح؟", ca_lead: "أدخل نشاطك. تقدّر الحاسبة المال الذي قد يضيع كل شهر وتقترح عليك الخطة المناسبة.",
    ca_c: "زبائن في اليوم", ca_t: "متوسط التذكرة (دج)", ca_d: "أيام العمل في الشهر", ca_l: "فارق الصندوق المقدَّر (أخطاء ونسيان وضياع)",
    ca_s: "عدد المؤسسات", ca_n: "وما تحتاج إليه", ca_need: "المخزون، لوحة قيادة مباشرة، الإرسال إلى المطبخ والبار، عدة صناديق",
    ca_o1: "المبيعات الشهرية المقدّرة", ca_o2: "المال الذي قد يضيع كل شهر", ca_o3: "الخطة المقترحة", ca_ratio: "حتى فارق صغير يؤثر على هامش ربحك كل شهر.", ca_cta: "اطلب عرضًا لهذه الخطة", ca_disc: "تقدير إرشادي مبني على إجاباتك، وليس وعدًا بنتيجة.",
    s_eyebrow: "البداية", s_h2: "جاهز للعمل في أسبوع", s_lead: "نحن نتكفّل بالتركيب. وأنت تحتفظ بطاقتك لزبائنك.",
    s1t: "تختار خطة", s1: "مستشار يقدّم لك ميدا بعرض تجريبي من 20 دقيقة في مؤسستك.",
    s2t: "نحن نركّب", s2: "ننشئ حسابك بقائمتك وأسعارك وفرقك، ثم نكوّن موظفيك.",
    s3t: "تفتح أول خدمة", s3: "تأخذ طلباتك وتغلق صندوقك مع ميدا. نبقى متاحين الأسبوع الأول.",
    o_eyebrow: "العروض", o_h2: "خطة لكل مؤسسة", o_lead: "تختلف الخطط في ميزاتها وحدودها. يُحدَّد السعر حسب العرض وفق مؤسستك.",
    badge: "للانطلاق", cta_demo: "اطلب عرضًا تجريبيًا", g_cta: "اطلب عرض سعر", opt: "اختياري", nolim: "بلا حدود", d90: "90 يومًا", y1: "سنة",
    e_for: "مؤسسة تريد صندوقًا واضحًا وقائمة QR.", p_for: "مؤسسات نشطة جدًا، خدمة كاملة في القاعة.", b_for: "فرق كبيرة وسلاسل صغيرة.", g_for: "مجموعات وشبكات متعددة المواقع.",
    e_lim: "مؤسسة واحدة · صندوق واحد · 5 موظفين · سجل 90 يومًا", p_lim: "حتى 3 مؤسسات · 3 صناديق · 15 موظفًا · سجل سنة", b_lim: "حتى 10 مؤسسات · 10 صناديق · 40 موظفًا · سجل بلا حدود", g_lim: "مؤسسات وصناديق وموظفون بلا حدود",
    e1: "الصندوق: الطلبات والمدفوعات والتذاكر والسجل", e2: "تخفيضات وإلغاءات بصلاحيات", e3: "فتح وإغلاق الصندوق مع ظهور الفوارق", e4: "شاشة مطبخ بحالة كل طبق", e5: "قائمة QR بالعربية والفرنسية: الزبون يطلب ويتابع طلبه", e6: "QR للطلبات المحمولة في الكونتوار، نداء النادل", e7: "تقرير يومي وتقارير الصندوق ولوحة اليوم عن بُعد",
    inc_e: "كل Essential، زائد:", inc_p: "كل Professional، زائد:", inc_b: "كل Business، زائد:",
    pr1: "إرسال الطلبات حسب المحطة (المطبخ، البار)", pr2: "تعيين النُّدُل على الطاولات وتأكيد طلبات QR", pr3: "لوحة قيادة مباشرة، المبيعات حسب الساعة والموظف", pr4: "المخزون والتنبيهات وتكلفة الوصفات", pr5: "طباعة مباشرة على طابعة حرارية", pr6: "عدة صناديق، تسليم الخدمة، الإشعارات", pr7: "تصدير كامل للبيانات", pr_opt: "اختياري: تخطيط الموظفين، الطلب عبر الإنترنت والتوصيل",
    bu1: "الطلب عبر الإنترنت مع التوصيل", bu2: "تخطيط الموظفين والحضور والعطل والتكوين", bu3: "الاتجاهات وربحية القائمة والتوقعات", bu4: "تقارير مخصصة ومجدولة وتنبيهات الشذوذ", bu5: "الموافقات وسجل تدقيق متقدم", bu6: "تصدير مجدول", bu_opt: "اختياري: مقارنة المؤسسات، تصدير الأجور",
    pg1: "لوحة قيادة موحدة لكل مؤسساتك", pg2: "مقارنة المؤسسات", pg3: "تسجيل الحضور وتصدير الأجور",
    tm1t: "التزام 3 أشهر", tm1: "يبدأ كل اشتراك بـ 3 أشهر على الأقل، لترى النتائج وتكوّن فريقك.",
    tm2t: "السعر حسب العرض", tm2: "يقترح عليك مستشار سعرًا مناسبًا لمؤسستك بعد العرض التجريبي.",
    tm3t: "دفع بسيط", tm3: "تحويل أو بريد الجزائر أو بطاقة أو نقدًا مقابل وصل. دائمًا لميدا ومع فاتورة.",
    cmp: "قارن الخطط بالتفصيل", cmp_f: "الميزة",
    r1: "الصندوق والتذاكر والتخفيضات والإلغاءات بصلاحيات", r2: "فتح وإغلاق الصندوق وتقارير الصندوق", r3: "قائمة QR بالعربية والفرنسية، طلب ومتابعة من الزبون", r4: "QR للطلبات المحمولة، نداء النادل", r5: "شاشة مطبخ بحالة كل طبق", r6: "تقرير يومي ولوحة اليوم عن بُعد", r7: "إرسال حسب المحطة (المطبخ، البار)", r8: "تعيين النُّدُل وتأكيد طلبات QR", r9: "لوحة قيادة مباشرة، المبيعات حسب الساعة والموظف", r10: "المخزون والتنبيهات وتكلفة الوصفات", r11: "طباعة مباشرة على طابعة حرارية", r12: "تصدير كامل للبيانات", r13: "الطلب عبر الإنترنت مع التوصيل", r14: "تخطيط الموظفين والحضور والعطل والتكوين", r15: "الاتجاهات والتوقعات والتقارير المخصصة والمجدولة", r16: "الموافقات وسجل تدقيق متقدم", r17: "مقارنة المؤسسات، تصدير الأجور", r18: "لوحة قيادة موحدة لعدة مؤسسات", r19: "المؤسسات", r20: "الصناديق", r21: "الموظفون", r22: "سجل التقارير",
    o_fine: "التركيب والتكوين مشمولان. التجهيزات (اللوحات والطابعات وأدراج النقود) غير مشمولة ما لم يُذكر خلاف ذلك.",
    q_eyebrow: "أسئلة", q_h2: "أسئلتكم الشائعة",
    q1t: "ما العتاد الذي أحتاجه؟", q1: "لوحة أو حاسوب واتصال بالإنترنت. يُنصح بطابعة تذاكر. نساعدك في اختيار العتاد المناسب لمؤسستك.",
    q2t: "هل سيعرف فريقي استعمالها؟", q2: "صُممت ميدا لتُفهم في دقائق. نكوّن فريقك أثناء التركيب ونبقى متاحين الأسبوع الأول.",
    q3t: "لماذا التزام 3 أشهر؟", q3: "ثلاثة أشهر تترك لفريقك وقتًا ليعتاد ولك لترى الفرق في صندوقك وأرقامك. لا نبيع اشتراكًا لشهر واحد.",
    q4t: "كيف أدفع؟", q4: "بتحويل أو بريد الجزائر أو بطاقة أو نقدًا مقابل وصل. الدفع دائمًا لميدا وليس لوسيط، وتتلقى فاتورة.",
    q5t: "هل أستطيع تغيير الخطة لاحقًا؟", q5: "نعم. يمكنك الانتقال إلى خطة أعلى في أي وقت. ينطبق السعر الجديد عند الاستحقاق القادم.",
    q6t: "وبياناتي؟", q6: "بياناتك ملكك. نحميها ولا نستعملها إلا لتشغيل ميدا، ويمكنك تصديرها.",
    q7t: "أنا زبون بالفعل: أين أسجّل الدخول؟", q7: "استعمل زر «تسجيل الدخول» أعلى الصفحة للدخول إلى منصتك.",
    ct_h2: "مستعد لتضع كل شيء على المائدة؟", ct_p: "اطلب عرضًا تجريبيًا من 20 دقيقة في مؤسستك. نرد عليك بسرعة.", ct_mail: "البريد الإلكتروني", ct_login: "زبون بالفعل؟ سجّل الدخول",
    fm_name: "اسمك", fm_phone: "الهاتف", fm_venue: "اسم المؤسسة", fm_type: "النوع", fm_city: "المدينة", fm_plan: "الخطة المطلوبة", fm_msg: "رسالة (اختياري)", other: "أخرى", notsure: "لا أعرف بعد",
    fm_send: "أرسل طلبي", fm_wa: "أرسل عبر واتساب", ft: "© 2026 Dzira Technology. جميع الحقوق محفوظة."
  };
  var T = {
    fr: { cur: "DA", lbl: "العربية", sales: "ventes", ord: "commandes",
      errReq: "Merci de renseigner votre nom, votre établissement et un numéro de téléphone valide.", ok: "Votre message est prêt dans votre messagerie. Si rien ne s'ouvre, écrivez-nous à {m}.", sent: "Merci ! Votre demande est envoyée. Nous vous rappelons rapidement.", fail: "L'envoi automatique a échoué. Nous ouvrons votre messagerie à la place." },
    ar: { cur: "دج", lbl: "Français", sales: "مبيعات", ord: "طلبات",
      errReq: "يرجى إدخال اسمك ومؤسستك ورقم هاتف صحيح.", ok: "رسالتك جاهزة في تطبيق البريد. إن لم يُفتح شيء فراسلنا على {m}.", sent: "شكرًا! تم إرسال طلبك. سنتصل بك قريبًا.", fail: "فشل الإرسال التلقائي. سنفتح تطبيق البريد بدلًا من ذلك." }
  };
  var lang = "fr";
  var nodes = $$("[data-i18n]");
  nodes.forEach(function (n) { n._fr = n.innerHTML; });
  function setLang(l, save) {
    lang = l;
    document.documentElement.lang = l; document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    nodes.forEach(function (n) { var k = n.getAttribute("data-i18n"); n.innerHTML = (l === "ar" && AR[k] != null) ? AR[k] : n._fr; });
    $$("[data-lang-label]").forEach(function (e) { e.textContent = T[l].lbl; });
    var t = l === "ar" ? "ميدا | منصة إدارة المطاعم والمقاهي والوجبات السريعة" : "Meida | La plateforme de gestion pour restaurants, cafés et fast-foods";
    document.title = t;
    var d = $('meta[name="description"]'); if (d) d.content = l === "ar" ? "ميدا تجمع الصندوق والمطبخ وقائمة QR والتقارير في منصة واحدة. من الطلب إلى الصندوق، للمطاعم والمقاهي والوجبات السريعة في الجزائر." : "Meida réunit caisse, cuisine, menu QR et rapports dans une seule plateforme. De la commande à la caisse, pour les restaurants, cafés, fast-foods et lounges en Algérie.";
    renderCalc(); renderOrders(true);
    if (save) store.set("meida_lang", l);
  }
  var langBtn = $("#lang");
  if (langBtn) langBtn.addEventListener("click", function () { setLang(lang === "fr" ? "ar" : "fr", true); });

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
  var q = /[?&]lang=(ar|fr)/.exec(location.search), saved = (q && q[1]) || store.get("meida_lang");
  renderCalc(); renderOrders(true);
  if (saved === "ar") setLang("ar", false);
})();
