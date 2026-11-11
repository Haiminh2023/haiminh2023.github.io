/* Trang hướng dẫn: tab thiết bị, menu bên trái theo mục đang xem, slider ảnh Android */
(function () {
    var tabs = document.querySelectorAll('.g-tabs button');
    tabs.forEach(function (b) {
        b.addEventListener('click', function () {
            tabs.forEach(function (x) { x.classList.toggle('on', x === b); });
            document.querySelectorAll('.g-pane').forEach(function (p) { p.classList.toggle('on', p.id === 'dev-' + b.getAttribute('data-dev')); });
        });
    });
    var links = Array.prototype.slice.call(document.querySelectorAll('.g-side a'));
    var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    function mark() {
        var y = window.scrollY + 160, cur = 0;
        secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
        links.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
    }
    window.addEventListener('scroll', mark, { passive: true }); mark();
    links.forEach(function (a) {
        a.addEventListener('click', function (e) {
            var t = document.querySelector(a.getAttribute('href')); if (!t) return;
            e.preventDefault();
            var nb = document.querySelector('.navbar');
            window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - (nb ? nb.offsetHeight : 0) - 20, behavior: 'smooth' });
            history.replaceState(null, '', a.getAttribute('href'));
        });
    });
    document.querySelectorAll('[data-slider]').forEach(function (sl) {
        var track = sl.querySelector('.g-track'), n = track.children.length, i = 0, dots = sl.querySelector('.g-dots');
        for (var k = 0; k < n; k++) { var d = document.createElement('button'); d.type = 'button'; d.setAttribute('aria-label', String(k + 1)); dots.appendChild(d); }
        function go(j) {
            i = Math.max(0, Math.min(n - 1, j));
            track.style.transform = 'translateX(' + (-100 * i) + '%)';
            Array.prototype.forEach.call(dots.children, function (d, k) { d.classList.toggle('on', k === i); });
            sl.querySelector('[data-prev]').disabled = i === 0; sl.querySelector('[data-next]').disabled = i === n - 1;
        }
        dots.addEventListener('click', function (e) { var d = e.target.closest('button'); if (d) go(Array.prototype.indexOf.call(dots.children, d)); });
        sl.querySelector('[data-prev]').addEventListener('click', function () { go(i - 1); });
        sl.querySelector('[data-next]').addEventListener('click', function () { go(i + 1); });
        var x0 = null;
        track.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1)); x0 = null; });
        go(0);
    });
    // mở đúng tab khi vào bằng link #download / #installation từ nút nổi
    if (location.hash) { var t = document.querySelector(location.hash); if (t) setTimeout(function () { var nb = document.querySelector('.navbar'); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - (nb ? nb.offsetHeight : 0) - 20 }); }, 300); }
})();
