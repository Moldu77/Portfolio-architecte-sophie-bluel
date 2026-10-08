//recuperation du formulaire de connexion//
const loginForm = document.querySelector("#loginForm");
loginForm.addEventListener("submit", (event) => {
  // Empêcher le comportement par défaut du formulaire (rechargement de la page)//
  event.preventDefault();

  // Récupérer les valeurs des champs du formulaire//
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  //  gérer les erreurs//
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erreur dans l’identifiant ou le mot de passe");
    }
    return response.json();
  })
  .then((data) => {
    localStorage.setItem("token", data.token);
    window.location.href = "index.html";
  })

  //affichage du message d'erreur dans la page login.html//
  .catch((error) => {
    const errorMessage = document.querySelector("#error-message");
    errorMessage.textContent = error.message;
    errorMessage.style.color = "red";
  });
  
});
