document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('hero');
    
    // Daftar URL gambar untuk background (Ganti dengan path gambarmu nanti)
    const heroImages = [
        'assets/hero1.jpg', // Gambar 1 (Orang bagi-bagi makanan)
        'assets/hero2.jpg', // Gambar 2 (Orang menanam pohon)
        'assets/hero3.jpg'  // Gambar 3 (Mengajar anak-anak)
    ];

    let currentIndex = 0;

    // Set gambar awal saat halaman dimuat
    heroSection.style.backgroundImage = `url('${heroImages[currentIndex]}')`;

    // Fungsi untuk mengganti gambar
    function cycleHeroImage() {
        currentIndex = (currentIndex + 1) % heroImages.length; // Loop kembali ke 0 jika sudah di akhir
        heroSection.style.backgroundImage = `url('${heroImages[currentIndex]}')`;
    }

    // Jalankan pergantian gambar setiap 5 detik (5000 milidetik)
    setInterval(cycleHeroImage, 3000);
});