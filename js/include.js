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
        adjustPagePadding();
        initAutoHideHeader();
        initImageSliders();
    }
    
    // ==================== AUTO HIDE HEADER ON MOBILE ====================
    let lastScrollHandler = null;
    let touchHandlerRef = null;
    let touchEndHandlerRef = null;
    let backToTopHandlerRef = null; // THÊM: reference cho back-to-top
    
    function initAutoHideHeader() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) {
            setTimeout(initAutoHideHeader, 100);
            return;
        }
        
        // Xóa sự kiện cũ nếu có
        if (lastScrollHandler) {
            window.removeEventListener('scroll', lastScrollHandler);
        }
        if (touchHandlerRef) {
            document.removeEventListener('touchstart', touchHandlerRef);
        }
        if (touchEndHandlerRef) {
            document.removeEventListener('touchend', touchEndHandlerRef);
        }
        
        // Chỉ áp dụng cho mobile
        if (window.innerWidth <= 768) {
            let lastScroll = 0;
            let ticking = false;
            let isHidden = false;
            let touchStartY = 0;
            let touchStartTime = 0;
            let isScrolling = false;
            let scrollTimeout;
            
            // Hàm kiểm tra vị trí cuối trang
            const isAtBottom = () => {
                const scrollY = window.scrollY;
                const visibleHeight = window.innerHeight;
                const pageHeight = document.body.offsetHeight;
                return scrollY + visibleHeight >= pageHeight - 50; // 50px threshold
            };
            
            // Hàm xử lý scroll
            const handleScroll = () => {
                const currentScroll = window.pageYOffset;
                const atBottom = isAtBottom();
                
                // Tính toán direction
                const scrollingDown = currentScroll > lastScroll;
                const scrollingUp = currentScroll < lastScroll;
                const atTop = currentScroll < 50;
                const scrolledEnough = currentScroll > 150;
                
                // Đánh dấu đang scroll
                isScrolling = true;
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                }, 150);
                
                // XỬ LÝ HEADER - QUAN TRỌNG: KHÔNG ẩn khi ở cuối trang
                if (atBottom) {
                    // Ở cuối trang: LUÔN hiện header
                    if (isHidden) {
                        navbar.classList.remove('hidden');
                        isHidden = false;
                    }
                } else {
                    // Không ở cuối trang: xử lý bình thường
                    if (scrollingDown && scrolledEnough && !isHidden) {
                        navbar.classList.add('hidden');
                        isHidden = true;
                    } 
                    else if ((scrollingUp || atTop) && isHidden) {
                        navbar.classList.remove('hidden');
                        isHidden = false;
                    }
                }
                
                lastScroll = currentScroll;
                ticking = false;
            };
            
            // Hàm xử lý touch start
            const handleTouchStart = (e) => {
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
            };
            
            // Hàm xử lý touch end
            const handleTouchEnd = (e) => {
                if (isScrolling) return;
                if (isAtBottom()) return; // KHÔNG xử lý khi ở cuối trang
                
                const touchEndY = e.changedTouches[0].clientY;
                const touchEndTime = Date.now();
                const distance = Math.abs(touchEndY - touchStartY);
                const duration = touchEndTime - touchStartTime;
                
                if (distance < 10 && duration < 200) {
                    navbar.classList.remove('hidden');
                    isHidden = false;
                    
                    setTimeout(() => {
                        if (window.pageYOffset > 150 && !isScrolling && !isAtBottom()) {
                            navbar.classList.add('hidden');
                            isHidden = true;
                        }
                    }, 3000);
                }
            };
            
            const throttledScrollHandler = () => {
                if (!ticking) {
                    window.requestAnimationFrame(handleScroll);
                    ticking = true;
                }
            };
            
            // Lưu references
            lastScrollHandler = throttledScrollHandler;
            touchHandlerRef = handleTouchStart;
            touchEndHandlerRef = handleTouchEnd;
            
            // Thêm sự kiện
            window.addEventListener('scroll', throttledScrollHandler, { passive: true });
            document.addEventListener('touchstart', handleTouchStart, { passive: true });
            document.addEventListener('touchend', handleTouchEnd, { passive: true });
            
        } else {
            navbar.classList.remove('hidden');
        }
    }
    
    // ==================== BACK TO TOP BUTTON ====================
    function initBackToTop() {
        const backToTop = document.querySelector('.back-to-top');
        if (!backToTop) return;
        
        // Xóa handler cũ nếu có
        if (backToTopHandlerRef) {
            window.removeEventListener('scroll', backToTopHandlerRef);
        }
        
        // Thêm class
        if (!backToTop.classList.contains('back-to-top')) {
            backToTop.classList.add('back-to-top');
        }
        
        // CSS transitions
        backToTop.style.transition = 'opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease';
        
        let ticking = false;
        
        const updateBackToTop = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const pageHeight = document.body.offsetHeight;
            
            // CHỈ hiển thị khi:
            // 1. Scroll xuống > 80% màn hình
            // 2. KHÔNG ở cuối trang (tránh giật)
            const shouldShow = scrollPosition > windowHeight * 0.8 && 
                              (scrollPosition + windowHeight) < pageHeight - 100;
            
            if (shouldShow) {
                if (!backToTop.classList.contains('visible')) {
                    backToTop.classList.add('visible');
                    backToTop.style.opacity = '1';
                    backToTop.style.visibility = 'visible';
                    backToTop.style.transform = 'translateY(0)';
                }
            } else {
                if (backToTop.classList.contains('visible')) {
                    backToTop.classList.remove('visible');
                    backToTop.style.opacity = '0';
                    backToTop.style.visibility = 'hidden';
                    backToTop.style.transform = 'translateY(20px)';
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
        
        // Lưu reference để cleanup
        backToTopHandlerRef = throttledUpdate;
        
        // Thêm event listener
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
    
    // Xử lý active state
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
    
    // Điều chỉnh padding
    function adjustPagePadding() {
        const header = document.querySelector('.navbar');
        const page = document.querySelector('.page');
        
        if (header && page) {
            const headerHeight = header.offsetHeight;
            page.style.paddingTop = (headerHeight + 20) + 'px';
        }
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
    
    const handleResize = debounce(() => {
        adjustPagePadding();
        initAutoHideHeader();
        initBackToTop(); // THÊM: re-init back-to-top khi resize
    }, 150);
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup ĐẦY ĐỦ khi unload
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
        if (touchEndHandlerRef) {
            document.removeEventListener('touchend', touchEndHandlerRef);
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
