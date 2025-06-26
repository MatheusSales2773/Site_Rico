const stars = document.querySelectorAll('.star');
let selectedRating = 0;

stars.forEach((star, index) => {
  star.addEventListener('mouseover', () => highlightStars(index));
  star.addEventListener('mouseout', resetStars);
  star.addEventListener('click', () => selectStars(index));
});

function highlightStars(index) {
  for (let i = 0; i <= index; i++) {
    stars[i].textContent = '★';
  }
}

function resetStars() {
  stars.forEach((star, i) => {
    star.textContent = i < selectedRating ? '★' : '☆';
  });
}

function selectStars(index) {
  selectedRating = index + 1;
  resetStars();
}

function submitReview() {
  const review = document.getElementById("reviewText").value;
  if (selectedRating && review.trim()) {
    alert(`Avaliação enviada com ${selectedRating} estrela(s):\n"${review}"`);
    document.getElementById("reviewText").value = "";
    selectedRating = 0;
    resetStars();
  } else {
    alert("Por favor, dê uma nota e escreva uma resenha.");
  }
}
