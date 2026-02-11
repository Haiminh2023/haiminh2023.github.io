// js/security.js - Tự động thêm security headers nếu thiếu
(function() {
    'use strict';
    
    // Kiểm tra đã có security headers chưa
    function hasSecurityHeaders() {
        return document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null;
    }
    
    // Nếu đã có thì không làm gì
    if (hasSecurityHeaders()) {
        console.log('✅ Trang đã có security headers');
        return;
    }
    
    console.log('🔄 Đang thêm security headers tự động...');
    
    // Danh sách security meta tags
    const securityMetaTags = [
        {
            'http-equiv': 'Content-Security-Policy',
            'content': `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://haiminh2023.github.io; connect-src 'self'; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self';`
        },
        {
            'http-equiv': 'X-Frame-Options',
            'content': 'SAMEORIGIN'
        },
        {
            'http-equiv': 'X-Content-Type-Options',
            'content': 'nosniff'
        },
        {
            'http-equiv': 'Referrer-Policy',
            'content': 'strict-origin-when-cross-origin'
        },
        {
            'name': 'robots',
            'content': 'index, follow'
        }
    ];
    
    // Danh sách preconnect links
    const preconnectLinks = [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://haiminh2023.github.io' }
    ];
    
    // Lấy element đầu tiên trong head để chèn trước nó
    const firstHeadElement = document.head.firstElementChild;
    
    // Thêm security meta tags
    securityMetaTags.forEach(tag => {
        const meta = document.createElement('meta');
        for (const [attr, value] of Object.entries(tag)) {
            meta.setAttribute(attr, value);
        }
        document.head.insertBefore(meta, firstHeadElement);
    });
    
    // Thêm preconnect links
    preconnectLinks.forEach(link => {
        const linkEl = document.createElement('link');
        for (const [attr, value] of Object.entries(link)) {
            linkEl.setAttribute(attr, value);
        }
        document.head.insertBefore(linkEl, firstHeadElement);
    });
    
    console.log('✅ Security headers đã được thêm tự động');
})();
