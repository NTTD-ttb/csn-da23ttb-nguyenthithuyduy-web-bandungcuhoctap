document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".LienHeForm");
    const thongBaoCamOn = document.querySelector(".camon");

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Ngăn load lại trang

        // Hiện thông báo cảm ơn
        thongBaoCamOn.style.display = "block";

        // Cuộn xuống dòng cảm ơn cho đẹp
        thongBaoCamOn.scrollIntoView({ behavior: "smooth" });

        // Xóa form sau khi gửi (tùy chọn)
        form.reset();
    });
});
