document.addEventListener('DOMContentLoaded', () => {
    // 1. DATA DUMMY EVENTS (Simulasi Database)
    const allEvents = [
        { id: 1, title: "Trash Picking Alam Sutera", date: "2026-02-05", displayDate: "Fri, Feb 5 2026", time: "12.00-15.00 WIB", registered: 11, max: 15, img: "assets/trash-hero-logo.png" },
        { id: 2, title: "Mangrove Planting PIK", date: "2026-02-12", displayDate: "Thu, Feb 12 2026", time: "08.00-11.00 WIB", registered: 15, max: 15, img: "assets/trash-hero-logo.png" },
        { id: 3, title: "Teaching Orphans BSD", date: "2026-01-20", displayDate: "Tue, Jan 20 2026", time: "14.00-16.00 WIB", registered: 8, max: 10, img: "assets/trash-hero-logo.png" },
        { id: 4, title: "Animal Shelter Rescue", date: "2026-03-01", displayDate: "Sun, Mar 1 2026", time: "09.00-13.00 WIB", registered: 5, max: 20, img: "assets/trash-hero-logo.png" },
        { id: 5, title: "River Cleanup Ciliwung", date: "2026-02-25", displayDate: "Wed, Feb 25 2026", time: "07.00-12.00 WIB", registered: 20, max: 30, img: "assets/trash-hero-logo.png" }
    ];

    // Variabel State
    let currentEvents = [...allEvents]; // Data yang sedang aktif (setelah di-search/sort)
    let currentPage = 1;
    const itemsPerPage = 3; // Menampilkan 3 event per halaman

    // Elemen DOM
    const eventsListContainer = document.getElementById('eventsList');
    const paginationContainer = document.getElementById('paginationContainer');
    const searchInput = document.querySelector('.search-container input');
    const searchBtn = document.querySelector('.search-container button');
    const sortDropdown = document.querySelector('.sort-dropdown');

    // 2. FUNGSI RENDER EVENTS KE HTML
    function renderEvents() {
        eventsListContainer.innerHTML = ''; // Bersihkan kontainer

        // Hitung index awal dan akhir untuk pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const eventsToShow = currentEvents.slice(startIndex, endIndex);

        if (eventsToShow.length === 0) {
            eventsListContainer.innerHTML = '<p style="padding: 20px; text-align: center;">No events found.</p>';
            return;
        }

        // Looping data event dan buat elemen HTML
        eventsToShow.forEach(event => {
            // Cek apakah slot penuh
            const isFull = event.registered >= event.max;
            const btnDaftar = isFull 
                ? `<button class="btn-daftar" disabled style="color: grey; cursor: not-allowed;"><i class="fa-solid fa-ban"></i> Kuota Penuh</button>`
                : `<button class="btn-daftar" onclick="daftarEvent(${event.id}, '${event.title}')"><i class="fa-regular fa-circle-plus"></i> Daftar Sekarang</button>`;

            const eventHTML = `
                <div class="event-item">
                    <div class="event-logo">
                        <img src="${event.img}" alt="Event Logo" onerror="this.style.display='none'">
                    </div>
                    <div class="event-datetime">
                        <h4>${event.displayDate}</h4>
                        <p><i class="fa-regular fa-clock"></i> ${event.time}</p>
                    </div>
                    <div class="event-info-text">
                        <h4>${event.title}</h4>
                        <p>${event.registered} / ${event.max} Registered</p>
                    </div>
                    <div class="event-actions">
                        <button class="btn-info" onclick="infoEvent(${event.id})"><i class="fa-solid fa-info"></i> Info</button>
                        ${btnDaftar}
                    </div>
                </div>
            `;
            eventsListContainer.insertAdjacentHTML('beforeend', eventHTML);
        });

        renderPagination();
    }

    // 3. FUNGSI RENDER PAGINATION (Nomor Halaman)
    function renderPagination() {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(currentEvents.length / itemsPerPage);

        if (totalPages <= 1) return; // Sembunyikan jika cuma 1 halaman

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = "#";
            pageLink.className = "page-num";
            pageLink.innerText = i;
            
            // Highlight halaman aktif
            if (i === currentPage) {
                pageLink.style.backgroundColor = "#ff4d4d";
                pageLink.style.color = "white";
            }

            pageLink.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                renderEvents();
            });

            paginationContainer.appendChild(pageLink);
        }
    }

    // 4. FUNGSI SEARCH
    function handleSearch() {
        const query = searchInput.value.toLowerCase();
        currentEvents = allEvents.filter(event => 
            event.title.toLowerCase().includes(query)
        );
        currentPage = 1; // Reset ke halaman 1 setiap kali mencari
        renderEvents();
    }

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // 5. FUNGSI SORTING (Newest / Oldest)
    sortDropdown.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        
        if (sortBy === 'newest') {
            currentEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === 'oldest') {
            currentEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
            // Default Sorting (kembalikan sesuai urutan ID awal)
            currentEvents.sort((a, b) => a.id - b.id);
        }
        
        currentPage = 1;
        renderEvents();
    });

    // 6. RESPONSIVE NAVBAR (Menu Burger Toggle)
    const menuBtn = document.querySelector('.menu-button');
    const navLinks = document.querySelector('.navlink');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            // Toggle display (membutuhkan tambahan CSS sedikit untuk mobile jika belum ada)
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '80px';
            navLinks.style.right = '0';
            navLinks.style.backgroundColor = 'white';
            navLinks.style.width = '200px';
            navLinks.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
    }

    // Inisialisasi awal saat halaman di-load
    renderEvents();
});

// 7. FUNGSI TOMBOL AKSI (Info & Daftar)
// Ditaruh di luar DOMContentLoaded agar bisa diakses oleh atribut onclick di HTML string
window.infoEvent = function(id) {
    alert(`Menampilkan detail lengkap untuk Event ID: ${id}. Nantinya ini akan pindah ke halaman Event Detail.`);
    // window.location.href = `event-detail.html?id=${id}`; // Kode asli untuk pindah halaman
};

window.daftarEvent = function(id, title) {
    const confirmDaftar = confirm(`Apakah kamu yakin ingin mendaftar untuk kegiatan: ${title}?`);
    if (confirmDaftar) {
        alert("Berhasil mendaftar! Status aplikasi kamu sekarang: Pending.");
        // Di sini nantinya kamu akan memanggil API backend untuk update database
    }
};