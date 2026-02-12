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
        // ❌ ĐÃ XÓA: adjustPagePadding() - Không ghi đè padding-top bằng JS
        initAutoHideHeader();
        initImageSliders();
    }
    
    // ==================== AUTO HIDE HEADER ON MOBILE ====================
    let lastScrollHandler = null;
    let touchHandlerRef = null;
    
    function initAutoHideHeader() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) {
            setTimeout(initAutoHideHeader, 100);
            return;
        }
        
        // Xóa sự kiện cũ
        if (lastScrollHandler) {
            window.removeEventListener('scroll', lastScrollHandler);
        }
        if (touchHandlerRef) {
            document.removeEventListener('touchstart', touchHandlerRef);
        }
        
        // DESKTOP: Luôn hiện header, không xử lý auto-hide
        if (window.innerWidth > 768) {
            navbar.classList.remove('hidden');
            return;
        }
        
        // ===== MOBILE: Auto-hide header =====
        let lastScroll = window.pageYOffset;
        let ticking = false;
        let isHidden = false;
        let touchStartY = 0;
        let touchStartTime = 0;
        
        // Kiểm tra vị trí đầu trang
        const isAtTop = () => window.pageYOffset < 50;
        
        // Kiểm tra vị trí cuối trang
        const isAtBottom = () => {
            const scrollY = window.scrollY;
            const visibleHeight = window.innerHeight;
            const pageHeight = document.documentElement.scrollHeight;
            return scrollY + visibleHeight >= pageHeight - 30;
        };
        
        // ===== SCROLL HANDLER =====
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            const atTop = isAtTop();
            const atBottom = isAtBottom();
            const scrollingDown = currentScroll > lastScroll;
            const scrollingUp = currentScroll < lastScroll;
            
            // TRƯỜNG HỢP ĐẶC BIỆT: Đầu trang hoặc cuối trang
            if (atTop || atBottom) {
                if (isHidden) {
                    navbar.classList.remove('hidden');
                    isHidden = false;
                }
                lastScroll = currentScroll;
                ticking = false;
                return;
            }
            
            // Scroll delta quá nhỏ -> bỏ qua
            if (Math.abs(currentScroll - lastScroll) < 5) {
                ticking = false;
                return;
            }
            
            // XỬ LÝ ẨN/HIỆN CHUẨN
            if (scrollingDown && currentScroll > 150 && !isHidden) {
                navbar.classList.add('hidden');
                isHidden = true;
            } 
            else if (scrollingUp && isHidden) {
                navbar.classList.remove('hidden');
                isHidden = false;
            }
            
            lastScroll = currentScroll;
            ticking = false;
        };
        
        // ===== TOUCH HANDLER - PHÂN BIỆT TAP VÀ SWIPE =====
        const handleTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        };
        
        const handleTouchEnd = (e) => {
            // Không xử lý nếu đang ở đầu hoặc cuối trang
            if (isAtTop() || isAtBottom()) return;
            
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndTime = Date.now();
            const distance = Math.abs(touchEndY - touchStartY);
            const duration = touchEndTime - touchStartTime;
            
            // CHỈ hiện header khi TAP (di chuyển < 10px, thời gian < 200ms)
            // KHÔNG hiện header khi SWIPE (đã xử lý bằng scroll)
            if (distance < 10 && duration < 200) {
                navbar.classList.remove('hidden');
                isHidden = false;
                
                // Tự động ẩn sau 3 giây nếu không scroll
                setTimeout(() => {
                    if (window.pageYOffset > 150 && !isAtTop() && !isAtBottom()) {
                        navbar.classList.add('hidden');
                        isHidden = true;
                    }
                }, 3000);
            }
        };
        
        // Throttle scroll với requestAnimationFrame
        const throttledScrollHandler = () => {
            if (!ticking) {
                window.requestAnimationFrame(handleScroll);
                ticking = true;
            }
        };
        
        // Lưu references
        lastScrollHandler = throttledScrollHandler;
        touchHandlerRef = handleTouchStart;
        
        // Add event listeners
        window.addEventListener('scroll', throttledScrollHandler, { passive: true });
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // RESET khi xoay màn hình
        window.addEventListener('orientationchange', function() {
            setTimeout(() => {
                navbar.classList.remove('hidden');
                isHidden = false;
            }, 100);
        });
    }
    
    // ==================== ACTIVE STATE ====================
    function handleActiveState() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const linkHref = link.getAttribute('href');
            const linkPage = linkHref.split('/').pop();
            
            if (currentPage === linkPage) {
                link.classList.add('active');
            }
            
            if ((currentPage === '' || currentPage === 'index.html' || currentPage === '../index.html') && 
                (linkHref === '../index.html' || linkHref === 'index.html' || linkHref === '/')) {
                link.classList.add('active');
            }
        });
    }
    
    // ==================== BACK TO TOP BUTTON ====================
    let backToTopHandlerRef = null;
    
    function initBackToTop() {
        const backToTop = document.querySelector('.back-to-top');
        if (!backToTop) return;
        
        // Xóa handler cũ
        if (backToTopHandlerRef) {
            window.removeEventListener('scroll', backToTopHandlerRef);
        }
        
        // Reset trạng thái
        backToTop.classList.remove('visible');
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
        backToTop.style.transform = 'translateY(20px)';
        
        let ticking = false;
        
        const updateBackToTop = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const pageHeight = document.documentElement.scrollHeight;
            
            // Kiểm tra cuối trang
            const atBottom = scrollPosition + windowHeight >= pageHeight - 30;
            const atTop = scrollPosition < 50;
            const scrolledEnough = scrollPosition > windowHeight * 0.6;
            
            // QUY TẮC HIỂN THỊ:
            // - Không hiển thị ở đầu trang
            // - Không hiển thị ở cuối trang
            // - Chỉ hiển thị khi scroll đủ xa và không ở biên
            const shouldShow = !atTop && !atBottom && scrolledEnough;
            
            if (shouldShow) {
                if (!backToTop.classList.contains('visible')) {
                    backToTop.classList.add('visible');
                }
            } else {
                if (backToTop.classList.contains('visible')) {
                    backToTop.classList.remove('visible');
                }
            }
            
            ticking = false;
        };
        
        const throttledUpdate = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateBackToTop);
                ticking = true;
            }
        };
        
        backToTopHandlerRef = throttledUpdate;
        window.addEventListener('scroll', throttledUpdate, { passive: true });
        
        // Click handler
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
            // Giữ nguyên code slider của bạn
        });
    }
    
    // ==================== GLOBAL EVENT LISTENERS ====================
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
    
    // Xử lý resize - KHÔNG gọi adjustPagePadding nữa
    const handleResize = debounce(() => {
        initAutoHideHeader();
        initBackToTop();
    }, 150);
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup khi unload
    window.addEventListener('beforeunload', () => {
        if (lastScrollHandler) {
            window.removeEventListener('scroll', lastScrollHandler);
        }
        if (backToTopHandlerRef) {
            window.removeEventListener('scroll', backToTopHandlerRef);
        }
        if (touchHandlerRef) {
            document.removeEventListener('touchstart', touchHandlerRef);
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
