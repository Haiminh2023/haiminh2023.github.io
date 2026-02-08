// js/include.js - Xử lý include header và footer

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== LOAD HEADER ====================
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('includes/header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không tìm thấy file header.html');
                }
                return response.text();
            })
            .then(headerHTML => {
                // Thay thế placeholder bằng header thật
                headerPlaceholder.outerHTML = headerHTML;
                
                // Sau khi header được load, xử lý active state
                setTimeout(handleActiveState, 50);
                setTimeout(adjustPagePadding, 100);
            })
            .catch(error => {
                console.error('Lỗi khi load header:', error);
                // Fallback: Hiển thị header cơ bản nếu load thất bại
                headerPlaceholder.outerHTML = `
                    <header class="navbar">
                        <div class="nav-inner">
                            <a class="logo" href="../index.html">❄ Đọc Online</a>
                            <nav class="nav-menu">
                                <a href="../index.html">Trang chủ</a>
                                <a href="pages/features.html">Tính năng</a>
                                <a href="pages/guide.html">Hướng dẫn</a>
                                <a href="pages/pricing.html">Giá</a>
                                <a href="pages/contact.html">Liên hệ</a>
                            </nav>
                        </div>
                    </header>
                `;
                setTimeout(handleActiveState, 50);
                setTimeout(adjustPagePadding, 100);
            });
    }
    
    // ==================== LOAD FOOTER ====================
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('includes/footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không tìm thấy file footer.html');
                }
                return response.text();
            })
            .then(footerHTML => {
                // Thay thế placeholder bằng footer thật
                footerPlaceholder.outerHTML = footerHTML;
                
                // Khởi tạo back to top button
                setTimeout(initBackToTop, 50);
            })
            .catch(error => {
                console.error('Lỗi khi load footer:', error);
                // Fallback: Hiển thị footer cơ bản
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
    
    // Xử lý active state cho navigation
    function handleActiveState() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            // Xóa class active cũ
            link.classList.remove('active');
            
            // Lấy href của link
            const linkHref = link.getAttribute('href');
            const linkPage = linkHref.split('/').pop();
            
            // Kiểm tra và thêm class active
            if (currentPage === linkPage || 
                (currentPage === '' && linkPage === 'index.html') ||
                (currentPage === 'index.html' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
            
            // Xử lý đặc biệt cho trang chủ
            if (currentPage === '' || currentPage === 'index.html') {
                if (link.classList.contains('nav-home')) {
                    link.classList.add('active');
                }
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
        
        // Ẩn hiện button khi scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        // Xử lý click để scroll lên đầu
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Gọi adjustPagePadding khi resize window
    window.addEventListener('resize', adjustPagePadding);
});
