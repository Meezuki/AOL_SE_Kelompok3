document.getElementById('registerForm').addEventListener('submit', function(e) {
    const password = document.getElementById('password').value;
    const conPassword = document.getElementById('conPassword').value;
    const agreement = document.getElementById('agreement').checked;

    if (password !== conPassword) {
        e.preventDefault();
        alert("Passwords do not match!");
        return;
    }

    if (!agreement) {
        e.preventDefault();
        alert("You must agree to the terms and conditions.");
        return;
    }

    // Jika valid, data akan diteruskan ke proses pendaftaran
    console.log("Form valid, ready to be sent to database.");
});