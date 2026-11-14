/* Trang Ủng hộ: chọn mức tiền -> VietQR có sẵn số tiền + nội dung; QR + nút PayPal; nút chép */
(function () {
    // ==== CẤU HÌNH ====
    var PAYPAL = 'https://www.paypal.com/ncp/payment/EK2FPCZLNM3ES';   // link thanh toán PayPal (người ủng hộ tự nhập số USD)
    var BANK_BIN = '970426', ACC = '16001012942156', MSG = 'UNG HO MEMDECK';

    function tlv(id, v) { return id + (v.length < 10 ? '0' : '') + v.length + v; }
    function crc16(s) {
        var c = 0xFFFF;
        for (var i = 0; i < s.length; i++) {
            c ^= s.charCodeAt(i) << 8;
            for (var k = 0; k < 8; k++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF;
        }
        return ('000' + c.toString(16).toUpperCase()).slice(-4);
    }
    // Chuẩn VietQR (EMVCo) – chuyển nhanh Napas 247 tới tài khoản
    function vietqr(amount) {
        var acc = tlv('00', 'A000000727') + tlv('01', tlv('00', BANK_BIN) + tlv('01', ACC)) + tlv('02', 'QRIBFTTA');
        var p = tlv('00', '01') + tlv('01', amount ? '12' : '11') + tlv('38', acc) + tlv('53', '704') +
            (amount ? tlv('54', String(amount)) : '') + tlv('58', 'VN') + tlv('62', tlv('08', MSG)) + '6304';
        return p + crc16(p);
    }
    function vnd(n) { return Number(n).toLocaleString('vi-VN') + ' đ'; }
    function en() { return window.MD_LANG === 'en'; }

    function setVN(box, amt) {
        box.querySelectorAll('[data-pane="vn"] [data-amt]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-amt') === amt); });
        var q = box.querySelector('.sp-code-q'), lab = box.querySelector('.sp-code-amt');
        if (!q) return;
        if (window.qrcode) {
            // Luôn tự tạo mã: có số tiền -> điền sẵn; «Tuỳ ý» -> mã tĩnh, người ủng hộ tự nhập số tiền
            var qr = qrcode(0, 'M'); qr.addData(vietqr(amt)); qr.make();
            q.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
            q.classList.add('gen');
        }
        lab.textContent = amt ? (en() ? 'Amount: ' : 'Số tiền: ') + vnd(amt) : (en() ? 'Amount: your choice' : 'Số tiền: tuỳ ý');
        var how = box.querySelector('.sp-how');
        if (how) how.textContent = amt
            ? (en() ? 'Open your banking app, scan the code: amount and message are filled in, just confirm.' : 'Mở app ngân hàng, quét mã: số tiền và nội dung đã điền sẵn, bạn chỉ cần xác nhận.')
            : (en() ? 'Open your banking app, scan the code: the message is filled in, enter any amount and confirm.' : 'Mở app ngân hàng, quét mã: nội dung đã điền sẵn, bạn nhập số tiền tuỳ ý rồi xác nhận.');
        box._vn = amt;
    }
    // Mã QR của link PayPal: người xem trên máy tính quét bằng điện thoại
    function setPP(box) {
        var q = box.querySelector('#spPpQr');
        if (!q || q.firstChild || !window.qrcode) return;
        var qr = qrcode(0, 'M'); qr.addData(PAYPAL); qr.make();
        q.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
    }
    function tab(box, which) {
        box.querySelectorAll('[data-pay]').forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-pay') === which); });
        box.querySelectorAll('[data-pane]').forEach(function (p) { p.hidden = p.getAttribute('data-pane') !== which; });
    }
    function boxes() { return document.querySelectorAll('.sp-qr'); }

    document.addEventListener('click', function (e) {
        var b = e.target.closest('[data-pay]');
        if (b) { tab(b.closest('.sp-qr'), b.getAttribute('data-pay')); return; }
        var t = e.target.closest('.sp-tier');   // thẻ mức ở phương án C
        if (t) {
            document.querySelectorAll('.sp-tier').forEach(function (x) { x.classList.toggle('hot', x === t); });
            boxes().forEach(function (bx) { setVN(bx, t.getAttribute('data-amt')); });
            return;
        }
        var m = e.target.closest('.sp-amt-b');
        if (m) {
            var bx = m.closest('.sp-qr');
            if (m.hasAttribute('data-amt')) setVN(bx, m.getAttribute('data-amt'));
            return;
        }
        var c = e.target.closest('.sp-copy');
        if (c) {
            var v = c.getAttribute('data-copy'), old = c.textContent;
            var done = function () { c.textContent = en() ? 'Copied' : 'Đã chép'; c.classList.add('ok'); setTimeout(function () { c.textContent = old; c.classList.remove('ok'); }, 1400); };
            if (navigator.clipboard) navigator.clipboard.writeText(v).then(done, done); else done();
        }
    });
    function init() {
        boxes().forEach(function (bx) {
            setVN(bx, bx._vn !== undefined ? bx._vn : '50000');
            setPP(bx);
            tab(bx, en() ? 'intl' : 'vn');   // người xem tiếng Anh: mở sẵn PayPal
        });
    }
    document.addEventListener('md:lang', init);
    if (document.readyState !== 'loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
