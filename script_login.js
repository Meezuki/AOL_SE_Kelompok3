document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Mencegah reload halaman

    const loginId = document.getElementById('login_id').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('login_api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login_id: loginId,
                password: password
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert(result.message);
            
            // Simpan data user di memori browser (localStorage)
            localStorage.setItem('userSession', JSON.stringify(result.data));

            // Arahkan ke halaman utama setelah login
            window.location.href = 'dashboard.html'; 
            
        } else {
            alert("Gagal: " + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Terjadi kesalahan saat menghubungi server.");
    }
});