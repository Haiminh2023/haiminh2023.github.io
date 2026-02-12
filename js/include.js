document.addEventListener('DOMContentLoaded', function () {

    /* ================= LOAD HEADER ================= */
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        const isInPages = window.location.pathname.includes('/pages/');
        const headerPath = isInPages ? '../includes/header.html' : 'includes/header.html';

        fetch(headerPath)
            .then(res => res.text())
            .then(html => {
                headerPlaceholder.outerHTML = html;
                setTimeout(initAll, 50);
            });
    }

    /* ================= LOAD FOOTER ================= */
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const isInPages = window.location.pathname.includes('/pages/');
        const footerPath = isInPages ? '../includes/footer.html' : 'includes/footer.html';

        fetch(footerPath)
            .then(res => res.text())
            .then(html => {
                footerPlaceholder.outerHTML = html;
                setTimeout(initBackToTop, 50);
            });
    }

    /* ================= INIT ALL ================= */
    function initAll() {
        syncBodyPadding();
        initAutoHideHeader();
        initBackToTop();
        handleActiveState();
    }

    /* ================= SYNC BODY PADDING ================= */
    function syncBodyPadding() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const height = navbar.offsetHeight;
        document.body.style.paddingTop = height + "px";
    }

    window.addEventListener('resize', syncBodyPadding);

    /* ================= AUTO HIDE HEADER ================= */
    function initAutoHideHeader() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let lastScroll = 0;
        let ticking = false;

        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            const scrollingDown = currentScroll > lastScroll;
            const scrollingUp = currentScroll < lastScroll;

            if (window.innerWidth <= 768) {
                if (scrollingDown && currentScroll > 150) {
                    navbar.classList.add('hidden');
                } else if (scrollingUp || currentScroll < 50) {
                    navbar.classList.remove('hidden');
                }
            } else {
                navbar.classList.remove('hidden');
            }

            lastScroll = currentScroll;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        }, { passive: true });
    }

    /* ================= BACK TO TOP ================= */
    function initBackToTop() {
        const btn = document.querySelector('.back-to-top');
        if (!btn) return;

        const update = () => {
            if (window.scrollY > window.innerHeight * 0.7) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', update, { passive: true });

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        update();
    }

    /* ================= ACTIVE NAV ================= */
    function handleActiveState() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = document.querySelectorAll('.nav-menu a');

        links.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('href').split('/').pop();
            if (currentPage === linkPage) {
                link.classList.add('active');
            }
        });
    }
});
