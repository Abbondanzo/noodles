const showModal = () => {
  const modal = document.getElementById("interactive-modal");
  modal.style.display = "block";
};

const hideModal = () => {
  const modal = document.getElementById("interactive-modal");
  modal.style.display = "none";
};

(() => {
  const pseudoInteractiveElements =
    document.getElementsByClassName("pseudo-interactive");
  for (var i = 0; i < pseudoInteractiveElements.length; i++) {
    pseudoInteractiveElements[i].addEventListener("click", showModal);
  }
  document.getElementById("close-modal").addEventListener("click", hideModal);
})();
