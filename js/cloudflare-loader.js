// js/cloudflare-loader.js
(function() {
    'use strict';
    
    // Chỉ chạy khi DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCloudflare);
    } else {
        loadCloudflare();
    }
    
    function loadCloudflare() {
        // Chỉ load trên production
        if (window.location.hostname.includes('localhost') || 
            window.location.hostname.includes('127.0.0.1')) {
            console.log('🚫 Cloudflare disabled on localhost');
            return;
        }
        
        // Danh sách trang cần analytics
        const pages = ['/', '/index.html', '/pages/versions.html', '/pages/policies.html'];
        const currentPage = window.location.pathname;
        
        if (!pages.includes(currentPage)) {
            return;
        }
        
        console.log('📊 Loading Cloudflare Analytics...');
        
        const script = document.createElement('script');
        script.defer = true;
        script.src = 'https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015';
        script.integrity = 'sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==';
        script.crossOrigin = 'anonymous';
        script.setAttribute('data-cf-beacon', JSON.stringify({
            "token": "6253bf09a72b4f46a2de8059f99c0982",
            "spa": true
        }));
        
        document.body.appendChild(script);
    }
})();
