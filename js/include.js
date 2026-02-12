// js/include.js
document.addEventListener('DOMContentLoaded', function () {

    /* ================= LOAD HEADER ================= */

    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        const isInPages = window.location.pathname.includes('/pages/');
        const headerPath = isInPages ? '../includes/header.html' : 'includes/header.html';

        fetch(headerPath)
            .then(res => {
                if (!res.ok) throw new Error();
                return res.text();
            })
            .then(html => {
                headerPlaceholder.outerHTML = html;
                setTimeout(initComponents, 50);
            })
            .catch(() => {
                headerPlaceholder.outerHTML = `
                    <header class="navbar">
                        <div class="nav-inner">
                            <a class="logo" href="../index.html">❄ Đọc Online</a>
                            <nav class="nav-menu">
                                <a href="../index.html">Trang chủ</a>
                                <a href="features.html">Tính năng</a>
                                <a href="guide.html">Hướng dẫn</a>
                                <a href="pricing.html">Giá</a>
                                <a href="contact.html">Liên hệ</a>
                            </nav>
                        </div>
                    </header>
                `;
                setTimeout(initComponents, 50);
            });
    }

    /* ================= LOAD FOOTER ================= */

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const isInPages = window.location.pathname.includes('/pages/');
        const footerPath = isInPages ? '../includes/footer.html' : 'includes/footer.html';

        fetch(footerPath)
            .then(res => {
                if (!res.ok) throw new Error();
                return res.text();
            })
            .then(html => {
                footerPlaceholder.outerHTML = html;
                setTimeout(initBackToTop, 50);
            })
            .catch(() => {
                footerPlaceholder.outerHTML = `
                    <footer class="footer">© 2026 Doc Online</footer>
                    <a href="#" class="back-to-top">↑</a>
                `;
                setTimeout(initBackToTop, 50);
            });
    }

    /* ================= INIT ALL ================= */

    function initComponents() {
        handleActiveState();
        initAutoHideHeader();
        initImageSliders();
    }

    /* =====================================================
       AUTO HIDE HEADER (MƯỢT – KHÔNG GIẬT – KHÔNG TAP BUG)
    ===================================================== */

    let headerScrollHandler = null;

    function initAutoHideHeader() {

        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        // Xóa listener cũ nếu có
        if (headerScrollHandler) {
            window.removeEventListener('scroll', headerScrollHandler);
            headerScrollHandler = null;
        }

        // Desktop luôn hiển thị
        if (window.innerWidth > 768) {
            navbar.classList.remove('hidden');
            return;
        }

        let lastScroll = window.pageYOffset;
        let isHidden = false;
        let ticking = false;

        const handleScroll = () => {

            const current = window.pageYOffset;
            const delta = current - lastScroll;

            // Nếu gần top → luôn hiện
            if (current < 80) {
                navbar.classList.remove('hidden');
                isHidden = false;
                lastScroll = current;
                ticking = false;
                return;
            }

            // Chỉ phản ứng nếu cuộn đủ lớn (chống rung tay)
            if (Math.abs(delta) < 8) {
                ticking = false;
                return;
            }

            if (delta > 0 && !isHidden) {
                // Cuộn xuống
                navbar.classList.add('hidden');
                isHidden = true;
            } else if (delta < 0 && isHidden) {
                // Cuộn lên
                navbar.classList.remove('hidden');
                isHidden = false;
            }

            lastScroll = current;
            ticking = false;
        };

        headerScrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        };

        window.addEventListener('scroll', headerScrollHandler, { passive: true });
    }

    /* ================= ACTIVE NAV ================= */

    function handleActiveState() {
        const currentPage =
            window.location.pathname.split('/').pop() || 'index.html';

        const links = document.querySelectorAll('.nav-menu a');

        links.forEach(link => {
            link.classList.remove('active');
            const page = link.getAttribute('href').split('/').pop();

            if (currentPage === page) {
                link.classList.add('active');
            }

            if (
                (currentPage === '' || currentPage === 'index.html') &&
                (page === 'index.html')
            ) {
                link.classList.add('active');
            }
        });
    }

    /* ================= BACK TO TOP ================= */

    function initBackToTop() {
        const btn = document.querySelector('.back-to-top');
        if (!btn) return;

        const onScroll = () => {
            if (window.scrollY > window.innerHeight * 0.8) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        btn.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        onScroll();
    }

    /* ================= IMAGE SLIDER (GIỮ NGUYÊN) ================= */

    function initImageSliders() {
        const sliders = document.querySelectorAll('.image-slider');
        if (!sliders.length) return;

        sliders.forEach(slider => {
            // Giữ nguyên code slider của bạn
        });
    }

    /* ================= RESIZE ================= */

    let resizeTimeout;

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initAutoHideHeader();
        }, 150);
    });

});
