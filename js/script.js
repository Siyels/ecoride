console.log("✅ Script détecté et chargé 1");
console.log("📌 Page chargée :", window.location.pathname);
console.log("🔍 Formulaire trouvé ? inscription", document.getElementById("signup-form"));
// A changer pour la prod
const BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost/EcoRide/api" 
    : "https://mon-site.com/api";  // Mets ton URL de prod ici

// Formulaire    
    const formSignup = document.getElementById("signup-form");
if (!formSignup) {
    console.error("❌ Formulaire non trouvé !");
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 Page détectée :", window.location.pathname);

    if (window.location.pathname.includes("details.html")) {
        afficherDetailsCovoiturage();
    } else if (window.location.pathname.includes("historie.html")) {
        afficherHistorique();
    } else if (window.location.pathname.includes("index.html")) {
        initialiserTrajets();
        configurerRecherche();
        configurerFiltres();
    }

    configurerBoutonHistorique();
});


/*
     Configuration filtre 
*/

function configurerFiltres() {
    const boutonFiltrer = document.getElementById("apply-filters");
    if (!boutonFiltrer) {
        console.error("❌ Bouton de filtre introuvable !");
        return;
    }

    boutonFiltrer.addEventListener("click", () => {
        console.log("🎯 Application des filtres...");

        // Charger les trajets affichés après la recherche
        const trajetsFiltresStockes = JSON.parse(localStorage.getItem("trajetsFiltres")) || [];
        if (trajetsFiltresStockes.length === 0) {
            console.warn("⚠️ Aucun trajet à filtrer !");
            return;
        }

        const prixMax = parseFloat(document.getElementById("filter-price").value) || Infinity;
        const dureeMax = parseFloat(document.getElementById("filter-duration").value) || Infinity;
        const noteMin = parseFloat(document.getElementById("filter-rating").value) || 0;
        const ecoFilter = document.getElementById("filter-eco").value.toLowerCase();

        console.log(`🔍 Filtres : Prix max = ${prixMax}, Durée max = ${dureeMax}, Note min = ${noteMin}, Écologique = ${ecoFilter}`);

        const trajetsFiltresFinal = trajetsFiltresStockes.filter((trajet) => {
            const prix = parseFloat(trajet.prix.replace("€", "")) || 0;
            const duree = trajet.duree ? parseFloat(trajet.duree.replace("h", "")) : 0;
            const note = trajet.note ? parseFloat(trajet.note) : 5;

            return (
                prix <= prixMax &&
                duree <= dureeMax &&
                note >= noteMin &&
                (ecoFilter === "" || (ecoFilter === "true" && trajet.vehicule.includes("Tesla")) || (ecoFilter === "false" && !trajet.vehicule.includes("Tesla")))
            );
        });

        afficherTrajets(trajetsFiltresFinal);
    });
}

/**
 * 
 *              TRAJET
 * 
 */












/* 
    Filtrer les trajets 
*/

function afficherTrajets(trajetsFiltres) {
    console.log('🚗 Mise à jour de l\'affichage des trajets');
    const resultsContainer = document.getElementById("results-container");
    if (!resultsContainer) {
        console.error("❌ Élément #results-container introuvable !");
        return;
    }

    resultsContainer.innerHTML = "";
    if (trajetsFiltres.length === 0) {
        resultsContainer.innerHTML = "<p class='text-danger text-center'>Aucun trajet disponible.</p>";
        return;
    }

    trajetsFiltres.forEach((trajet, index) => {
        const trajetHTML = `
            <div class="col-md-6 fade-in">
                <div class="card p-3 shadow-sm border border-success rounded-3">
                    <div class="d-flex align-items-center">
                        <div class="me-3">
                            <img src="https://via.placeholder.com/50" class="rounded-circle" alt="Conducteur">
                        </div>
                        <h5 class="text-success">🚗 ${trajet.depart} → ${trajet.arrivee}</h5>
                    </div>
                    <p><strong>📅 Date :</strong> ${trajet.date}</p>
                    <p><strong>💰 Prix :</strong> ${trajet.prix}</p>
                    <p><strong>👤 Conducteur :</strong> ${trajet.conducteur}</p>
                    <p><strong>🚘 Véhicule :</strong> ${trajet.vehicule} ${trajet.vehicule.includes("Tesla") ? '<span class="badge bg-success">Écologique</span>' : ''}</p>
                    <a href="details.html?index=${index}" class="btn btn-success w-100 mt-2">Détails</a>
                </div>
            </div>`;
        resultsContainer.innerHTML += trajetHTML;
    });
    console.log("✅ Trajets affichés !");
}
/*  
    Afficher ddétail des coovoiturage sur detail.html
*/

function afficherDetailsCovoiturage() {
    const params = new URLSearchParams(window.location.search);
    let index = params.get("index");
    console.log("Index du trajet :", index);
    const trajetsStockes = JSON.parse(localStorage.getItem("trajets"));

    if (trajetsStockes && index !== null && trajetsStockes[index]) {
        const trajet = trajetsStockes[index];
        document.getElementById("carpool-details").innerHTML = `
            <p><strong>📍 Départ :</strong> ${trajet.depart}</p>
            <p><strong>🏁 Arrivée :</strong> ${trajet.arrivee}</p>
            <p><strong>📅 Date :</strong> ${trajet.date}</p>
            <p><strong>💰 Prix :</strong> ${trajet.prix}</p>
            <p><strong>👤 Conducteur :</strong> ${trajet.conducteur}</p>
            <p><strong>🚘 Véhicule :</strong> ${trajet.vehicule}</p>
        `;
    } else {
        document.getElementById("carpool-details").innerHTML = "<p class='text-danger'>Détails non disponibles.</p>";
    }
}
/*
    Gestion du bouton "histrorique"
*/

function configurerBoutonHistorique() {
    const boutonHistorique = document.getElementById("button_historique");
    if (boutonHistorique) {
        boutonHistorique.addEventListener("click", () => {
            window.location.href = "historie.html";
        });
    }
}






/**
 * 🎯 Gestion du bouton "Historique"
 */
function configurerBoutonHistorique() {
    const boutonHistorique = document.getElementById("button_historique");
    if (boutonHistorique) {
        boutonHistorique.addEventListener("click", () => {
            window.location.href = "historie.html";
        });
    }
}

/**
 * 📜 Affichage de l'historique des covoiturages
 */
function afficherHistorique() {
    let historiqueTableBody = document.getElementById("historiqueTableBody");

    if (!historiqueTableBody) {
        console.error("Erreur: Élément #historiqueTableBody introuvable.");
        return;
    }

    historiqueTableBody.innerHTML = "";

    trajets.forEach((trajet, index) => {
        let row = `
            <tr>
                <td>${trajet.date}</td>
                <td>${trajet.depart}</td>
                <td>${trajet.arrivee}</td>
                <td>${trajet.vehicule}</td>
                <td class="${getStatutClass(trajet.statut)}">${trajet.statut}</td>
                <td>
                    ${trajet.statut === "En cours" ? `<button class="btn btn-danger btn-sm" onclick="annulerTrajet(${index})">Annuler</button>` : ""}
                </td>
            </tr>
        `;
        historiqueTableBody.innerHTML += row;
    });
}

/**
 * ❌ Fonction pour annuler un trajet
 */
function annulerTrajet(index) {
    if (trajets[index]) {
        trajets[index].statut = "Annulé";
        afficherHistorique(); // Met à jour l'affichage
    }
}

/**
 * 🏷️ Obtenir la classe CSS du statut
 */
function getStatutClass(statut) {
    switch (statut) {
        case "Terminé": return "text-success";
        case "Annulé": return "text-danger";
        case "En cours": return "text-warning";
        default: return "";
    }
}
/**
 
/**
 * 🎭 Gestion de l'affichage des options en fonction du rôle sélectionné
 */
function configurerAffichageRole() {
    const roleRadios = document.querySelectorAll('input[name="role"]');
    const chauffeurOptions = document.getElementById("chauffeur-options");
    const passengerSave = document.getElementById("passenger-save");

    function updateFormDisplay() {
        const selectedRole = document.querySelector('input[name="role"]:checked');

        if (!selectedRole) {
            // Si aucun choix n'est sélectionné, tout cacher
            chauffeurOptions.style.display = "none";
            passengerSave.style.display = "none";
            return;
        }

        if (selectedRole.value === "chauffeur" || selectedRole.value === "les_deux") {
            chauffeurOptions.style.display = "block";
            passengerSave.style.display = "none";
        } else if (selectedRole.value === "passager") {
            chauffeurOptions.style.display = "none";
            passengerSave.style.display = "block";
        }
    }

    roleRadios.forEach(radio => {
        radio.addEventListener("change", updateFormDisplay);
    });

}

// Exécuter la configuration du rôle une fois le DOM chargé
document.addEventListener("DOMContentLoaded", () => {
    configurerAffichageRole();
});



/*
    Chauffeur et Les deux

*/


// 🏁 Démarrer un covoiturage
function demarrerCovoiturage(index) {
    let trajetsStockes = JSON.parse(localStorage.getItem("trajets")) || [];

    if (trajetsStockes[index]) {
        trajetsStockes[index].statut = "En cours";
        localStorage.setItem("trajets", JSON.stringify(trajetsStockes));
        afficherTrajetsChauffeur();
    }
}

// 🏁 Clôturer un covoiturage
function terminerCovoiturage(index) {
    let trajetsStockes = JSON.parse(localStorage.getItem("trajets")) || [];

    if (trajetsStockes[index]) {
        trajetsStockes[index].statut = "Terminé";
        localStorage.setItem("trajets", JSON.stringify(trajetsStockes));
        afficherTrajetsChauffeur();
    }
}

/* // 🚗 Afficher les trajets du chauffeur
function afficherTrajetsChauffeur() {
    const trajetsChauffeur = document.getElementById("trajets-en-cours");
    let trajetsStockes = JSON.parse(localStorage.getItem("trajets")) || [];

    trajetsChauffeur.innerHTML = "";

    trajetsStockes.forEach((trajet, index) => {
        if (trajet.statut === "En cours" || trajet.statut === "À venir") {
            let buttonHTML = trajet.statut === "À venir"
                ? `<button class="btn btn-primary" onclick="demarrerCovoiturage(${index})">Démarrer</button>`
                : `<button class="btn btn-danger" onclick="terminerCovoiturage(${index})">Arrivée à destination</button>`;

            trajetsChauffeur.innerHTML += `
                <div class="card p-3">
                    <p><strong>📍 Départ :</strong> ${trajet.depart}</p>
                    <p><strong>🏁 Arrivée :</strong> ${trajet.arrivee}</p>
                    <p><strong>📅 Date :</strong> ${trajet.date}</p>
                    <p><strong>🚘 Véhicule :</strong> ${trajet.vehicule}</p>
                    ${buttonHTML}
                </div>`;
        }
    });
} */

// 🔥 Lancer l'affichage au chargement de la page


/*
    Passager

*/
// ✅ Confirmation par les passagers
function validerTrajet(index) {
    let trajetsStockes = JSON.parse(localStorage.getItem("trajets")) || [];

    if (trajetsStockes[index]) {
        let avis = prompt("Laissez un avis sur le trajet (facultatif) :");
        let note = prompt("Donnez une note sur 5 :");

        trajetsStockes[index].avis = avis || "";
        trajetsStockes[index].note = note || "5";
        trajetsStockes[index].statut = "Validé";

        localStorage.setItem("trajets", JSON.stringify(trajetsStockes));
        afficherTrajetsPassagers();
    }
}

// 🚗 Afficher les trajets passagers à valider


// 🔥 Affichage au chargement


/*

    Emploiyer dashboard

*/

// Avis en attentes
// 📝 Afficher les avis à valider
function afficherAvisAValider() {
    const listeAvis = document.getElementById("liste-avis");
    let trajetsStockes = JSON.parse(localStorage.getItem("trajets")) || [];

    listeAvis.innerHTML = "";

    trajetsStockes.forEach((trajet, index) => {
        if (trajet.statut === "Validé" && trajet.avis && !trajet.avisApprouve) {
            listeAvis.innerHTML += `
                <div class="card p-3">
                    <p><strong>🚗 Trajet :</strong> ${trajet.depart} → ${trajet.arrivee}</p>
                    <p><strong>📅 Date :</strong> ${trajet.date}</p>
                    <p><strong>👤 Avis de passager :</strong> ${trajet.avis}</p>
                    <button class="btn btn-success" onclick="validerAvis(${index})">✅ Approuver</button>
                    <button class="btn btn-danger" onclick="refuserAvis(${index})">❌ Refuser</button>
                </div>`;
        }
    });
}

// ✅ Approuver un avis
function validerAvis(index) {
    let trajetsStockes = JSON.parse(localStorage.getItem("trajets")) || [];
    trajetsStockes[index].avisApprouve = true;
    localStorage.setItem("trajets", JSON.stringify(trajetsStockes));
    afficherAvisAValider();
}

// ❌ Refuser un avis
function refuserAvis(index) {
    let trajetsStockes = JSON.parse(localStorage.getItem("trajets")) || [];
    trajetsStockes[index].avis = "Avis refusé par un employé.";
    trajetsStockes[index].avisApprouve = false;
    localStorage.setItem("trajets", JSON.stringify(trajetsStockes));
    afficherAvisAValider();
}


// Trajets problematique
// ⚠️ Afficher les trajets avec problèmes
function afficherProblemesTrajets() {
    const listeProblemes = document.getElementById("liste-problemes");
    let trajetsStockes = JSON.parse(localStorage.getItem("trajets")) || [];

    listeProblemes.innerHTML = "";

    trajetsStockes.forEach((trajet, index) => {
        if (trajet.problemeSignale) {
            listeProblemes.innerHTML += `
                <div class="card p-3">
                    <p><strong>🚗 Trajet :</strong> ${trajet.depart} → ${trajet.arrivee}</p>
                    <p><strong>📅 Date :</strong> ${trajet.date}</p>
                    <p><strong>👤 Signalé par :</strong> ${trajet.signalePar}</p>
                    <p><strong>📝 Problème :</strong> ${trajet.probleme}</p>
                    <button class="btn btn-info" onclick="contacterConducteur(${index})">📩 Contacter le chauffeur</button>
                </div>`;
        }
    });
}

// 📩 Contacter le conducteur pour résoudre un problème
function contacterConducteur(index) {
    let trajetsStockes = JSON.parse(localStorage.getItem("trajets")) || [];
    alert(`Un email a été envoyé au conducteur ${trajetsStockes[index].conducteur}.`);
}

// Signaler un probleme

// 🚨 Fonction pour signaler un problème après un trajet
function signalerProbleme(index) {
    let trajetsStockes = JSON.parse(localStorage.getItem("trajets")) || [];
    
    let description = prompt("Décrivez le problème rencontré :");
    if (description) {
        trajetsStockes[index].problemeSignale = true;
        trajetsStockes[index].probleme = description;
        trajetsStockes[index].signalePar = "Utilisateur anonyme"; // On peut ajouter le pseudo de l'utilisateur connecté
        localStorage.setItem("trajets", JSON.stringify(trajetsStockes));
        alert("Le problème a été signalé à un employé.");
    }
}

/*
        Admin Board

*/

// Ajouter les comptes à afficher
// 👥 Afficher la liste des comptes


// 🚫 Suspendre un compte


// ✅ Réactiver un compte
function reactiverCompte(index) {
    let utilisateursStockes = JSON.parse(localStorage.getItem("utilisateurs")) || [];
    utilisateursStockes[index].suspendu = false;
    localStorage.setItem("utilisateurs", JSON.stringify(utilisateursStockes));
    afficherComptes();
}

// Les graphiques
// 📊 Générer le graphique des covoiturages
function afficherGraphiqueCovoiturages() {
    let trajetsStockes = JSON.parse(localStorage.getItem("trajets")) || [];
    let dates = {};
    
    trajetsStockes.forEach(trajet => {
        if (!dates[trajet.date]) {
            dates[trajet.date] = 1;
        } else {
            dates[trajet.date]++;
        }
    });

    let labels = Object.keys(dates);
    let data = Object.values(dates);

    new Chart(document.getElementById("graphique-covoiturages"), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Nombre de covoiturages par jour',
                data: data,
                backgroundColor: 'blue'
            }]
        }
    });
}

// 💰 Générer le graphique des gains de la plateforme
function afficherGraphiqueGains() {
    let trajetsStockes = JSON.parse(localStorage.getItem("trajets")) || [];
    let gains = {};

    trajetsStockes.forEach(trajet => {
        if (!gains[trajet.date]) {
            gains[trajet.date] = parseFloat(trajet.prix);
        } else {
            gains[trajet.date] += parseFloat(trajet.prix);
        }
    });

    let labels = Object.keys(gains);
    let data = Object.values(gains);

    new Chart(document.getElementById("graphique-gains"), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gains de la plateforme (€)',
                data: data,
                backgroundColor: 'green',
                borderColor: 'black',
                borderWidth: 1
            }]
        }
    });
}

// 🔥 Charger les statistiques au chargement de la page
/*document.addEventListener("DOMContentLoaded", () => {
    afficherComptes();
    afficherGraphiqueCovoiturages();
    afficherGraphiqueGains();
});
*/
// ➕ Ajouter un employé
function ajouterEmploye(event) {
    event.preventDefault();

    let nom = document.getElementById("nom-employe").value.trim();
    let email = document.getElementById("email-employe").value.trim();
    let mdp = document.getElementById("mdp-employe").value.trim();

    if (!nom || !email || !mdp) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    let utilisateursStockes = JSON.parse(localStorage.getItem("utilisateurs")) || [];

    // Vérifier si l'email existe déjà
    let emailExiste = utilisateursStockes.some(user => user.email === email);
    if (emailExiste) {
        alert("Cet email est déjà utilisé !");
        return;
    }

    // Ajouter le nouvel employé
    let nouvelEmploye = {
        nom: nom,
        email: email,
        password: mdp,  // ⚠️ En production, il faut hasher les mots de passe
        role: "employe",
        suspendu: false
    };

    utilisateursStockes.push(nouvelEmploye);
    localStorage.setItem("utilisateurs", JSON.stringify(utilisateursStockes));

    alert("Employé ajouté avec succès !");
    document.getElementById("form-ajout-employe").reset();
    afficherComptes(); // Met à jour la liste des comptes
}

/*
    Gestion des Credits
*/

// Ajout 10 credit nnew utilisateur
function initialiserCredits() {
    if (!localStorage.getItem("creditUtilisateur")) {
        localStorage.setItem("creditUtilisateur", "10");
    }
}

// 🔥 Exécuter l'initialisation des crédits au chargement de la page

/*document.addEventListener("DOMContentLoaded", () => {
    initialiserCredits();
    afficherSoldeCredits();
});

function afficherSoldeCredits() {
    const solde = localStorage.getItem("creditUtilisateur") || "0";
    document.getElementById("credit-solde").innerText = solde;
}
*/

// Mise a jours crédit

/*  Mettre à jour l'affichage du solde de crédits
function mettreAJourCredits() {
    const solde = localStorage.getItem("creditUtilisateur") || "0";
    document.getElementById("credit-solde").innerText = solde;
}

// 🔥 Exécuter la mise à jour dès le chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    mettreAJourCredits();
});
*/

/**
 * 
 *          CONNECTION
 * 
 */


document.addEventListener("DOMContentLoaded", function () {
    const formLogin = document.getElementById("login-form");
    if (formLogin) {
        formLogin.addEventListener("submit", function (event) {
            event.preventDefault();

            let email = document.getElementById("email").value.trim();
            let password = document.getElementById("password").value.trim();

            connexionUtilisateur(email, password);
        });
    }
});


async function connexionUtilisateur(email, password) {
    try {
        let response = await fetch(`${BASE_URL}/login.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include" // Important pour maintenir la session PHP
        });

        let textResponse = await response.text();
        console.log("🔍 Réponse brute du serveur :", textResponse);

        let result;
        try {
            result = JSON.parse(textResponse);
        } catch (jsonError) {
            console.error("❌ Erreur de parsing JSON :", jsonError);
            alert("❌ Réponse du serveur invalide !");
            return;
        }

        console.log("✅ JSON reçu :", result);

        if (response.ok) {
            if (result.message === "Connexion réussie !" && result.user) {
                alert("✅ Connexion réussie !");
                localStorage.setItem("utilisateurConnecte", JSON.stringify(result.user));

                // Rediriger en fonction du rôle
                if (result.user.role === "admin") {
                    window.location.href = "admin_dashboard.html";
                } else if (result.user.role === "employe") {
                    window.location.href = "employee_dashboard.html";
                } else {
                    window.location.href = "user_dashboard.html";
                }
            } else {
                console.error("⚠️ Réponse inattendue du serveur :", result);
                alert("❌ Erreur de connexion.");
            }
        } else {
            console.error("❌ Erreur HTTP :", response.status, result);
            alert("❌ Email ou mot de passe incorrect.");
        }
    } catch (error) {
        console.error("❌ Erreur lors de la connexion :", error);
        alert("❌ Problème de connexion au serveur.");
    }
}





/**
 * 
 * COOKIE 
 */

// Verification des Roles

// 🔒 Vérification des rôles sur chaque page
function verifierAcces(roleAutorise) {
    let utilisateurConnecte = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    if (!utilisateurConnecte || utilisateurConnecte.role !== roleAutorise) {
        alert("🚫 Accès refusé ! Vous n'avez pas la permission d'accéder à cette page.");
        window.location.href = "index.html"; // Redirection vers l'accueil
    }
}

// Verifier la session 
async function verifierSession() {
    try {
        let response = await fetch(`${BASE_URL}/session.php`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        let textResponse = await response.text();
        console.log("🔍 Réponse brute de session.php :", textResponse);

        let result;
        try {
            result = JSON.parse(textResponse);
        } catch (jsonError) {
            console.error("❌ Erreur JSON lors de la vérification de session :", jsonError);
            return;
        }

        console.log("✅ Vérification de la session :", result);

        if (result.status === "success" && result.session_data) {
            console.log("👤 Utilisateur connecté :", result.session_data);

            let connexionLink = document.getElementById("connexion-link");
            let deconnexionLink = document.getElementById("deconnexion-link");

            if (connexionLink) connexionLink.style.display = "none";
            if (deconnexionLink) deconnexionLink.style.display = "block";
        } else {
            console.warn("🚫 Aucun utilisateur connecté");
        }
    } catch (error) {
        console.error("❌ Erreur lors de la vérification de session :", error);
    }
}

// 🔥 Vérification automatique au chargement
document.addEventListener("DOMContentLoaded", verifierSession);




// 🔥 Vérification automatique au chargement
document.addEventListener("DOMContentLoaded", verifierSession);


/**
 *          INSCRIPTION
 */

document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 DOM chargé et script exécuté !");
    
    const formSignup = document.getElementById("signup-form");

    if (!formSignup) {
        console.error("❌ Formulaire d'inscription introuvable !");
        return;
    }

    formSignup.addEventListener("submit", async function(event) {
        event.preventDefault();

        // Vérifier si les champs existent
        const pseudoInput = document.getElementById("signup-nom");
        const emailInput = document.getElementById("signup-email");
        const passwordInput = document.getElementById("signup-password");

        if (!pseudoInput || !emailInput || !passwordInput) {
            console.error("❌ Un ou plusieurs champs du formulaire sont introuvables !");
            return;
        }

        // Récupération des valeurs des champs
        const pseudo = pseudoInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const role = "user"; // Rôle fixé par défaut

        if (!pseudo || !email || !password) {
            console.warn("⚠️ Tous les champs doivent être remplis !");
            alert("❌ Veuillez remplir tous les champs !");
            return;
        }

        // Création de l'objet des données à envoyer
        const formData = {
            pseudo: pseudo,
            email: email,
            password: password,
            role: role
        };

        console.log("📩 Données envoyées :", formData); // Debugging

        try {
            const response = await fetch(`${BASE_URL}/register.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log("📩 Réponse reçue :", result); // Debugging

            if (response.ok) {
                alert('✅ Inscription réussie !');
                window.location.href = 'login.html';
            } else {
                alert(`❌ Erreur : ${result.error}`);
            }
        } catch (error) {
            console.error('❌ Erreur lors de la requête :', error);
            alert('Une erreur est survenue. Veuillez réessayer plus tard.');
        }
    });

    console.log("🎯 Script prêt !");
});



/**
 *  GESTION DES MENUS
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Gestion dynamique du menu");

    // Récupérer les éléments du menu
    const connexionLink = document.getElementById("connexion-link");
    const deconnexionLink = document.getElementById("deconnexion-link");
    const userDashboard = document.getElementById("user-dashboard");
    const userSpace = document.getElementById("user-space");
    const employeDashboard = document.getElementById("employe-dashboard");
    const adminDashboard = document.getElementById("admin-dashboard");

    // Récupérer l'utilisateur connecté depuis localStorage
    let utilisateurConnecte = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    if (utilisateurConnecte) {
        console.log("👤 Utilisateur connecté :", utilisateurConnecte);

        // Cache le lien Connexion et affiche Déconnexion
        if (connexionLink) connexionLink.style.display = "none";
        if (deconnexionLink) deconnexionLink.style.display = "block";

        // Afficher ou cacher les menus selon le rôle
        if (userDashboard) userDashboard.style.display = "block";
        if (userSpace) userSpace.style.display = "block";

        if (utilisateurConnecte.role === "employe") {
            if (employeDashboard) employeDashboard.style.display = "block";
            if (adminDashboard) adminDashboard.style.display = "none";
        } else if (utilisateurConnecte.role === "admin") {
            if (employeDashboard) employeDashboard.style.display = "block";
            if (adminDashboard) adminDashboard.style.display = "block";
        } else {
            if (employeDashboard) employeDashboard.style.display = "none";
            if (adminDashboard) adminDashboard.style.display = "none";
        }
    } else {
        console.log("🚫 Aucun utilisateur connecté");

        // Afficher Connexion et cacher Déconnexion
        if (connexionLink) connexionLink.style.display = "block";
        if (deconnexionLink) deconnexionLink.style.display = "none";

        // Cacher les menus utilisateur, employé et admin
        if (userDashboard) userDashboard.style.display = "none";
        if (userSpace) userSpace.style.display = "none";
        if (employeDashboard) employeDashboard.style.display = "none";
        if (adminDashboard) adminDashboard.style.display = "none";
    }

    // 🔹 Gestion de la Déconnexion
    if (deconnexionLink) {
        deconnexionLink.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("utilisateurConnecte"); // Supprimer les infos de l'utilisateur
            alert("✅ Déconnexion réussie !");
            window.location.href = "index.html"; // Redirection vers l'accueil
        });
    }
});


// **********DECONECTION*************//
document.addEventListener("DOMContentLoaded", function () {
    const deconnexionLink = document.getElementById("deconnexion-link");

    if (deconnexionLink) {
        deconnexionLink.addEventListener("click", async function (event) {
            event.preventDefault();

            try {
                let response = await fetch(`${BASE_URL}/logout.php`, {
                    method: "GET",
                    credentials: "include"
                });

                let result = await response.json();
                console.log(result.message); // Debug

                if (response.ok) {
                    alert("✅ Déconnexion réussie !");
                    
                    // Suppression des données locales
                    localStorage.removeItem("token");
                    localStorage.removeItem("utilisateurConnecte");

                    // Redirection vers la page d'accueil
                    window.location.href = "index.html";
                } else {
                    alert("❌ Erreur lors de la déconnexion.");
                }
            } catch (error) {
                console.error("❌ Erreur lors de la déconnexion :", error);
            }
        });
    }
});

/**
 * 
 *               TRAJETS
 */


//Ajouter trajet en tant que conducteur
document.addEventListener("DOMContentLoaded", function () {
    let form = document.getElementById("voyageForm");
    
    if (!form) {
        console.error("🚨 Formulaire 'voyageForm' introuvable !");
        return; // ⛔ Stoppe l'exécution si le formulaire n'est pas trouvé
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        let adresseDepart = document.getElementById("adresseDepart")?.value.trim() || "";
        let adresseArrivee = document.getElementById("adresseArrivee")?.value.trim() || "";
        let dateTrajet = document.getElementById("dateTrajet")?.value.trim() || "";
        let vehicule = document.getElementById("vehicule")?.value.trim() || "";
        let places = parseInt(document.getElementById("nBplace")?.value) || 1;
        let prix = parseFloat(document.getElementById("prix")?.value) || 0.0;

        if (!adresseDepart || !adresseArrivee || !dateTrajet || !vehicule) {
            alert("Veuillez remplir tous les champs !");
            return;
        }

        let trajetData = {
            adresseDepart,
            adresseArrivee,
            dateTrajet,
            vehicule,
            places,
            prix,
            eco: 1
        };

        try {
            let response = await fetch("http://localhost/EcoRide/api/ad_trajet.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(trajetData)
            });

            let textResponse = await response.text(); // 🔍 Debug : voir si on reçoit bien du JSON
            console.log("🔍 Réponse brute du serveur :", textResponse);

            let result;
            try {
                result = JSON.parse(textResponse);
            } catch (jsonError) {
                console.error("❌ Réponse du serveur invalide (pas un JSON) :", jsonError);
                alert("❌ Erreur : réponse serveur invalide !");
                return;
            }

            console.log("✅ Réponse JSON :", result);

            if (result.status === "success") {
                alert("✅ Trajet ajouté avec succès !");
                location.reload();
            } else {
                alert("❌ Erreur : " + result.message);
            }
        } catch (error) {
            console.error("❌ Erreur lors de l'ajout du trajet :", error);
            alert("❌ Une erreur est survenue !");
        }
    });
});

// Charger et afficher les trajets disponibles sur l'index.html
async function afficherTrajetsDisponibles() {
    try {
        let response = await fetch("http://localhost/EcoRide/api/get_trajet.php", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        let trajets = await response.json();
        console.log("📌 Trajets récupérés :", trajets);

        const resultsContainer = document.getElementById("results-container");
        if (!resultsContainer) {
            console.error("❌ Élément #results-container introuvable !");
            return;
        }

        resultsContainer.innerHTML = "";

        if (trajets.length === 0) {
            resultsContainer.innerHTML = "<p class='text-danger text-center'>Aucun trajet disponible.</p>";
            return;
        }

        trajets.forEach((trajet) => {
            const trajetHTML = `
                <div class="col-md-6 fade-in">
                    <div class="card p-3 shadow-sm border border-success rounded-3">
                        <div class="d-flex align-items-center">
                            <div class="me-3">
                                <img src="https://via.placeholder.com/50" class="rounded-circle" alt="Conducteur">
                            </div>
                            <h5 class="text-success">🚗 ${trajet.adresse_depart} → ${trajet.adresse_arrivee}</h5>
                        </div>
                        <p><strong>📅 Date :</strong> ${trajet.date_trajet}</p>
                        <p><strong>💰 Prix :</strong> ${trajet.prix} €</p>
                        <p><strong>👤 Conducteur :</strong> ${trajet.conducteur}</p>
                        <p><strong>🚘 Véhicule :</strong> ${trajet.vehicule} ${trajet.eco == 1 ? '<span class="badge bg-success">Écologique</span>' : ''}</p>
                        <a href="details.html?id=${trajet.id}" class="btn btn-success w-100 mt-2">Voir détails</a>
                    </div>
                </div>`;
            resultsContainer.innerHTML += trajetHTML;
        });

        console.log("✅ Trajets affichés !");
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des trajets :", error);
    }
}

// Exécuter la récupération des trajets au chargement de la page
document.addEventListener("DOMContentLoaded", afficherTrajetsDisponibles);



console.log("✅ Fin du script");



