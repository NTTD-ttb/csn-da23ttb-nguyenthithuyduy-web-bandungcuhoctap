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
