document.addEventListener('DOMContentLoaded', () => {
    const sessionData = localStorage.getItem('userSession');
    if (!sessionData) return window.location.href = 'loginpage.html';
    
    const user = JSON.parse(sessionData);
    if (user.role !== 'organizer') return window.location.href = 'dashboard.html';

    document.getElementById('createEventForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        // Menggunakan FormData untuk mengirim Teks + File Gambar
        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('location', document.getElementById('location').value);
        formData.append('event_date', document.getElementById('event_date').value);
        formData.append('max_quota', document.getElementById('max_quota').value);
        formData.append('hours_reward', document.getElementById('hours_reward').value);
        formData.append('created_by', user.id);
        
        // Ambil file gambar dari input
        const imageFile = document.getElementById('event_image').files[0];
        if(imageFile) {
            formData.append('image', imageFile);
        }

        try {
            // Hilangkan headers 'Content-Type' karena Fetch akan mengaturnya otomatis untuk FormData
            const response = await fetch('create_event_api.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert(result.message);
                window.location.href = 'dashboard.html';
            } else {
                alert("Gagal: " + result.message);
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan jaringan.");
        }
    });
});