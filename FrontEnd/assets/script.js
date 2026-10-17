//recuperation de la galerie//
const gallery = document.querySelector(".gallery");

function createWorkItem(work) {
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

//recuperation des travaux de l'API//
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((works) => {
    //automatisation de l'affichage des projets//
    for (const work of works) {
      createWorkItem(work);
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
  btnEdition.style.display = "block";

  //affichage de la modal//

  const editBtn = document.querySelector(".edit-btn");
  const modal = document.getElementById("modal1");
  const crosse = document.querySelectorAll(".modal-crosse");

  // recuperation des deux croix de chaque modal pour la fermeture avec la boucle foreach//
  crosse.forEach((crosses) => {
    crosses.addEventListener("click", closeModal);
  });
  editBtn.addEventListener("click", () => {
    modal.setAttribute("aria-hidden", "false");
    modal.style.display = "flex";
    modal.setAttribute("aria-modal", "true");
    showGallery();
  });

  //fermeture de la modal//
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    modal.style.display = "none";
    modal.setAttribute("aria-modal", "false");
  }

  function createModalItem(work) {
    const div = document.createElement("div");
    const images = document.createElement("img");
    //creation de l'icone trash//
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
          `[data-delete-id-modal="${id}"]`,
        );
        if (figureToDelete) {
          figureToDelete.remove();
        }
      } else {
        console.error("erreur");
      }
    });
  }

  //reinitialise l'affichage de la zone photo en quittant la modal//
  function resetPictureArea() {
    const imageUploaded = document.querySelector(".preview-img");
    if (imageUploaded) {
      imageUploaded.remove();
    }
    const dragPictureIcon = document.querySelector(".drag-picture-icon");
    const buttonDragPicture = document.querySelector(".btn-drag-picture");
    const subtitleButtonDrag = document.querySelector(".drag-picture-area p");
    dragPictureIcon.style.display = "";
    buttonDragPicture.style.display = "";
    subtitleButtonDrag.style.display = "";
  }

  //recuperation des photos et les affichent//
  const photoModal = document.querySelector(".photo-modal");
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
      for (const work of works) {
        createModalItem(work);
      }
    });

  //affichage de la deuxieme modal form photo//

  //passage de la gallery au formulaire//
  const buttonAddPhoto = document.querySelector(".btn-add-photo");
  const modalGallery = document.querySelector(".modal-div");
  const modalPhotoContainer = document.querySelector(".add-photo-container");

  //bascule modal-div a modalForm//

  buttonAddPhoto.addEventListener("click", showAddPhoto);

  function showAddPhoto() {
    modalGallery.style.display = "none";
    modalGallery.setAttribute("aria-hidden", "true");
    modalPhotoContainer.style.display = "flex";
    //accessibilté du leceteur d'ecran pour le focus//
    const titleInput = document.getElementById("title");
    titleInput.focus();
    modalPhotoContainer.setAttribute("aria-hidden", "false");
  }

  //fermeture modalForm pour retourner sur la modalGallery//

  const backButton = document.querySelector(".modal-back-arrow");

  backButton.addEventListener("click", showGallery);

  function showGallery() {
    modalGallery.style.display = "flex";
    modalGallery.setAttribute("aria-hidden", "false");
    modalPhotoContainer.style.display = "none";
    buttonAddPhoto.focus();
    modalPhotoContainer.setAttribute("aria-hidden", "true");
    resetPictureArea();
    formSubmit.reset();
    const errorMessage = document.querySelector(".errorMsg");
    errorMessage.textContent = "";
  }

  //ajout de photo//
  const pictureArea = document.querySelector(".drag-picture-area");
  const addPictureInput = document.getElementById("image");

  //remplacement de la pictureArea image par la photo a ajouté//
  addPictureInput.addEventListener("change", () => {
    resetPictureArea();
    let file = addPictureInput.files[0];
    //si if ne vaut rien on sort du listener //
    if (!file) {
      return;
    }
    //verification de la size du file//
    if (file.size > 4 * 1024 * 1024) {
      alert("le fichier est trop lourd");
      addPictureInput.value = "";
      return;
    }

    let fileImage = URL.createObjectURL(file);
    const imageUploaded = document.createElement("img");
    imageUploaded.src = fileImage;
    imageUploaded.alt = file.name;
    //creation de la class de l'image uploader //
    imageUploaded.classList.add("preview-img");
    pictureArea.appendChild(imageUploaded);
    //cacher l'ancien contenu de la zone//
    const dragPictureIcon = document.querySelector(".drag-picture-icon");
    const buttonDragPicture = document.querySelector(".btn-drag-picture");
    const subtitleButtonDrag = document.querySelector(".drag-picture-area p");

    dragPictureIcon.style.display = "none";
    buttonDragPicture.style.display = "none";
    subtitleButtonDrag.style.display = "none";
  });
  //recuperation de l'input select et le remplit avec les categories de l'API//
  const selectInput = document.getElementById("categorie");
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => {
      for (let categorie of categories) {
        let option = document.createElement("option");
        option.value = categorie.id;
        option.textContent = categorie.name;
        selectInput.appendChild(option);
      }
    });

  //validation du formulaire et reset//

  const formSubmit = document.querySelector(".add-photo-form");
  formSubmit.addEventListener("submit", (event) => {
    event.preventDefault();
    //verification si les champs sont correctement saisie//
    const inputTitle = document.getElementById("title");
    const selectInput = document.getElementById("categorie");
    const errorMessage = document.querySelector(".errorMsg");
    if (
      inputTitle.value.trim() === "" ||
      selectInput.value === "" ||
      !addPictureInput.files[0]
    ) {
      errorMessage.textContent = "Veuillez remplir correctement les champs";
      return;
    }
    //creation form vide//
    const formData = new FormData();

    //ajout des valeur dans ce form vide//
    formData.append("title", inputTitle.value);
    formData.append("image", addPictureInput.files[0]);
    formData.append("category", selectInput.value);
    let token = localStorage.getItem("token");

    fetch(`http://localhost:5678/api/works`, {
      method: "POST",
      //authentification avec le token//
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }).then((response) =>
      response.json().then((newWork) => {
        if (response.ok) {
          createWorkItem(newWork);
          createModalItem(newWork);
          formSubmit.reset();
          resetPictureArea();

          errorMessage.textContent = "";
          showGallery();
        } else {
          errorMessage.textContent =
            "Envoi impossible veuillez corriger la saisie ";
        }
      }),
    );
  });
}
//fin du mode edition//
