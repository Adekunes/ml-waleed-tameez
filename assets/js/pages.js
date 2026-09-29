/*
 * Page renderers. Each page sets <html data-page="..."> and gets its content from STUDY_DATA.
 */
(function () {
    "use strict";

    var A = window.ASH;
    var D = A.data;
    var esc = A.esc, en = A.en, lines = A.lines, icons = A.icons, letter = A.letter;

    function $(sel, root) { return (root || document).querySelector(sel); }

    /* ---------- shared: cover (self-test) mode for tables ---------- */

    function coverToggle(label) {
        return '<button type="button" class="btn btn-toggle" data-cover-toggle aria-pressed="false">' +
            icons.eyeOff + "<span>" + esc(label || "وضع المراجعة") + "</span>" + en("Cover answers") + "</button>";
    }

    function wireCover(scope) {
        var btn = $("[data-cover-toggle]", scope);
        if (!btn) return;
        function set(on) {
            btn.setAttribute("aria-pressed", String(on));
            btn.innerHTML = (on ? icons.eye : icons.eyeOff) + "<span>" + (on ? "إظهار الكل" : "وضع المراجعة") + "</span>" +
                en(on ? "Reveal all" : "Cover answers");
            scope.querySelectorAll("[data-coverable]").forEach(function (t) {
                t.classList.toggle("is-covered", on);
                t.querySelectorAll(".cover").forEach(function (c) {
                    c.classList.remove("is-revealed");
                    if (on) {
                        c.setAttribute("tabindex", "0");
                        c.setAttribute("role", "button");
                        c.setAttribute("aria-label", "إظهار · Reveal");
                    } else {
                        c.removeAttribute("tabindex");
                        c.removeAttribute("role");
                        c.removeAttribute("aria-label");
                    }
                });
            });
        }
        set(false);
        btn.addEventListener("click", function () { set(btn.getAttribute("aria-pressed") !== "true"); });
        function reveal(e) {
            var c = e.target.closest(".is-covered .cover");
            if (!c) return;
            if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            c.classList.add("is-revealed");
            c.removeAttribute("tabindex");
            c.removeAttribute("role");
            c.removeAttribute("aria-label");
        }
        scope.addEventListener("click", reveal);
        scope.addEventListener("keydown", reveal);
    }

    /* ---------- home ---------- */

    function counts() {
        var nahwRows = 0;
        D.nahw.groups.forEach(function (g) { nahwRows += g.rows.length; });
        var letters = 0;
        D.makharij.areas.forEach(function (a) { letters += a.letters.length; });
        var examples = 0;
        D.radaah.cycles.forEach(function (c) { examples += c.examples.length; });
        return {
            numbers: [A.toArabicDigits(D.numbers.rows.length) + " قواعد", D.numbers.rows.length + " rules"],
            nahw: [A.toArabicDigits(nahwRows) + " أنواع", nahwRows + " noun types"],
            makharij: [A.toArabicDigits(letters) + " حرفاً", letters + " letters"],
            radaah: [A.toArabicDigits(examples) + " أمثلة", examples + " diagrams"]
        };
    }

    function renderHome() {
        var c = counts();
        var grid = $("#topic-grid");
        grid.innerHTML = D.topics.map(function (t, i) {
            var best = A.getBest && A.practiceDeck && t.id !== "radaah" ? A.getBest([t.id]) : null;
            return '<a class="topic-card t-' + t.id + '" href="' + esc(t.href) + '">' +
                '<span class="topic-glyph" aria-hidden="true">' + esc(t.glyph) + "</span>" +
                '<span class="topic-index" aria-hidden="true">' + en("0" + (i + 1)) + "</span>" +
                '<span class="topic-title">' + esc(t.ar) + " " + en(t.en) + "</span>" +
                '<span class="topic-desc">' + esc(t.desc) + "<br>" + en(t.descEn) + "</span>" +
                '<span class="topic-meta"><span>' + esc(c[t.id][0]) + " · " + en(c[t.id][1]) + "</span>" +
                (best !== null ? '<span class="best-badge" title="Best quiz score">' + icons.target + A.toArabicDigits(best) + "٪</span>" : "") +
                "</span>" +
                '<span class="topic-go" aria-hidden="true">' + icons.arrow + "</span>" +
                "</a>";
        }).join("");
    }

    /* ---------- numbers ---------- */

    function renderNumbers() {
        var cols = D.numbers.columns;
        var table = $("#numbers-table");
        table.innerHTML =
            "<thead><tr><th scope=\"col\">العدد " + en("Number") + "</th>" +
            cols.map(function (c) { return '<th scope="col">' + esc(c.ar) + " " + en(c.en) + "</th>"; }).join("") +
            "</tr></thead><tbody>" +
            D.numbers.rows.map(function (r) {
                return '<tr id="' + r.id + '"><th scope="row" class="num-cell">' + esc(r.label) + "</th>" +
                    cols.map(function (c) {
                        return '<td data-label="' + esc(c.ar) + '"><span class="cover">' + formatRule(r[c.key]) + "</span></td>";
                    }).join("") + "</tr>";
            }).join("") + "</tbody>";

        $("#numbers-notes").innerHTML = D.numbers.notes.map(function (n) {
            var html = '<article class="note-card" id="' + n.id + '"><h3>' + esc(n.title) + " " + en(n.titleEn, "h-en") + "</h3>";
            (n.paragraphs || []).forEach(function (p) { html += "<p>" + esc(p) + "</p>"; });
            if (n.english) html += '<p class="note-en" lang="en" dir="ltr"><strong>Note:</strong> ' + esc(n.english).replace("mabni", "<em>mabni</em>") + "</p>";
            if (n.items) {
                html += '<ul class="term-list">' + n.items.map(function (i) {
                    return "<li><strong>" + esc(i.term) + "</strong><span>" + esc(i.text) + "</span></li>";
                }).join("") + "</ul>";
            }
            return html + "</article>";
        }).join("");

        wireFinder();
        wireCover($("#numbers-page"));
    }

    // "الشق الأول: ..." lines become labelled parts so the two halves read clearly.
    function formatRule(parts) {
        return parts.map(function (p) {
            var m = /^(الشق (?:الأول|الثاني)):\s*(.+)$/.exec(p);
            if (m) return '<span class="part"><span class="part-label">' + esc(m[1]) + "</span>" + esc(m[2]) + "</span>";
            return '<span class="part">' + esc(p) + "</span>";
        }).join("");
    }

    function wireFinder() {
        var input = $("#number-finder");
        var out = $("#finder-result");
        if (!input) return;
        function update() {
            var raw = A.toLatinDigits(input.value).replace(/[^\d]/g, "");
            document.querySelectorAll("#numbers-table tr.is-match").forEach(function (tr) { tr.classList.remove("is-match"); });
            if (!raw) {
                out.innerHTML = en("Type 1–99, or a round hundred.");
                out.className = "finder-result";
                return;
            }
            var n = parseInt(raw, 10);
            var row = A.numberRowFor(n);
            if (!row) {
                out.className = "finder-result is-miss";
                out.innerHTML = "العدد " + esc(A.toArabicDigits(n)) + " غير مذكور في هذا الجدول " + en("Not covered in this table");
                return;
            }
            var tr = document.getElementById(row.id);
            tr.classList.add("is-match");
            out.className = "finder-result is-hit";
            out.innerHTML = "العدد <strong>" + esc(A.toArabicDigits(n)) + "</strong> ← الصف <strong>" + esc(row.label) + "</strong> " + en("Rule highlighted below");
            var rect = tr.getBoundingClientRect();
            if (rect.top < 80 || rect.bottom > window.innerHeight) {
                tr.scrollIntoView({ behavior: A.reduceMotion ? "auto" : "smooth", block: "center" });
            }
        }
        input.addEventListener("input", update);
        update();
    }

    /* ---------- nahw ---------- */

    function renderNahw() {
        var cases = D.nahw.cases;
        $("#case-legend").innerHTML =
            cases.map(function (c) {
                return '<span class="legend-item"><span class="case-dot case-' + c.key + '"></span>' + esc(c.voweled) + " " + en(c.en) +
                    ' <span class="legend-orig">الأصل: ' + esc(c.original) + "</span></span>";
            }).join("") +
            '<span class="legend-item"><span class="sub-sample">ي</span>علامة فرعية ' + en("Substitute marker") + "</span>";

        $("#nahw-groups").innerHTML = D.nahw.groups.map(function (g) {
            return '<section class="card table-card" id="' + g.id + '" aria-labelledby="' + g.id + '-h">' +
                '<header class="card-head"><span class="card-num">' + esc(g.number) + "</span>" +
                '<h2 id="' + g.id + '-h">' + esc(g.ar) + " " + en(g.en, "h-en") + "</h2></header>" +
                '<div class="table-wrap"><table class="study-table nahw-table" data-coverable>' +
                "<thead><tr><th scope=\"col\">النوع " + en("Type") + "</th>" +
                cases.map(function (c) {
                    return '<th scope="col" class="case-h case-' + c.key + '"><span class="case-dot case-' + c.key + '"></span>' + esc(c.voweled) + " " + en(c.en) + "</th>";
                }).join("") + "</tr></thead><tbody>" +
                g.rows.map(function (r) {
                    return '<tr id="' + r.id + '"><th scope="row"><span class="type-name">' + esc(r.type) + "</span>" +
                        '<span class="type-sample">' + esc(r.sample) + (r.sampleEn ? " " + en("(" + r.sampleEn + ")") : "") + "</span></th>" +
                        cases.map(function (c) {
                            var cell = r[c.key];
                            var sub = g.substitutes && cell.mark !== c.original;
                            return '<td data-label="' + esc(c.ar) + '"><span class="cover">' +
                                '<span class="mark case-' + c.key + (sub ? " is-sub" : "") + '"' + (sub ? ' title="علامة فرعية · substitute marker"' : "") + ">" + esc(cell.mark) + "</span>" +
                                '<span class="arabic-ex">' + esc(cell.ex) + "</span></span></td>";
                        }).join("") + "</tr>";
                }).join("") +
                "</tbody></table></div></section>";
        }).join("");

        wireCover($("#nahw-page"));
    }

    /* ---------- makharij ---------- */

    function letterEntries() {
        var out = [];
        D.makharij.areas.forEach(function (a) {
            a.letters.forEach(function (l, i) {
                out.push({ id: "mk-" + a.id + "-" + i, area: a, letter: l });
            });
        });
        return out;
    }

    function renderMakharij() {
        var areas = D.makharij.areas;
        var entries = letterEntries();
        var selected = null;
        var filter = "all";

        var withLetters = areas.filter(function (a) { return a.letters.length; });

        $("#area-filter").innerHTML =
            '<button type="button" class="chip-filter" data-filter="all" aria-pressed="true">الكل ' + en("All") +
            ' <span class="count">' + A.toArabicDigits(entries.length) + "</span></button>" +
            withLetters.map(function (a) {
                return '<button type="button" class="chip-filter area-' + a.id + '" data-filter="' + a.id + '" aria-pressed="false">' +
                    '<span class="area-dot"></span>' + esc(a.ar) + ' <span class="count">' + A.toArabicDigits(a.letters.length) + "</span></button>";
            }).join("");

        function paintMap() {
            $("#letter-map").innerHTML = withLetters.filter(function (a) {
                return filter === "all" || filter === a.id;
            }).map(function (a) {
                return '<div class="map-group area-' + a.id + '"><p class="map-label"><span class="area-dot"></span>' + esc(a.ar) + " " + en(a.translit) + "</p>" +
                    '<div class="letter-grid">' + a.letters.map(function (l, i) {
                        var id = "mk-" + a.id + "-" + i;
                        return '<button type="button" class="letter-chip area-' + a.id + '" data-entry="' + id + '" aria-pressed="' + (selected === id) + '"' +
                            ' aria-label="' + esc(l.letter + (l.variant ? " " + l.variant : "") + " — " + a.ar) + '">' +
                            '<span class="lc-letter">' + esc(letter(l.letter)) + "</span>" +
                            (l.variant ? '<span class="lc-variant">' + esc(l.variant) + "</span>" : "") + "</button>";
                    }).join("") + "</div></div>";
            }).join("");
        }

        function paintDetail() {
            var pane = $("#letter-detail");
            var e = entries.filter(function (x) { return x.id === selected; })[0];
            if (!e) {
                pane.className = "letter-detail is-empty";
                pane.innerHTML = '<div class="detail-empty"><span class="detail-glyph" aria-hidden="true">؟</span>' +
                    "<p>اضغط على حرف لعرض مخرجه</p>" + en("Tap a letter to see where it is pronounced") + "</div>";
                return;
            }
            var others = entries.filter(function (x) { return x.letter.letter === e.letter.letter && x.id !== e.id; });
            pane.className = "letter-detail area-" + e.area.id;
            pane.innerHTML =
                '<div class="detail-top"><span class="detail-glyph">' + esc(letter(e.letter.letter)) + "</span>" +
                '<div><p class="detail-area"><span class="area-dot"></span>' + esc(e.area.ar) + "</p>" +
                '<p class="detail-area-en">' + en(e.area.translit + " · " + e.area.en) + "</p>" +
                (e.letter.variant ? '<p class="detail-variant">' + esc(e.letter.variant) + "</p>" : "") + "</div></div>" +
                '<p class="detail-desc">' + esc(e.letter.description) + "</p>" +
                (others.length ? '<div class="detail-also"><span>يخرج أيضاً من: ' + en("Also from") + "</span>" + others.map(function (o) {
                    return '<button type="button" class="chip-mini area-' + o.area.id + '" data-entry="' + o.id + '"><span class="area-dot"></span>' +
                        esc(o.area.ar) + (o.letter.variant ? " — " + esc(o.letter.variant) : "") + "</button>";
                }).join("") + "</div>" : "") +
                '<a class="link-quiet" href="#' + e.id + '" data-jump="' + e.id + '">في جدول المنطقة ' + en("Show in area list") + "</a>";
        }

        function select(id, opts) {
            selected = id;
            var e = entries.filter(function (x) { return x.id === id; })[0];
            if (e && filter !== "all" && filter !== e.area.id) {
                filter = "all";
                document.querySelectorAll("[data-filter]").forEach(function (b) {
                    b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === "all"));
                });
            }
            paintMap();
            paintDetail();
            if (opts && opts.scroll) {
                var pane = $("#letter-detail");
                var r = pane.getBoundingClientRect();
                if (r.top < 70 || r.top > window.innerHeight * 0.6) pane.scrollIntoView({ behavior: A.reduceMotion ? "auto" : "smooth", block: "start" });
            }
            if (opts && opts.focus) {
                var chip = document.querySelector('.letter-chip[data-entry="' + id + '"]');
                if (chip) chip.focus({ preventScroll: true });
            }
        }

        $("#area-filter").addEventListener("click", function (e) {
            var b = e.target.closest("[data-filter]");
            if (!b) return;
            filter = b.getAttribute("data-filter");
            document.querySelectorAll("[data-filter]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
            paintMap();
        });

        $("#makharij-explorer").addEventListener("click", function (e) {
            var jump = e.target.closest("[data-jump]");
            if (jump) {
                e.preventDefault();
                var id = jump.getAttribute("data-jump");
                var row = document.getElementById(id);
                var det = row && row.closest("details");
                if (det) det.open = true;
                history.replaceState(null, "", "#" + id);
                A.flashTarget(id);
                return;
            }
            var b = e.target.closest("[data-entry]");
            if (!b) return;
            var inPane = !!b.closest("#letter-detail");
            select(b.getAttribute("data-entry"), { focus: !inPane, scroll: window.innerWidth < 900 && !inPane });
        });

        // Arrow keys move between letters in the map.
        $("#letter-map").addEventListener("keydown", function (e) {
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].indexOf(e.key) === -1) return;
            var chips = Array.prototype.slice.call(document.querySelectorAll("#letter-map .letter-chip"));
            var i = chips.indexOf(document.activeElement);
            if (i === -1) return;
            e.preventDefault();
            var n = i;
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") n = Math.min(chips.length - 1, i + 1);
            if (e.key === "ArrowRight" || e.key === "ArrowUp") n = Math.max(0, i - 1);
            if (e.key === "Home") n = 0;
            if (e.key === "End") n = chips.length - 1;
            select(chips[n].getAttribute("data-entry"), { focus: true });
        });

        // Full reference list, grouped by area.
        $("#area-list").innerHTML = areas.map(function (a, ai) {
            return '<details class="area-card area-' + a.id + '" id="area-' + a.id + '"' + (ai < 2 ? " open" : "") + ">" +
                '<summary><span class="area-badge" aria-hidden="true">' + esc(a.ar.replace(/^ال/, "").charAt(0)) + "</span>" +
                '<span class="area-name">' + esc(a.ar) + " " + en(a.translit + " · " + a.en) + "</span>" +
                '<span class="count">' + (a.letters.length ? A.toArabicDigits(a.letters.length) + " " + en("letters") : en("reference")) + "</span>" +
                '<span class="chev" aria-hidden="true"></span></summary>' +
                '<div class="area-body"><p class="area-desc">' + esc(a.description) + "</p>" +
                (a.letters.length ? '<ul class="letter-rows">' + a.letters.map(function (l, i) {
                    var id = "mk-" + a.id + "-" + i;
                    return '<li id="' + id + '"><button type="button" class="row-letter" data-select="' + id + '" aria-label="' + esc("اعرض " + l.letter) + '">' + esc(letter(l.letter)) + "</button>" +
                        '<span class="row-text">' + (l.variant ? '<span class="row-variant">' + esc(l.variant) + "</span>" : "") + esc(l.description) + "</span></li>";
                }).join("") + "</ul>" : "") +
                (a.details ? '<dl class="teeth-list">' + a.details.map(function (d) {
                    return "<div><dt>" + esc(d.name) + "</dt><dd>" + esc(d.position) + "</dd></div>";
                }).join("") + "</dl>" : "") +
                "</div></details>";
        }).join("");

        $("#area-list").addEventListener("click", function (e) {
            var b = e.target.closest("[data-select]");
            if (!b) return;
            select(b.getAttribute("data-select"));
            $("#makharij-explorer").scrollIntoView({ behavior: A.reduceMotion ? "auto" : "smooth", block: "start" });
        });

        $("#makharij-tip").innerHTML = "<strong>نصيحة للمذاكرة</strong> " + esc(D.makharij.tip.ar) +
            '<span class="en tip-en" lang="en" dir="ltr"><strong>Study tip:</strong> ' + esc(D.makharij.tip.en) + "</span>";

        document.addEventListener("ash:target", function (ev) {
            var id = ev.detail.id;
            if (/^mk-/.test(id)) {
                var det = ev.detail.el.closest("details");
                if (det) det.open = true;
                select(id);
            } else if (/^area-/.test(id)) {
                ev.detail.el.open = true;
            }
        });

        paintMap();
        paintDetail();
    }

    /* ---------- radaah ---------- */

    function renderRadaah() {
        var W = 300, H = 220;
        $("#radaah-cycles").innerHTML = D.radaah.cycles.map(function (c) {
            return '<section class="cycle" id="' + c.id + '" aria-labelledby="' + c.id + '-h">' +
                '<h2 class="cycle-title" id="' + c.id + '-h">' + esc(c.title) + " " + en(c.titleEn, "h-en") + "</h2>" +
                '<div class="diagram-grid">' + c.examples.map(function (ex) {
                    var byId = {};
                    ex.nodes.forEach(function (n) { byId[n.id] = n; });
                    function pt(ref) {
                        if (Array.isArray(ref)) {
                            var p = byId[ref[0]], q = byId[ref[1]];
                            return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2, mid: true };
                        }
                        return byId[ref];
                    }
                    var svgLines = ex.lines.map(function (l) {
                        var a = pt(l[0]), b = pt(l[1]);
                        return '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '"/>' +
                            (a.mid ? '<circle class="joint" cx="' + a.x + '" cy="' + a.y + '" r="4"/>' : "");
                    }).join("");
                    var names = ex.nodes.map(function (n) { return n.label + (n.tag ? " (" + n.tag + ")" : ""); }).join("، ");
                    return '<article class="card diagram-card" id="' + ex.id + '">' +
                        '<h3>' + esc(ex.title) + "</h3>" +
                        '<figure class="diagram" role="img" aria-label="' + esc(names) + '">' +
                        '<svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none" aria-hidden="true">' + svgLines + "</svg>" +
                        ex.nodes.map(function (n) {
                            return '<div class="node' + (n.tag ? " has-tag" : "") + '" style="left:' + (n.x / W * 100) + "%;top:" + (n.y / H * 100) + '%">' +
                                esc(n.label) + (n.tag ? '<span class="node-tag">' + esc(n.tag) + "</span>" : "") + "</div>";
                        }).join("") +
                        "</figure></article>";
                }).join("") + "</div></section>";
        }).join("");
    }

    /* ---------- boot ---------- */

    var renderers = {
        home: renderHome,
        numbers: renderNumbers,
        nahw: renderNahw,
        makharij: renderMakharij,
        radaah: renderRadaah,
        practice: function () {}
    };

    document.addEventListener("DOMContentLoaded", function () {
        var page = document.documentElement.getAttribute("data-page");
        if (renderers[page]) renderers[page]();

        var mount = document.getElementById("practice");
        if (mount && A.mountPractice) {
            var decks = (mount.getAttribute("data-decks") || "").split(",").filter(Boolean);
            A.mountPractice(mount, {
                decks: decks,
                selectable: mount.hasAttribute("data-selectable"),
                length: parseInt(mount.getAttribute("data-length"), 10) || undefined,
                title: mount.getAttribute("data-title") || undefined,
                titleEn: mount.getAttribute("data-title-en") || undefined
            });
        }

        document.documentElement.classList.add("is-ready");
        if (location.hash.length > 1) {
            var id = decodeURIComponent(location.hash.slice(1));
            requestAnimationFrame(function () { A.flashTarget(id); });
        }
    });

    window.addEventListener("hashchange", function () {
        if (location.hash.length > 1) A.flashTarget(decodeURIComponent(location.hash.slice(1)));
    });
})();
