/* MemDeck web – Kho bộ thẻ (chỉ xem): duyệt, tìm, xem thẻ mẫu + chủ đề. Không tải bộ thẻ.
   Dữ liệu: API công khai chỉ đọc của server (GET /api/hoc/public/store/...). */
(function () {
    var API = (function () {
        try { var q = new URLSearchParams(location.search).get('api'); if (q && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(q)) return q.replace(/\/$/, ''); } catch (e) {}
        return window.MD_STORE_API || 'https://api.doc-online.io.vn/api/hoc/public';
    })();
    var PAGE = 24;
    var $ = function (id) { return document.getElementById(id); };
    var L = function () { return window.MD_LANG === 'en' ? 'en' : 'vi'; };
    var T = function (vi, en) { return L() === 'en' ? en : vi; };
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var state = { language: '', level: '', meaning: '', q: '', sort: 'featured', offset: 0, books: [], total: 0, facets: null };

    function dn(code, type) {
        try { return new Intl.DisplayNames([L()], { type: type || 'language' }).of(code.toLowerCase()); } catch (e) { return code.toUpperCase(); }
    }
    function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
    // "Gốc|en=...|ja=..." -> tên theo ngôn ngữ giao diện
    function loc(s) {
        s = String(s || '').trim();
        // mô tả dạng JSON {"vi": "...", "en": "...", ...}
        if (s.charAt(0) === '{') {
            try {
                var o = JSON.parse(s), lo = {};
                Object.keys(o).forEach(function (k) { lo[k.toLowerCase()] = o[k]; });
                return String(lo[L()] || lo.vi || lo.en || lo[Object.keys(lo)[0]] || '');
            } catch (e) { }
        }
        var parts = s.split('|'), base = parts[0], want = L(), m = {};
        for (var i = 1; i < parts.length; i++) { var k = parts[i].indexOf('='); if (k > 0) m[parts[i].slice(0, k).trim().toLowerCase()] = parts[i].slice(k + 1).trim(); }
        if (m[want]) return m[want];
        return base;
    }
    // chủ đề: "仕事|vi=Công việc|en=Work" -> {base, tr}
    function topicName(s) {
        s = String(s || '');
        var parts = s.split('|'), m = {};
        for (var i = 1; i < parts.length; i++) { var k = parts[i].indexOf('='); if (k > 0) m[parts[i].slice(0, k).trim().toLowerCase()] = parts[i].slice(k + 1).trim(); }
        var tr = m[L()] || '';
        return { base: parts[0], tr: tr && tr !== parts[0] ? tr : '' };
    }
    var CAT = { 'từ vựng': 'Vocabulary', 'ngữ pháp': 'Grammar', 'giao tiếp': 'Conversation', 'kanji': 'Kanji', 'hán tự': 'Kanji', 'luyện thi': 'Exam prep', 'đọc hiểu': 'Reading', 'nghe': 'Listening' };
    function catName(s) { if (L() !== 'en') return s || ''; return CAT[String(s || '').toLowerCase()] || s || ''; }
    var LV = { 'sơ cấp': 'Beginner', 'trung cấp': 'Intermediate', 'cao cấp': 'Advanced', 'nhập môn': 'Starter' };
    function lvName(s) { if (L() !== 'en') return s || ''; return LV[String(s || '').toLowerCase()] || s || ''; }
    var GLYPH = { ja: '日', zh: '中', ko: '한', en: 'Aa', fr: 'Fr', de: 'De', es: 'Es', ru: 'Ру', th: 'ไท', vi: 'Vi', it: 'It', pt: 'Pt' };
    function num(n) { return Number(n || 0).toLocaleString(L() === 'en' ? 'en-US' : 'vi-VN'); }
    function ruby(s) {
        return esc(s).replace(/\{([^|{}]+)\|([^{}]+)\}/g, '<ruby>$1<rt>$2</rt></ruby>');
    }
    function meaningOf(obj) {
        var src = obj || {}; obj = {};
        Object.keys(src).forEach(function (k) { if (src[k]) obj[k.toUpperCase()] = src[k]; });
        var want = (state.meaning || (L() === 'en' ? 'EN' : 'VI')).toUpperCase();
        return obj[want] || obj[L().toUpperCase()] || obj.VI || obj.EN || obj[Object.keys(obj)[0]] || '';
    }

    function api(path, params) {
        var u = API + path;
        if (params) {
            var q = Object.keys(params).filter(function (k) { return params[k] !== '' && params[k] != null; })
                .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); }).join('&');
            if (q) u += '?' + q;
        }
        return fetch(u, { headers: { 'Accept': 'application/json' } }).then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        }).then(function (j) { if (!j || j.status !== 'success') throw new Error('bad'); return j.data; });
    }

    function cover(b, big) {
        var code = (b.language_code || '').toLowerCase();
        var g = GLYPH[code] || (code ? code.toUpperCase() : '?');
        var img = b.cover_image_url ? '<img src="' + esc(b.cover_image_url) + '" alt="" loading="lazy" onerror="this.remove()">' : '';
        return '<div class="st-cover l-' + esc(code) + (big ? ' big' : '') + '"><span>' + esc(g) + '</span><em>' + esc(cap(dn(code))) + '</em>' + img + '</div>';
    }
    function card(b) {
        var langs = (b.supported_languages || []).slice(0, 9).map(function (x) { return '<i>' + esc(String(x).toUpperCase()) + '</i>'; }).join('');
        var badges = (b.is_new ? '<b class="nb">' + T('Mới', 'New') + '</b>' : '') + (b.is_featured ? '<b class="fb">★</b>' : '');
        return '<button class="st-card" data-id="' + b.id + '">' + cover(b) +
            '<div class="st-info">' + (badges ? '<div class="st-badges">' + badges + '</div>' : '') +
            '<h3>' + esc(loc(b.title)) + '</h3>' +
            '<p class="st-meta">' + esc([lvName(b.level_name), catName(b.category_name)].filter(Boolean).join(' · ')) + '</p>' +
            '<p class="st-n">' + num(b.card_count) + ' ' + T('thẻ', Number(b.card_count) === 1 ? 'card' : 'cards') + '</p>' +
            (langs ? '<div class="st-langs" title="' + T('Nghĩa có sẵn', 'Meanings available') + '">' + langs + '</div>' : '') +
            '</div></button>';
    }

    function chips(el, items, cur, key, allLabel) {
        var h = '<button class="chip' + (cur ? '' : ' on') + '" data-k="' + key + '" data-v="">' + allLabel + '</button>';
        items.forEach(function (it) {
            h += '<button class="chip' + (cur === it.v ? ' on' : '') + '" data-k="' + key + '" data-v="' + esc(it.v) + '">' + esc(it.label) + ' <small>' + it.count + '</small></button>';
        });
        el.innerHTML = h;
    }
    function renderFacets() {
        var f = state.facets; if (!f) return;
        chips($('stLangs'), (f.languages || []).map(function (x) { return { v: x.code, label: cap(dn(x.code)), count: x.count }; }),
            state.language, 'language', T('Tất cả ngôn ngữ', 'All languages'));
        chips($('stLevels'), (f.levels || []).map(function (x) { return { v: x.name, label: lvName(x.name), count: x.count }; }),
            state.level, 'level', T('Mọi trình độ', 'All levels'));
        var sel = $('stMeaning'), h = '<option value="">' + T('Mọi ngôn ngữ', 'Any language') + '</option>';
        (f.meanings || []).forEach(function (m) { h += '<option value="' + esc(m.code) + '"' + (state.meaning === m.code ? ' selected' : '') + '>' + esc(cap(dn(m.code))) + ' (' + m.count + ')</option>'; });
        sel.innerHTML = h;
    }
    function renderGrid(append) {
        var g = $('stGrid');
        if (!state.books.length) {
            g.innerHTML = '<div class="st-empty">' + T('Không có bộ thẻ nào khớp. Thử bỏ bớt bộ lọc.', 'No decks match. Try removing a filter.') + '</div>';
        } else {
            g.innerHTML = state.books.map(card).join('');
        }
        $('stCount').textContent = state.total ? T(state.total + ' bộ thẻ', state.total + (state.total > 1 ? ' decks' : ' deck')) : '';
        $('stMore').hidden = state.books.length >= state.total;
    }
    function skeleton() {
        var h = ''; for (var i = 0; i < 6; i++) h += '<div class="st-card sk"><div class="st-cover"></div><div class="st-info"><h3></h3><p></p><p></p></div></div>';
        $('stGrid').innerHTML = h;
    }
    function error() {
        $('stGrid').innerHTML = '<div class="st-empty">' + T('Chưa tải được kho bộ thẻ. Kiểm tra mạng rồi ', 'Could not load the store. Check your connection and ') +
            '<button class="linkbtn" id="stRetry">' + T('thử lại', 'try again') + '</button>.</div>';
        $('stCount').textContent = '';
        var r = $('stRetry'); if (r) r.onclick = function () { load(false); };
    }
    var seq = 0;
    function load(append) {
        var my = ++seq;
        if (!append) { state.offset = 0; skeleton(); }
        api('/store/browse', { language: state.language, level: state.level, meaning: state.meaning, q: state.q, sort: state.sort, limit: PAGE, offset: state.offset })
            .then(function (d) {
                if (my !== seq) return;
                state.total = d.total; state.facets = d.facets;
                state.books = append ? state.books.concat(d.books) : d.books;
                renderFacets(); renderGrid();
            }).catch(function () { if (my === seq) error(); });
    }

    /* ---------- chi tiết ---------- */
    var detailCache = {};
    function sampleCard(c) {
        var ex = c.example_reading_1 ? ruby(c.example_reading_1) : esc(c.example_sentence_1);
        var exm = meaningOf(c.example_meanings_1);
        var sub = [c.pronunciation, c.hanviet && L() === 'vi' ? c.hanviet : '', c.part_of_speech].filter(Boolean).map(esc).join(' · ');
        return '<div class="sc"><div class="sc-word">' + esc(c.phrase) + '</div>' +
            (sub ? '<div class="sc-sub">' + sub + '</div>' : '') +
            '<div class="sc-mean">' + esc(meaningOf(c.meanings)) + '</div>' +
            (ex ? '<div class="sc-ex">' + ex + (exm ? '<small>→ ' + esc(exm) + '</small>' : '') + '</div>' : '') + '</div>';
    }
    function renderDetail(d, tab) {
        tab = tab || 'samples';
        var langs = (d.supported_languages || []).map(function (x) { return '<i>' + esc(cap(dn(String(x)))) + '</i>'; }).join('');
        var topics = (d.topics || []).map(function (t) { var n = topicName(t.topic); return '<li><span>' + esc(n.base) + (n.tr ? ' <em>' + esc(n.tr) + '</em>' : '') + '</span><b>' + num(t.card_count) + '</b></li>'; }).join('');
        var samples = (d.sample_cards || []).map(sampleCard).join('');
        var desc = loc(d.description || '');
        $('stmBody').innerHTML =
            '<div class="stm-head">' + cover(d, true) + '<div>' +
            '<p class="stm-kicker">' + esc([cap(dn(d.language_code || '')), lvName(d.level_code || d.level_name), catName(d.category_name)].filter(Boolean).join(' · ')) + '</p>' +
            '<h2 id="stmTitle">' + esc(loc(d.title)) + '</h2>' +
            '<p class="stm-n">' + num(d.card_count) + ' ' + T('thẻ', Number(d.card_count) === 1 ? 'card' : 'cards') + ((d.topics || []).length ? ' · ' + d.topics.length + ' ' + T('chủ đề', 'topics') : '') + '</p>' +
            (langs ? '<div class="stm-langs"><span>' + T('Nghĩa bằng', 'Meanings in') + '</span>' + langs + '</div>' : '') +
            '</div></div>' +
            (desc ? '<p class="stm-desc">' + esc(desc) + '</p>' : '') +
            '<div class="stm-tabs"><button data-tab="samples" class="' + (tab === 'samples' ? 'on' : '') + '">' + T('Thẻ mẫu', 'Sample cards') + '</button>' +
            '<button data-tab="topics" class="' + (tab === 'topics' ? 'on' : '') + '">' + T('Chủ đề', 'Topics') + '</button></div>' +
            '<div class="stm-pane">' + (tab === 'samples'
                ? (samples ? '<div class="sc-grid">' + samples + '</div>' : '<p class="st-empty">' + T('Bộ thẻ này chưa có thẻ mẫu.', 'No sample cards yet.') + '</p>')
                : (topics ? '<ul class="stm-topics">' + topics + '</ul>' : '<p class="st-empty">' + T('Bộ thẻ này chưa chia chủ đề.', 'This deck has no topics.') + '</p>')) + '</div>' +
            '<div class="stm-foot"><p>' + T('Muốn học cả bộ? Mở MemDeck → <b>Bộ thẻ</b> → <b>+ Thêm</b> → <b>Tải từ Store</b>.', 'Want the full deck? Open MemDeck → <b>Decks</b> → <b>+ Add</b> → <b>Download from Store</b>.') + '</p>' +
            '<a class="btn btn-primary" href="guide.html#download">' + T('Tải plugin', 'Get the plugin') + '</a></div>';
        $('stmBody').querySelectorAll('.stm-tabs button').forEach(function (b) { b.onclick = function () { renderDetail(d, b.getAttribute('data-tab')); }; });
    }
    function openDetail(id) {
        var m = $('stModal'); m.hidden = false; document.body.classList.add('st-lock');
        requestAnimationFrame(function () { m.classList.add('open'); });
        $('stmBody').innerHTML = '<div class="stm-loading">' + T('Đang tải…', 'Loading…') + '</div>';
        if (location.hash !== '#deck-' + id) history.replaceState(null, '', '#deck-' + id);
        var p = detailCache[id] ? Promise.resolve(detailCache[id]) : api('/store/books/' + id);
        p.then(function (d) { detailCache[id] = d; m._d = d; renderDetail(d); })
         .catch(function () { $('stmBody').innerHTML = '<div class="stm-loading">' + T('Không tải được bộ thẻ này.', 'Could not load this deck.') + '</div>'; });
    }
    function closeDetail() {
        var m = $('stModal'); m.classList.remove('open'); document.body.classList.remove('st-lock'); m._d = null;
        setTimeout(function () { m.hidden = true; }, 220);
        if (/^#deck-/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
    }

    /* ---------- sự kiện ---------- */
    function init() {
        if (!$('stGrid')) return;
        var t;
        $('stQ').addEventListener('input', function () { clearTimeout(t); var v = this.value; t = setTimeout(function () { state.q = v.trim(); load(false); }, 320); });
        $('stSort').addEventListener('change', function () { state.sort = this.value; load(false); });
        $('stMeaning').addEventListener('change', function () { state.meaning = this.value; load(false); });
        document.addEventListener('click', function (e) {
            var c = e.target.closest('.st-chips .chip');
            if (c) { state[c.getAttribute('data-k')] = c.getAttribute('data-v'); if (c.getAttribute('data-k') === 'language') state.level = ''; load(false); return; }
            var k = e.target.closest('.st-card[data-id]');
            if (k) { openDetail(k.getAttribute('data-id')); return; }
            if (e.target.closest('[data-close]')) closeDetail();
        });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('stModal').hidden) closeDetail(); });
        $('stMore').addEventListener('click', function () { state.offset = state.books.length; load(true); });
        document.addEventListener('md:lang', function () {
            renderFacets(); if (state.books.length) renderGrid();
            var m = $('stModal'); if (!m.hidden && m._d) renderDetail(m._d);
        });
        var h = location.hash.match(/^#deck-(\d+)/);
        var hl = location.hash.match(/^#lang=([a-z]{2,3})/);
        if (hl) state.language = hl[1];
        load(false);
        if (h) openDetail(h[1]);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
