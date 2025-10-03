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
                <div class="projet-details card-body">
                    <h2>${projet.title}</h2>
                    <p class="overview">
                        Pour ${projet.client} <br>
                        ${badges}
                    </p>

                    <!-- Button trigger modal -->
                    <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modal${projet.id}">
                        Afficher détails
                    </button>
                </div>
            </div>
        `;

        // Modal
        document.body.insertAdjacentHTML('beforeend', 
            `<div class="modal fade" id="modal${projet.id}" tabindex="-1" aria-labelledby="modal${projet.id}Label" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="modal${projet.id}Label">Modal title</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Tous les détails ! 
                        </div>
                        <div class="modal-footer">
                            <a href="${projet.url}"> <button type="button" class="btn btn-primary">Voir le site</button> </a>
                        </div>
                    </div>
                </div>
            </div>`);
    }
}

function displayProjects(projets) {
    let containerPortfolio = document.getElementById("portfolio");
    containerPortfolio.innerHTML = ""; // Retirer les affichages existants
    if (containerPortfolio) {
        projets.forEach(projet => {
            const node = document.createElement("article");
            containerPortfolio.appendChild(node);
            node.setAttribute("id", projet.id);
            node.setAttribute("class", "grid col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center");
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
        loader.style.opacity = '100%';
        loader.style.animation = 'spin 2s linear infinite';
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
        console.log('technologies:', data.technologies);
        populateTechnologyFilter(data.technologies);

    } catch (error) {
        // Gérer l'erreur
        console.error('Erreur de chargement:', error);
        errorMessage.textContent = 'Impossible de charger les projets. Veuillez réessayer.';
        errorMessage.style.display = 'block';

    } finally {
        // Cacher le loader dans tous les cas
        loader.style.opacity = '0';
        loader.style.animation = 'none';
    }
}

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

function populateTechnologyFilter(technologies) {
    const filterContainer = document.querySelector('.filtres');
    if (filterContainer) {
        filterContainer.innerHTML = ""; 
        technologies.forEach(tech => {
            const button = document.createElement('button');
            button.textContent = tech;
            button.className = 'btn btn-info';
            filterContainer.appendChild(button);
            button.onclick = () => loadProjectsByTechnology(tech);
            console.log(button);
        })
        const allButton = document.createElement('button');
        allButton.textContent = "Réinitialiser";
        allButton.className = 'btn btn-secondary';
        allButton.style.width = '120px';
        filterContainer.appendChild(allButton);
        allButton.onclick = () => loadProjects();
    }
}


// Charger au démarrage
document.addEventListener('DOMContentLoaded', async () => {await(loadProjects());});
