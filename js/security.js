// js/security.js - CSP linh hoạt theo từng trang
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
        
        // CSP cơ bản cho hầu hết trang
        let csp = `
            default-src 'self';
            script-src 'self' 'unsafe-inline';
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
            font-src 'self' https://fonts.gstatic.com;
            img-src 'self' data: https://haiminh2023.github.io;
            connect-src 'self';
            object-src 'none';
            base-uri 'self';
            form-action 'self';
        `;
        
        // Trang versions.html cần Cloudflare Insights
        if (path.includes('versions.html')) {
            csp = csp.replace(
                "script-src 'self' 'unsafe-inline'",
                "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com"
            );
        }
        
        // Trang home và features có onclick inline
        if (path === '/' || path.includes('features.html') || path.includes('index.html')) {
            csp = csp.replace(
                "script-src 'self' 'unsafe-inline'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
            );
        }
        
        return csp.replace(/\s+/g, ' ').trim(); // Xóa khoảng trắng thừa
    }
    
    // Thêm CSP meta tag
    const cspMeta = document.createElement('meta');
    cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
    cspMeta.setAttribute('content', getCSPForCurrentPage());
    document.head.insertBefore(cspMeta, document.head.firstElementChild);
    
    // Thêm các meta tags khác (nhưng frame-ancestors và X-Frame-Options không hoạt động trong meta)
    const otherMetaTags = [
        ['X-Content-Type-Options', 'nosniff'],
        ['Referrer-Policy', 'strict-origin-when-cross-origin']
    ];
    
    otherMetaTags.forEach(([httpEquiv, content]) => {
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', httpEquiv);
        meta.setAttribute('content', content);
        document.head.insertBefore(meta, document.head.firstElementChild);
    });
    
    // Thêm robots meta
    const robotsMeta = document.createElement('meta');
    robotsMeta.setAttribute('name', 'robots');
    robotsMeta.setAttribute('content', 'index, follow');
    document.head.insertBefore(robotsMeta, document.head.firstElementChild);
    
    console.log('✅ Security headers đã được thêm');
    console.log('CSP:', getCSPForCurrentPage());
})();
