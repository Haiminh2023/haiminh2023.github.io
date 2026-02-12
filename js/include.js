// js/include.js
document.addEventListener('DOMContentLoaded', function() {
    // ==================== LOAD HEADER ====================
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        const isInPages = window.location.pathname.includes('/pages/');
        const headerPath = isInPages ? '../includes/header.html' : 'includes/header.html';
        
        fetch(headerPath)
            .then(response => {
                if (!response.ok) throw new Error('Không tìm thấy header');
                return response.text();
            })
            .then(headerHTML => {
                headerPlaceholder.outerHTML = headerHTML;
                setTimeout(initComponents, 50);
            })
            .catch(error => {
                console.error('Lỗi load header:', error);
                // Fallback header
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
    
    // ==================== LOAD FOOTER ====================
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const isInPages = window.location.pathname.includes('/pages/');
        const footerPath = isInPages ? '../includes/footer.html' : 'includes/footer.html';
        
        fetch(footerPath)
            .then(response => {
                if (!response.ok) throw new Error('Không tìm thấy footer');
                return response.text();
            })
            .then(footerHTML => {
                footerPlaceholder.outerHTML = footerHTML;
                setTimeout(initBackToTop, 50);
            })
            .catch(error => {
                console.error('Lỗi load footer:', error);
                // Fallback footer
                footerPlaceholder.outerHTML = `
                    <footer class="footer">
                        © 2026 Doc Online
                    </footer>
                    <a href="#" class="back-to-top">↑</a>
                `;
                setTimeout(initBackToTop, 50);
            });
    }
    
    // ==================== INITIALIZE ALL COMPONENTS ====================
    function initComponents() {
        handleActiveState();
        initAutoHideHeader();
        initImageSliders();
    }
    
    // ==================== AUTO HIDE HEADER ON MOBILE ====================
    let lastScrollHandler = null;
    let resizeTimeout = null;
    
    function initAutoHideHeader() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
    
        if (lastScrollHandler) {
            window.removeEventListener('scroll', lastScrollHandler);
        }
    
        // Desktop: luôn hiện header
        if (window.innerWidth > 768) {
            navbar.classList.remove('hidden');
            return;
        }
    
        // Reset trạng thái
        navbar.classList.remove('hidden');
        let lastScroll = window.pageYOffset;
        let isHidden = false;
        let ticking = false;
        let atBottom = false;
    
        const isAtBottom = () => {
            const scrollY = window.scrollY;
            const visibleHeight = window.innerHeight;
            const pageHeight = document.documentElement.scrollHeight;
            return scrollY + visibleHeight >= pageHeight - 10;
        };
    
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            const scrollingDown = currentScroll > lastScroll;
            const scrollingUp = currentScroll < lastScroll;
            const atTop = currentScroll < 50;
            atBottom = isAtBottom();
    
            // Ở đầu trang: LUÔN hiện header
            if (atTop) {
                if (isHidden) {
                    navbar.classList.remove('hidden');
                    isHidden = false;
                }
                lastScroll = currentScroll;
                ticking = false;
                return;
            }
    
            // Ở cuối trang: LUÔN hiện header
            if (atBottom) {
                if (isHidden) {
                    navbar.classList.remove('hidden');
                    isHidden = false;
                }
                lastScroll = currentScroll;
                ticking = false;
                return;
            }
    
            // Giữa trang: ẩn khi vuốt xuống, hiện khi vuốt lên
            const delta = Math.abs(currentScroll - lastScroll);
            if (delta < 5) {
                ticking = false;
                return;
            }
    
            if (scrollingDown && currentScroll > 150 && !isHidden) {
                navbar.classList.add('hidden');
                isHidden = true;
            } else if (scrollingUp && isHidden) {
                navbar.classList.remove('hidden');
                isHidden = false;
            }
    
            lastScroll = currentScroll;
            ticking = false;
        };
    
        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        };
    
        lastScrollHandler = scrollHandler;
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }
    
    // Xử lý active state cho navigation
    function handleActiveState() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const linkHref = link.getAttribute('href');
            const linkPage = linkHref.split('/').pop();
            
            // Kiểm tra active
            if (currentPage === linkPage) {
                link.classList.add('active');
            }
            
            // Xử lý trang chủ
            if ((currentPage === '' || currentPage === 'index.html' || currentPage === '../index.html') && 
                (linkHref === '../index.html' || linkHref === 'index.html' || linkHref === '/')) {
                link.classList.add('active');
            }
        });
    }
    
    
    // Khởi tạo back to top button
    function initBackToTop() {
        const backToTop = document.querySelector('.back-to-top');
        if (!backToTop) return;
        
        // Thêm class nếu chưa có
        if (!backToTop.classList.contains('back-to-top')) {
            backToTop.classList.add('back-to-top');
        }
        
        
        let backTicking = false;
        
        const updateBackToTop = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
        
            if (scrollPosition > windowHeight * 0.8) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        
            backTicking = false;
        };
        
        const scrollHandler = () => {
            if (!backTicking) {
                requestAnimationFrame(updateBackToTop);
                backTicking = true;
            }
        };
        
        window.addEventListener('scroll', scrollHandler, { passive: true });

        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Kiểm tra ban đầu
        updateBackToTop();
    }
    
    // ==================== INIT IMAGE SLIDERS ====================
    function initImageSliders() {
        const sliders = document.querySelectorAll('.image-slider');
        if (sliders.length === 0) return;
        
        sliders.forEach(slider => {
            // ... (giữ nguyên phần slider code của bạn)
            // (Đã có trong code bạn cung cấp)
        });
    }
    
    // ==================== GLOBAL EVENT LISTENERS ====================
    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Xử lý resize với debounce
    const handleResize = debounce(() => {
        initAutoHideHeader(); // Re-init header behavior
    }, 150);
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup khi trang bị unload
    window.addEventListener('beforeunload', () => {
        if (lastScrollHandler) {
            window.removeEventListener('scroll', lastScrollHandler);
        }
        window.removeEventListener('resize', handleResize);
    });
    
    // Khởi tạo lần đầu
    setTimeout(() => {
        if (document.querySelector('.navbar')) {
            initComponents();
        }
    }, 100);
});
