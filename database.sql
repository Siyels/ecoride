-- Supprime la base si elle existe déjà (Attention ! Supprime toutes les données existantes)
DROP DATABASE IF EXISTS ecoride;
CREATE DATABASE ecoride;
USE ecoride;

-- 🏗️ Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🛣️ Table des trajets
CREATE TABLE trajets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conducteur_id INT NOT NULL,
    depart VARCHAR(100) NOT NULL,
    arrivee VARCHAR(100) NOT NULL,
    date_depart DATETIME NOT NULL,
    places_disponibles INT NOT NULL CHECK (places_disponibles > 0),
    prix DECIMAL(10,2) NOT NULL CHECK (prix >= 0),
    vehicule VARCHAR(100) NOT NULL,
    eco BOOLEAN DEFAULT 1,
    FOREIGN KEY (conducteur_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 🚗 Table des réservations
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    trajet_id INT NOT NULL,
    status ENUM('en attente', 'confirmée', 'annulée') DEFAULT 'en attente',
    date_reservation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (trajet_id) REFERENCES trajets(id) ON DELETE CASCADE
);

-- 🌱 Table des avis (optionnel)
CREATE TABLE avis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    conducteur_id INT NOT NULL,
    note INT CHECK (note BETWEEN 1 AND 5),
    commentaire TEXT,
    date_avis TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (conducteur_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 🏁 Table des notifications (optionnel)
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    message TEXT NOT NULL,
    date_notification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lu BOOLEAN DEFAULT 0,
    FOREIGN KEY (utilisateur_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 👤 **Ajout d'un administrateur par défaut**
INSERT INTO users (nom, email, mot_de_passe, role) VALUES
('Admin', 'admin@ecoride.com', '$2y$10$hashedpassword123', 'admin');

-- 🚗 **Ajout de trajets de test**
INSERT INTO trajets (conducteur_id, depart, arrivee, date_depart, places_disponibles, prix, vehicule, eco)
VALUES
(1, 'Paris', 'Lyon', '2025-02-14 10:00:00', 3, 29.99, 'Tesla Model 3', 1),
(1, 'Marseille', 'Nice', '2025-02-15 08:30:00', 2, 15.50, 'Renault Zoe', 1);

-- 📌 **Ajout d'une réservation de test**
INSERT INTO reservations (utilisateur_id, trajet_id, status)
VALUES
(1, 1, 'confirmée');
