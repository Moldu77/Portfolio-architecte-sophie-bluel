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
      //attribut permettant de retrover et supprimer les projets//
      figure.dataset.deleteIdModal = work.id;

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
    //verification si l'utilisateur est connecté pour afficher ou non les filtres//
    if (localStorage.getItem("token")) {
      filtersContainer.style.display = "none";
    }

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

//mode edition//
//verification si l'utilisateur est connecté//
if (localStorage.getItem("token")) {
  //affichage de la barre d'édition//
  const editionBar = document.querySelector(".edition-bar");
  editionBar.style.display = "flex";
  //changement du texte du bouton login en logout//
  const logout = document.querySelector(".login-btn");
  logout.textContent = "logout";
  //ajout de l'event listener pour le logout//
  logout.addEventListener("click", (event) => {
    //annulation de l'evenement par defaut qui renvoie sur login.html//
    event.preventDefault();
    localStorage.removeItem("token");
    //redirection vers la page principale //
    window.location.href = "index.html";
  });
  //ajout du btn modifier//
  const btnEdition = document.querySelector(".edit-btn");
  btnEdition.style.display = "flex";

  //affichage de la modal//

  const editBtn = document.querySelector(".edit-btn");
  const modal = document.getElementById("modal1");
  const crosse = document.querySelector(".modal-crosse");
  crosse.addEventListener("click", closeModal);
  editBtn.addEventListener("click", () => {
    modal.setAttribute("aria-hidden", "false");
    modal.style.display = "flex";
    modal.setAttribute("aria-modal", "true");
  });

  //fermeture de la modal//
  modal.addEventListener("click",(event)=>{
    if(event.target === modal){
      closeModal();
    }
  })
  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    modal.style.display = "none";
    modal.setAttribute("aria-modal", "false");
  }
  //recuperation des photos//
  const photoModal = document.querySelector(".photo-modal");
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
      for (const work of works) {
        const div = document.createElement("div");
        const images = document.createElement("img");
        //recuperation de l'icone trash//
        const trashBtn = document.createElement("button");
        const trashIcon = document.createElement("img");
        trashIcon.src = "./assets/icons/trash.svg";

        //accessibilité du btn//
        trashBtn.setAttribute("aria-label", "supprimer le projet");

        images.src = work.imageUrl;
        images.alt = work.title;

        photoModal.appendChild(div);
        div.appendChild(images);
        div.appendChild(trashBtn);
        trashBtn.appendChild(trashIcon);

        //creation class du btnTrash ,images et de la div des items pour le CSS//
        trashBtn.classList.add("trash-btn");
        images.classList.add("work-item-img");
        div.classList.add("work-item");

        //suppression des items//
        trashBtn.addEventListener("click", deleteItems);
        //assignation du work.id pour le fournir a la fonction deleteItems//
        trashBtn.dataset.deleteItem = work.id;
      }

      function deleteItems(e) {
        //recuperation du work.id//
        const id = e.currentTarget.dataset.deleteItem;
        // récupération de l'élément à retirer avant la réponse du serveur//
        const item = e.currentTarget.parentElement;
        //recuperation du token//
        let token = localStorage.getItem("token");
        fetch(`http://localhost:5678/api/works/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
          if (response.ok) { 
            item.remove();
            const figureToDelete = document.querySelector(
              `[data-delete-id-modal="${id}"]`
            );
            if(figureToDelete){
              figureToDelete.remove();
            }
          } else {
            console.error;
          }
        });
      }
    });
}
