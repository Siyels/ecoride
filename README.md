# 🚀 Projet EcoRide

## 📌 Description
EcoRide est une application de covoiturage permettant aux utilisateurs de proposer et réserver des trajets en toute simplicité.

## 📂 Structure du projet
```
├── api/               # Dossier contenant les fichiers PHP (backend)
│   ├── login.php      # Gestion de l'authentification
│   ├── session.php    # Vérification de la session utilisateur
│   ├── ad_trajet.php  # Ajout de trajets
│   ├── get_trajet.php # Récupération des trajets disponibles
|   |──
|   |──
|   |──
|   |──
|   |──
|   |──
├── html/              # Fichiers HTML (frontend)
│   ├── index.html     # Page principale
│   ├── login.html     # Page de connexion
│   ├── user_space.html # Espace utilisateur
|   |──
|   |──
|   |──
├── js/                # Scripts JavaScript
│   ├── script.js      # Scripts principaux de l'application
├── config.php         # Configuration de la base de données
├── README.md          # Ce fichier
├── database.sql       # Script SQL pour créer la base de données
```

## 🛠️ Installation
### 1️⃣ Prérequis
- PHP 8+
- MySQL / MariaDB
- Apache (via XAMPP, WAMP ou autre)
- Git

### 2️⃣ Cloner le projet
```bash
git clone https://github.com/tonpseudo/EcoRide.git
cd EcoRide
```

### 3️⃣ Configurer la base de données
1. Créer une base de données `ecoride`.
2. Importer le fichier `database.sql` dans phpMyAdmin ou avec la commande :
```bash
mysql -u root -p ecoride < database.sql
```

### 4️⃣ Configurer le projet
1. Copier le fichier `config.example.php` en `config.php`.
2. Modifier `config.php` avec les bonnes informations de connexion MySQL.

### 5️⃣ Lancer le serveur
Si vous utilisez **PHP en local** :
```bash
php -S localhost:8000
```
Sinon, ouvrez `http://localhost/` dans votre navigateur.

## 🔄 Workflow Git
### 🏗️ Bonnes pratiques Git
1️⃣ **Créer une branche pour chaque fonctionnalité**
```bash
git checkout -b feature/ajout-trajet
```

2️⃣ **Développer et tester**
```bash
git add .
git commit -m "Ajout de la fonctionnalité d'ajout de trajet"
```

3️⃣ **Fusionner vers `develop` après test**
```bash
git checkout develop
git merge feature/ajout-trajet
git push origin develop
```

4️⃣ **Fusionner vers `main` quand `develop` est stable**
```bash
git checkout main
git merge develop
git push origin main
```

## 📖 Manuel d'utilisation
Le manuel d'utilisation se trouve dans le fichier `manuel.pdf` et explique comment utiliser l'application.

## 🌐 Liens du projet
- **Dépôt GitHub** : [🔗 Lien vers GitHub](https://github.com/tonpseudo/EcoRide)
- **Application déployée** : [🔗 Lien vers l'application](https://mon-site.com)
- **Gestion de projet (Trello/Notion/Jira)** : [🔗 Lien Trello](https://trello.com/mon-projet)

## 📧 Contact
Si vous avez des questions, contactez-moi sur **email@exemple.com**.

---
© 2024 - EcoRide - Tous droits réservés.
