document.addEventListener("DOMContentLoaded", () => {
    const dsSanPham = JSON.parse(localStorage.getItem("dsSanPham")) || [];

    function taoTheSanPham(sp) {
        return `
            <div class="col-6 col-md-3 san-pham" data-id="${sp.id}">
                    <div class="card-sanpham">
                        <i class="fa-solid fa-star favorite-icon" data-id="${sp.id}"></i>
                        <a href="TrangChiTietSanPham.html?id=${sp.id}">
                            <img src="${sp.hinh}" class="anh-sp" alt="${sp.ten}" />
                        </a>

                        <p class="ten-sp">${sp.ten}</p>
                        <h4 class="gia-sp">Giá: ${sp.gia.toLocaleString()} đ</h4>
                        <a href="#" class="nut-them" onclick="themGioHang(${sp.id})">Thêm giỏ hàng</a>
                    </div>
                </div>
        `;
    }

    function hienThiTheoDanhMuc(danhMuc, idHTML) {
        let list = dsSanPham.filter((sp) => sp.danhMuc === danhMuc); // lọc sản phẩm theo danh mục
        //  list = list.slice(0, 4); // lấy đúng 4 sản phẩm

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

// // tìm kiếm trên thanh
document.addEventListener("DOMContentLoaded", () => {
    const tuKhoaRaw = localStorage.getItem("tuKhoaTimKiem");
    if (!tuKhoaRaw) return; // không phải do tìm kiếm thì thoát

    const dsSanPham = JSON.parse(localStorage.getItem("dsSanPham")) || [];

    // Hàm chuẩn hóa tiếng Việt
    function removeDiacritics(str) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    }

    const tuKhoa = removeDiacritics(tuKhoaRaw.toLowerCase());
    const cacTu = tuKhoa.split(/\s+/).filter((t) => t !== "");

    const ketQua = dsSanPham.filter((sp) => {
        const ten = removeDiacritics(sp.ten.toLowerCase());
        return cacTu.some((tu) => ten.includes(tu));
    });

    // HIỂN THỊ KẾT QUẢ
    hienThiKetQuaTimKiem(ketQua, tuKhoaRaw);

    // Xoá từ khóa để F5 không chạy lại
    localStorage.removeItem("tuKhoaTimKiem");
});

// Dùng lại hàm của bạn (giữ nguyên)
function hienThiKetQuaTimKiem(list, tuKhoaHienThi) {
    const khuVucSP = document.querySelector(".col-md-9");
    khuVucSP.innerHTML = `
        <h2 class="mb-4">KẾT QUẢ TÌM KIẾM: "${tuKhoaHienThi}"</h2>
        <div class="row g-3" id="ketQuaTimKiem"></div>
    `;

    const box = document.getElementById("ketQuaTimKiem");

    if (list.length === 0) {
        box.innerHTML = `<p>Không tìm thấy sản phẩm phù hợp với từ khóa "<strong>${tuKhoaHienThi}</strong>".</p>`;
        return;
    }

    box.innerHTML = list
        .map(
            (sp) => `
            <div class="col-6 col-md-3 san-pham" data-id="${sp.id}">
                <div class="card-sanpham">
                    <i class="fa-solid fa-star favorite-icon" data-id="${sp.id}"></i>
                    <a href="TrangChiTietSanPham.html?id=${sp.id}">
                        <img src="${sp.hinh}" class="anh-sp" alt="${sp.ten}" />
                    </a>
                    <p class="ten-sp">${sp.ten}</p>
                    <h4 class="gia-sp">Giá: ${Number(sp.gia).toLocaleString()} đ</h4>
                    <a href="#" class="nut-them" onclick="themGioHang(${sp.id})">Thêm giỏ hàng</a>
                </div>
            </div>
        `
        )
        .join("");
}
