// js/security.js 
(function() {
    'use strict';
    
    if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        return;
    }
    
    const csp = `
        default-src * data: blob: 'unsafe-inline' 'unsafe-eval';
        script-src * 'unsafe-inline' 'unsafe-eval' data: blob: https://static.cloudflareinsights.com;
        style-src * 'unsafe-inline' data: blob: https://fonts.googleapis.com;
        font-src * data: blob: https://fonts.gstatic.com;
        img-src * data: blob: https://haiminh2023.github.io;
        connect-src * data: blob:;
        frame-src * data: blob:;
        form-action *;
        base-uri *;
        object-src *;
    `.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Thêm CSP meta tag
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', csp);
    
    // Đảm bảo head tồn tại
    if (document.head) {
        document.head.appendChild(meta);
    } else {
        const observer = new MutationObserver(() => {
            if (document.head) {
                document.head.appendChild(meta);
                observer.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }
})();
