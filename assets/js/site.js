/*
 * Shared shell: helpers, theme toggle, print, keyboard shortcuts and site-wide search.
 * Exposes window.ASH for the page and practice scripts.
 */
(function () {
    "use strict";

    var D = window.STUDY_DATA;
    var ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

    /* ---------- helpers ---------- */

    function esc(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function en(text, cls) {
        return '<span class="en' + (cls ? " " + cls : "") + '" lang="en" dir="ltr">' + esc(text) + "</span>";
    }

    function toArabicDigits(value) {
        return String(value).replace(/[0-9]/g, function (d) { return ARABIC_DIGITS[d]; });
    }

    function toLatinDigits(value) {
        return String(value)
            .replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); })
            .replace(/[۰-۹]/g, function (d) { return String(d.charCodeAt(0) - 0x06f0); });
    }

    // Loose Arabic matching: ignore tashkeel/tatweel, unify alif, ya and ta marbuta forms.
    function normalize(value) {
        return toLatinDigits(String(value || ""))
            .toLowerCase()
            .replace(/[ً-ٰٟـ]/g, "")
            .replace(/[أإآٱ]/g, "ا")
            .replace(/ى/g, "ي")
            .replace(/ة/g, "ه")
            .replace(/ؤ/g, "و")
            .replace(/ئ/g, "ي")
            .replace(/["'()«»،,.:؛]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function shuffle(list) {
        var copy = list.slice();
        for (var i = copy.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = copy[i];
            copy[i] = copy[j];
            copy[j] = tmp;
        }
        return copy;
    }

    var store = {
        get: function (key) {
            try { return window.localStorage.getItem(key); } catch (e) { return null; }
        },
        set: function (key, value) {
            try { window.localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
        }
    };

    function letter(value) {
        return value === "ه" ? "هـ" : value;
    }

    function lines(value) {
        return (Array.isArray(value) ? value : [value]).map(esc).join("<br>");
    }

    function numberRowFor(n) {
        if (!isFinite(n) || n < 1) return null;
        var rows = D.numbers.rows;
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i];
            if (r.hundreds) {
                if (n >= 100 && n <= 900 && n % 100 === 0) return r;
            } else if (n >= r.min && n <= r.max) {
                return r;
            }
        }
        return null;
    }

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function flashTarget(id) {
        if (!id) return;
        var el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        el.classList.remove("is-target");
        void el.offsetWidth;
        el.classList.add("is-target");
        document.dispatchEvent(new CustomEvent("ash:target", { detail: { id: id, el: el } }));
    }

    var icons = {
        search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
        sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
        moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.1A8.5 8.5 0 1 1 9.9 3.5a7 7 0 0 0 10.6 10.6z"/></svg>',
        print: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V3h10v6"/><rect x="7" y="14" width="10" height="7" rx="1"/><path d="M7 18H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/></svg>',
        arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
        check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
        x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
        retry: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
        eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
        eyeOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A9.9 9.9 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4"/><path d="M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.6 9.6 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>',
        cards: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/></svg>',
        target: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>'
    };

    /* ---------- theme ---------- */

    function currentTheme() {
        var set = document.documentElement.getAttribute("data-theme");
        if (set === "light" || set === "dark") return set;
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function paintThemeButtons() {
        var dark = currentTheme() === "dark";
        document.querySelectorAll('[data-action="theme"]').forEach(function (btn) {
            btn.innerHTML = dark ? icons.sun : icons.moon;
            btn.setAttribute("aria-label", dark ? "الوضع الفاتح · Light mode" : "الوضع الداكن · Dark mode");
            btn.setAttribute("title", dark ? "Light mode" : "Dark mode");
        });
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", dark ? "#0e1316" : "#f6f4ee");
    }

    function toggleTheme() {
        var next = currentTheme() === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        store.set("ash-theme", next);
        paintThemeButtons();
    }

    /* ---------- search index ---------- */

    var index = null;

    function topicById(id) {
        return D.topics.filter(function (t) { return t.id === id; })[0];
    }

    function buildIndex() {
        var out = [];
        function add(topic, anchor, title, sub, text) {
            var t = topicById(topic);
            out.push({
                topic: topic,
                topicAr: t.ar,
                href: t.href + (anchor ? "#" + anchor : ""),
                title: title,
                sub: sub || "",
                hay: normalize(title + " " + (sub || "") + " " + (text || "") + " " + t.ar + " " + t.en),
                titleHay: normalize(title)
            });
        }

        D.topics.forEach(function (t) {
            out.push({
                topic: t.id, topicAr: t.ar, href: t.href, title: t.ar, sub: t.en + " — " + t.descEn,
                hay: normalize(t.ar + " " + t.en + " " + t.desc + " " + t.descEn), titleHay: normalize(t.ar), page: true
            });
        });

        var cols = D.numbers.columns;
        D.numbers.rows.forEach(function (r) {
            var parts = cols.map(function (c) { return c.ar + ": " + r[c.key].join("، "); });
            add("numbers", r.id, "العدد " + r.label, parts.join(" · "), toLatinDigits(r.label));
        });
        D.numbers.notes.forEach(function (n) {
            var body = (n.paragraphs || []).join(" ") + " " + (n.english || "") + " " +
                (n.items || []).map(function (i) { return i.term + " " + i.text; }).join(" ");
            add("numbers", n.id, n.title, n.titleEn, body);
        });

        D.nahw.groups.forEach(function (g) {
            add("nahw", g.id, g.ar, g.en, "");
            g.rows.forEach(function (r) {
                var parts = D.nahw.cases.map(function (c) { return c.ar + ": " + r[c.key].mark; });
                var examples = D.nahw.cases.map(function (c) { return r[c.key].ex; }).join(" ");
                add("nahw", r.id, r.type, parts.join(" · "), r.sample + " " + (r.sampleEn || "") + " " + examples + " " + g.ar);
            });
        });

        D.makharij.areas.forEach(function (a) {
            add("makharij", "area-" + a.id, a.ar, a.translit + " — " + a.en, a.description +
                (a.details || []).map(function (d) { return " " + d.name + " " + d.position; }).join(""));
            a.letters.forEach(function (l, i) {
                add("makharij", "mk-" + a.id + "-" + i, "حرف " + l.letter + (l.variant ? " (" + l.variant + ")" : ""),
                    a.ar + " · " + l.description, l.letter + " " + a.translit + " " + a.en);
            });
        });

        D.radaah.cycles.forEach(function (c) {
            c.examples.forEach(function (ex) {
                var names = ex.nodes.map(function (n) { return n.label + (n.tag ? " " + n.tag : ""); }).join("، ");
                add("radaah", ex.id, c.title + " · " + ex.title, names, c.titleEn);
            });
        });
        return out;
    }

    function search(query) {
        index = index || buildIndex();
        var q = normalize(query);
        if (!q) return [];
        var tokens = q.split(" ");
        var results = [];

        // A plain number jumps straight to the rule that governs it.
        var asNumber = /^\d+$/.test(q) ? parseInt(q, 10) : NaN;
        var numberRow = numberRowFor(asNumber);

        index.forEach(function (item) {
            item.words = item.words || item.hay.split(" ");
            item.titleWords = item.titleWords || item.titleHay.split(" ");
            // Single letters only match whole words, so "ق" finds the letter, not every word containing ق.
            var ok = tokens.every(function (t) {
                return t.length === 1 ? item.words.indexOf(t) !== -1 : item.hay.indexOf(t) !== -1;
            });
            if (!ok) return;
            var score = 0;
            if (item.titleHay === q) score += 100;
            else if (item.titleHay.indexOf(q) === 0) score += 60;
            else if (item.titleHay.indexOf(q) !== -1) score += 40;
            tokens.forEach(function (t) { if (item.titleWords.indexOf(t) !== -1) score += 30; });
            if (item.page) score += 15;
            results.push({ item: item, score: score });
        });

        if (numberRow) {
            var hit = index.filter(function (i) { return i.href === "numbers.html#" + numberRow.id; })[0];
            results = results.filter(function (r) { return r.item !== hit; });
            results.unshift({ item: hit, score: 1000, why: "القاعدة التي تشمل العدد " + toArabicDigits(asNumber) });
        }

        results.sort(function (a, b) { return b.score - a.score; });
        return results.slice(0, 24);
    }

    /* ---------- search dialog ---------- */

    var dialog, input, list, active = -1, current = [];

    function highlight(text, query) {
        var safe = esc(text);
        var q = String(query || "").trim();
        if (!q || /[ً-ٟ]/.test(text)) return safe;
        var i = text.indexOf(q);
        if (i === -1) return safe;
        return esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + q.length)) + "</mark>" + esc(text.slice(i + q.length));
    }

    function renderResults() {
        var q = input.value;
        current = search(q);
        active = current.length ? 0 : -1;
        if (!q.trim()) {
            list.innerHTML = '<li class="search-empty">' +
                '<p>جرّب: <button type="button" data-q="١٥">١٥</button> <button type="button" data-q="كسرة">كسرة</button> ' +
                '<button type="button" data-q="ق">ق</button> <button type="button" data-q="المثنى">المثنى</button> ' +
                '<button type="button" data-q="الخيشوم">الخيشوم</button></p>' +
                en("Search every page. Type a number to find its rule, a letter to find its makhraj.") + "</li>";
            return;
        }
        if (!current.length) {
            list.innerHTML = '<li class="search-empty"><p>لا توجد نتائج لـ «' + esc(q) + '»</p>' + en("No results") + "</li>";
            return;
        }
        list.innerHTML = current.map(function (r, i) {
            var it = r.item;
            return '<li role="option" id="sr-' + i + '" aria-selected="' + (i === active) + '">' +
                '<a href="' + esc(it.href) + '" data-i="' + i + '">' +
                '<span class="sr-topic t-' + esc(it.topic) + '">' + esc(it.topicAr) + "</span>" +
                '<span class="sr-body"><span class="sr-title">' + highlight(it.title, q) + "</span>" +
                (r.why ? '<span class="sr-why">' + esc(r.why) + "</span>" : "") +
                '<span class="sr-sub">' + highlight(it.sub, q) + "</span></span>" +
                '<span class="sr-go">' + icons.arrow + "</span></a></li>";
        }).join("");
        input.setAttribute("aria-activedescendant", "sr-0");
    }

    function moveActive(delta) {
        if (!current.length) return;
        active = (active + delta + current.length) % current.length;
        list.querySelectorAll("[role=option]").forEach(function (li, i) {
            li.setAttribute("aria-selected", String(i === active));
            if (i === active) li.scrollIntoView({ block: "nearest" });
        });
        input.setAttribute("aria-activedescendant", "sr-" + active);
    }

    function go(href) {
        var parts = href.split("#");
        var page = parts[0];
        var here = location.pathname.split("/").pop() || "index.html";
        closeSearch();
        if (page === here && parts[1]) {
            history.replaceState(null, "", "#" + parts[1]);
            flashTarget(parts[1]);
        } else {
            location.href = href;
        }
    }

    function buildDialog() {
        dialog = document.createElement("dialog");
        dialog.className = "search-dialog";
        dialog.setAttribute("aria-label", "بحث · Search");
        dialog.innerHTML =
            '<form method="dialog" class="search-box" role="search">' +
            icons.search +
            '<input type="search" autocomplete="off" spellcheck="false" enterkeyhint="go" ' +
            'placeholder="ابحث في كل الملخصات…" aria-label="Search all notes" aria-controls="search-results" role="combobox" aria-expanded="true">' +
            '<button type="button" class="search-close" data-close>Esc</button></form>' +
            '<ul class="search-results" id="search-results" role="listbox"></ul>' +
            '<div class="search-foot">' + en("↑ ↓ to move · Enter to open · Esc to close") + "</div>";
        document.body.appendChild(dialog);
        input = dialog.querySelector("input");
        list = dialog.querySelector(".search-results");

        input.addEventListener("input", renderResults);
        input.addEventListener("keydown", function (e) {
            if (e.key === "ArrowDown") { e.preventDefault(); moveActive(1); }
            else if (e.key === "ArrowUp") { e.preventDefault(); moveActive(-1); }
            else if (e.key === "Enter") {
                e.preventDefault();
                if (active >= 0 && current[active]) go(current[active].item.href);
            }
        });
        list.addEventListener("click", function (e) {
            var chip = e.target.closest("[data-q]");
            if (chip) {
                input.value = chip.getAttribute("data-q");
                renderResults();
                input.focus();
                return;
            }
            var link = e.target.closest("a[data-i]");
            if (link && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                go(link.getAttribute("href"));
            }
        });
        dialog.addEventListener("click", function (e) {
            if (e.target === dialog || e.target.closest("[data-close]")) closeSearch();
        });
    }

    function openSearch(prefill) {
        if (!dialog) buildDialog();
        if (typeof prefill === "string") input.value = prefill;
        renderResults();
        if (!dialog.open) {
            if (dialog.showModal) dialog.showModal(); else dialog.setAttribute("open", "");
        }
        input.focus();
        input.select();
    }

    function closeSearch() {
        if (dialog && dialog.open) {
            if (dialog.close) dialog.close(); else dialog.removeAttribute("open");
        }
    }

    /* ---------- wiring ---------- */

    function isTyping(el) {
        return el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
    }

    document.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-action]");
        if (!btn) return;
        var action = btn.getAttribute("data-action");
        if (action === "theme") toggleTheme();
        else if (action === "search") openSearch();
        else if (action === "print") window.print();
    });

    document.addEventListener("keydown", function (e) {
        if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            openSearch();
        } else if (e.key === "/" && !isTyping(document.activeElement) && !(dialog && dialog.open)) {
            e.preventDefault();
            openSearch();
        }
    });

    // Details elements open for printing, then go back to how the reader left them.
    window.addEventListener("beforeprint", function () {
        document.querySelectorAll("details:not([open])").forEach(function (d) {
            d.setAttribute("open", "");
            d.setAttribute("data-print-opened", "");
        });
    });
    window.addEventListener("afterprint", function () {
        document.querySelectorAll("details[data-print-opened]").forEach(function (d) {
            d.removeAttribute("open");
            d.removeAttribute("data-print-opened");
        });
    });

    if (window.matchMedia) {
        var mq = window.matchMedia("(prefers-color-scheme: dark)");
        if (mq.addEventListener) mq.addEventListener("change", paintThemeButtons);
    }

    document.addEventListener("DOMContentLoaded", function () {
        paintThemeButtons();
        var y = document.querySelector("[data-year]");
        if (y) y.textContent = toArabicDigits(new Date().getFullYear());
    });

    window.ASH = {
        data: D,
        esc: esc,
        en: en,
        lines: lines,
        letter: letter,
        icons: icons,
        store: store,
        shuffle: shuffle,
        normalize: normalize,
        toArabicDigits: toArabicDigits,
        toLatinDigits: toLatinDigits,
        numberRowFor: numberRowFor,
        flashTarget: flashTarget,
        openSearch: openSearch,
        reduceMotion: reduceMotion
    };
})();
