// js/cloudflare.js - Load Cloudflare Analytics SAFELY
(function() {
    'use strict';
    
    // Hàm load Cloudflare khi an toàn
    function loadCloudflareAnalytics() {
        // Chỉ load trên production
        if (window.location.hostname.includes('localhost') || 
            window.location.hostname.includes('127.0.0.1')) {
            console.log('🌐 Cloudflare Analytics disabled on localhost');
            return;
        }
        
        // Chỉ load trên các trang cần thiết
        const allowedPages = [
            '/',
            '/index.html',
            '/pages/versions.html',
            '/pages/policies.html',
            '/pages/features.html',
            '/pages/guide.html'
        ];
        
        const currentPage = window.location.pathname;
        if (!allowedPages.includes(currentPage)) {
            return;
        }
        
        console.log('📊 Loading Cloudflare Analytics...');
        
        // Tạo script element
        const script = document.createElement('script');
        script.defer = true;
        script.src = 'https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015';
        script.integrity = 'sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==';
        script.crossOrigin = 'anonymous';
        
        // Cloudflare token
        const cfToken = '6253bf09a72b4f46a2de8059f99c0982';
        script.setAttribute('data-cf-beacon', JSON.stringify({
            "token": cfToken,
            "spa": true,
            "version": "2024.11.0"
        }));
        
        // Đảm bảo body tồn tại trước khi append
        function appendScript() {
            if (document.body) {
                document.body.appendChild(script);
                console.log('✅ Cloudflare Analytics script loaded');
            } else {
                // Thử lại sau 100ms
                setTimeout(appendScript, 100);
            }
        }
        
        appendScript();
    }
    
    // Chờ DOM hoàn toàn sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCloudflareAnalytics);
    } else {
        // DOM đã ready, nhưng đợi thêm một chút cho chắc
        setTimeout(loadCloudflareAnalytics, 100);
    }
})();
