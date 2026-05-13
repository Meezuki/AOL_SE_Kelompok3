document.addEventListener('DOMContentLoaded', () => {
    // 1. Cek apakah yang masuk benar-benar EO
    const sessionData = localStorage.getItem('userSession');
    if (!sessionData) {
        alert("Silakan login terlebih dahulu.");
        window.location.href = 'loginpage.html';
        return;
    }

    const user = JSON.parse(sessionData);
    if (user.role !== 'organizer') {
        alert("Akses ditolak! Hanya Event Organizer yang bisa membuat event.");
        window.location.href = 'dashboard.html';
        return;
    }

    // 2. Tangani saat tombol submit ditekan
    document.getElementById('createEventForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        // Ambil nilai dari form
        const eventData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            location: document.getElementById('location').value,
            event_date: document.getElementById('event_date').value,
            max_quota: document.getElementById('max_quota').value,
            hours_reward: document.getElementById('hours_reward').value,
            created_by: user.id // Penting: Mencatat siapa EO yang membuat event ini
        };

        try {
            const response = await fetch('create_event_api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData)
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert(result.message);
                window.location.href = 'dashboard.html'; // Kembali ke dasbor setelah sukses
            } else {
                alert("Gagal: " + result.message);
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan jaringan saat menyimpan event.");
        }
    });
});