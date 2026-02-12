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
        }
        
        // Chỉ áp dụng cho mobile
        if (window.innerWidth <= 768) {
            let lastScroll = 0;
            let ticking = false;
            let isHidden = false;
            
            const handleScroll = () => {
                const currentScroll = window.pageYOffset;
                
                // Tính toán direction
                const scrollingDown = currentScroll > lastScroll;
                const scrollingUp = currentScroll < lastScroll;
                const atTop = currentScroll < 50;
                const scrolledEnough = currentScroll > 150;
                
                if (scrollingDown && scrolledEnough && !isHidden) {
                    navbar.classList.add('hidden');
                    isHidden = true;
                } 
                else if ((scrollingUp || atTop) && isHidden) {
                    navbar.classList.remove('hidden');
                    isHidden = false;
                }
                
                lastScroll = currentScroll;
                ticking = false;
            };
            
            const throttledScrollHandler = () => {
                if (!ticking) {
                    window.requestAnimationFrame(handleScroll);
                    ticking = true;
                }
            };
            
            // Lưu reference để có thể xóa sau
            lastScrollHandler = throttledScrollHandler;
            
            // Thêm sự kiện
            window.addEventListener('scroll', throttledScrollHandler, { passive: true });
            
            // Hiện header khi tap (cho mobile UX tốt hơn)
            let tapTimeout;
            document.addEventListener('touchstart', () => {
                clearTimeout(tapTimeout);
                navbar.classList.remove('hidden');
                isHidden = false;
                
                // Auto hide sau 3 giây nếu không có tương tác
                tapTimeout = setTimeout(() => {
                    if (window.pageYOffset > 150 && !navbar.matches(':hover')) {
                        navbar.classList.add('hidden');
                        isHidden = true;
                    }
                }, 3000);
            });
        } else {
            // Trên desktop, đảm bảo header luôn hiển thị
            navbar.classList.remove('hidden');
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
