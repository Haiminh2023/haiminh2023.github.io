/* Trang chủ: vài bộ thẻ nổi bật lấy trực tiếp từ kho (API chỉ đọc). Lỗi mạng thì ẩn khối này. */
(function () {
    var API = window.MD_STORE_API || 'https://api.doc-online.io.vn/api/hoc/public';
    try { var q = new URLSearchParams(location.search).get('api'); if (q && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(q)) API = q.replace(/\/$/, ''); } catch (e) {}
    var box = document.getElementById('homeDecks'), grid = document.getElementById('homeDeckGrid');
    if (!box || !grid) return;
    var data = null;
    var L = function () { return window.MD_LANG === 'en' ? 'en' : 'vi'; };
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    function loc(s) { var p = String(s || '').split('|'), m = {}; p.slice(1).forEach(function (x) { var k = x.indexOf('='); if (k > 0) m[x.slice(0, k).trim()] = x.slice(k + 1).trim(); }); return m[L()] || p[0]; }
    function dn(c) { try { var n = new Intl.DisplayNames([L()], { type: 'language' }).of(c); return n.charAt(0).toUpperCase() + n.slice(1); } catch (e) { return c.toUpperCase(); } }
    var G = { ja: '日', zh: '中', ko: '한', en: 'Aa', fr: 'Fr', de: 'De', es: 'Es', ru: 'Ру', th: 'ไท' };
    function render() {
        if (!data || !data.length) return;
        grid.innerHTML = data.map(function (b) {
            var c = (b.language_code || '').toLowerCase();
            var img = b.cover_image_url ? '<img src="' + esc(b.cover_image_url) + '" alt="" loading="lazy" onerror="this.remove()">' : '';
            return '<a class="st-card" href="pages/store.html#deck-' + b.id + '"><div class="st-cover l-' + esc(c) + '"><span>' + esc(G[c] || c.toUpperCase()) + '</span><em>' + esc(dn(c)) + '</em>' + img + '</div>' +
                '<div class="st-info"><h3>' + esc(loc(b.title)) + '</h3><p class="st-meta">' + esc(b.level_name || '') + '</p>' +
                '<p class="st-n">' + Number(b.card_count || 0).toLocaleString(L() === 'en' ? 'en-US' : 'vi-VN') + ' ' + (L() === 'en' ? (Number(b.card_count) === 1 ? 'card' : 'cards') : 'thẻ') + '</p></div></a>';
        }).join('');
        box.hidden = false;
    }
    fetch(API + '/store/browse?sort=featured&limit=6').then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(function (j) { data = (j && j.data && j.data.books) || []; render(); }).catch(function () {});
    document.addEventListener('md:lang', render);
})();
