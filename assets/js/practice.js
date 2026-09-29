/*
 * Practice engine: multiple-choice quiz + flashcards, generated from STUDY_DATA.
 * Mount with ASH.mountPractice(element, { decks: ["numbers"], selectable: false }).
 */
(function () {
    "use strict";

    var A = window.ASH;
    var D = A.data;
    var esc = A.esc, en = A.en, lines = A.lines, icons = A.icons, shuffle = A.shuffle, letter = A.letter;

    var QUIZ_LENGTH = 10;

    function keyOf(value) {
        return Array.isArray(value) ? value.join("|") : String(value);
    }

    function uniq(values) {
        var seen = {};
        return values.filter(function (v) {
            var k = keyOf(v);
            if (seen[k]) return false;
            seen[k] = true;
            return true;
        });
    }

    function topic(id) {
        return D.topics.filter(function (t) { return t.id === id; })[0];
    }

    /* ---------- question + card builders ---------- */

    function numbersDeck() {
        var cols = D.numbers.columns, rows = D.numbers.rows;
        var questions = [];
        cols.forEach(function (col) {
            var pool = uniq(rows.map(function (r) { return r[col.key]; }));
            rows.forEach(function (r) {
                questions.push({
                    key: "numbers:" + r.id + ":" + col.key,
                    prompt: '<span class="q-kicker">العدد</span><span class="q-big q-num">' + esc(r.label) + "</span>",
                    ask: col.ar + "؟",
                    askEn: col.en,
                    answer: r[col.key],
                    pool: pool,
                    explain: cols.map(function (c) {
                        return "<div><dt>" + esc(c.ar) + "</dt><dd>" + lines(r[c.key]) + "</dd></div>";
                    }).join(""),
                    href: "numbers.html#" + r.id
                });
            });
        });
        var cards = rows.map(function (r) {
            return {
                key: "numbers:" + r.id,
                front: '<span class="q-kicker">العدد</span><span class="q-big q-num">' + esc(r.label) + "</span>",
                back: "<dl class=\"fc-list\">" + cols.map(function (c) {
                    return "<div><dt>" + esc(c.ar) + "</dt><dd>" + lines(r[c.key]) + "</dd></div>";
                }).join("") + "</dl>",
                href: "numbers.html#" + r.id
            };
        });
        return { questions: questions, cards: cards };
    }

    function nahwDeck() {
        var cases = D.nahw.cases;
        var all = [];
        D.nahw.groups.forEach(function (g) {
            g.rows.forEach(function (r) {
                cases.forEach(function (c) { all.push(r[c.key].mark); });
            });
        });
        all = uniq(all);

        var questions = [], cards = [];
        D.nahw.groups.forEach(function (g) {
            var groupMarks = [];
            g.rows.forEach(function (r) { cases.forEach(function (c) { groupMarks.push(r[c.key].mark); }); });
            groupMarks = uniq(groupMarks);

            g.rows.forEach(function (r) {
                var head = '<span class="q-kicker">' + esc(g.ar) + "</span>" +
                    '<span class="q-big">' + esc(r.type) + "</span>" +
                    '<span class="q-sample">' + esc(r.sample) + (r.sampleEn ? " " + en("(" + r.sampleEn + ")") : "") + "</span>";

                cases.forEach(function (c) {
                    questions.push({
                        key: "nahw:" + r.id + ":" + c.key,
                        prompt: head,
                        ask: "علامة " + c.ar + "؟",
                        askEn: c.en + " marker",
                        caseKey: c.key,
                        answer: r[c.key].mark,
                        pool: groupMarks,
                        fallback: all,
                        explain: '<p class="ex-line"><span class="case-dot case-' + c.key + '"></span>' +
                            esc(c.ar) + ': <strong>' + esc(r[c.key].mark) + '</strong> — <span class="arabic-ex">' + esc(r[c.key].ex) + "</span></p>",
                        href: "nahw.html#" + r.id
                    });
                });

                cards.push({
                    key: "nahw:" + r.id,
                    front: head,
                    back: '<dl class="fc-list">' + cases.map(function (c) {
                        return '<div><dt><span class="case-dot case-' + c.key + '"></span>' + esc(c.ar) + "</dt><dd><strong>" +
                            esc(r[c.key].mark) + '</strong> <span class="arabic-ex">' + esc(r[c.key].ex) + "</span></dd></div>";
                    }).join("") + "</dl>",
                    href: "nahw.html#" + r.id
                });
            });
        });
        return { questions: questions, cards: cards };
    }

    function makharijDeck() {
        var areas = D.makharij.areas.filter(function (a) { return a.letters.length; });
        var areaNames = areas.map(function (a) { return a.ar; });
        var descCount = {};
        areas.forEach(function (a) {
            a.letters.forEach(function (l) { descCount[l.description] = (descCount[l.description] || 0) + 1; });
        });

        var questions = [], cards = [];
        areas.forEach(function (a) {
            var areaLetters = a.letters.map(function (l) { return l.letter; });
            a.letters.forEach(function (l, i) {
                var id = "mk-" + a.id + "-" + i;
                var face = '<span class="q-letter">' + esc(letter(l.letter)) + "</span>" +
                    (l.variant ? '<span class="q-sample">' + esc(l.variant) + "</span>" : "");

                questions.push({
                    key: "makharij:" + id + ":area",
                    prompt: face,
                    ask: "من أين يخرج هذا الحرف؟",
                    askEn: "Which area is it articulated from?",
                    answer: a.ar,
                    pool: areaNames,
                    explain: '<p class="ex-line"><strong>' + esc(a.ar) + "</strong> — " + esc(l.description) + "</p>",
                    href: "makharij-chart.html#" + id
                });

                // Reverse question only when the description points to exactly one letter.
                if (descCount[l.description] === 1) {
                    questions.push({
                        key: "makharij:" + id + ":letter",
                        prompt: '<span class="q-kicker">' + esc(a.ar) + '</span><span class="q-desc">' + esc(l.description) + "</span>",
                        ask: "أي حرف هذا؟",
                        askEn: "Which letter is described?",
                        answer: l.letter,
                        pool: areaLetters,
                        fallback: ["ق", "ك", "ج", "ش", "ض", "ل", "ر", "ف", "ب", "ء", "ه", "ع", "غ"],
                        letterOptions: true,
                        explain: '<p class="ex-line"><strong class="arabic-ex">' + esc(letter(l.letter)) + "</strong> " +
                            (l.variant ? "(" + esc(l.variant) + ") " : "") + "— " + esc(a.ar) + "</p>",
                        href: "makharij-chart.html#" + id
                    });
                }

                cards.push({
                    key: "makharij:" + id,
                    front: face,
                    back: '<p class="fc-area area-' + a.id + '">' + esc(a.ar) + " " + en(a.translit) + "</p>" +
                        '<p class="fc-desc">' + esc(l.description) + "</p>",
                    href: "makharij-chart.html#" + id
                });
            });
        });
        return { questions: questions, cards: cards };
    }

    var builders = { numbers: numbersDeck, nahw: nahwDeck, makharij: makharijDeck };
    var cache = {};

    function deck(id) {
        if (!cache[id]) cache[id] = builders[id]();
        return cache[id];
    }

    function makeOptions(q) {
        var answerKey = keyOf(q.answer);
        var pick = shuffle(q.pool.filter(function (v) { return keyOf(v) !== answerKey; }));
        if (pick.length < 3 && q.fallback) {
            var have = {};
            pick.forEach(function (v) { have[keyOf(v)] = true; });
            shuffle(q.fallback).forEach(function (v) {
                var k = keyOf(v);
                if (k !== answerKey && !have[k]) { pick.push(v); have[k] = true; }
            });
        }
        return shuffle(pick.slice(0, 3).concat([q.answer]));
    }

    /* ---------- storage ---------- */

    function bestKey(decks) { return "ash-best-" + decks.slice().sort().join("+"); }

    function getBest(decks) {
        var v = parseInt(A.store.get(bestKey(decks)), 10);
        return isNaN(v) ? null : v;
    }

    function saveBest(decks, pct) {
        var prev = getBest(decks);
        if (prev === null || pct > prev) A.store.set(bestKey(decks), String(pct));
        return prev;
    }

    /* ---------- UI ---------- */

    function verdict(pct) {
        if (pct >= 90) return ["ممتاز", "Excellent"];
        if (pct >= 70) return ["جيد جداً", "Very good"];
        if (pct >= 50) return ["جيد، واصل", "Good — keep going"];
        return ["راجع ثم حاول مرة أخرى", "Review the table, then try again"];
    }

    function mountPractice(root, opts) {
        opts = opts || {};
        var state = {
            mode: "quiz",
            decks: (opts.decks || ["numbers"]).slice(),
            selectable: !!opts.selectable,
            length: opts.length || QUIZ_LENGTH
        };

        root.classList.add("practice");
        root.innerHTML =
            '<div class="practice-head">' +
            '<div><p class="kicker">' + en("Practice") + "</p>" +
            '<h2 id="' + (opts.titleId || "practice-title") + '">' + esc(opts.title || "اختبر نفسك") + " " + en(opts.titleEn || "Test yourself", "h-en") + "</h2></div>" +
            '<div class="segmented" role="tablist" aria-label="Practice mode">' +
            '<button type="button" role="tab" data-mode="quiz" aria-selected="true">' + icons.target + "<span>اختبار</span>" + en("Quiz") + "</button>" +
            '<button type="button" role="tab" data-mode="cards" aria-selected="false">' + icons.cards + "<span>بطاقات</span>" + en("Flashcards") + "</button>" +
            "</div></div>" +
            (state.selectable ? '<div class="deck-picker" role="group" aria-label="Topics"></div>' : "") +
            '<div class="practice-body" tabindex="-1"></div>';

        var body = root.querySelector(".practice-body");
        var picker = root.querySelector(".deck-picker");

        function paintPicker() {
            if (!picker) return;
            picker.innerHTML = Object.keys(builders).map(function (id) {
                var t = topic(id);
                var on = state.decks.indexOf(id) !== -1;
                return '<button type="button" class="chip-toggle t-' + id + '" data-deck="' + id + '" aria-pressed="' + on + '">' +
                    '<span class="chip-check">' + icons.check + "</span>" + esc(t.ar) + " " + en(t.en) + "</button>";
            }).join("");
        }

        root.querySelector(".segmented").addEventListener("click", function (e) {
            var b = e.target.closest("[data-mode]");
            if (!b) return;
            state.mode = b.getAttribute("data-mode");
            root.querySelectorAll("[data-mode]").forEach(function (x) {
                x.setAttribute("aria-selected", String(x === b));
            });
            start();
        });

        if (picker) {
            picker.addEventListener("click", function (e) {
                var b = e.target.closest("[data-deck]");
                if (!b) return;
                var id = b.getAttribute("data-deck");
                var i = state.decks.indexOf(id);
                if (i === -1) state.decks.push(id);
                else if (state.decks.length > 1) state.decks.splice(i, 1);
                paintPicker();
                start();
            });
        }

        function start(subset) {
            if (state.mode === "quiz") startQuiz(subset); else startCards();
        }

        /* ----- quiz ----- */

        var quiz;

        function startQuiz(subset) {
            var pool = subset || [];
            if (!subset) {
                state.decks.forEach(function (id) { pool = pool.concat(deck(id).questions.map(function (q) { q.deck = id; return q; })); });
                pool = shuffle(pool).slice(0, state.length);
            } else {
                pool = shuffle(subset);
            }
            quiz = {
                items: pool.map(function (q) { return { q: q, options: makeOptions(q), picked: null }; }),
                i: 0,
                correct: 0,
                retryRun: !!subset
            };
            paintQuestion();
        }

        function optionHtml(q, v) {
            return q.letterOptions ? '<span class="opt-letter">' + esc(letter(v)) + "</span>" : lines(v);
        }

        function paintQuestion() {
            var item = quiz.items[quiz.i];
            var q = item.q;
            var total = quiz.items.length;
            var t = topic(q.deck);
            body.innerHTML =
                '<div class="quiz-top">' +
                '<span class="pill t-' + q.deck + '">' + esc(t.ar) + "</span>" +
                '<span class="quiz-count">سؤال ' + A.toArabicDigits(quiz.i + 1) + " من " + A.toArabicDigits(total) + " " + en("Q" + (quiz.i + 1) + "/" + total) + "</span>" +
                '<span class="quiz-score" aria-label="Correct so far">' + icons.check + A.toArabicDigits(quiz.correct) + "</span>" +
                "</div>" +
                '<div class="progress" aria-hidden="true"><span style="width:' + (quiz.i / total * 100) + '%"></span></div>' +
                '<div class="q-card">' + q.prompt + "</div>" +
                '<p class="q-ask">' + esc(q.ask) + " " + en(q.askEn) + "</p>" +
                '<div class="options' + (q.letterOptions ? " options-letters" : "") + '">' +
                item.options.map(function (v, i) {
                    return '<button type="button" class="option" data-i="' + i + '"><kbd>' + (i + 1) + "</kbd><span>" + optionHtml(q, v) + "</span></button>";
                }).join("") +
                "</div>" +
                '<div class="feedback" role="status" aria-live="polite"></div>';
            var first = body.querySelector(".option");
            if (first && root.contains(document.activeElement)) first.focus();
        }

        function answer(i) {
            var item = quiz.items[quiz.i];
            if (item.picked !== null) return;
            item.picked = i;
            var q = item.q;
            var right = keyOf(item.options[i]) === keyOf(q.answer);
            if (right) quiz.correct++;
            body.querySelectorAll(".option").forEach(function (b, j) {
                b.disabled = true;
                if (keyOf(item.options[j]) === keyOf(q.answer)) b.classList.add("is-correct");
                else if (j === i) b.classList.add("is-wrong");
            });
            body.querySelector(".quiz-score").innerHTML = icons.check + A.toArabicDigits(quiz.correct);
            var last = quiz.i === quiz.items.length - 1;
            var fb = body.querySelector(".feedback");
            fb.className = "feedback " + (right ? "is-right" : "is-wrong");
            fb.innerHTML =
                '<div class="fb-head">' + (right ? icons.check + "<strong>صحيح</strong> " + en("Correct") :
                    icons.x + "<strong>ليس صحيحاً</strong> " + en("Not quite")) + "</div>" +
                '<dl class="fb-explain">' + q.explain + "</dl>" +
                '<div class="fb-actions">' +
                '<a class="link-quiet" href="' + esc(q.href) + '">عرض في الملخص ' + en("See in notes") + "</a>" +
                '<button type="button" class="btn btn-primary" data-next>' + (last ? "النتيجة " + en("Results") : "التالي " + en("Next")) + icons.arrow + "</button>" +
                "</div>";
            body.querySelector("[data-next]").focus({ preventScroll: true });
        }

        function next() {
            if (quiz.i < quiz.items.length - 1) {
                quiz.i++;
                paintQuestion();
                var first = body.querySelector(".option");
                if (first) first.focus({ preventScroll: true });
            } else {
                paintSummary();
            }
        }

        function paintSummary() {
            var total = quiz.items.length;
            var pct = Math.round(quiz.correct / total * 100);
            var prev = quiz.retryRun ? getBest(state.decks) : saveBest(state.decks, pct);
            var best = getBest(state.decks);
            var v = verdict(pct);
            var missed = quiz.items.filter(function (it) { return keyOf(it.options[it.picked]) !== keyOf(it.q.answer); });
            var isRecord = !quiz.retryRun && (prev === null || pct > prev);

            body.innerHTML =
                '<div class="summary">' +
                '<div class="ring" style="--p:' + pct + '"><span>' + A.toArabicDigits(pct) + "٪</span></div>" +
                "<h3>" + esc(v[0]) + " " + en(v[1]) + "</h3>" +
                "<p>" + A.toArabicDigits(quiz.correct) + " من " + A.toArabicDigits(total) + " إجابات صحيحة " +
                en(quiz.correct + " of " + total + " correct") + "</p>" +
                (best !== null ? '<p class="best">' + (isRecord ? "رقم قياسي جديد! " + en("New best") : "أفضل نتيجة: " + A.toArabicDigits(best) + "٪ " + en("Best " + best + "%")) + "</p>" : "") +
                (missed.length ? '<div class="missed"><h4>راجع هذه ' + en("Review these") + "</h4><ul>" +
                    missed.map(function (it) {
                        return '<li><a href="' + esc(it.q.href) + '"><span class="m-q">' + stripTags(it.q.prompt) + " — " + esc(it.q.ask) + "</span>" +
                            '<span class="m-a">' + (it.q.letterOptions ? esc(letter(it.q.answer)) : lines(it.q.answer)) + "</span></a></li>";
                    }).join("") + "</ul></div>" : "") +
                '<div class="summary-actions">' +
                '<button type="button" class="btn btn-primary" data-restart>' + icons.retry + "جولة جديدة " + en("New round") + "</button>" +
                (missed.length ? '<button type="button" class="btn" data-retry-missed>أعد الأخطاء ' + en("Retry mistakes") + "</button>" : "") +
                "</div></div>";
            quiz.missed = missed.map(function (it) { return it.q; });
            var focusTarget = body.querySelector("[data-restart]");
            if (focusTarget) focusTarget.focus({ preventScroll: true });
        }

        function stripTags(html) {
            var d = document.createElement("div");
            d.innerHTML = html.replace(/<\/span><span/g, "</span> <span");
            return esc(d.textContent.replace(/\s+/g, " ").trim());
        }

        /* ----- flashcards ----- */

        var fc;

        function startCards() {
            var cards = [];
            state.decks.forEach(function (id) {
                cards = cards.concat(deck(id).cards.map(function (c) { c.deck = id; return c; }));
            });
            fc = { queue: shuffle(cards), total: cards.length, known: 0, flipped: false };
            paintCard();
        }

        function paintCard() {
            if (!fc.queue.length) {
                body.innerHTML =
                    '<div class="summary">' +
                    '<div class="ring" style="--p:100"><span>' + icons.check + "</span></div>" +
                    "<h3>أنهيت كل البطاقات " + en("All cards done") + "</h3>" +
                    "<p>" + A.toArabicDigits(fc.total) + " بطاقة " + en(fc.total + " cards reviewed") + "</p>" +
                    '<div class="summary-actions"><button type="button" class="btn btn-primary" data-restart>' + icons.retry + "من جديد " + en("Start over") + "</button></div></div>";
                body.querySelector("[data-restart]").focus({ preventScroll: true });
                return;
            }
            var c = fc.queue[0];
            var t = topic(c.deck);
            fc.flipped = false;
            body.innerHTML =
                '<div class="quiz-top">' +
                '<span class="pill t-' + c.deck + '">' + esc(t.ar) + "</span>" +
                '<span class="quiz-count">بقي ' + A.toArabicDigits(fc.queue.length) + " " + en(fc.queue.length + " left") + "</span>" +
                '<span class="quiz-score">' + icons.check + A.toArabicDigits(fc.known) + "</span>" +
                "</div>" +
                '<div class="progress" aria-hidden="true"><span style="width:' + (fc.known / fc.total * 100) + '%"></span></div>' +
                '<button type="button" class="flashcard" aria-pressed="false" aria-label="Flip card">' +
                '<span class="fc-face fc-front">' + c.front + '<span class="fc-hint">اضغط للقلب ' + en("Tap or press Space to flip") + "</span></span>" +
                '<span class="fc-face fc-back">' + c.back + "</span>" +
                "</button>" +
                '<div class="fc-actions">' +
                '<button type="button" class="btn btn-again" data-again disabled><kbd>1</kbd>مرة أخرى ' + en("Again") + "</button>" +
                '<a class="link-quiet" href="' + esc(c.href) + '">في الملخص ' + en("Notes") + "</a>" +
                '<button type="button" class="btn btn-got" data-got disabled><kbd>2</kbd>عرفتها ' + en("Got it") + "</button>" +
                "</div>";
        }

        function flip() {
            var card = body.querySelector(".flashcard");
            if (!card) return;
            fc.flipped = !fc.flipped;
            card.classList.toggle("is-flipped", fc.flipped);
            card.setAttribute("aria-pressed", String(fc.flipped));
            body.querySelectorAll("[data-again],[data-got]").forEach(function (b) { b.disabled = false; });
        }

        function rate(knewIt) {
            if (!fc.flipped) return;
            var c = fc.queue.shift();
            if (knewIt) fc.known++;
            else fc.queue.splice(Math.min(fc.queue.length, 3), 0, c);
            paintCard();
            var card = body.querySelector(".flashcard");
            if (card) card.focus({ preventScroll: true });
        }

        /* ----- events ----- */

        body.addEventListener("click", function (e) {
            var t = e.target;
            var opt = t.closest(".option");
            if (opt && !opt.disabled) return answer(parseInt(opt.getAttribute("data-i"), 10));
            if (t.closest("[data-next]")) return next();
            if (t.closest("[data-restart]")) return start();
            if (t.closest("[data-retry-missed]")) return start(quiz.missed);
            if (t.closest(".flashcard")) return flip();
            if (t.closest("[data-again]")) return rate(false);
            if (t.closest("[data-got]")) return rate(true);
        });

        root.addEventListener("keydown", function (e) {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            var n = parseInt(A.toLatinDigits(e.key), 10);
            if (state.mode === "quiz" && quiz && n >= 1 && n <= 4) {
                var b = body.querySelector('.option[data-i="' + (n - 1) + '"]');
                if (b && !b.disabled) { e.preventDefault(); answer(n - 1); }
            } else if (state.mode === "cards" && fc && fc.flipped && (n === 1 || n === 2)) {
                e.preventDefault();
                rate(n === 2);
            }
        });

        paintPicker();
        start();
        return { restart: start };
    }

    A.mountPractice = mountPractice;
    A.practiceDeck = deck;
    A.getBest = getBest;
})();
