// js/include.js
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== LOAD HEADER ====================
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        // Xác định đường dẫn đúng
        const isInPages = window.location.pathname.includes('/pages/');
        const headerPath = isInPages ? '../includes/header.html' : 'includes/header.html';
        
        fetch(headerPath)
            .then(response => {
                if (!response.ok) throw new Error('Không tìm thấy header');
                return response.text();
            })
            .then(headerHTML => {
                headerPlaceholder.outerHTML = headerHTML;
                setTimeout(() => {
                    handleActiveState();
                    adjustPagePadding();
                    initAutoHideHeader();
                }, 50);
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
                setTimeout(() => {
                    handleActiveState();
                    adjustPagePadding();
                    initAutoHideHeader(); // <== THÊM DÒNG NÀY
                }, 50);
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
    
    // ==================== FUNCTIONS ====================
    // ==================== AUTO HIDE HEADER ON MOBILE ====================
    function initAutoHideHeader() {
        console.log('🔄 Đang khởi tạo auto-hide header...');
        
        const navbar = document.querySelector('.navbar');
        if (!navbar) {
            console.error('❌ Không tìm thấy .navbar');
            setTimeout(initAutoHideHeader, 100);
            return;
        }
        
        console.log('✅ Tìm thấy navbar');
        
        const mobileBreakpoint = 768;
        
        // Chỉ áp dụng trên mobile
        if (window.innerWidth <= mobileBreakpoint) {
            console.log('📱 Đang ở chế độ mobile');
            
            let lastScrollY = window.scrollY;
            let ticking = false;
            
            function updateNavbar() {
                const currentScrollY = window.scrollY;
                
                // Ẩn header khi scroll xuống > 100px
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    if (!navbar.classList.contains('hidden')) {
                        console.log('⬇️ Ẩn header');
                        navbar.classList.add('hidden');
                    }
                } 
                // Hiện header khi scroll lên
                else if (currentScrollY < lastScrollY) {
                    if (navbar.classList.contains('hidden')) {
                        console.log('⬆️ Hiện header');
                        navbar.classList.remove('hidden');
                    }
                }
                
                lastScrollY = currentScrollY;
                ticking = false;
            }
            
            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(updateNavbar);
                    ticking = true;
                }
            }, { passive: true });
            
            // Reset khi resize
            window.addEventListener('resize', function() {
                if (window.innerWidth > mobileBreakpoint) {
                    navbar.classList.remove('hidden');
                }
            });
            
            console.log('🎯 Auto-hide header đã kích hoạt');
        }
    }
    // Xử lý active state cho navigation
    function handleActiveState() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            // Lấy phần cuối của href
            const linkHref = link.getAttribute('href');
            const linkPage = linkHref.split('/').pop();
            
            // Kiểm tra active
            if (currentPage === linkPage) {
                link.classList.add('active');
            }
            
            // Xử lý trang chủ (index.html hoặc /)
            if ((currentPage === '' || currentPage === 'index.html') && link.classList.contains('nav-home')) {
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
        
        // Ẩn ban đầu
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
        backToTop.style.transform = 'translateY(20px)';
        
        // Thêm class nếu chưa có
        if (!backToTop.classList.contains('back-to-top')) {
            backToTop.classList.add('back-to-top');
        }
        
        window.addEventListener('scroll', function() {
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
        });
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Kiểm tra ban đầu
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        if (scrollPosition > windowHeight * 0.8) {
            backToTop.classList.add('visible');
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
            backToTop.style.transform = 'translateY(0)';
        }
    }
    
    // Gọi khi resize
    window.addEventListener('resize', adjustPagePadding);

    // ==================== INIT IMAGE SLIDERS ====================
    function initImageSliders() {
        const sliders = document.querySelectorAll('.image-slider');
        if (sliders.length === 0) return;
        
        sliders.forEach(slider => {
            const track = slider.querySelector('.slider-track');
            const slides = slider.querySelectorAll('.slider-slide');
            const prevBtn = slider.querySelector('.slider-prev');
            const nextBtn = slider.querySelector('.slider-next');
            const dotsContainer = slider.querySelector('.slider-dots');
            
            let currentSlide = 0;
            const totalSlides = slides.length;
            
            // Tạo dots nếu có container
            if (dotsContainer) {
                dotsContainer.innerHTML = ''; // Xóa dots cũ
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement('span');
                    dot.addEventListener('click', () => goToSlide(i));
                    dotsContainer.appendChild(dot);
                }
            }
            
            const dots = dotsContainer ? dotsContainer.querySelectorAll('span') : [];
            
            function updateSlider() {
                // Di chuyển track
                track.style.transform = `translateX(-${currentSlide * 100}%)`;
                
                // Cập nhật dots
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
                
                // Cập nhật trạng thái nút
                if (prevBtn) {
                    prevBtn.disabled = currentSlide === 0;
                }
                if (nextBtn) {
                    nextBtn.disabled = currentSlide === totalSlides - 1;
                }
                
                // Thêm hiệu ứng fade cho slide
                slides.forEach((slide, index) => {
                    slide.style.opacity = index === currentSlide ? '1' : '0.7';
                    slide.style.transition = 'opacity 0.3s ease';
                });
            }
            
            function goToSlide(index) {
                if (index < 0 || index >= totalSlides) return;
                currentSlide = index;
                updateSlider();
            }
            
            function nextSlide() {
                if (currentSlide < totalSlides - 1) {
                    currentSlide++;
                    updateSlider();
                }
            }
            
            function prevSlide() {
                if (currentSlide > 0) {
                    currentSlide--;
                    updateSlider();
                }
            }
            
            // Thêm sự kiện cho nút
            if (prevBtn) {
                prevBtn.addEventListener('click', prevSlide);
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', nextSlide);
            }
            
            // Thêm sự kiện swipe cho mobile
            let startX = 0;
            let endX = 0;
            
            track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            }, { passive: true });
            
            track.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                handleSwipe();
            }, { passive: true });
            
            function handleSwipe() {
                const diff = startX - endX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
            }
            
            updateSlider();
            
            function handleResize() {
                slides.forEach(slide => {
                    slide.style.minWidth = '100%';
                });
            }
            
            window.addEventListener('resize', handleResize);
        });
    }
    
    // Gọi hàm khởi tạo slider sau khi load nội dung
    setTimeout(initImageSliders, 100);
    
    // Khởi tạo auto hide header sau khi mọi thứ load xong
    setTimeout(initAutoHideHeader, 300);
});
