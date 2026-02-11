// js/security.js - FIXED cho anchor links và inline handlers
(function() {
    'use strict';
    
    // Kiểm tra đã có CSP chưa
    if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        return;
    }
    
    // Lấy hostname hiện tại
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const baseDomain = hostname.replace('www.', '');
    
    // CSP HOÀN CHỈNH - Cho phép tất cả cần thiết
    const csp = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: blob: https://haiminh2023.github.io;
        connect-src 'self' ${isLocalhost ? 'http://localhost:* http://127.0.0.1:*' : `https://${baseDomain} https://*.${baseDomain}`} https://*.cloudflare.com;
        media-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'self';
        frame-src 'self' https://www.youtube.com https://player.vimeo.com;
        worker-src 'self' blob:;
        child-src 'self' blob:;
        manifest-src 'self';
        prefetch-src 'self';
        navigate-to 'self' https://${baseDomain}/*;
    `.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Thêm CSP
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', csp);
    document.head.appendChild(meta);
    
    console.log('✅ Applied CSP for:', hostname);
    console.log('CSP:', csp);
    
    // FIX THÊM: Đảm bảo anchor links hoạt động
    setTimeout(() => {
        fixAnchorLinks();
        fixInlineHandlers();
    }, 100);
    
    // Hàm fix anchor links
    function fixAnchorLinks() {
        // Tìm tất cả links có hash (#)
        const anchorLinks = document.querySelectorAll('a[href*="#"]');
        anchorLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                // Đảm bảo click handler hoạt động
                link.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                        // Update URL hash
                        history.pushState(null, null, `#${targetId}`);
                    }
                }, { passive: false });
            }
        });
        console.log(`🔗 Fixed ${anchorLinks.length} anchor links`);
    }
    
    // Hàm fix inline handlers (onclick, etc.)
    function fixInlineHandlers() {
        // Tìm các element có onclick
        const elementsWithOnclick = document.querySelectorAll('[onclick]');
        elementsWithOnclick.forEach(el => {
            const onclickAttr = el.getAttribute('onclick');
            if (onclickAttr) {
                // Thêm event listener thay thế
                el.addEventListener('click', function() {
                    try {
                        // Chạy onclick code
                        new Function(onclickAttr).call(this);
                    } catch (error) {
                        console.error('Error executing onclick:', error);
                    }
                });
                console.log(`🔄 Fixed onclick for:`, el);
            }
        });
    }
})();
