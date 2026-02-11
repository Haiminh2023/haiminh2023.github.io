// js/security.js - CHỈ THÊM CSP, KHÔNG TỰ ĐỘNG THÊM CLOUDFLARE
(function() {
    'use strict';
    
    // Chỉ kiểm tra và thêm CSP
    if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        return;
    }
    
    console.log('🔒 Đang thêm Content Security Policy...');
    
    // CSP đơn giản và hiệu quả
    const csp = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: https://haiminh2023.github.io;
        connect-src 'self';
        frame-src 'self';
        form-action 'self';
        base-uri 'self';
        object-src 'none'
    `.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Thêm CSP meta tag
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', csp);
    
    // Đảm bảo head tồn tại
    if (document.head) {
        document.head.appendChild(meta);
        console.log('✅ CSP đã được thêm thành công');
    } else {
        // Fallback: chờ head tồn tại
        const observer = new MutationObserver(() => {
            if (document.head) {
                document.head.appendChild(meta);
                console.log('✅ CSP đã được thêm (after wait)');
                observer.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }
})();
