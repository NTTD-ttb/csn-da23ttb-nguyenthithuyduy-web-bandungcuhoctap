function hienThiGioHang() {
    const ds = document.getElementById("dsGioHang");
    const tongCongEl = document.getElementById("tongCong");
    let gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];

    ds.innerHTML = "";
    let tongCong = 0;
    // xuất hiện thông báo trong bản khi chưa có giỏ hàng chưa có sp
    if (gioHang.length === 0) {
        ds.innerHTML = `<tr><td colspan="6">Chưa có sản phẩm trong giỏ hàng</td></tr>`;
    }
    // ----------------
    gioHang.forEach((sp, index) => {
        const tong = sp.gia * sp.sl;
        tongCong += tong;

        ds.innerHTML += `
            <tr>
                <td><img src="${sp.hinh}" class="anhSanPham"></td>
                <td>${sp.ten}</td>
                <td class="donGia">${sp.gia.toLocaleString()} đ</td>
                <td>
                    <div class="ChonSL">
                        <button class="btn-minus giam" data-index="${index}">-</button>
                        <input type="text" value="${sp.sl}" readonly />
                        <button class="btn-plus tang" data-index="${index}">+</button>
                    </div>
                </td>
                <td class="donGia">${tong.toLocaleString()} đ</td>
                <td><button class="btnXoa" data-index="${index}"><i class="fa fa-trash"></i></button></td>
            </tr>
        `;
    });

    // cập nhật tổng cộng
    tongCongEl.textContent = tongCong.toLocaleString() + " đ";

    // Gán vào ô tổng tiền thanh toán nếu có
    const tongCongText = tongCongEl.textContent;
    const tongThanhToan = document.getElementById("tongThanhToan");
    if (tongThanhToan) tongThanhToan.textContent = tongCongText;

    // Nút tăng
    document.querySelectorAll(".tang").forEach((btn) =>
        btn.addEventListener("click", (e) => {
            const i = e.target.dataset.index;
            gioHang[i].sl++;
            localStorage.setItem("gioHang", JSON.stringify(gioHang));
            hienThiGioHang();
        })
    );

    // Nút giảm
    document.querySelectorAll(".giam").forEach((btn) =>
        btn.addEventListener("click", (e) => {
            const i = e.target.dataset.index;
            if (gioHang[i].sl > 1) gioHang[i].sl--;
            else gioHang.splice(i, 1);
            localStorage.setItem("gioHang", JSON.stringify(gioHang));
            hienThiGioHang();
        })
    );

    // Nút xóa
    document.querySelectorAll(".btnXoa").forEach((btn) =>
        btn.addEventListener("click", (e) => {
            const i = e.target.dataset.index;
            gioHang.splice(i, 1);
            localStorage.setItem("gioHang", JSON.stringify(gioHang));
            hienThiGioHang();
        })
    );
}

document.addEventListener("DOMContentLoaded", hienThiGioHang);
// XỬ LÝ LOGIC
// xử lý logic

/***** Logic Thanh toán / Form / Đặt hàng thành công *****/
document.addEventListener("DOMContentLoaded", () => {
    // DOM element references
    const formBox = document.querySelector(".thongtin-box");
    const successBox = document.querySelector(".thongbao-thanhtoan");
    const paymentBox = document.getElementById("payment-box");
    const btnThanhToan = document.getElementById("btnThanhToan");
    const formThanhToan = document.getElementById("formThanhToan");
    const dsGioHangTbody = document.getElementById("dsGioHang");
    const maDonHangEl = document.getElementById("maDonHang");
    const tongCongEls = document.querySelectorAll("#tongCong");

    // Ẩn form và thông báo thành công lúc ban đầu
    if (formBox) formBox.style.display = "none";
    if (successBox) successBox.style.display = "none";

    // Nút Thanh toán
    // btnThanhToan &&
    //     btnThanhToan.addEventListener("click", () => {
    //         const gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
    //         if (!gioHang || gioHang.length === 0) {
    //             alert("Giỏ hàng của bạn đang trống!");
    //             return;
    //         }

    //         // Hiện form đặt hàng
    //         if (formBox) {
    //             formBox.style.display = "block";
    //             window.scrollTo({ top: formBox.offsetTop - 20, behavior: "smooth" });
    //         }

    //         // Ẩn thông báo trước đó
    //         if (successBox) successBox.style.display = "none";
    //     });
    btnThanhToan &&
        btnThanhToan.addEventListener("click", () => {
            //  KIỂM TRA NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP CHƯA
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            if (!currentUser) {
                alert("Bạn cần đăng nhập trước khi thanh toán!");
                window.location.href = "../html/dangnhap.html";
                return;
            }

            const gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
            if (!gioHang || gioHang.length === 0) {
                alert("Giỏ hàng của bạn đang trống!");
                return;
            }

            //  Khi đã đăng nhập → HIỆN FORM ĐẶT HÀNG
            if (formBox) {
                formBox.style.display = "block";
                window.scrollTo({ top: formBox.offsetTop - 20, behavior: "smooth" });
            }

            if (successBox) successBox.style.display = "none";
        });

    // Hàm kiểm tra email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Hàm kiểm tra số điện thoại
    function isValidPhone(phone) {
        return /^[0-9]{7,12}$/.test(phone.replace(/\s+/g, ""));
    }

    // Xử lý submit form Đặt hàng
    formThanhToan &&
        formThanhToan.addEventListener("submit", (e) => {
            e.preventDefault();

            const inputs = Array.from(formThanhToan.querySelectorAll(".custom-input")).filter((el) => el.tagName.toLowerCase() !== "textarea");

            // thứ tự input theo HTML bạn cung cấp
            const requiredInputs = inputs.slice(0, 6);

            let valid = true;
            let firstInvalid = null;

            // Reset border
            requiredInputs.forEach((inp) => (inp.style.border = ""));

            // Validate
            requiredInputs.forEach((inp, idx) => {
                const val = inp.value.trim();

                if (val === "") {
                    valid = false;
                    if (!firstInvalid) firstInvalid = inp;
                    inp.style.border = "1px solid red";
                } else {
                    if (inp.type === "email" && !isValidEmail(val)) {
                        valid = false;
                        if (!firstInvalid) firstInvalid = inp;
                        inp.style.border = "1px solid red";
                    } else if (idx === 4 && !isValidPhone(val)) {
                        valid = false;
                        if (!firstInvalid) firstInvalid = inp;
                        inp.style.border = "1px solid red";
                    } else {
                        inp.style.border = "1px solid #ced4da";
                    }
                }
            });

            if (!valid) {
                alert("Vui lòng điền đúng và đầy đủ thông tin.");
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            // Tạo mã đơn hàng
            const randomCode = "MDH" + Math.floor(100000 + Math.random() * 900000);
            // =------------------------------ mới chèn 12/10/2025
            // Tạo mã đơn hàng

            // ==============================
            //  LƯU ĐƠN HÀNG VÀO LOCALSTORAGE
            // ==============================

            // Lấy người dùng hiện tại
            // ==============================
            //  LƯU ĐƠN HÀNG THEO USER
            // ==============================

            // Lấy người dùng hiện tại
            const currentUserLS = JSON.parse(localStorage.getItem("currentUser"));
            const emailNguoiMua = currentUserLS.email;

            // Tạo key theo từng tài khoản
            const keyDonHang = "donHang_" + emailNguoiMua;

            // Lấy danh sách đơn hàng cũ
            let danhSachDonHang = JSON.parse(localStorage.getItem(keyDonHang)) || [];
            // Lấy dữ liệu từ form
            const hoten = document.getElementById("hoten").value.trim();
            const diachi = document.getElementById("diachi").value.trim();
            const sdt = document.getElementById("sdt").value.trim();
            const ghichu = document.getElementById("ghichu").value.trim();

            // Lấy tổng tiền thanh toán (bỏ chữ đ, bỏ dấu chấm)
            let tongGiaText = document.getElementById("tongThanhToan").textContent.replace(/[^\d]/g, "");
            let tongGiaTri = parseInt(tongGiaText) || 0;

            // Lấy giỏ hàng hiện tại
            const gioHangHienTai = JSON.parse(localStorage.getItem("gioHang")) || [];

            // Tạo ngày mua (ngày giờ Việt Nam)
            const ngayMua = new Date();
            const ngay = String(ngayMua.getDate()).padStart(2, "0");
            const thang = String(ngayMua.getMonth() + 1).padStart(2, "0");
            const nam = ngayMua.getFullYear();
            const gio = String(ngayMua.getHours()).padStart(2, "0");
            const phut = String(ngayMua.getMinutes()).padStart(2, "0");
            const giay = String(ngayMua.getSeconds()).padStart(2, "0");

            const ngayMuaText = `${ngay}/${thang}/${nam} ${gio}:${phut}:${giay}`;

            // Tạo object đơn hàng
            const donHang = {
                maDonHang: randomCode,
                email: emailNguoiMua,
                hoTen: hoten,
                diaChi: diachi,
                soDienThoai: sdt,
                ghiChu: ghichu,
                ngayMua: ngayMuaText,
                tongGia: tongGiaTri,
                danhSachSanPham: gioHangHienTai,
            };

            // Thêm đơn hàng vào mảng
            danhSachDonHang.push(donHang);

            // Lưu vào LocalStorage
            localStorage.setItem(keyDonHang, JSON.stringify(danhSachDonHang));

            // ========================end 12/10/2025-----------
            // Xóa giỏ hàng
            localStorage.removeItem("gioHang");

            // Cập nhật bảng giỏ hàng về rỗng
            try {
                hienThiGioHang();
            } catch (err) {
                console.warn("Không thể làm mới giỏ hàng:", err);
            }

            // Reset tổng tiền về 0
            tongCongEls.forEach((el) => (el.textContent = "0"));

            // Hiện mã đơn
            if (maDonHangEl) maDonHangEl.textContent = randomCode;

            // Hiện thông báo thành công
            if (successBox) successBox.style.display = "block";

            // Ẩn form
            if (formBox) formBox.style.display = "none";

            // Cuộn xuống thông báo
            if (successBox) {
                window.scrollTo({ top: successBox.offsetTop - 10, behavior: "smooth" });
            }
        });
});
