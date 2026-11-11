/* MemDeck web: song ngữ Việt / Anh.
   Phần tử có data-en="..." : nội dung tiếng Việt nằm sẵn trong HTML, tiếng Anh nằm trong data-en (có thể chứa thẻ HTML).
   Thuộc tính: data-en-placeholder, data-en-title, data-en-alt, data-en-aria-label, data-en-content (meta).
   Ngôn ngữ khác: để trình duyệt (Google Chrome) tự dịch. */
(function () {
    var KEY = 'memdeck_lang';
    var ATTRS = ['placeholder', 'title', 'alt', 'aria-label', 'content', 'src', 'poster', 'href'];
    function pick() {
        try {
            var q = new URLSearchParams(location.search).get('lang');
            if (q === 'vi' || q === 'en') { localStorage.setItem(KEY, q); return q; }
            var s = localStorage.getItem(KEY);
            if (s === 'vi' || s === 'en') return s;
        } catch (e) {}
        var n = (navigator.language || 'vi').toLowerCase();
        return n.indexOf('vi') === 0 ? 'vi' : 'en';
    }
    var lang = pick();
    window.MD_LANG = lang;
    document.documentElement.lang = lang;

    function applyEl(el) {
        if (el.hasAttribute('data-en')) {
            if (!el.hasAttribute('data-vi')) el.setAttribute('data-vi', el.innerHTML);
            var v = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-vi');
            if (el.innerHTML !== v) el.innerHTML = v;
        }
        for (var i = 0; i < ATTRS.length; i++) {
            var a = ATTRS[i], k = 'data-en-' + a;
            if (el.hasAttribute(k)) {
                if (!el.hasAttribute('data-vi-' + a)) el.setAttribute('data-vi-' + a, el.getAttribute(a) || '');
                el.setAttribute(a, lang === 'en' ? el.getAttribute(k) : el.getAttribute('data-vi-' + a));
            }
        }
    }
    function apply(root) {
        root = root || document;
        if (root.nodeType === 1) applyEl(root);
        var sel = '[data-en],[data-en-placeholder],[data-en-title],[data-en-alt],[data-en-aria-label],[data-en-content],[data-en-src],[data-en-poster],[data-en-href]';
        var list = root.querySelectorAll ? root.querySelectorAll(sel) : [];
        for (var i = 0; i < list.length; i++) applyEl(list[i]);
        var sw = document.querySelectorAll('.lang-switch button');
        for (var j = 0; j < sw.length; j++) sw[j].classList.toggle('on', sw[j].getAttribute('data-lang') === lang);
    }
    function set(l) {
        if (l !== 'vi' && l !== 'en') return;
        lang = l; window.MD_LANG = l; document.documentElement.lang = l;
        try { localStorage.setItem(KEY, l); } catch (e) {}
        apply(document);
        document.dispatchEvent(new CustomEvent('md:lang', { detail: l }));
    }
    window.MD_I18N = { apply: apply, set: set, t: function (vi, en) { return lang === 'en' ? en : vi; } };

    document.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('.lang-switch button');
        if (b) { e.preventDefault(); set(b.getAttribute('data-lang')); }
    });
    function start() {
        apply(document);
        new MutationObserver(function (ms) {
            ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) apply(n); }); });
        }).observe(document.body, { childList: true, subtree: true });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
