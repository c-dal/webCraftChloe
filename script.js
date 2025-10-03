// Configuration
const API_URL = 'https://gabistam.github.io/Demo_API/data/projects.json';

// Fonctions d'affichage

function showError(message) {
    const errorElement = document.getElementById('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function displayProjectInfo(projet) {
    const container = document.getElementById(projet.id);
    if (container) {
        let badges = "";
        projet.technologies.forEach(element => {
            badges +=`<span class="techno badge text-bg-secondary">${element}</span>`
        });
        container.innerHTML = `
            <div class="project-card card">
                <img src="${projet.image}" alt="${projet.title}" class="card-img-top img">
                <div class="projet-details">
                    <h2>${projet.title}</h2>
                    <p class="overview">
                        client, technos, bouton détails <br>
                        ${badges}
                    </p>
                    </p>

                </div>
            </div>
        `;
    }
}

function displayProjects(projets) {
    let containerPortfolio = document.getElementById("portfolio");
    if (containerPortfolio) {
        projets.forEach(projet => {
            const node = document.createElement("article");
            containerPortfolio.appendChild(node);
            console.log("coucou j'ai cree un container");
            console.log(`Je suis le projet ${projet.title}`);
            node.setAttribute("id", projet.id);
            node.setAttribute("class", "col-12 col-md-6 col-lg-4 mb-4");
            displayProjectInfo(projet)
        });
    }

}


// Fonction de chargement avec gestion complète
async function loadProjects() {
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error');

    try {
        // Afficher le loader
        loader.style.display = 'block';
        errorMessage.style.display = 'none';

        // Requête AJAX
        const response = await fetch(API_URL);

        // Vérifier le statut
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }

        // Parser JSON
        const data = await response.json();

        // Utiliser les données
        displayProjects(data.projects);
        //populateTechnologyFilter(data.technologies);

    } catch (error) {
        // Gérer l'erreur
        console.error('Erreur de chargement:', error);
        errorMessage.textContent = 'Impossible de charger les projets. Veuillez réessayer.';
        errorMessage.style.display = 'block';

    } finally {
        // Cacher le loader dans tous les cas
        loader.style.display = 'none';
    }
}

// Charger au démarrage
document.addEventListener('DOMContentLoaded', loadProjects);


async function loadProjectsByTechnology(tech) {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Filtrer les projets contenant la technologie recherchée
        const filteredProjects = data.projects.filter(project =>
            project.technologies.includes(tech)
        );

        console.log(`Projets utilisant ${tech}:`, filteredProjects);
        displayProjects(filteredProjects);

    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur lors du filtrage des projets.');
    }
}

// Exemple d'utilisation
// loadProjectsByTechnology('React'); // Charge tous les projets React
