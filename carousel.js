// let counter = 0

function move(category, direction) {
	const carousel = document.getElementById(category)

	var counter = parseInt(carousel.dataset.counter) + direction
	if (counter > 6) counter = 0
	if (counter < 0) counter = 6

	carousel.dataset.counter = counter
	const items = carousel.querySelectorAll(".carousel__item")

	for (var i = 0; i < items.length; i++) {
		items[i].style.order = `${(i + counter) % 7}`
		items[i].style.animation = `slide${direction == 1 ? "right" : "left"} 0.1s ease-in-out`
		items[i].addEventListener("animationend", e => e.target.style.animation = "", false);
	}
}