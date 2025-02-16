document.addEventListener("DOMContentLoaded", function () {
    verifierSession(); // Vérifie si l'utilisateur est connecté au chargement de la page

    // Gestion du formulaire de connexion
    const formLogin = document.getElementById("login-form");
    if (formLogin) {
        formLogin.addEventListener("submit", function (event) {
            event.preventDefault();
            let email = document.getElementById("login-email").value.trim();
            let password = document.getElementById("login-password").value.trim();
            connexionUtilisateur(email, password);
        });
    }

    // Gestion du formulaire d'inscription
    const formSignup = document.getElementById("signup-form");
    if (formSignup) {
        formSignup.addEventListener("submit", function (event) {
            event.preventDefault();
            let pseudo = document.getElementById("signup-nom").value.trim();
            let email = document.getElementById("signup-email").value.trim();
            let password = document.getElementById("signup-password").value.trim();
            inscriptionUtilisateur(pseudo, email, password);
        });
    }
});

// 🔹 Fonction pour gérer la connexion
async function connexionUtilisateur(email, password) {
    try {
        let response = await fetch("http://localhost/EcoRide/api/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        let result = await response.json();

        if (response.ok && result.token) {
            // 🔹 Stocker le token et les infos utilisateur
            localStorage.setItem("token", result.token);
            localStorage.setItem("utilisateurConnecte", JSON.stringify({
                id: result.user_id,
                pseudo: result.pseudo,
                email: result.email,
                role: result.role
            }));

            alert(`✅ Connexion réussie en tant que ${result.role}`);

            // 🔹 Rediriger vers la bonne page en fonction du rôle
            switch (result.role) {
                case "admin":
                    window.location.href = "admin_dashboard.html";
                    break;
                case "employe":
                    window.location.href = "employee_dashboard.html";
                    break;
                default:
                    window.location.href = "user_dashboard.html";
                    break;
            }
        } else {
            alert("❌ Email ou mot de passe incorrect.");
        }
    } catch (error) {
        console.error("❌ Erreur lors de la connexion :", error);
        alert("❌ Problème de connexion au serveur.");
    }
}

// 🔹 Fonction pour gérer l'inscription
async function inscriptionUtilisateur(pseudo, email, password) {
    try {
        let response = await fetch("http://localhost/EcoRide/api/register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pseudo, email, password })
        });

        let result = await response.json();

        if (response.ok && result.message === "Inscription réussie !") {
            alert("✅ Inscription réussie !");
            window.location.href = "login.html"; // Redirige vers la page de connexion
        } else {
            alert("❌ Erreur lors de l'inscription !");
        }
    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error);
        alert("❌ Problème de connexion au serveur.");
    }
}

// 🔹 Fonction pour vérifier la session utilisateur
async function verifierSession() {
    let token = localStorage.getItem("token");
    if (!token) {
        console.log("🔒 Aucun utilisateur connecté.");
        return;
    }

    let response = await fetch("http://localhost/EcoRide/api/session.php", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });

    let user = await response.json();
    
    if (user.id) {
        console.log("👤 Utilisateur connecté :", user);
        document.getElementById("connexion-link").style.display = "none";
        document.getElementById("deconnexion-link").style.display = "block";

        if (user.role === "admin") {
            document.getElementById("admin-dashboard").style.display = "block";
        } else if (user.role === "employe") {
            document.getElementById("employe-dashboard").style.display = "block";
        } else {
            document.getElementById("user-dashboard").style.display = "block";
        }
    }
}

// 🔹 Déconnexion utilisateur
document.getElementById("deconnexion-link").addEventListener("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("utilisateurConnecte");
    alert("✅ Déconnexion réussie !");
    window.location.href = "login.html";
});

// 🔹 Affichage des trajets disponibles
async function afficherTrajets() {
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = "<p>🔄 Chargement des trajets...</p>";

    let response = await fetch("http://localhost/EcoRide/api/get_trajets.php");
    let trajets = await response.json();

    resultsContainer.innerHTML = "";
    if (trajets.length === 0) {
        resultsContainer.innerHTML = "<p class='text-danger'>Aucun trajet disponible.</p>";
        return;
    }

    trajets.forEach(trajet => {
        resultsContainer.innerHTML += `
            <div class="col-md-6 fade-in">
                <div class="card p-3 shadow-sm border border-success rounded-3">
                    <h5 class="text-success">🚗 ${trajet.depart} → ${trajet.arrivee}</h5>
                    <p><strong>📅 Date :</strong> ${trajet.date}</p>
                    <p><strong>💰 Prix :</strong> ${trajet.prix}€</p>
                    <p><strong>👤 Conducteur :</strong> ${trajet.conducteur}</p>
                    <p><strong>🚘 Véhicule :</strong> ${trajet.vehicule}</p>
                    <button class="btn btn-success w-100 mt-2" onclick="reserverTrajet(${trajet.id})">Réserver</button>
                </div>
            </div>`;
    });
}

// 🔹 Fonction pour réserver un trajet
async function reserverTrajet(trajet_id) {
    let token = localStorage.getItem("token");
    if (!token) {
        alert("❌ Vous devez être connecté pour réserver un trajet.");
        return;
    }

    let response = await fetch("http://localhost/EcoRide/api/reserver.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ trajet_id })
    });

    let result = await response.json();
    if (result.message) {
        alert("✅ " + result.message);
        afficherTrajets();
    } else {
        alert("❌ " + result.error);
    }
}
