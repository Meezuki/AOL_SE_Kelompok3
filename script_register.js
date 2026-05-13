document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Mencegah halaman reload

    // Mengambil nilai dari input HTML
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const conPassword = document.getElementById('conPassword').value;
    const agreement = document.getElementById('agreement').checked;
    
    // Mengambil role yang dipilih (Volunteer atau EO)
    const role = document.querySelector('input[name="role"]:checked').value;

    // Validasi dasar
    if (password !== conPassword) {
        alert("Konfirmasi kata sandi tidak cocok!");
        return;
    }

    if (!agreement) {
        alert("Anda harus menyetujui syarat dan ketentuan.");
        return;
    }

    // Mengirim data ke PHP menggunakan Fetch API
    try {
        const response = await fetch('register_api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                role: role
            })
        });

        // Menerima balasan dari PHP
        const result = await response.json();

        if (result.status === 'success') {
            alert(result.message);
            window.location.href = 'loginpage.html'; // Arahkan ke halaman login
        } else {
            alert("Gagal: " + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Terjadi kesalahan saat menghubungi server.");
    }
});