document.addEventListener('DOMContentLoaded', () => {
    // 1. Cek Session
    const sessionData = localStorage.getItem('userSession');
    if (!sessionData) {
        alert("Silakan login terlebih dahulu.");
        window.location.href = 'loginpage.html';
        return;
    }

    const user = JSON.parse(sessionData);
    document.getElementById('welcomeMsg').innerText = `Welcome, ${user.username}!`;
    document.getElementById('userRoleBadge').innerText = user.role;

    const contentArea = document.getElementById('dashboardContent');

    // 2. Render Tampilan berdasarkan Role
    if (user.role === 'user') {
        renderVolunteerDashboard(contentArea, user.id);
    } else if (user.role === 'organizer') {
        renderEODashboard(contentArea, user.id);
    }

    // 3. Logout Logic
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('userSession');
        window.location.href = 'loginpage.html';
    });
});

// Jadikan fungsi ini async karena kita akan melakukan fetch (tarik data)
async function renderVolunteerDashboard(container, userId) {
    container.innerHTML = `<p>Loading dashboard data...</p>`; // Teks loading sementara

    try {
        const response = await fetch('get_volunteer_dashboard.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId })
        });

        const result = await response.json();

        if (result.status === 'success') {
            const data = result.data;
            
            // Hitung persentase progress bar (maksimal 100%)
            let progressPercent = (data.total_hours / data.target_hours) * 100;
            if (progressPercent > 100) progressPercent = 100;

            // Buat baris tabel untuk setiap lamaran (looping)
            let tableRows = '';
            if (data.applications.length > 0) {
                data.applications.forEach(app => {
                    // Format tanggal agar lebih rapi (opsional)
                    const dateObj = new Date(app.event_date);
                    const formattedDate = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

                    tableRows += `
                        <tr>
                            <td>${app.title}</td>
                            <td>${formattedDate}</td>
                            <td>${app.hours_reward}</td>
                            <td><span class="status-label ${app.status}">${app.status}</span></td>
                        </tr>
                    `;
                });
            } else {
                tableRows = `<tr><td colspan="4" style="text-align:center;">Belum ada riwayat lamaran. Yuk daftar event di menu Places!</td></tr>`;
            }

            // Gabungkan semua ke dalam HTML
            container.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Comserv Hours Progress</h3>
                        <p>Target: ${data.target_hours} Hours (Binusian Standard)</p>
                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${progressPercent}%;"></div>
                        </div>
                        <p><strong>${data.total_hours} / ${data.target_hours} Hours Collected</strong></p>
                    </div>
                </div>

                <div class="table-section">
                    <h3>My Applied Events</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Date</th>
                                <th>Hours</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            container.innerHTML = `<p style="color:red;">Gagal memuat data: ${result.message}</p>`;
        }
    } catch (error) {
        console.error("Error fetching dashboard:", error);
        container.innerHTML = `<p style="color:red;">Terjadi kesalahan sistem saat memuat data.</p>`;
    }
}

async function renderEODashboard(container, userId) {
    container.innerHTML = `<p>Loading applicant data...</p>`;

    try {
        const response = await fetch('get_eo_dashboard.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        });

        const result = await response.json();

        if (result.status === 'success') {
            const applicants = result.data;
            let tableRows = '';

            if (applicants.length > 0) {
                applicants.forEach(app => {
                    // Tombol aksi hanya aktif jika statusnya masih 'pending'
                    let actionButtons = '';
                    if (app.status === 'pending') {
                        actionButtons = `
                            <button class="btn-action btn-approve" onclick="updateStatus(${app.reg_id}, 'accepted', ${userId})">Approve</button>
                            <button class="btn-action btn-reject" onclick="updateStatus(${app.reg_id}, 'rejected', ${userId})">Reject</button>
                        `;
                    } else {
                        actionButtons = `<span style="color: grey; font-size: 12px;">Selesai diulas</span>`;
                    }

                    tableRows += `
                        <tr>
                            <td>${app.applicant_name}</td>
                            <td>${app.event_title}</td>
                            <td><span class="status-label ${app.status}">${app.status}</span></td>
                            <td>${actionButtons}</td>
                        </tr>
                    `;
                });
            } else {
                tableRows = `<tr><td colspan="4" style="text-align:center;">Belum ada mahasiswa yang melamar event Anda.</td></tr>`;
            }

            container.innerHTML = `
                <div class="table-section">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3>Applicant Management</h3>
                        <button class="btn-approve" style="padding: 10px 20px; border-radius: 5px; border:none; cursor:pointer;" onclick="alert('Fitur Create Event sedang dikembangkan!')">+ Create New Event</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Applicant Name</th>
                                <th>Event Targeted</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            container.innerHTML = `<p style="color:red;">Gagal memuat data: ${result.message}</p>`;
        }
    } catch (error) {
        console.error("Error fetching EO dashboard:", error);
        container.innerHTML = `<p style="color:red;">Terjadi kesalahan sistem saat memuat data pelamar.</p>`;
    }
}

// Tambahkan Fungsi Global untuk Tombol Approve/Reject di paling bawah file
window.updateStatus = async function(regId, newStatus, eoId) {
    const confirmAction = confirm(`Apakah Anda yakin ingin melakukan ${newStatus.toUpperCase()} pada pelamar ini?`);
    if (!confirmAction) return;

    try {
        const response = await fetch('update_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reg_id: regId, status: newStatus })
        });

        const result = await response.json();
        if (result.status === 'success') {
            alert(result.message);
            // Refresh ulang tampilan dasbor agar status di tabel langsung berubah
            renderEODashboard(document.getElementById('dashboardContent'), eoId);
        } else {
            alert("Gagal: " + result.message);
        }
    } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan jaringan saat update status.");
    }
};