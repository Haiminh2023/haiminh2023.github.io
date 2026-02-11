// js/security.js - Tự động thêm security meta tags
(function() {
    // Chỉ thêm nếu chưa có
    if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        return;
    }
    
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
    
    const preconnectLinks = [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://haiminh2023.github.io' }
    ];
    
    // Thêm meta tags
    securityMetaTags.forEach(tag => {
        const meta = document.createElement('meta');
        for (const [attr, value] of Object.entries(tag)) {
            meta.setAttribute(attr, value);
        }
        document.head.appendChild(meta);
    });
    
    // Thêm preconnect links
    preconnectLinks.forEach(link => {
        const linkEl = document.createElement('link');
        for (const [attr, value] of Object.entries(link)) {
            linkEl.setAttribute(attr, value);
        }
        document.head.appendChild(linkEl);
    });
    
    console.log('✅ Security headers đã được thêm tự động');
})();
