
ocument.addEventListener("DOMContentLoaded", function () {
    const formLogin = document.getElementById("login-form");

    formLogin.addEventListener("submit", async function(event) {
        event.preventDefault();

        let email = document.getElementById("login-email").value.trim();
        let password = document.getElementById("login-password").value.trim();

        try {
            let response = await fetch("http://localhost/EcoRide/api/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include" // Permet d'envoyer et récupérer la session
            });

            let result = await response.json();

            if (response.ok && result.message === "Connexion réussie !") {
                alert("✅ Connexion réussie !");
                window.location.href = "user_dashboard.html";
            } else {
                alert("❌ Email ou mot de passe incorrect.");
            }
        } catch (error) {
            console.error("❌ Erreur lors de la connexion :", error);
            alert("❌ Problème de connexion au serveur.");
        }
    });
});