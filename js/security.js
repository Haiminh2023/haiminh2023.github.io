// js/security.js - FIXED với Cloudflare Insights
(function() {
    'use strict';
    
    // Kiểm tra đã có CSP chưa
    const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingCSP) {
        console.log('⚠️ Đã có CSP, không thêm mới');
        return;
    }
    
    console.log('🔄 Đang thêm CSP tự động...');
    
    // Lấy thông tin trang
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const baseDomain = hostname.replace('www.', '');
    
    // CSP HOÀN CHỈNH với Cloudflare Insights
    const csp = `
        default-src 'self' ${protocol}//${baseDomain};
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com;
        script-src-elem 'self' 'unsafe-inline' https://static.cloudflareinsights.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: blob: https://haiminh2023.github.io;
        connect-src 'self' ${protocol}//${baseDomain} ${protocol}//*.${baseDomain} https://*.cloudflare.com;
        frame-src 'self';
        form-action 'self';
        base-uri 'self';
        object-src 'none';
        worker-src 'self' blob:;
        manifest-src 'self';
    `.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Thêm CSP meta tag
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', csp);
    document.head.appendChild(meta);
    
    console.log('✅ CSP đã được thêm với Cloudflare support');
    console.log('CSP:', csp);
    
    // TẠO SCRIPT CLOUDFLARE ĐÚNG CÁCH
    createCloudflareScript();
    
    function createCloudflareScript() {
        // Chỉ tạo script cho các trang cần Cloudflare
        const path = window.location.pathname;
        const needCloudflare = path.includes('versions.html') || 
                               path.includes('policies.html') ||
                               path.includes('features.html');
        
        if (!needCloudflare) return;
        
        console.log('🌐 Tạo Cloudflare Analytics script...');
        
        // Tạo script element
        const script = document.createElement('script');
        script.defer = true;
        script.src = 'https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015';
        script.integrity = 'sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==';
        script.crossOrigin = 'anonymous';
        
        // Token Cloudflare (nếu có thể ẩn)
        // Trong thực tế, nên lấy từ biến môi trường hoặc backend
        const cfToken = '6253bf09a72b4f46a2de8059f99c0982'; // Token hiện tại
        
        script.setAttribute('data-cf-beacon', JSON.stringify({
            "token": cfToken,
            "spa": true,
            "version": "2024.11.0"
        }));
        
        // Thêm vào body (không thêm vào head để tránh parse sớm)
        document.body.appendChild(script);
        
        console.log('✅ Cloudflare script đã được thêm');
    }
})();
