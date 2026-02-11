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
        adjustPagePadding();
        initAutoHideHeader();
        initImageSliders();
    }
    
    // ==================== AUTO HIDE HEADER ON MOBILE ====================
    let lastScrollHandler = null;
    let resizeTimeout = null;
    
    function initAutoHideHeader() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) {
            setTimeout(initAutoHideHeader, 100);
            return;
        }
        
        // Xóa sự kiện cũ nếu có
        if (lastScrollHandler) {
            window.removeEventListener('scroll', lastScrollHandler);
            document.removeEventListener('touchstart', handleTap);
            document.removeEventListener('touchend', handleTouchEnd);
        }
        
        // Chỉ áp dụng cho mobile
        if (window.innerWidth <= 768) {
            let lastScroll = 0;
            let ticking = false;
            let isHidden = false;
            let touchStartY = 0;
            let touchStartTime = 0;
            let isTouching = false;
            let scrollDisabled = false;
            
            // Hàm xử lý touch start
            const handleTap = (e) => {
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
                isTouching = true;
                
                // Chỉ hiện header nếu đang ẩn và không phải đang scroll
                if (isHidden && !scrollDisabled) {
                    navbar.classList.remove('hidden');
                    isHidden = false;
                    
                    // Tạm thời disable scroll detection trong 300ms
                    scrollDisabled = true;
                    setTimeout(() => {
                        scrollDisabled = false;
                    }, 300);
                }
            };
            
            // Hàm xử lý touch end - phân biệt tap và swipe
            const handleTouchEnd = (e) => {
                const touchEndY = e.changedTouches[0].clientY;
                const touchEndTime = Date.now();
                const distance = Math.abs(touchEndY - touchStartY);
                const duration = touchEndTime - touchStartTime;
                
                // Chỉ coi là tap nếu di chuyển ít và thời gian ngắn
                if (distance < 10 && duration < 200) {
                    // Đây là tap thực sự - hiện header
                    navbar.classList.remove('hidden');
                    isHidden = false;
                    
                    // Tạm thời disable auto-hide trong 2 giây
                    clearTimeout(autoHideTimeout);
                    autoHideTimeout = setTimeout(() => {
                        if (window.pageYOffset > 150 && !isTouching) {
                            navbar.classList.add('hidden');
                            isHidden = true;
                        }
                    }, 2000);
                }
                
                isTouching = false;
            };
            
            let autoHideTimeout;
            
            const handleScroll = () => {
                // Bỏ qua nếu đang trong thời gian chặn scroll detection
                if (scrollDisabled) return;
                
                const currentScroll = window.pageYOffset;
                const scrollDelta = currentScroll - lastScroll;
                
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        // Chỉ xử lý nếu scroll đủ nhiều
                        if (Math.abs(scrollDelta) > 5) {
                            const scrollingDown = currentScroll > lastScroll;
                            const atTop = currentScroll < 50;
                            
                            // Vuốt xuống - ẩn header
                            if (scrollingDown && currentScroll > 100 && !isHidden) {
                                navbar.classList.add('hidden');
                                isHidden = true;
                            } 
                            // Vuốt lên hoặc ở top - hiện header
                            else if ((!scrollingDown || atTop) && isHidden) {
                                navbar.classList.remove('hidden');
                                isHidden = false;
                            }
                        }
                        
                        lastScroll = currentScroll;
                        ticking = false;
                    });
                    
                    ticking = true;
                }
            };
            
            // Lưu reference để có thể xóa sau
            lastScrollHandler = handleScroll;
            
            // Thêm sự kiện với passive: true để tăng performance
            window.addEventListener('scroll', handleScroll, { passive: true });
            document.addEventListener('touchstart', handleTap, { passive: true });
            document.addEventListener('touchend', handleTouchEnd, { passive: true });
            
            // Hiện header khi hover (cho tablet có mouse)
            navbar.addEventListener('mouseenter', () => {
                if (isHidden) {
                    navbar.classList.remove('hidden');
                    isHidden = false;
                }
            });
            
            // Auto-hide khi mouse leave (chỉ trên tablet/desktop)
            navbar.addEventListener('mouseleave', () => {
                if (!isTouching && window.pageYOffset > 150 && window.innerWidth <= 768) {
                    setTimeout(() => {
                        if (!navbar.matches(':hover') && !isTouching) {
                            navbar.classList.add('hidden');
                            isHidden = true;
                        }
                    }, 500);
                }
            });
            
        } else {
            // Trên desktop, đảm bảo header luôn hiển thị
            navbar.classList.remove('hidden');
            
            // Thêm hiệu ứng mượt mà cho desktop scroll
            let desktopLastScroll = 0;
            const handleDesktopScroll = () => {
                const currentScroll = window.pageYOffset;
                const scrollingDown = currentScroll > desktopLastScroll;
                
                if (scrollingDown && currentScroll > 100) {
                    navbar.style.transform = 'translateY(-10px)';
                    navbar.style.opacity = '0.95';
                } else {
                    navbar.style.transform = 'translateY(0)';
                    navbar.style.opacity = '1';
                }
                
                desktopLastScroll = currentScroll;
            };
            
            window.addEventListener('scroll', handleDesktopScroll, { passive: true });
            lastScrollHandler = handleDesktopScroll;
        }
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
    
    // Tự động điều chỉnh padding-top cho content
    function adjustPagePadding() {
        const header = document.querySelector('.navbar');
        const page = document.querySelector('.page');
        
        if (header && page) {
            const headerHeight = header.offsetHeight;
            page.style.paddingTop = (headerHeight + 20) + 'px';
        }
    }
    
    // Khởi tạo back to top button
    function initBackToTop() {
        const backToTop = document.querySelector('.back-to-top');
        if (!backToTop) return;
        
        // Thêm class nếu chưa có
        if (!backToTop.classList.contains('back-to-top')) {
            backToTop.classList.add('back-to-top');
        }
        
        // CSS transitions
        backToTop.style.transition = 'opacity 0.3s, transform 0.3s, visibility 0.3s';
        
        const updateBackToTop = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Hiển thị khi cuộn xuống 80% chiều cao màn hình
            if (scrollPosition > windowHeight * 0.8) {
                backToTop.classList.add('visible');
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
                backToTop.style.transform = 'translateY(0)';
            } else {
                backToTop.classList.remove('visible');
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
                backToTop.style.transform = 'translateY(20px)';
            }
        };
        
        window.addEventListener('scroll', updateBackToTop, { passive: true });
        
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
        adjustPagePadding();
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
