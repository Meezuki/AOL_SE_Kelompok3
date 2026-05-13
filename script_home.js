document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('hero');
    
    // Daftar URL gambar untuk background (Ganti dengan path gambarmu nanti)
    const heroImages = [
        'assets/hero1.jpg', // Gambar 1 (Orang bagi-bagi makanan)
        'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1920&auto=format&fit=crop', // Gambar 2 (Orang menanam pohon)
        'https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=1920&auto=format&fit=crop'  // Gambar 3 (Mengajar anak-anak)
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
    setInterval(cycleHeroImage, 5000);
});