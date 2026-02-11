// js/security.js - FIXED - Cho phép JSON và tất cả resources cần thiết
(function() {
    'use strict';
    
    // Kiểm tra đã có security headers chưa
    const hasSecurityHeaders = () => {
        return document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null;
    };
    
    // Nếu đã có headers thì không làm gì
    if (hasSecurityHeaders()) {
        console.log('✅ Trang đã có security headers');
        return;
    }
    
    console.log('🔄 Đang thêm security headers tự động...');
    
    // Xác định CSP dựa trên trang hiện tại
    function getCSPForCurrentPage() {
        const path = window.location.pathname;
        const hostname = window.location.hostname;
        
        // CSP cơ bản - MỞ RỘNG connect-src
        let csp = `
            default-src 'self';
            script-src 'self' 'unsafe-inline';
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
            font-src 'self' https://fonts.gstatic.com;
            img-src 'self' data: https://haiminh2023.github.io;
            connect-src 'self' https://${hostname} https://*.${hostname};
            object-src 'none';
            base-uri 'self';
            form-action 'self';
        `;
        
        // Trang versions.html cần Cloudflare Insights và JSON
        if (path.includes('versions.html')) {
            csp = `
                default-src 'self';
                script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com;
                style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
                font-src 'self' https://fonts.gstatic.com;
                img-src 'self' data: https://haiminh2023.github.io;
                connect-src 'self' https://${hostname} https://*.${hostname} https://*.cloudflare.com;
                object-src 'none';
                base-uri 'self';
                form-action 'self';
            `;
        }
        
        // Trang guide.html cần các link và resources
        if (path.includes('guide.html')) {
            csp = `
                default-src 'self';
                script-src 'self' 'unsafe-inline';
                style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
                font-src 'self' https://fonts.gstatic.com;
                img-src 'self' data: https://haiminh2023.github.io;
                connect-src 'self' https://${hostname} https://*.${hostname};
                object-src 'none';
                base-uri 'self';
                form-action 'self';
                frame-src https://www.youtube.com https://player.vimeo.com;
            `;
        }
        
        // Trang features.html cần onclick inline
        if (path.includes('features.html') || path === '/' || path.includes('index.html')) {
            csp = csp.replace(
                "script-src 'self' 'unsafe-inline'",
                "script-src 'self' 'unsafe-inline'"
            );
        }
        
        return csp.replace(/\s+/g, ' ').trim();
    }
    
    // Thêm CSP meta tag
    const cspMeta = document.createElement('meta');
    cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
    cspMeta.setAttribute('content', getCSPForCurrentPage());
    document.head.insertBefore(cspMeta, document.head.firstElementChild);
    
    console.log('✅ Security headers đã được thêm');
    console.log('CSP:', getCSPForCurrentPage());
})();
