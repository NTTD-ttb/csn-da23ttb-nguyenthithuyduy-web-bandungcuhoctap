document.addEventListener("DOMContentLoaded", () => {
    const dsSanPham = JSON.parse(localStorage.getItem("dsSanPham")) || [];

    function taoTheSanPham(sp) {
        return `
            <div class="card-sanpham">
                <img src="${sp.hinh}" class="anh-sp" alt="${sp.ten}" />
                <p class="ten-sp">${sp.ten}</p>
                <h4 class="gia-sp">Giá: ${sp.gia.toLocaleString()} đ</h4>
                <a href="../Html/TrangChiTietSanPham.html?id=${sp.id}" class="nut-xem">
                    <i class="fa-solid fa-eye"></i>
                    Xem sản phẩm
                </a>
            </div>
        `;
    }

    function hienThiTheoDanhMuc(danhMuc, idHTML) {
        let list = dsSanPham.filter((sp) => sp.danhMuc === danhMuc); // lọc sản phẩm theo danh mục
        list = list.slice(0, 4); // lấy đúng 4 sản phẩm

        const box = document.getElementById(idHTML); // tìm vị trí đưa sản p vào
        box.innerHTML = list.map(taoTheSanPham).join("");
    }

    // Render từng danh mục
    hienThiTheoDanhMuc("Bút học sinh", "spDungCuViet");
    hienThiTheoDanhMuc("Vở học sinh", "spVoHocSinh");
    hienThiTheoDanhMuc("Dụng cụ đo - tính toán", "spDoTinhToan");
    hienThiTheoDanhMuc("Họa Phẩm", "spHoaPham");
    hienThiTheoDanhMuc("Balo", "spBalo");
    hienThiTheoDanhMuc("Sản phẩm khác", "spKhac");
    hienThiTheoDanhMuc("Sản phẩm Nổi Bậc", "spNoiBac1");
    hienThiTheoDanhMuc("Sản phẩm Nổi Bậc", "spNoiBac2");
    hienThiTheoDanhMuc("Sản phẩm Nổi Bậc", "spNoiBac3");
});
// đăng xuất đăng nhập
document.addEventListener("DOMContentLoaded", () => {
    const userArea = document.getElementById("userArea");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Nếu CHƯA đăng nhập -> giữ nguyên Đăng ký | Đăng nhập
    if (!currentUser) {
        userArea.innerHTML = `
            <a href="../Html/Dangki.html">Đăng kí</a>
            <span>|</span>
            <a href="../Html/Dangnhap.html">Đăng nhập</a>
        `;
        return;
    }

    // Nếu ĐÃ đăng nhập -> hiện tên + dropdown đăng xuất
    userArea.innerHTML = `
        <div class="dropdown">
            <button class="btn dropdown-toggle text-capitalize tendangnhap" data-bs-toggle="dropdown">
                ${currentUser.hoten}
            </button>
            <ul class="dropdown-menu tendangxuat">
                <li><a class="dropdown-item" id="btnLogout">Đăng xuất</a></li>
                <li><a class="dropdown-item" id="btnDonhang" href="../Html/donhang.html">Đơn hàng</a></li>
            </ul>
        </div>
    `;

    // Xử lý đăng xuất
    document.getElementById("btnLogout").addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.reload(); // load lại trang để hiện lại Đăng nhập | Đăng ký
    });
});
