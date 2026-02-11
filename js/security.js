// js/security.js - Thêm security headers cho tất cả trang
(function() {
    'use strict';
    
    // Kiểm tra đã có security headers chưa
    const hasSecurityHeaders = () => {
        return document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null ||
               document.querySelector('meta[http-equiv="X-Frame-Options"]') !== null;
    };
    
    // Nếu đã có headers thì chỉ thêm preconnect nếu thiếu
    if (hasSecurityHeaders()) {
        addPreconnectLinksIfNeeded();
        return;
    }
    
    console.log('🔄 Đang thêm security headers tự động...');
    
    // Thêm security meta tags
    const metaTags = [
        ['Content-Security-Policy', `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://haiminh2023.github.io; connect-src 'self'; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self';`],
        ['X-Frame-Options', 'SAMEORIGIN'],
        ['X-Content-Type-Options', 'nosniff'],
        ['Referrer-Policy', 'strict-origin-when-cross-origin']
    ];
    
    // Thêm vào đầu <head>
    const firstElement = document.head.firstElementChild;
    
    metaTags.forEach(([httpEquiv, content]) => {
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', httpEquiv);
        meta.setAttribute('content', content);
        document.head.insertBefore(meta, firstElement);
    });
    
    // Thêm robots meta
    const robotsMeta = document.createElement('meta');
    robotsMeta.setAttribute('name', 'robots');
    robotsMeta.setAttribute('content', 'index, follow');
    document.head.insertBefore(robotsMeta, firstElement);
    
    // Thêm preconnect links
    addPreconnectLinks();
    
    console.log('✅ Security headers đã được thêm');
    
    function addPreconnectLinks() {
        const links = [
            { href: 'https://fonts.googleapis.com' },
            { href: 'https://fonts.gstatic.com', crossorigin: true },
            { href: 'https://haiminh2023.github.io' }
        ];
        
        links.forEach(config => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = config.href;
            if (config.crossorigin) {
                link.crossOrigin = '';
            }
            document.head.appendChild(link);
        });
    }
    
    function addPreconnectLinksIfNeeded() {
        const existingUrls = Array.from(document.querySelectorAll('link[rel="preconnect"]'))
            .map(link => link.href);
        
        const neededUrls = [
            'https://fonts.googleapis.com/',
            'https://fonts.gstatic.com/',
            'https://haiminh2023.github.io/'
        ];
        
        neededUrls.forEach(url => {
            if (!existingUrls.includes(url)) {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = url;
                if (url.includes('fonts.gstatic.com')) {
                    link.crossOrigin = '';
                }
                document.head.appendChild(link);
            }
        });
    }
})();
