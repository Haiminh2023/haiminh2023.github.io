// js/cloudflare.js - Load Cloudflare Analytics SAFELY
(function() {
    'use strict';
    
    function loadCloudflareAnalytics() {
        if (window.location.hostname.includes('localhost') || 
            window.location.hostname.includes('127.0.0.1')) {
            return;
        }
        
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
        
        function appendScript() {
            if (document.body) {
                document.body.appendChild(script);
            } else {
                setTimeout(appendScript, 100);
            }
        }
        
        appendScript();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCloudflareAnalytics);
    } else {
        setTimeout(loadCloudflareAnalytics, 100);
    }
})();
