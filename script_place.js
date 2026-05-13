document.addEventListener('DOMContentLoaded', () => {
    let allEvents = [];
    let currentEvents = [];
    let currentPage = 1;
    const itemsPerPage = 3; 
    
    // Cek user session (untuk mengambil user_id saat mau daftar)
    const sessionData = localStorage.getItem('userSession');
    const user = sessionData ? JSON.parse(sessionData) : null;

    const eventsListContainer = document.getElementById('eventsList');
    const paginationContainer = document.getElementById('paginationContainer');

    // 1. Fungsi Mengambil Data dari Database
    async function fetchEvents() {
        eventsListContainer.innerHTML = '<p style="text-align:center;">Loading events...</p>';
        try {
            const response = await fetch('get_events.php');
            const result = await response.json();
            
            if(result.status === 'success') {
                allEvents = result.data;
                currentEvents = [...allEvents];
                renderEvents();
            } else {
                eventsListContainer.innerHTML = '<p style="text-align:center; color:red;">Gagal memuat event.</p>';
            }
        } catch(error) {
            console.error(error);
            eventsListContainer.innerHTML = '<p style="text-align:center; color:red;">Error server.</p>';
        }
    }

    // 2. Menampilkan Data ke HTML
    function renderEvents() {
        eventsListContainer.innerHTML = ''; 

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const eventsToShow = currentEvents.slice(startIndex, endIndex);

        if (eventsToShow.length === 0) {
            eventsListContainer.innerHTML = '<p style="padding: 20px; text-align: center;">No events found.</p>';
            return;
        }

        eventsToShow.forEach(event => {
            // Kalkulasi slot
            const isFull = event.available_slots <= 0;
            const registeredCount = event.max_quota - event.available_slots;

            // Tombol Daftar
            const btnDaftar = isFull 
                ? `<button class="btn-daftar" disabled style="color: grey;"><i class="fa-solid fa-ban"></i> Penuh</button>`
                : `<button class="btn-daftar" onclick="daftarEvent(${event.id}, '${event.title}')"><i class="fa-regular fa-circle-plus"></i> Daftar Sekarang</button>`;

            // Format Tanggal
            const dateObj = new Date(event.event_date);
            const dateStr = dateObj.toLocaleDateString('id-ID', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

            const eventHTML = `
                <div class="event-item">
                    <div class="event-logo">
                        <img src="assets/trash_hero_logo.png" alt="Event" onerror="this.style.display='none'">
                    </div>
                    <div class="event-datetime">
                        <h4>${dateStr}</h4>
                        <p><i class="fa-solid fa-location-dot"></i> ${event.location}</p>
                        <p style="color: #17a948; font-weight:bold; margin-top:5px;">+${event.hours_reward} Jam Comserv</p>
                    </div>
                    <div class="event-info-text">
                        <h4>${event.title}</h4>
                        <p>${event.description}</p>
                        <p style="font-size:12px; margin-top:5px;">${registeredCount} / ${event.max_quota} Registered</p>
                    </div>
                    <div class="event-actions">
                        ${btnDaftar}
                    </div>
                </div>
            `;
            eventsListContainer.insertAdjacentHTML('beforeend', eventHTML);
        });

        renderPagination();
    }

    function renderPagination() {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(currentEvents.length / itemsPerPage);
        if (totalPages <= 1) return; 

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = "#";
            pageLink.className = "page-num";
            pageLink.innerText = i;
            
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


// --- FITUR SEARCH & SORT ---
    const searchInput = document.querySelector('.search-container input');
    const searchBtn = document.querySelector('.search-container button');
    const sortDropdown = document.querySelector('.sort-dropdown');

    // Fungsi Search
    function handleSearch() {
        const query = searchInput.value.toLowerCase();
        currentEvents = allEvents.filter(event => 
            event.title.toLowerCase().includes(query) || 
            event.location.toLowerCase().includes(query)
        );
        currentPage = 1;
        renderEvents();
    }

    // Trigger search saat tombol diklik atau tekan Enter
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    // Fungsi Sort
    if (sortDropdown) {
        sortDropdown.addEventListener('change', (e) => {
            const sortBy = e.target.value;
            
            if (sortBy === 'newest') {
                currentEvents.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
            } else if (sortBy === 'oldest') {
                currentEvents.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
            } else {
                // Default Sorting (kembalikan ke urutan awal ID)
                currentEvents.sort((a, b) => a.id - b.id);
            }
            
            currentPage = 1;
            renderEvents();
        });
    }


    // Jalankan fungsi tarik data saat halaman diload
    fetchEvents();

    // Fungsi Submit Lamaran (Global function agar bisa dipanggil dari HTML)
    window.daftarEvent = async function(eventId, title) {
        if(!user || user.role !== 'user') {
            alert("Hanya Volunteer yang sudah login yang bisa mendaftar!");
            window.location.href = 'loginpage.html';
            return;
        }

        const confirmDaftar = confirm(`Apakah kamu yakin ingin melamar event: ${title}?`);
        if (!confirmDaftar) return;

        try {
            const response = await fetch('apply_event.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    event_id: eventId
                })
            });

            const result = await response.json();
            if(result.status === 'success') {
                alert(result.message);
            } else {
                alert("Gagal: " + result.message);
            }
        } catch(e) {
            console.error(e);
            alert("Terjadi kesalahan jaringan.");
        }
    };
});