//recuperation des travaux de l'API//
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((works) => {
    //recuperation de la galerie//
    const gallery = document.querySelector(".gallery");

    //automatisation de l'affichage des projets//
    for (const work of works) {
      //creation des elements//
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");
      //ajout des elements//
      img.src = work.imageUrl;
      img.alt = work.title;
      figcaption.textContent = work.title;
      //ajout de l'attribut data-category-id pour le filtrage//
      figure.dataset.categoryId = work.categoryId;

      gallery.appendChild(figure);
      figure.appendChild(img);
      figure.appendChild(figcaption);
    }
  });

fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((categories) => {
    //recuperation de la section des filtres//
    const portfolioTitle = document.querySelector("#portfolio h2");
    //creation du conteneur des filtres//
    const filtersContainer = document.createElement("div");
    filtersContainer.classList.add("filters-container");
    portfolioTitle.after(filtersContainer);

    //boutton "Tous" pour afficher tous les projets//
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.dataset.categoryId = "all";
    filtersContainer.appendChild(allButton);
    allButton.addEventListener("click", filterProjects);

    //creation des boutons de filtre//
    for (const category of categories) {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.dataset.categoryId = category.id;
      filtersContainer.appendChild(button);
      button.addEventListener("click", filterProjects);
    }
  });

function filterProjects(event) {
  const categoryId = event.target.dataset.categoryId;
  const gallery = document.querySelector(".gallery");
  const figures = gallery.querySelectorAll("figure");
  for (const figure of figures) {
    if (categoryId === "all" || figure.dataset.categoryId === categoryId) {
      figure.style.display = "";
    } else {
      figure.style.display = "none";
    }
  }
}
