// js/security.js 
(function() {
    'use strict';
    
    if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        return;
    }
    
    const csp = `
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: https://haiminh2023.github.io;
        connect-src 'self';
        frame-src *;
        frame-ancestors *;
        form-action 'self';
        base-uri 'self';
        object-src 'none';
        default-src *;
    `.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();;
    
    // Thêm CSP meta tag
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', csp);
    
    // Đảm bảo head tồn tại
    if (document.head) {
        document.head.appendChild(meta);
    } else {
        // Fallback: chờ head tồn tại
        const observer = new MutationObserver(() => {
            if (document.head) {
                document.head.appendChild(meta);
                observer.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }
})();
