// 1. Lấy danh sách sản phẩm từ localStorage
// -----------------------------
function layDSSanPham() {
    let ds = JSON.parse(localStorage.getItem("dsSanPham")) || [];
    return ds;
}

// -----------------------------
// 2. Hiển thị sản phẩm theo danh mục (ở trang này là "Vở học sinh")
// -----------------------------
function hienThiSanPham() {
    const box = document.getElementById("listSanPham");
    let ds = layDSSanPham();

    // Lấy đúng danh mục
    let dsLoc = ds.filter((sp) => sp.danhMuc === DANH_MUC);

    box.innerHTML = "";

    dsLoc.forEach((sp) => {
        box.innerHTML += `
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
    });
}

// -----------------------------
// 3. Thêm sản phẩm vào giỏ hàng
// -----------------------------
function themGioHang(id) {
    let gioh = JSON.parse(localStorage.getItem("gioHang")) || [];
    let ds = layDSSanPham();
    let sp = ds.find((x) => x.id === id);

    let index = gioh.findIndex((x) => x.id === id);

    if (index === -1) {
        gioh.push({ id: sp.id, ten: sp.ten, gia: sp.gia, hinh: sp.hinh, sl: 1 });
    } else {
        gioh[index].sl++;
    }

    localStorage.setItem("gioHang", JSON.stringify(gioh));
    alert("Đã thêm vào giỏ hàng!");
}

// xử lý yêu thích 2
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("favorite-icon")) {
        const id = Number(e.target.dataset.id);
        let ds = JSON.parse(localStorage.getItem("dsSanPham")) || [];
        let yeu = JSON.parse(localStorage.getItem("yeuThich")) || [];

        let sp = ds.find((sp) => sp.id === id);
        if (!sp) return;

        let index = yeu.findIndex((x) => x.id === id);

        if (index === -1) {
            yeu.push({
                id: sp.id,
                ten: sp.ten,
                gia: sp.gia,
                hinh: sp.hinh,
            });
            e.target.classList.add("active");
        } else {
            yeu.splice(index, 1);
            e.target.classList.remove("active");
        }

        localStorage.setItem("yeuThich", JSON.stringify(yeu));
    }
});
function activeYeuThichIcon() {
    let yeu = JSON.parse(localStorage.getItem("yeuThich")) || [];

    document.querySelectorAll(".favorite-icon").forEach((icon) => {
        let id = Number(icon.dataset.id);
        if (yeu.some((x) => x.id === id)) {
            icon.classList.add("active");
        }
    });
}

document.addEventListener("DOMContentLoaded", activeYeuThichIcon);
// sản phẩm nổi bậc bên trái

// -----------------------------
// 5. Khi tải trang → render sản phẩm
// -----------------------------
hienThiSanPham();
