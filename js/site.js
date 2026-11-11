// js/site.js – hiệu ứng cho giao diện mới (trang chủ + tính năng)
(function () {
    'use strict';

    /* ----- Hiện dần khi cuộn ----- */
    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        items.forEach(function (el) { io.observe(el); });
    } else {
        items.forEach(function (el) { el.classList.add('in'); });
    }

    /* ----- Tour tính năng: tab + tự chuyển sau 6 giây ----- */
    var tour = document.getElementById('tourBox');
    if (tour) {
        var tabs = Array.prototype.slice.call(tour.querySelectorAll('.tour-tab'));
        var shots = tour.querySelectorAll('.tour-device img');
        var idx = 0, timer = null, paused = false;
        function show(i) {
            idx = (i + tabs.length) % tabs.length;
            tabs.forEach(function (t, k) {
                t.classList.toggle('on', k === idx);
                t.setAttribute('aria-selected', k === idx ? 'true' : 'false');
                // khởi động lại thanh tiến trình
                var bar = t.querySelector('.bar i');
                if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
            });
            var id = tabs[idx].getAttribute('data-shot');
            shots.forEach(function (img) { img.classList.toggle('on', img.getAttribute('data-id') === id); });
            restart();
        }
        function restart() {
            clearTimeout(timer);
            if (!paused) timer = setTimeout(function () { show(idx + 1); }, 6000);
        }
        tabs.forEach(function (t, k) { t.addEventListener('click', function () { show(k); }); });
        tour.addEventListener('mouseenter', function () { paused = true; tour.classList.add('paused'); clearTimeout(timer); });
        tour.addEventListener('mouseleave', function () { paused = false; tour.classList.remove('paused'); restart(); });
        // chỉ chạy khi tour đang trên màn hình
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (en) {
                if (en[0].isIntersecting) { if (!timer) restart(); } else { clearTimeout(timer); timer = null; }
            }, { threshold: 0.2 }).observe(tour);
        } else { restart(); }
    }

    /* ----- Video giới thiệu ----- */
    var video = document.getElementById('introVideo');
    var frame = document.getElementById('videoFrame');
    var playBtn = document.getElementById('videoPlay');
    function playVideo(t) {
        if (!video) return;
        if (typeof t === 'number') { try { video.currentTime = t; } catch (e) {} }
        frame.classList.add('playing');
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
    }
    if (playBtn) playBtn.addEventListener('click', function () { playVideo(); });
    if (video) video.addEventListener('play', function () { frame.classList.add('playing'); });
    document.querySelectorAll('.video-chips button').forEach(function (b) {
        b.addEventListener('click', function () {
            playVideo(parseFloat(b.getAttribute('data-t')) || 0);
            frame.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });

    /* ----- Trang tính năng: menu con dính + đánh dấu mục đang xem ----- */
    var sub = document.querySelector('.subnav');
    if (sub) {
        var links = Array.prototype.slice.call(sub.querySelectorAll('a'));
        var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
        function navH() {
            var nb = document.querySelector('.navbar');
            var h = nb && !nb.classList.contains('hidden') ? nb.offsetHeight : 0;
            document.documentElement.style.setProperty('--nav-h', h + 'px');
        }
        setInterval(navH, 300);
        function mark() {
            var y = window.scrollY + 180, cur = secs[0];
            secs.forEach(function (s) { if (s.offsetTop <= y) cur = s; });
            links.forEach(function (a) {
                var on = cur && a.getAttribute('href') === '#' + cur.id;
                a.classList.toggle('on', on);
                if (on && a.scrollIntoView && sub.dataset.last !== cur.id) {
                    sub.dataset.last = cur.id;
                    var w = sub.querySelector('.wrap');
                    w.scrollTo({ left: a.offsetLeft - w.offsetLeft - 16, behavior: 'smooth' });
                }
            });
        }
        window.addEventListener('scroll', mark, { passive: true });
        mark();
    }
})();
